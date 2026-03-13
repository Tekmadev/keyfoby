/**
 * Placeholder for future pricing automation.
 *
 * Requirements:
 * - The system MUST be designed to support pricing later.
 * - The system MUST NOT auto-quote today.
 *
 * This file is where you can later add:
 * - make/model exceptions
 * - after-hours multipliers
 * - travel fees by service area
 * - key type distinctions (remote vs smart key)
 * - "lost all keys" complexity premiums
 */

export type PricingRule = {
  id: string;
  description: string;
  enabled: boolean;
  /**
   * A simple predicate-style rule shape for later expansion.
   * Keep it data-only for now; logic will live in `pricingEngine.ts`.
   */
  appliesTo?: {
    serviceNames?: string[];
    ignitionTypes?: Array<"Key Start" | "Push Button Start" | "Unknown">;
    vehicleYearMin?: number;
    vehicleYearMax?: number;
  };
  effect?: {
    addCents?: number;
    multiplyBy?: number;
    notes?: string;
  };
};

export const pricingRules: PricingRule[] = [
  // Intentionally empty/disabled by default.
  // Add rules here when you're ready to enable pricing suggestions.
];

