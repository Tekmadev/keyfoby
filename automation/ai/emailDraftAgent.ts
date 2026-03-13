import type { DraftEmail } from "../types/decision";
import type { IntakePayload } from "../types/intake";
import type { IntakeDecision, PricingReadiness } from "../types/decision";

type OpenAiResponseTextResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

function fallbackDraft(
  payload: IntakePayload,
  decision: IntakeDecision
): DraftEmail {
  const vehicle = [
    payload.vehicleYear,
    payload.vehicleMake,
    payload.vehicleModel,
  ]
    .filter(Boolean)
    .join(" ");
  const subject = `Re: ${payload.serviceRequested || "Your request"} (${
    vehicle || "vehicle info"
  })`;

  const lines: string[] = [];
  lines.push(`Hi${payload.customerName ? ` ${payload.customerName}` : ""},`);
  lines.push("");
  lines.push("Thanks for reaching out to KeyFoby.");
  lines.push("We typically reply within 2 hours.");
  lines.push(
    `We received your request for: ${
      payload.serviceRequested || "service inquiry"
    }${vehicle ? ` for your ${vehicle}` : ""}.`
  );
  lines.push("");

  if (decision.feasibility === "unsupported") {
    lines.push(
      "Based on the details provided, this request may not be supported as-is. I’ll review it and get back to you shortly with the best next steps."
    );
  } else if (decision.feasibility === "supported") {
    lines.push(
      "This looks like something we can likely help with. I’ll review your details and confirm the best option for your vehicle."
    );
  } else {
    lines.push(
      "I’ll review your details to confirm whether we can help and what the next steps are."
    );
  }

  if (decision.missingInfo.length) {
    lines.push("");
    lines.push(
      `To move faster, please reply with: ${decision.missingInfo.join(", ")}.`
    );
  }

  lines.push("");
  lines.push(
    "We don’t confirm pricing or booking until a technician reviews your details."
  );
  lines.push("");
  lines.push("Thank you,");
  lines.push("KeyFoby");

  return {
    subject,
    bodyText: lines.join("\n"),
    intentNotes: [
      "Acknowledge request and set expectations",
      "Avoid auto-quoting and auto-booking",
      "Request missing details if needed",
    ],
  };
}

async function callOpenAiForEmailDraft(input: {
  payload: IntakePayload;
  decision: IntakeDecision;
  pricing: PricingReadiness;
}): Promise<OpenAiResponseTextResult> {
  const apiKey = env("OPENAI_API_KEY");
  if (!apiKey) return { ok: false, error: "OPENAI_API_KEY missing on server." };

  // Use a configurable model; default to a lightweight one.
  const model = env("OPENAI_MODEL") ?? "gpt-4o-mini";

  // Responses API (preferred). We only need plain text output.
  const prompt = [
    "You are an assistant for a mobile automotive key service business.",
    "Write a professional customer email draft.",
    "Constraints:",
    "- Tone: friendly but professional.",
    "- Mention we typically reply within 2 hours (without overpromising).",
    "- Do NOT confirm pricing.",
    "- Do NOT confirm booking/date/time.",
    "- Keep it concise, polite, and clear.",
    "- If information is missing, ask for it in a single short bullet list.",
    "",
    "Customer intake (JSON):",
    JSON.stringify(input.payload),
    "",
    "Decision (JSON):",
    JSON.stringify(input.decision),
    "",
    "Pricing readiness (JSON):",
    JSON.stringify(input.pricing),
    "",
    "Output format EXACTLY:",
    "SUBJECT: <one line>",
    "BODY:",
    "<email body text>",
  ].join("\n");

  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: prompt,
        temperature: 0.4,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        ok: false,
        error: `OpenAI error: ${res.status} ${errText}`.trim(),
      };
    }

    const json = (await res.json()) as any;
    // Responses API often returns `output_text` convenience.
    const text: string | undefined =
      typeof json.output_text === "string"
        ? json.output_text
        : Array.isArray(json.output)
        ? json.output
            .flatMap((o: any) => o?.content ?? [])
            .map((c: any) => (c?.type === "output_text" ? c.text : ""))
            .filter(Boolean)
            .join("\n")
        : undefined;

    if (!text || !text.trim())
      return { ok: false, error: "OpenAI returned empty draft." };
    return { ok: true, text: text.trim() };
  } catch (e: any) {
    return { ok: false, error: e?.message || "OpenAI request failed." };
  }
}

function parseDraftFromModel(text: string): {
  subject?: string;
  body?: string;
} {
  const lines = text.split("\n");
  const subjectLine = lines.find((l) =>
    l.trim().toUpperCase().startsWith("SUBJECT:")
  );
  const subject = subjectLine
    ? subjectLine.split(":").slice(1).join(":").trim()
    : undefined;

  const bodyStartIdx = lines.findIndex(
    (l) => l.trim().toUpperCase() === "BODY:"
  );
  const body =
    bodyStartIdx >= 0
      ? lines
          .slice(bodyStartIdx + 1)
          .join("\n")
          .trim()
      : undefined;

  return { subject, body };
}

export async function generateDraftEmail(args: {
  payload: IntakePayload;
  decision: IntakeDecision;
  pricing: PricingReadiness;
}): Promise<DraftEmail> {
  // Try OpenAI; if it fails, fall back to a deterministic template.
  const modelResult = await callOpenAiForEmailDraft(args);
  if (!modelResult.ok) return fallbackDraft(args.payload, args.decision);

  const parsed = parseDraftFromModel(modelResult.text);
  if (!parsed.subject || !parsed.body)
    return fallbackDraft(args.payload, args.decision);

  return {
    subject: parsed.subject,
    bodyText: parsed.body,
    intentNotes: [
      "Professional, concise reply drafted by AI",
      "No pricing/booking confirmation (human approval required)",
    ],
  };
}
