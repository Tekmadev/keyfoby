/**
 * POST /api/lead: the new quote form's only server endpoint (Vercel Function).
 *
 *   browser form ──► this function
 *       1. same-origin + JSON + streamed size cap, honeypot
 *       2. Cloudflare Turnstile siteverify (bot protection; hostname + action checked)
 *       3. Supabase RPC public.submit_website_lead(secret, lead)
 *          (validates, de-duplicates retries, rate-limits, stores in website.leads)
 *       4. Resend email to the owner (the lead is already stored if this fails)
 *
 * Request JSON:  { lead: { ...fields }, turnstileToken: string, website?: "" }
 *   lead fields: see LIMITS below. client_request_id is a UUID the browser makes
 *   once per form attempt (crypto.randomUUID()) and reuses on retry.
 *   "website" is a hidden honeypot input; real people leave it empty.
 *   The Turnstile widget must be rendered with action "quote".
 * Response JSON: { ok: true, ref: "KF-1001" }
 *            or  { ok: false, error: "invalid" | "bot_check" | "rate_limited" | "server", field?: string }
 *
 * Server-only env vars (never NEXT_PUBLIC_):
 *   LEAD_INGEST_SECRET      64 hex chars; its SHA-256 is in website.settings
 *   TURNSTILE_SECRET_KEY    Cloudflare Turnstile secret
 *   RESEND_API_KEY          Resend API key (sending access only)
 *   LEAD_NOTIFY_TO          owner inbox, e.g. keyfoby@gmail.com
 *   LEAD_NOTIFY_FROM        e.g. "KeyFoby Web Query <leads@keyfoby.com>"
 *   LEAD_CONFIRM_FROM       optional; address for customer confirmations (display name is
 *                           always "KeyFoby"); defaults to the LEAD_NOTIFY_FROM address
 *   SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY (fall back to the NEXT_PUBLIC_SUPABASE_* values)
 *   LEAD_ALLOWED_ORIGINS    optional, comma-separated; defaults to the keyfoby.com
 *                           origins plus this project's own Vercel URLs
 *   TURNSTILE_EXPECTED_HOSTNAMES  optional, comma-separated; defaults to the
 *                           hostnames of the allowed origins
 */

const MAX_BODY_BYTES = 16 * 1024;
const TURNSTILE_ACTION = "quote";

/** Allowed lead fields and their maximum lengths (same as the database). */
const LIMITS: Record<string, number> = {
  key_type: 10, has_working_key: 10, vehicle_year: 4, vehicle_make: 40, vehicle_model: 60,
  ignition: 10, town: 60, other_town: 80, customer_name: 80, phone: 40, details: 1000,
  consent_version: 40, page_path: 200, utm_source: 100, utm_medium: 100, utm_campaign: 100,
  gclid: 200, client_request_id: 36, email: 254,
};

/** Hidden attribution fields: the visitor cannot fix these, so they are cut, never rejected. */
const CUT_FIELDS = new Set(["page_path", "utm_source", "utm_medium", "utm_campaign", "gclid"]);

/** Text Postgres jsonb cannot hold: NUL, or half of an emoji (lone surrogate). */
const BAD_TEXT = /\u0000|[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/;

const KEY_LABELS = new Map<string, string>([
  ["blade", "Blade key"],
  ["remote", "Remote key"],
  ["flip", "Flip key"],
  ["smart", "Smart key (push-to-start)"],
]);

type Env = Record<string, string | undefined>;
type Deps = { env: Env; fetch: typeof fetch; now?: () => Date; sleep?: (ms: number) => Promise<void> };
type Fail = { ok: false; error: "invalid" | "bot_check" | "rate_limited" | "server"; field?: string };

function json(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extra },
  });
}

function fail(status: number, error: Fail["error"], field?: string): Response {
  const body: Fail = field ? { ok: false, error, field } : { ok: false, error };
  return json(body, status);
}

function allowedOrigins(env: Env): string[] {
  const list = (env.LEAD_ALLOWED_ORIGINS || "https://www.keyfoby.com,https://keyfoby.com")
    .split(",").map((s) => s.trim()).filter(Boolean);
  // Vercel system env vars hold host names without the scheme.
  for (const host of [env.VERCEL_URL, env.VERCEL_BRANCH_URL, env.VERCEL_PROJECT_PRODUCTION_URL]) {
    if (host) list.push(`https://${host}`);
  }
  return list;
}

function expectedHostnames(env: Env): Set<string> {
  if (env.TURNSTILE_EXPECTED_HOSTNAMES) {
    return new Set(env.TURNSTILE_EXPECTED_HOSTNAMES.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
  }
  return new Set(allowedOrigins(env).map((o) => { try { return new URL(o).hostname; } catch { return ""; } }).filter(Boolean));
}

/** Same rule as the database: +1 and 10 digits, area code not starting with 0/1. */
export function normalisePhone(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  return /^[2-9]\d{9}$/.test(d) ? `+1${d}` : null;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

/** One line of text: no control characters, cut on whole characters (never half an emoji). */
function oneLine(s: string, max: number): string {
  return Array.from(s.replace(/[\u0000-\u001f\u007f\u2028\u2029\u200b-\u200f\u202a-\u202e\u2066-\u2069]+/g, " ").replace(/\s+/g, " ").trim()).slice(0, max).join("");
}

/** Maps the database's 'invalid:<x>' messages to a form field name. */
export function fieldFromDbMessage(message: string): string | undefined {
  const m = /^invalid:(.+)$/.exec(message.trim());
  if (!m) return undefined;
  const x = m[1];
  const check = /^leads_(.+)_check$/.exec(x);
  if (check) return check[1];
  if (x === "leads_town_fkey") return "town";
  if (x === "leads_one_town") return "other_town";
  return x;
}

/** Reads the body but stops as soon as it passes the byte limit (works for chunked bodies too). */
async function readBodyCapped(request: Request): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  const all = new Uint8Array(total);
  let at = 0;
  for (const c of chunks) { all.set(c, at); at += c.byteLength; }
  return new TextDecoder().decode(all);
}

async function verifyTurnstile(deps: Deps, token: string): Promise<"ok" | "fail" | "error"> {
  const secret = deps.env.TURNSTILE_SECRET_KEY;
  if (!secret) return "error";
  // Cloudflare's dummy test secrets (1x/2x/3x0000...) must never protect the live site.
  if (deps.env.VERCEL_ENV === "production" && /^[123]x0{20,}/.test(secret)) {
    console.error("turnstile: a TEST secret key is set in production");
    return "error";
  }
  try {
    // No remoteip: it is optional, and not forwarding it keeps the visitor's IP out of our calls.
    const res = await deps.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, idempotency_key: crypto.randomUUID() }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return "error";
    const data = (await res.json()) as { success?: boolean; hostname?: string; action?: string; "error-codes"?: string[] };
    if (data.success !== true) {
      console.warn(`turnstile: rejected (${(data["error-codes"] || []).join(",").slice(0, 80) || "no reason"})`);
      return "fail";
    }
    if (!data.hostname || !expectedHostnames(deps.env).has(data.hostname.toLowerCase())) {
      console.warn(`turnstile: hostname ${oneLine(data.hostname || "missing", 60)} not expected`);
      return "fail";
    }
    // Cloudflare's test secrets omit "action"; real tokens carry the widget's action.
    // In production the action is required, so a missing one is a failure too.
    const production = deps.env.VERCEL_ENV === "production";
    if ((production || data.action !== undefined) && data.action !== TURNSTILE_ACTION) {
      console.warn(`turnstile: action ${oneLine(String(data.action ?? "missing"), 40)} is not "${TURNSTILE_ACTION}"`);
      return "fail";
    }
    return "ok";
  } catch {
    return "error";
  }
}

type RpcResult = { ok: true; id: string; ref: string; createdAt?: string; duplicate: boolean; notify: boolean; confirm: boolean; floodAlert: boolean } | { ok: false; message: string; status: number };

async function submitToSupabase(deps: Deps, lead: Record<string, unknown>): Promise<RpcResult> {
  const url = deps.env.SUPABASE_URL || deps.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = deps.env.SUPABASE_PUBLISHABLE_KEY || deps.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const secret = deps.env.LEAD_INGEST_SECRET;
  if (!url || !key || !secret) return { ok: false, message: "not_configured", status: 0 };
  try {
    const res = await deps.fetch(`${url.replace(/\/$/, "")}/rest/v1/rpc/submit_website_lead`, {
      method: "POST",
      // Works with the legacy anon JWT and the new publishable key (Authorization must equal apikey).
      headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}` },
      body: JSON.stringify({ p_secret: secret, p_lead: lead }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json().catch(() => ({}))) as {
      id?: string; ref?: string; created_at?: string; duplicate?: boolean; notify?: boolean; confirm?: boolean; flood_alert?: boolean; message?: string;
    };
    if (res.ok && data.id && data.ref) {
      return { ok: true, id: data.id, ref: data.ref, createdAt: data.created_at, duplicate: data.duplicate === true,
        notify: data.notify !== false, confirm: data.confirm === true, floodAlert: data.flood_alert === true };
    }
    return { ok: false, message: data.message || `http_${res.status}`, status: res.status };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.name : "fetch_failed", status: 0 };
  }
}

export function buildEmail(ref: string, lead: Record<string, unknown>, phone: string, receivedAt: Date, env: Env) {
  const s = (k: string) => (typeof lead[k] === "string" ? oneLine(lead[k] as string, 200) : "");
  const keyLabel = KEY_LABELS.get(s("key_type")) ?? "Not sure which key";
  const vehicle = [s("vehicle_year"), s("vehicle_make"), s("vehicle_model")].filter(Boolean).join(" ") || "Car not given";
  const listed = s("town") && s("town").toLowerCase() !== "other" ? s("town") : "";
  const town = listed || (s("other_town") ? `${s("other_town")} (outside the list)` : "Town not given");
  const working = s("has_working_key") === "lost" ? "ALL KEYS LOST" : s("has_working_key") === "spare" ? "Has a working key (needs a spare)" : "Not said";
  const ign = s("ignition"), kt = s("key_type");
  // A smart key normally goes with push-to-start, and blade/remote/flip keys with a turn-key ignition.
  // The form pre-fills that, but a few cars differ, so an unusual pair is flagged instead of refused.
  const oddPair = (kt === "smart" && ign === "key") || (["blade", "remote", "flip"].includes(kt) && ign === "push");
  const ignition = (ign === "push" ? "Push-to-start" : ign === "key" ? "Turn key" : "Not said") +
    (oddPair ? " (unusual for this key type: confirm on the call)" : "");
  const details = typeof lead.details === "string" && lead.details.trim() ? lead.details.trim() : "None";
  const pretty = `(${phone.slice(2, 5)}) ${phone.slice(5, 8)}-${phone.slice(8)}`;
  const when = receivedAt.toLocaleString("en-CA", { timeZone: "America/Toronto", dateStyle: "medium", timeStyle: "short" });
  const project = /https:\/\/([a-z0-9]+)\.supabase\.co/.exec(env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "")?.[1];
  const page = s("page_path");
  const source = [!page || page === "/" ? "Home page" : page, s("utm_source") && `utm ${s("utm_source")}/${s("utm_medium")}/${s("utm_campaign")}`, s("gclid") && "Google Ads click"].filter(Boolean).join(" · ");

  const subject = oneLine(`New quote request ${ref}: ${keyLabel}, ${vehicle}, ${listed || s("other_town") || "town not given"}`, 180);
  const rows: [string, string][] = [
    ["Name", s("customer_name")],
    ["Phone", pretty],
    ["Email", normaliseEmail(lead.email) || "Not given"],
    ["Key", keyLabel],
    ["Working key?", working],
    ["Car", vehicle],
    ["Ignition", ignition],
    ["Town", town],
    ["Details", details],
    ["Received", `${when} (Toronto time)`],
    ["Came from", source],
    ["Consent", `${s("consent_version") === "2026-11-07" ? "Phone/text" : "Phone, text or email"} about this quote (wording ${s("consent_version")})`],
  ];
  const text = [`New quote request ${ref}`, "", ...rows.map(([k, v]) => `${k}: ${v.replace(/\r?\n/g, "\n    ")}`), "", `Call: tel:${phone}`, `WhatsApp: https://wa.me/${phone.slice(1)}`,
    project ? `All leads: https://supabase.com/dashboard/project/${project}/editor (schema "website", table "leads")` : ""].join("\n");
  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:560px">
<h2 style="margin:0 0 4px">New quote request ${escapeHtml(ref)}</h2>
<p style="margin:0 0 16px;color:#555">${escapeHtml(keyLabel)} · ${escapeHtml(vehicle)} · ${escapeHtml(town)}</p>
<p style="margin:0 0 16px"><a href="tel:${escapeHtml(phone)}" style="background:#FFB23F;color:#0A0C0F;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:bold">Call ${escapeHtml(pretty)}</a>
&nbsp; <a href="https://wa.me/${escapeHtml(phone.slice(1))}">WhatsApp</a></p>
<table cellpadding="6" style="border-collapse:collapse;width:100%">${rows
    .map(([k, v]) => `<tr><td style="color:#555;border-bottom:1px solid #eee;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td><td style="border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`)
    .join("")}</table>
${project ? `<p style="margin-top:16px;font-size:13px"><a href="https://supabase.com/dashboard/project/${escapeHtml(project)}/editor">Open all leads in Supabase</a> (schema "website", table "leads"). Update the status there when you call back.</p>` : ""}
</body></html>`;
  return { subject, html, text };
}

type MailResult = "sent" | "maybe_sent" | "failed" | "not_configured";

/** Fixed business details for the customer email (same as lib/business-data.ts). */
const BUSINESS = {
  name: "KeyFoby",
  phone: "(905) 467-6860",
  tel: "+19054676860",
  address: "40 Courtland Ave, Hamilton, ON L9B 1X6",
  site: "https://www.keyfoby.com",
  email: "keyfoby@gmail.com",
};

/** Same rule as the database: one plain, lower-case address. */
export function normaliseEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim().toLowerCase();
  if (!v || v.length > 254) return null;
  return /^[a-z0-9_%+'-]+(\.[a-z0-9_%+'-]+)*@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/.test(v) ? v : null;
}

/**
 * Confirmation to the customer. On purpose it contains NO text the visitor typed
 * (name, car, town, details): only our fixed wording, the KF reference, the key type
 * from a fixed list and the phone number in our own format. So nobody can use the
 * form to send their own message to someone else's inbox.
 */
export function buildCustomerEmail(ref: string, lead: Record<string, unknown>, phone: string) {
  const kt = typeof lead.key_type === "string" ? lead.key_type : "";
  const key = KEY_LABELS.get(kt);
  const pretty = `(${phone.slice(2, 5)}) ${phone.slice(5, 8)}-${phone.slice(8)}`;
  const what = key ? `your quote request for a ${key.replace(/ \(push-to-start\)$/, "").toLowerCase()}` : "your quote request";
  const subject = `We got your quote request ${ref} | KeyFoby`;
  const text = [
    `Thanks for contacting KeyFoby.`,
    ``,
    `We received ${what}. Your reference is ${ref}.`,
    `We'll call or text you at ${pretty} with a price.`,
    ``,
    `Locked out right now? Call ${BUSINESS.phone}.`,
    `Need to add something? Reply to this email.`,
    ``,
    `KeyFoby, mobile car key locksmith`,
    `${BUSINESS.address} | ${BUSINESS.site} | ${BUSINESS.email}`,
    `You're getting this one email because you asked us for a quote. Don't want emails from us? Reply "unsubscribe" or email ${BUSINESS.email} and we won't email you again. Privacy: ${BUSINESS.site}/privacy-policy`,
  ].join("\n");
  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:560px">
<h2 style="margin:0 0 12px">Thanks for contacting KeyFoby</h2>
<p style="margin:0 0 8px">We received ${escapeHtml(what)}. Your reference is <strong>${escapeHtml(ref)}</strong>.</p>
<p style="margin:0 0 16px">We'll call or text you at <strong>${escapeHtml(pretty)}</strong> with a price.</p>
<p style="margin:0 0 8px">Locked out right now? Call <a href="tel:${BUSINESS.tel}">${escapeHtml(BUSINESS.phone)}</a>.</p>
<p style="margin:0 0 16px">Need to add something? Just reply to this email.</p>
<p style="margin:24px 0 0;font-size:12px;color:#666">KeyFoby, mobile car key locksmith<br>${escapeHtml(BUSINESS.address)} · <a href="${BUSINESS.site}">keyfoby.com</a> · ${escapeHtml(BUSINESS.email)}<br>You're getting this one email because you asked us for a quote. Don't want emails from us? Reply &quot;unsubscribe&quot; or email ${escapeHtml(BUSINESS.email)} and we won't email you again. <a href="${BUSINESS.site}/privacy-policy">Privacy policy</a></p>
</body></html>`;
  return { subject, html, text };
}

/** One Resend send with a stable idempotency key; one retry on 429/5xx/network. */
async function sendViaResend(
  deps: Deps, idemKey: string, payload: Record<string, unknown>,
): Promise<MailResult> {
  const key = deps.env.RESEND_API_KEY;
  if (!key) return "not_configured";
  const sleep = deps.sleep || ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) await sleep(800);
    try {
      const res = await deps.fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": idemKey },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok) return "sent";
      if (res.status === 409) return "maybe_sent";
      if (res.status !== 429 && res.status < 500) return "failed";
    } catch {
      /* timeout or network: retry once with the same idempotency key */
    }
  }
  return "failed";
}

async function confirmToCustomer(
  deps: Deps, ref: string, id: string, lead: Record<string, unknown>, phone: string,
): Promise<MailResult | "no_email"> {
  const to = normaliseEmail(lead.email);
  if (!to) return "no_email";
  const fromEnv = deps.env.LEAD_CONFIRM_FROM || deps.env.LEAD_NOTIFY_FROM || "";
  const addr = /<([^>]+)>/.exec(fromEnv)?.[1] || fromEnv.trim();
  if (!addr) return "not_configured";
  const replyTo = (deps.env.LEAD_NOTIFY_TO || "").split(",")[0].trim();
  let mail: ReturnType<typeof buildCustomerEmail>;
  try { mail = buildCustomerEmail(ref, lead, phone); } catch { return "failed"; }
  return sendViaResend(deps, `website-lead/customer/${id}`, {
    from: `KeyFoby <${addr}>`, to: [to], subject: mail.subject, html: mail.html, text: mail.text,
    ...(replyTo ? { reply_to: replyTo } : {}), tags: [{ name: "type", value: "website_lead_confirmation" }],
  });
}

async function notifyOwner(
  deps: Deps, ref: string, id: string, lead: Record<string, unknown>, phone: string, createdAt?: string, floodAlert = false,
): Promise<MailResult> {
  const { RESEND_API_KEY: key, LEAD_NOTIFY_TO: to, LEAD_NOTIFY_FROM: from } = deps.env;
  if (!key || !to || !from) return "not_configured";
  const sleep = deps.sleep || ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  let mail: ReturnType<typeof buildEmail>;
  try {
    // Received time comes from the database, so a retried send has the identical body (Resend idempotency).
    const received = createdAt && !Number.isNaN(Date.parse(createdAt)) ? new Date(createdAt) : (deps.now || (() => new Date()))();
    mail = floodAlert
      ? {
          subject: "KeyFoby website: unusual number of quote requests",
          text: `More than 20 quote requests arrived in the last hour (latest ${ref}). They are all saved in Supabase (schema "website", table "leads"), but no more emails will be sent for them this hour. Check for spam and mark it as status "spam".`,
          html: `<p>More than 20 quote requests arrived in the last hour (latest ${escapeHtml(ref)}). They are all saved in Supabase (schema "website", table "leads"), but no more emails will be sent for them this hour.</p><p>Check for spam and mark it as status "spam".</p>`,
        }
      : buildEmail(ref, lead, phone, received, deps.env);
  } catch {
    return "failed";
  }
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) await sleep(800);
    try {
      const res = await deps.fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": `website-lead/${floodAlert ? "flood/" : ""}${id}` },
        body: JSON.stringify({
          from, to: to.split(",").map((t) => t.trim()).filter(Boolean), subject: mail.subject, html: mail.html, text: mail.text,
          ...(!floodAlert && normaliseEmail(lead.email) ? { reply_to: normaliseEmail(lead.email) } : {}),
          tags: [{ name: "type", value: "website_lead" }],
        }),
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok) return "sent";
      // 409: the same idempotency key is in flight or was already used, so the email most likely went out.
      if (res.status === 409) return "maybe_sent";
      if (res.status !== 429 && res.status < 500) return "failed";
    } catch {
      /* timeout or network: retry once with the same idempotency key */
    }
  }
  return "failed";
}

export function createHandler(deps: Deps) {
  return async function handle(request: Request): Promise<Response> {
    try {
      if (request.method !== "POST") return json({ ok: false, error: "server" }, 405, { Allow: "POST" });

      const origin = request.headers.get("origin");
      if (!origin || !allowedOrigins(deps.env).includes(origin)) return fail(403, "server");
      if (!(request.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) return fail(415, "server");
      if (Number(request.headers.get("content-length") || 0) > MAX_BODY_BYTES) return fail(413, "invalid");

      const raw = await readBodyCapped(request);
      if (raw === null) return fail(413, "invalid");
      let body: { lead?: unknown; turnstileToken?: unknown; website?: unknown };
      try {
        body = JSON.parse(raw);
      } catch {
        return fail(400, "invalid");
      }
      if (!body || typeof body !== "object" || !body.lead || typeof body.lead !== "object" || Array.isArray(body.lead)) return fail(400, "invalid");

      // Honeypot: real people never fill the hidden "website" input. Look successful, store nothing.
      if (typeof body.website === "string" && body.website.trim() !== "") return json({ ok: true, ref: null });

      const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
      if (!token || token.length > 2048) return fail(400, "bot_check");
      const bot = await verifyTurnstile(deps, token);
      if (bot === "fail") return fail(400, "bot_check");
      if (bot === "error") {
        console.error("lead: turnstile verification unavailable or not configured");
        return fail(503, "server");
      }

      // Copy only known fields; anything too long is an error, never silently cut.
      const input = body.lead as Record<string, unknown>;
      const lead: Record<string, unknown> = { source: "quote_form", consent: input.consent === true };
      for (const [k, max] of Object.entries(LIMITS)) {
        let v = input[k];
        if (k === "vehicle_year" && typeof v === "number") v = String(v);
        if (typeof v !== "string") continue;
        if (BAD_TEXT.test(v)) {
          if (CUT_FIELDS.has(k)) continue;
          return fail(422, "invalid", k);
        }
        if (Array.from(v).length > max) {
          if (CUT_FIELDS.has(k)) v = Array.from(v).slice(0, max).join("");
          else return fail(422, "invalid", k);
        }
        lead[k] = v;
      }
      const phone = normalisePhone(typeof lead.phone === "string" ? lead.phone : "");
      if (!phone) return fail(422, "invalid", "phone");
      // Optional email: normalised once here and sent to the database in that form,
      // so the stored address, the owner email and the confirmation always agree.
      if (typeof lead.email === "string" && lead.email.trim()) {
        const em = normaliseEmail(lead.email);
        if (!em) return fail(422, "invalid", "email");
        lead.email = em;
      } else delete lead.email;

      const saved = await submitToSupabase(deps, lead);
      if (!saved.ok) {
        const msg = saved.message;
        if (msg === "rate_limited") return fail(429, "rate_limited");
        if (msg === "rate_limited_global") {
          console.error("lead: REFUSED, over 200 quote requests in the last hour (likely a flood)");
          return fail(429, "rate_limited");
        }
        const field = fieldFromDbMessage(msg);
        if (field && !["unknown_field", "consent_version", "lead", "client_request_id"].includes(field)) return fail(422, "invalid", field);
        if (/^invalid:(consent_version|unknown_field)$/.test(msg)) {
          console.error("lead: DB schema is older than the website code; run db/supabase/2026-11-10_03_lead_email.sql");
        }
        console.error(`lead: store failed (${saved.status} ${oneLine(msg, 80)})`);
        return fail(502, "server");
      }

      // The lead is stored from here on: never turn a mail problem into an error for the visitor.
      // A duplicate (retry) still goes through the email step: if the first attempt stored the
      // lead but never emailed, this sends it; if it did email, Resend's Idempotency-Key
      // (website-lead/<id>, kept 24 h) stops a second copy.
      if (!saved.notify && !saved.floodAlert) {
        console.error(`lead: stored ${saved.ref}; email skipped (over 20 requests this hour)`);
        return json({ ok: true, ref: saved.ref });
      }
      // Owner email and (if they gave an address, and we're not in a flood) the customer's
      // confirmation go out together.
      const [mailR, confR] = await Promise.allSettled([
        notifyOwner(deps, saved.ref, saved.id, lead, phone, saved.createdAt, saved.floodAlert),
        saved.confirm ? confirmToCustomer(deps, saved.ref, saved.id, lead, phone) : Promise.resolve("no_email" as const),
      ]);
      const mail: MailResult = mailR.status === "fulfilled" ? mailR.value : "failed";
      const conf = confR.status === "fulfilled" ? confR.value : "failed";
      const emailed = conf === "sent" || conf === "maybe_sent";
      if (conf === "failed") console.error(`lead: stored ${saved.ref}; customer confirmation email FAILED`);
      if (mail === "not_configured") console.error(`lead: stored ${saved.ref}; owner email NOT CONFIGURED (set RESEND_API_KEY, LEAD_NOTIFY_TO, LEAD_NOTIFY_FROM)`);
      else if (mail === "maybe_sent") console.warn(`lead: stored ${saved.ref}; owner email probably sent (Resend 409 on retry)`);
      else if (mail === "failed") console.error(`lead: stored ${saved.ref}; owner email FAILED`);
      return json({ ok: true, ref: saved.ref, emailed });
    } catch (e) {
      console.error(`lead: unhandled ${e instanceof Error ? e.name : "error"}`);
      return fail(500, "server");
    }
  };
}

export default {
  fetch: createHandler({ env: process.env, fetch: (...a: Parameters<typeof fetch>) => fetch(...a) }),
};
