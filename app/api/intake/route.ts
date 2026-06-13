import { NextResponse } from "next/server";
import { processIntake } from "@/automation/ai/intakeAgent";
import { getIntakeStore } from "@/automation/services/intakeStore";
import type { IntakePayload, IgnitionType } from "@/automation/types/intake";

// API routes are not served from the static export — required for build compatibility
export const dynamic = "force-static";

function getOwnerToken(): string | undefined {
  const v = process.env.AUTOMATION_OWNER_TOKEN;
  return v && v.trim() ? v.trim() : undefined;
}

function isAuthorizedOwner(req: Request): boolean {
  const token = getOwnerToken();
  if (!token) return false;
  const auth = req.headers.get("authorization") || "";
  const expected = `Bearer ${token}`;
  return auth === expected;
}

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function normalizeIgnitionType(v: unknown): IgnitionType {
  const s = asString(v).trim();
  if (s === "Key Start") return "Key Start";
  if (s === "Push Button Start") return "Push Button Start";
  return "Unknown";
}

function validatePayload(body: any): { ok: true; payload: IntakePayload } | { ok: false; error: string } {
  const payload: IntakePayload = {
    customerEmail: asString(body?.customerEmail).trim(),
    customerPhone: asString(body?.customerPhone).trim(),
    ignitionType: normalizeIgnitionType(body?.ignitionType),
    vehicleYear: asString(body?.vehicleYear).trim(),
    vehicleMake: asString(body?.vehicleMake).trim(),
    vehicleModel: asString(body?.vehicleModel).trim(),
    serviceRequested: asString(body?.serviceRequested).trim(),
    customerMessage: asString(body?.customerMessage).trim(),
    customerName: asString(body?.customerName).trim() || undefined,
    source: "web_contact_form",
    submittedAtIso: new Date().toISOString(),
  };

  // Required fields per spec:
  const missing: string[] = [];
  if (!payload.ignitionType || payload.ignitionType === "Unknown") missing.push("ignition type");
  if (!payload.vehicleYear) missing.push("vehicle year");
  if (!payload.vehicleMake) missing.push("vehicle make");
  if (!payload.vehicleModel) missing.push("vehicle model");
  if (!payload.serviceRequested) missing.push("service requested");
  if (!payload.customerMessage) missing.push("customer message");
  if (!payload.customerEmail) missing.push("customer email");
  if (!payload.customerPhone) missing.push("customer phone");

  if (missing.length) {
    return { ok: false, error: `Missing required field(s): ${missing.join(", ")}.` };
  }

  return { ok: true, payload };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = validatePayload(body);
    if (!validated.ok) {
      return NextResponse.json({ ok: false, error: validated.error }, { status: 400 });
    }

    // Run intake automation (recommendations only, no sending/booking).
    const output = await processIntake(validated.payload);

    // Save internally for owner review (in-memory store for now).
    const stored = getIntakeStore().put(output);

    return NextResponse.json(
      {
        ok: true,
        intakeId: stored.id,
        status: "received",
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Failed to process intake." },
      { status: 500 }
    );
  }
}

/**
 * Owner-only endpoint: list recent intakes for an internal dashboard / React Native app.
 * Protected via `Authorization: Bearer ${AUTOMATION_OWNER_TOKEN}`.
 */
export async function GET(req: Request) {
  if (!getOwnerToken()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Owner API is not configured. Set AUTOMATION_OWNER_TOKEN to enable owner-only endpoints.",
      },
      { status: 501 }
    );
  }

  if (!isAuthorizedOwner(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(req.url);
  const limitParam = url.searchParams.get("limit");
  const limit = Math.min(Math.max(Number(limitParam || "20") || 20, 1), 100);

  const recent = getIntakeStore().listRecent(limit).map((item) => ({
    id: item.id,
    createdAtIso: item.output.createdAtIso,
    serviceRequested: item.output.intake.serviceRequested,
    customerEmail: item.output.intake.customerEmail,
    customerPhone: item.output.intake.customerPhone,
    urgency: item.output.decision.urgency,
    feasibility: item.output.decision.feasibility,
    qualifiesForSameDay: item.output.decision.qualifiesForSameDay,
  }));

  return NextResponse.json({ ok: true, items: recent }, { status: 200 });
}

