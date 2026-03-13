import type { IntakePayload } from "./intake";

export type Urgency = "low" | "medium" | "high";

export type ServiceFeasibility = "supported" | "unsupported" | "unknown";

/**
 * This is a *recommendation* object produced by the AI/automation pipeline.
 * It is not an approval or booking confirmation.
 */
export type IntakeDecision = {
  feasibility: ServiceFeasibility;
  urgency: Urgency;
  qualifiesForSameDay: boolean;

  /**
   * Human-in-the-loop guardrails:
   * - `requiresHumanApproval` MUST remain true until an owner approval flow exists.
   */
  requiresHumanApproval: true;

  /**
   * High-signal reasons the system used to reach a decision.
   * These are meant for the owner/admin UI later.
   */
  reasons: string[];

  /**
   * Missing info that the owner or a future follow-up workflow might request.
   * (We do not auto-follow-up yet per requirements.)
   */
  missingInfo: string[];
};

export type PricingReadiness = {
  canAutoPriceLater: boolean;
  reason: string;
  /**
   * The pipeline must NOT auto-quote today.
   * This is a placeholder for future enablement.
   */
  suggestedPriceRangeCents?: { min: number; max: number };
};

export type DraftEmail = {
  subject: string;
  bodyText: string;
  /**
   * Simple, owner-friendly bullets describing what the draft is trying to do.
   */
  intentNotes: string[];
};

export type IntakeAutomationOutput = {
  intake: IntakePayload;
  decision: IntakeDecision;
  pricing: PricingReadiness;
  draftEmail: DraftEmail;
  createdAtIso: string;
};

