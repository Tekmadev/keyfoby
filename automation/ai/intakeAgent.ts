import type { IntakePayload } from "../types/intake";
import type { IntakeAutomationOutput } from "../types/decision";
import { decideIntake } from "./decisionEngine";
import { evaluatePricingReadiness } from "./pricingEngine";
import { generateDraftEmail } from "./emailDraftAgent";

/**
 * Orchestrates the intake processing pipeline.
 *
 * IMPORTANT:
 * - Produces recommendations only.
 * - Never sends emails or books calendar events.
 * - Keeps business logic server-side.
 */
export async function processIntake(payload: IntakePayload): Promise<IntakeAutomationOutput> {
  const createdAtIso = new Date().toISOString();
  const normalizedPayload: IntakePayload = {
    ...payload,
    submittedAtIso: payload.submittedAtIso ?? createdAtIso,
    source: payload.source ?? "unknown",
  };

  const decision = decideIntake(normalizedPayload);
  const pricing = evaluatePricingReadiness(normalizedPayload);
  const draftEmail = await generateDraftEmail({ payload: normalizedPayload, decision, pricing });

  return {
    intake: normalizedPayload,
    decision,
    pricing,
    draftEmail,
    createdAtIso,
  };
}

