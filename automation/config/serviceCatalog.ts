import type { IgnitionType } from "../types/intake";

export type ServiceCatalogItem = {
  /**
   * Name should match what your UI/service list uses (from Supabase).
   * If names differ, the decision engine will try a best-effort normalization.
   */
  name: string;

  /**
   * If empty/undefined, treat as "unknown/needs human review".
   */
  supportedIgnitionTypes?: IgnitionType[];

  /**
   * If undefined, treat as "unknown/needs human review".
   */
  supportedVehicleYearRange?: { min: number; max: number };

  /**
   * Pricing fields are data-only and optional today.
   * We explicitly do NOT auto-quote in the pricing engine yet.
   */
  basePriceCents?: number;
  priceRangeCents?: { min: number; max: number };

  notes?: string;
};

/**
 * IMPORTANT:
 * - This is intentionally a configuration/data file (not hardcoded logic).
 * - Populate/adjust names to match your Supabase `services` table values.
 * - Keep pricing optional until you're ready to enable pricing automation.
 */
export const serviceCatalog: ServiceCatalogItem[] = [
  {
    name: "Add Key",
    supportedIgnitionTypes: ["Key Start", "Push Button Start"],
    supportedVehicleYearRange: { min: 1996, max: new Date().getFullYear() + 1 },
    notes:
      "Adding a new key/key fob when at least one working key may still exist. Key type affects feasibility and pricing.",
  },
  {
    name: "Program & Key Cut",
    supportedIgnitionTypes: ["Key Start", "Push Button Start"],
    supportedVehicleYearRange: { min: 1996, max: new Date().getFullYear() + 1 },
    notes:
      "Programming plus cutting. May require ownership verification and on-site service depending on vehicle.",
  },
  {
    name: "Key Cut",
    supportedIgnitionTypes: ["Key Start", "Push Button Start", "Unknown"],
    supportedVehicleYearRange: { min: 1990, max: new Date().getFullYear() + 1 },
    notes:
      "Cutting a key only. For push-to-start vehicles this might be an emergency blade; confirm details.",
  },
  {
    name: "Program",
    supportedIgnitionTypes: ["Key Start", "Push Button Start"],
    supportedVehicleYearRange: { min: 1996, max: new Date().getFullYear() + 1 },
    notes:
      "Programming a key/remote. Confirm if customer has a working key and what type of remote/fob is needed.",
  },
  {
    name: "Lockout",
    supportedIgnitionTypes: ["Key Start", "Push Button Start", "Unknown"],
    supportedVehicleYearRange: { min: 1990, max: new Date().getFullYear() + 1 },
    notes:
      "Emergency lockout. Feasibility depends on location/vehicle and whether keys are inside.",
  },
  {
    name: "All Key Lost",
    supportedIgnitionTypes: ["Key Start", "Push Button Start"],
    supportedVehicleYearRange: { min: 1996, max: new Date().getFullYear() + 1 },
    notes:
      "Typically urgent. Often requires on-site service and possibly immobilizer considerations.",
  },
  {
    name: "Immobilizer",
    supportedIgnitionTypes: ["Key Start", "Push Button Start", "Unknown"],
    supportedVehicleYearRange: { min: 1996, max: new Date().getFullYear() + 1 },
    notes:
      "Immobilizer service/reset. Compatibility is vehicle-specific; keep human review.",
  },
  {
    name: "Diagnosis & Open",
    supportedIgnitionTypes: ["Key Start", "Push Button Start", "Unknown"],
    supportedVehicleYearRange: { min: 1990, max: new Date().getFullYear() + 1 },
    notes:
      "Diagnostic/opening service. Requires human review of the customer's problem description.",
  },
  {
    name: "Shell Replacement",
    supportedIgnitionTypes: ["Key Start", "Push Button Start", "Unknown"],
    notes:
      "Key shell replacement. Confirm key style and button layout; vehicle year may not be needed.",
  },
  {
    name: "Transponder Key",
    supportedIgnitionTypes: ["Key Start", "Push Button Start"],
    supportedVehicleYearRange: { min: 1996, max: new Date().getFullYear() + 1 },
    notes:
      "Transponder key service. Often requires cutting and programming; confirm if all keys are lost.",
  },
  {
    name: "Key Sell",
    supportedIgnitionTypes: ["Key Start", "Push Button Start", "Unknown"],
    notes:
      "Selling a key/fob. Confirm the exact part needed; do not auto-quote.",
  },
  {
    name: "Other",
    supportedIgnitionTypes: ["Key Start", "Push Button Start", "Unknown"],
    notes:
      "Custom request. Always requires human review.",
  },
];

