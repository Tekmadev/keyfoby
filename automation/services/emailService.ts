/**
 * Email sending service.
 *
 * Requirements:
 * - Use EmailJS for now.
 * - Emails must be drafted by AI, editable by owner, and only sent after approval.
 *
 * This module is intentionally NOT used by `/api/intake` yet because there is
 * no owner approval workflow implemented in this increment.
 */

import type { DraftEmail } from "../types/decision";
import type { IntakePayload } from "../types/intake";

export type ApprovedEmailToSend = {
  toEmail: string;
  toPhone?: string;
  subject: string;
  bodyText: string;
};

/**
 * Placeholder for server-side EmailJS sending.
 *
 * Note: EmailJS is primarily client-side (`@emailjs/browser`). For server-side,
 * you'd typically use EmailJS's REST API with a private key, or switch to a
 * server email provider (SendGrid, Postmark, SES) later.
 */
export async function sendApprovedCustomerEmail(_args: {
  intake: IntakePayload;
  draft: DraftEmail;
  approved: ApprovedEmailToSend;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  return {
    ok: false,
    error:
      "Email sending is disabled until an owner approval flow is implemented. (Human-in-the-loop requirement.)",
  };
}

