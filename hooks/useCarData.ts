/**
 * React Query Hooks for NHTSA Vehicle Data
 * Provides cached data fetching with proper loading and error states
 */

import { useQuery } from "@tanstack/react-query";
import {
  fetchMakes,
  fetchMakesForYear,
  fetchModelsForMakeAndYear,
  type VehicleMake,
  type VehicleModel,
} from "@/lib/nhtsa";

/**
 * Query configuration
 * Cache data for 24 hours since vehicle makes/models don't change often
 */
const QUERY_CONFIG = {
  staleTime: 1000 * 60 * 60 * 24, // 24 hours
  cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  retry: 2, // Retry failed requests twice
  refetchOnWindowFocus: false, // Don't refetch on window focus
};

/**
 * Fetch all makes for allowed vehicle types
 * Cached for 24 hours
 */
export function useMakes() {
  return useQuery<VehicleMake[], Error>({
    queryKey: ["makes"],
    queryFn: fetchMakes,
    ...QUERY_CONFIG,
  });
}

/**
 * Fetch makes for a specific year
 * Only enabled when year is provided
 * @param year - Model year (1990 to current+1)
 */
export function useMakesForYear(year: number | null) {
  return useQuery<VehicleMake[], Error>({
    queryKey: ["makes", year],
    queryFn: () => fetchMakesForYear(year!),
    enabled: year !== null && year >= 1990, // Only fetch if year is valid
    ...QUERY_CONFIG,
  });
}

/**
 * Fetch models for a specific make and year
 * Only enabled when both make and year are provided
 * @param make - Make name (e.g., "Toyota")
 * @param year - Model year
 */
export function useModelsForMakeAndYear(
  make: string | null,
  year: number | null
) {
  return useQuery<VehicleModel[], Error>({
    queryKey: ["models", make, year],
    queryFn: () => fetchModelsForMakeAndYear(make!, year!),
    enabled: !!make && make.trim().length > 0 && year !== null && year >= 1990, // Only fetch if both make and year are valid
    ...QUERY_CONFIG,
  });
}
