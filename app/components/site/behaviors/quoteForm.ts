import {
  trackContactFormSubmit,
  trackGoogleAdsContact,
  trackGoogleAdsLeadFormSubmit,
  trackGoogleAdsRequestQuote,
  trackSiteEvent,
} from "@/lib/analytics";
import { CONSENT_VERSION, PHONE, TEL, WA_DEFAULT_TEXT, waLink } from "../links";
import { byId, on, qs, qsa, runAll, type Cleanup } from "./dom";

/* =========================================================
   QUOTE FORM -> POST /api/lead (api/lead.ts)
   { lead, turnstileToken, website } -> { ok, ref } | { ok:false, error, field? }
   ========================================================= */

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string | undefined;
  reset: (id?: string) => void;
  remove?: (id?: string) => void;
};
declare global {
  interface Window { turnstile?: Turnstile }
}

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const KEY_LABEL: Record<string, string> = { blade: "Blade key", remote: "Remote key", flip: "Flip key", smart: "Smart key" };

/** API field name -> [error element id, input id, message] */
const FIELDS: Record<string, [string, string, string]> = {
  vehicle_year: ["e-year", "f-year", "Enter the 4-digit year, like 2018."],
  vehicle_make: ["e-make", "f-make", "Enter the make, like Honda."],
  vehicle_model: ["e-model", "f-model", "Enter the model, like Civic."],
  town: ["e-town", "f-town", "Choose a town from the list, or “Somewhere else”."],
  other_town: ["e-other", "f-other", "Type the town the car is in."],
  customer_name: ["e-name", "f-name", "Enter your name."],
  phone: ["e-phone", "f-phone", "Enter a 10-digit phone number."],
  email: ["e-email", "f-email", "Check your email address, or leave it empty."],
  details: ["e-details", "f-details", "Shorten this to 1,000 characters or less."],
  consent: ["e-consent", "f-consent", "Tick the box so we can contact you."],
};

function uuid(): string {
  const c = window.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  const b = new Uint8Array(16);
  c.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** Same rule as the API and the database: +1 and 10 digits, area code not starting with 0 or 1. */
/** Optional email: empty is fine; otherwise one plain address (the database checks it again). */
function emailOk(raw: string): boolean {
  const v = raw.trim();
  return v === "" || (v.length <= 254 && /^[a-z0-9_%+'-]+(\.[a-z0-9_%+'-]+)*@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/.test(v.toLowerCase()));
}

function phoneOk(raw: string): boolean {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return /^[2-9]\d{9}$/.test(digits);
}

const one = (s: string) => s.trim().replace(/\s+/g, " ");

/* ---- where the visitor came from (no personal data) ----
   Read from the URL; kept in sessionStorage for this tab so a visitor who lands
   on /?gclid=… and reaches the form after another page still sends it. */
const ATTR_KEYS = ["utm_source", "utm_medium", "utm_campaign", "gclid"] as const;
const ATTR_STORE = "kf_attr";
function attrFromUrl(): Record<string, string> {
  const params = new URLSearchParams(location.search);
  const out: Record<string, string> = {};
  for (const k of ATTR_KEYS) {
    const v = params.get(k);
    if (v) out[k] = v;
  }
  return out;
}
function attrFromStore(): Record<string, string> {
  try {
    const raw = JSON.parse(sessionStorage.getItem(ATTR_STORE) || "null");
    const out: Record<string, string> = {};
    if (raw && typeof raw === "object") {
      for (const k of ATTR_KEYS) if (typeof raw[k] === "string" && raw[k]) out[k] = raw[k];
    }
    return out;
  } catch {
    return {};
  }
}
/** Called on every page view: a landing URL with utm_* / gclid replaces what this tab remembered. */
export function rememberAttribution(): void {
  const a = attrFromUrl();
  if (!Object.keys(a).length) return;
  try { sessionStorage.setItem(ATTR_STORE, JSON.stringify(a)); } catch { /* storage blocked: URL values still work on this page */ }
}

export function initQuoteForm(): Cleanup | void {
  const d = document;
  const form = byId<HTMLFormElement>("quote-form");
  const okBox = byId("form-ok");
  if (!form || !okBox) return;
  const f = form.elements as HTMLFormControlsCollection & Record<string, HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>;
  const btn = qs<HTMLButtonElement>('button[type="submit"]', form)!;
  const btnHtml = btn.innerHTML;
  const alertBox = byId("form-alert")!;
  const note = byId("form-note")!;
  const tsBox = byId("ts-box")!;
  const hp = byId<HTMLInputElement>("f-website")!;
  const siteKey = (form.dataset.sitekey || "").trim();
  const cleanups: (Cleanup | void)[] = [];

  /* where the visitor came from (no personal data): this URL first, else what this tab remembered */
  rememberAttribution();
  const fromUrl = attrFromUrl();
  const attribution: Record<string, string> = {
    page_path: location.pathname || "/",
    ...(Object.keys(fromUrl).length ? fromUrl : attrFromStore()),
  };

  form.dataset.ready = "1";
  /* without a site key the form can't send: keep Send disabled and let the note's Call / WhatsApp be the actions */
  if (siteKey) btn.disabled = false;
  else note.hidden = false;

  /** The alert's WhatsApp text, from what the visitor already typed (key, car, town; never name or phone). */
  function waText(): string {
    const label = KEY_LABEL[f.keyType.value];
    const key = label ? label.toLowerCase() : "car key";
    const y = f.year.value.trim();
    const car = [/^\d{4}$/.test(y) ? y : "", one(f.make.value), one(f.model.value)].filter(Boolean).join(" ");
    const town = f.town.value;
    const where = town === "other" ? one(f.otherTown.value) : town;
    if (!label && !car && !where) return WA_DEFAULT_TEXT;
    const forCar = car ? ` for my ${car}` : "";
    const have = qs<HTMLInputElement>('input[name="have"]:checked', form!)?.value;
    let m = have === "lost" ? `Hi KeyFoby, I've lost all my keys and need a price for a ${key}${forCar}.`
      : have === "spare" ? `Hi KeyFoby, I need a price for a spare ${key}${forCar}.`
      : `Hi KeyFoby, I need a price for a ${key}${forCar}.`;
    if (where) m += ` The car is in ${where}.`;
    return m;
  }

  /* ---- messages ---- */
  /** text, then (unless lead is null) "<lead> call (905) 467-6860 or message us on WhatsApp." */
  function showAlert(text: string, lead: string | null = "Please") {
    alertBox.replaceChildren();
    const ns = "http://www.w3.org/2000/svg";
    const icon = d.createElementNS(ns, "svg");
    icon.setAttribute("class", "ic");
    icon.setAttribute("aria-hidden", "true");
    const use = d.createElementNS(ns, "use");
    use.setAttribute("href", "#i-info");
    icon.appendChild(use);
    const span = d.createElement("span");
    span.append(text);
    if (lead !== null) {
      const call = d.createElement("a");
      call.href = TEL; call.textContent = `call ${PHONE}`; call.dataset.track = "call"; call.dataset.trackLoc = "form-error";
      const wa = d.createElement("a");
      wa.href = waLink(waText()); wa.target = "_blank"; wa.rel = "noopener"; wa.textContent = "message us on WhatsApp";
      wa.dataset.track = "whatsapp"; wa.dataset.trackLoc = "form-error";
      span.append(` ${lead} `, call, " or ", wa, ".");
    }
    alertBox.append(icon, span);
    alertBox.hidden = false;
  }
  const clearAlert = () => { alertBox.hidden = true; alertBox.replaceChildren(); };

  function setErr(errId: string, inputs: Element[], msg: string) {
    const el = byId(errId);
    if (el) el.textContent = msg;
    inputs.forEach((i) => { if (msg) i.setAttribute("aria-invalid", "true"); else i.removeAttribute("aria-invalid"); });
    return !msg;
  }
  /* a field's error clears as soon as the visitor changes it */
  Object.values(FIELDS).forEach(([errId, inputId]) => {
    const input = byId(inputId);
    if (!input) return;
    const clear = () => { if (input.getAttribute("aria-invalid")) setErr(errId, [input], ""); };
    cleanups.push(on(input, "input", clear), on(input, "change", clear));
  });

  /* ---- Cloudflare Turnstile (explicit render, action "quote"), loaded when the form nears the screen ---- */
  let token: string | null = null;
  let widgetId: string | undefined;
  let tsState: "idle" | "loading" | "ready" | "error" = siteKey ? "idle" : "error";
  function renderWidget() {
    const ts = window.turnstile;
    if (!ts || widgetId !== undefined) return;
    const wrap = byId("ts-wrap");
    if (wrap) wrap.hidden = false;
    try {
      widgetId = ts.render(tsBox, {
        sitekey: siteKey,
        action: "quote",
        theme: "dark",
        size: tsBox.clientWidth && tsBox.clientWidth < 300 ? "compact" : "flexible",
        callback: (t: string) => { token = t; tsState = "ready"; },
        "expired-callback": () => { token = null; },
        "timeout-callback": () => { token = null; },
        "error-callback": () => { token = null; tsState = "error"; },
      });
      tsState = "ready";
    } catch {
      tsState = "error";
    }
  }
  function loadTurnstile() {
    if (!siteKey || tsState !== "idle") return;
    tsState = "loading";
    if (window.turnstile) { renderWidget(); return; }
    let s = qs<HTMLScriptElement>('script[src^="https://challenges.cloudflare.com/turnstile/"]');
    if (!s) {
      s = d.createElement("script");
      s.src = TURNSTILE_SRC;
      s.async = true;
      d.head.appendChild(s);
    }
    s.addEventListener("load", renderWidget, { once: true });
    s.addEventListener("error", () => { tsState = "error"; }, { once: true });
  }
  const resetWidget = () => {
    token = null;
    if (window.turnstile && widgetId !== undefined) {
      try { window.turnstile.reset(widgetId); } catch { /* ignore */ }
    }
  };
  if (siteKey) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); loadTurnstile(); } }, { rootMargin: "600px 0px" });
      io.observe(form);
      cleanups.push(() => io.disconnect());
    } else loadTurnstile();
    cleanups.push(on(form, "focusin", loadTurnstile));
  }

  /* ---- read and check the fields ---- */
  function readLead() {
    const lead: Record<string, unknown> = {};
    const keyType = f.keyType.value;
    if (keyType) lead.key_type = keyType;
    const have = qs<HTMLInputElement>('input[name="have"]:checked', form!)?.value;
    if (have) lead.has_working_key = have;
    lead.vehicle_year = f.year.value.trim();
    lead.vehicle_make = one(f.make.value);
    lead.vehicle_model = one(f.model.value);
    const ign = qs<HTMLInputElement>('input[name="ignition"]:checked', form!)?.value;
    if (ign) lead.ignition = ign;
    const town = f.town.value;
    if (town === "other") { lead.town = "other"; lead.other_town = one(f.otherTown.value); }
    else if (town) lead.town = town;
    lead.customer_name = one(f.name.value);
    lead.phone = f.phone.value.trim();
    const email = (f.email?.value || "").trim();
    if (email) lead.email = email;
    const details = f.details.value.trim();
    if (details) lead.details = details;
    lead.consent = f.consent.checked === true;
    lead.consent_version = CONSENT_VERSION;
    Object.assign(lead, attribution);
    return lead;
  }
  function validate(): HTMLElement | null {
    let first: HTMLElement | null = null;
    const maxYear = new Date().getFullYear() + 1;
    const y = f.year.value.trim();
    const checks: [string, HTMLElement[], string][] = [
      ["e-year", [f.year], /^\d{4}$/.test(y) && +y >= 1980 && +y <= maxYear ? "" : FIELDS.vehicle_year[2]],
      ["e-make", [f.make], f.make.value.trim() ? "" : FIELDS.vehicle_make[2]],
      ["e-model", [f.model], f.model.value.trim() ? "" : FIELDS.vehicle_model[2]],
      ["e-other", [f.otherTown], f.town.value !== "other" || f.otherTown.value.trim() ? "" : FIELDS.other_town[2]],
      ["e-details", [f.details], Array.from(f.details.value.trim()).length <= 1000 ? "" : FIELDS.details[2]],
      ["e-name", [f.name], f.name.value.trim() ? "" : FIELDS.customer_name[2]],
      ["e-phone", [f.phone], phoneOk(f.phone.value) ? "" : FIELDS.phone[2]],
      ["e-email", [f.email], emailOk(f.email?.value || "") ? "" : FIELDS.email[2]],
      ["e-consent", [f.consent], f.consent.checked ? "" : FIELDS.consent[2]],
    ];
    checks.forEach(([errId, inputs, msg]) => {
      if (!setErr(errId, inputs, msg) && !first) first = inputs[0];
    });
    return first;
  }

  /* ---- send ---- */
  let busy = false;
  let requestId: string | null = null;
  let lastSig = "";
  function setBusy(on: boolean) {
    busy = on;
    btn.disabled = on;
    if (on) { btn.setAttribute("aria-busy", "true"); btn.textContent = "Sending…"; }
    else { btn.removeAttribute("aria-busy"); btn.innerHTML = btnHtml; }
  }
  function succeed(ref: string | null, lead: Record<string, unknown>, emailed = false) {
    form!.hidden = true;
    const mailRow = byId("form-ok-mail");
    if (mailRow) mailRow.hidden = !emailed;
    const refRow = byId("form-ok-ref");
    const refVal = byId("form-ok-ref-v");
    if (ref && refRow && refVal) { refVal.textContent = ref; refRow.hidden = false; }
    okBox!.classList.add("is-on");
    okBox!.focus();
    /* api/lead.ts answers the honeypot with { ok: true, ref: null } and stores nothing:
       show the same thanks, but only a stored lead (it always has a KF-… ref) is a conversion */
    if (!ref) return;
    const keyType = typeof lead.key_type === "string" ? lead.key_type : "";
    trackSiteEvent("generate_lead", { form: "quote", key_type: keyType || undefined });
    trackContactFormSubmit(KEY_LABEL[keyType] || "Not sure");
    trackGoogleAdsLeadFormSubmit();
    trackGoogleAdsContact();
    trackGoogleAdsRequestQuote();
  }

  cleanups.push(on(form, "submit", async (e) => {
    e.preventDefault();
    if (busy) return;
    clearAlert();
    const first = validate();
    if (first) { (first as HTMLElement).focus(); return; }
    if (!siteKey) {
      showAlert("Online quote requests are switched off right now.");
      note.scrollIntoView({ block: "nearest" });
      return;
    }
    if (!token) {
      if (tsState === "error") showAlert("The security check couldn't load, so the form can't be sent.");
      else { loadTurnstile(); showAlert("One moment: the security check above the Send button is still running. Press Send again when it shows a tick.", null); }
      return;
    }
    const lead = readLead();
    const sig = JSON.stringify(lead);
    if (!requestId || sig !== lastSig) { requestId = uuid(); lastSig = sig; }
    lead.client_request_id = requestId;
    const usedToken = token;
    setBusy(true);
    let data: { ok?: boolean; ref?: string | null; emailed?: boolean; error?: string; field?: string } = {};
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, turnstileToken: usedToken, website: hp.value }),
        credentials: "same-origin",
      });
      data = await res.json().catch(() => ({ ok: false, error: "server" }));
    } catch {
      data = { ok: false, error: "server" };
    }
    resetWidget(); /* a Turnstile token works once; get a fresh one for any retry */
    setBusy(false);
    if (data.ok) { succeed(typeof data.ref === "string" ? data.ref : null, lead, data.emailed === true); return; }
    switch (data.error) {
      case "invalid": {
        const m = data.field ? FIELDS[data.field] : undefined;
        if (m) {
          const input = byId(m[1]);
          setErr(m[0], input ? [input] : [], m[2]);
          if (data.field === "other_town" && byId("f-other-wrap")) byId("f-other-wrap")!.hidden = false;
          input?.focus();
        } else {
          showAlert("Something in the form wasn't accepted. Check your details and send again.", "You can also");
        }
        break;
      }
      case "bot_check":
        showAlert("The security check didn't go through. Wait for it to refresh, then press Send again.", "You can also");
        break;
      case "rate_limited":
        showAlert("We've already had a few quote requests from this number in the last few minutes.", "To reach us now,");
        break;
      default:
        showAlert("Sorry, your request didn't go through. That's a problem on our side, not yours.");
    }
    /* Send was disabled while sending, so focus fell to <body>: put it back (a field error already focused its field) */
    if (!form!.contains(d.activeElement) || d.activeElement === btn) btn.focus();
  }));

  /* the honeypot must stay empty for people; browsers' autofill sometimes fills it */
  hp.value = "";

  return runAll([...cleanups, () => { if (window.turnstile && widgetId !== undefined) { try { window.turnstile.remove?.(widgetId); } catch { /* ignore */ } } }]);
}
