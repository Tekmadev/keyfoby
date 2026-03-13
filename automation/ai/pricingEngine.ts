import { serviceCatalog } from "../config/serviceCatalog";
import type { IntakePayload } from "../types/intake";
import type { PricingReadiness } from "../types/decision";

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

/**
 * Pricing engine is intentionally conservative today:
 * - It NEVER auto-quotes.
 * - It only reports whether future auto-pricing *could* be enabled for this intake.
 */
export function evaluatePricingReadiness(payload: IntakePayload): PricingReadiness {
  const catalogItem = serviceCatalog.find(
    (s) => normalize(s.name) === normalize(payload.serviceRequested)
  );

  if (!catalogItem) {
    return {
      canAutoPriceLater: false,
      reason: "Service not found in catalog; pricing automation not possible yet.",
    };
  }

  // We consider pricing "ready later" only if we have enough structured data AND some pricing data.
  const year = Number(payload.vehicleYear);
  if (!Number.isFinite(year)) {
    return {
      canAutoPriceLater: false,
      reason: "Vehicle year is not numeric; pricing automation not possible yet.",
    };
  }

  const hasAnyPricingData =
    typeof catalogItem.basePriceCents === "number" ||
    (catalogItem.priceRangeCents?.min != null && catalogItem.priceRangeCents?.max != null);

  if (!hasAnyPricingData) {
    return {
      canAutoPriceLater: false,
      reason:
        "Catalog does not contain pricing data for this service; keep human quoting for now.",
    };
  }

  // Still do NOT quote; optionally surface a broad range for owner review later.
  const suggestedRange = catalogItem.priceRangeCents;

  return {
    canAutoPriceLater: true,
    reason:
      "Sufficient structured details and catalog pricing data exist; safe to enable pricing later (still requires approval).",
    ...(suggestedRange ? { suggestedPriceRangeCents: suggestedRange } : {}),
  };
}

