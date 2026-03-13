export type IgnitionType = "Key Start" | "Push Button Start" | "Unknown";

/**
 * Structured payload sent from the public contact form to `/api/intake`.
 * This is intentionally business-focused (not UI-focused) so it can be reused
 * by future clients (e.g. React Native mobile app, internal admin tools).
 */
export type IntakePayload = {
  // Customer contact
  customerEmail: string;
  customerPhone: string;

  // Vehicle + request context
  ignitionType: IgnitionType;
  vehicleYear: string; // keep as string because UI captures it as a string
  vehicleMake: string;
  vehicleModel: string;
  serviceRequested: string;
  customerMessage: string;

  // Optional fields (not required by the spec but useful for owner review)
  customerName?: string;

  // Metadata (server can fill)
  submittedAtIso?: string;
  source?: "web_contact_form" | "unknown";
};

export type IntakeRecord = {
  id: string;
  payload: IntakePayload;
  createdAtIso: string;
};

