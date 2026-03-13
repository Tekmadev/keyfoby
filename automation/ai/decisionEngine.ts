import { serviceCatalog } from "../config/serviceCatalog";
import type { IntakePayload } from "../types/intake";
import type { IntakeDecision, ServiceFeasibility, Urgency } from "../types/decision";

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

function findCatalogItem(serviceRequested: string) {
  const n = normalize(serviceRequested);
  if (!n) return undefined;
  return serviceCatalog.find((item) => normalize(item.name) === n);
}

function inferUrgency(payload: IntakePayload): { urgency: Urgency; reasons: string[] } {
  const text = `${payload.serviceRequested} ${payload.customerMessage}`.toLowerCase();
  const reasons: string[] = [];

  // Heuristic keywords. (We can later replace/augment with a model classifier.)
  const highSignals = ["urgent", "asap", "today", "now", "emergency", "stuck", "locked", "stranded"];
  const mediumSignals = ["soon", "tomorrow", "this week", "appointment", "schedule"];

  if (highSignals.some((k) => text.includes(k))) {
    reasons.push("Customer message contains urgency keywords.");
    return { urgency: "high", reasons };
  }
  if (mediumSignals.some((k) => text.includes(k))) {
    reasons.push("Customer message suggests near-term scheduling.");
    return { urgency: "medium", reasons };
  }
  reasons.push("No urgency keywords detected; defaulting to low urgency.");
  return { urgency: "low", reasons };
}

function qualifiesForSameDay(payload: IntakePayload, urgency: Urgency): { qualifies: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const text = `${payload.serviceRequested} ${payload.customerMessage}`.toLowerCase();

  // NOTE: This is a recommendation only. Real availability is a human decision.
  if (urgency === "high" || text.includes("today") || text.includes("same day")) {
    reasons.push("High urgency / same-day intent detected.");
    return { qualifies: true, reasons };
  }
  reasons.push("No same-day intent detected; recommend normal scheduling.");
  return { qualifies: false, reasons };
}

export function decideIntake(payload: IntakePayload): IntakeDecision {
  const reasons: string[] = [];
  const missingInfo: string[] = [];

  // Validate the minimum useful info for the owner.
  if (!payload.vehicleYear) missingInfo.push("Vehicle year");
  if (!payload.vehicleMake) missingInfo.push("Vehicle make");
  if (!payload.vehicleModel) missingInfo.push("Vehicle model");
  if (!payload.ignitionType || payload.ignitionType === "Unknown") missingInfo.push("Ignition type");
  if (!payload.customerPhone) missingInfo.push("Customer phone");

  const catalogItem = findCatalogItem(payload.serviceRequested);

  let feasibility: ServiceFeasibility = "unknown";
  if (!catalogItem) {
    reasons.push("Service not found in catalog; requires human review.");
  } else {
    // Check ignition type support if defined.
    if (
      catalogItem.supportedIgnitionTypes &&
      !catalogItem.supportedIgnitionTypes.includes(payload.ignitionType)
    ) {
      feasibility = "unsupported";
      reasons.push("Catalog indicates ignition type is unsupported for this service.");
    } else {
      // Check year range support if possible.
      const year = Number(payload.vehicleYear);
      if (Number.isFinite(year) && catalogItem.supportedVehicleYearRange) {
        const { min, max } = catalogItem.supportedVehicleYearRange;
        if (year < min || year > max) {
          feasibility = "unsupported";
          reasons.push("Catalog indicates vehicle year is outside supported range.");
        } else {
          feasibility = "supported";
          reasons.push("Catalog indicates service is supported for this ignition type/year.");
        }
      } else {
        feasibility = "supported";
        reasons.push("Catalog indicates service is supported (year range not enforced).");
      }
    }

    if (catalogItem.notes) reasons.push(`Catalog notes: ${catalogItem.notes}`);
  }

  const urgencyInference = inferUrgency(payload);
  reasons.push(...urgencyInference.reasons);

  const sameDay = qualifiesForSameDay(payload, urgencyInference.urgency);
  reasons.push(...sameDay.reasons);

  return {
    feasibility,
    urgency: urgencyInference.urgency,
    qualifiesForSameDay: sameDay.qualifies,
    requiresHumanApproval: true,
    reasons,
    missingInfo,
  };
}

