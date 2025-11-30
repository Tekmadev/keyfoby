/**
 * NHTSA API Client
 * Integrates with the National Highway Traffic Safety Administration Vehicle API
 * API Documentation: https://vpic.nhtsa.dot.gov/api/
 */

const NHTSA_BASE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";

// Allowed vehicle types for filtering
const ALLOWED_VEHICLE_TYPES = ["car", "van", "truck", "mpv"] as const;

/**
 * NHTSA API Response Types
 */
export interface NHTSAResponse<T> {
  Count: number;
  Message: string;
  Results: T[];
  SearchCriteria?: string;
}

export interface NHTSAMake {
  MakeId: number;
  MakeName: string;
  Make_ID?: number;
  Make_Name?: string;
  VehicleTypeId?: number;
  VehicleTypeName?: string;
}

export interface NHTSAModel {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
  // Alternative format
  MakeId?: number;
  MakeName?: string;
  ModelId?: number;
  ModelName?: string;
}

export interface VehicleMake {
  id: number;
  name: string;
}

export interface VehicleModel {
  id: number;
  name: string;
  makeId: number;
  makeName: string;
}

/**
 * Normalize make data from NHTSA API
 * Handles both snake_case and camelCase formats
 */
function normalizeMake(make: NHTSAMake): VehicleMake {
  return {
    id: make.MakeId || make.Make_ID || 0,
    name: (make.MakeName || make.Make_Name || "").trim(),
  };
}

/**
 * Normalize model data from NHTSA API
 * Handles both snake_case and camelCase formats
 */
function normalizeModel(model: NHTSAModel): VehicleModel {
  return {
    id: model.Model_ID || model.ModelId || 0,
    name: (model.Model_Name || model.ModelName || "").trim(),
    makeId: model.Make_ID || model.MakeId || 0,
    makeName: (model.Make_Name || model.MakeName || "").trim(),
  };
}

/**
 * Generate array of years from 1990 to current year + 1
 * Returns years in descending order (newest first)
 */
export function getCommonYears(): number[] {
  const currentYear = new Date().getFullYear();
  const startYear = 1990;
  const endYear = currentYear + 1; // Include next year for upcoming models

  const years: number[] = [];
  for (let year = endYear; year >= startYear; year--) {
    years.push(year);
  }
  return years;
}

/**
 * Fetch makes for a specific vehicle type
 * @param vehicleType - Type of vehicle (car, van, truck, mpv)
 */
async function fetchMakesByType(vehicleType: string): Promise<VehicleMake[]> {
  try {
    const response = await fetch(
      `${NHTSA_BASE_URL}/GetMakesForVehicleType/${vehicleType}?format=json`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch makes for ${vehicleType}`);
    }

    const data: NHTSAResponse<NHTSAMake> = await response.json();

    if (!data.Results || data.Results.length === 0) {
      return [];
    }

    return data.Results.map(normalizeMake).filter(
      (make) => make.name && make.id
    );
  } catch (error) {
    console.error(`Error fetching makes for ${vehicleType}:`, error);
    return [];
  }
}

/**
 * Fetch all makes for allowed vehicle types (car, van, truck, mpv)
 * Combines results from multiple vehicle types and removes duplicates
 */
export async function fetchMakes(): Promise<VehicleMake[]> {
  try {
    // Fetch makes for all allowed vehicle types in parallel
    const makePromises = ALLOWED_VEHICLE_TYPES.map((type) =>
      fetchMakesByType(type)
    );

    const makesArrays = await Promise.all(makePromises);

    // Flatten and remove duplicates
    const allMakes = makesArrays.flat();
    const uniqueMakes = new Map<number, VehicleMake>();

    allMakes.forEach((make) => {
      if (!uniqueMakes.has(make.id)) {
        uniqueMakes.set(make.id, make);
      }
    });

    // Convert to array and sort alphabetically
    const sortedMakes = Array.from(uniqueMakes.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return sortedMakes;
  } catch (error) {
    console.error("Error fetching makes:", error);
    throw new Error("Failed to load vehicle makes. Please try again later.");
  }
}

/**
 * Fetch makes for a specific year
 * Filters by allowed vehicle types
 * @param year - Model year
 */
export async function fetchMakesForYear(year: number): Promise<VehicleMake[]> {
  try {
    // For performance, we'll fetch all makes and assume they're available for the year
    // The NHTSA API doesn't have a direct "makes for year" endpoint that's reliable
    // The models endpoint will handle year-specific filtering
    return await fetchMakes();
  } catch (error) {
    console.error(`Error fetching makes for year ${year}:`, error);
    throw new Error("Failed to load vehicle makes. Please try again later.");
  }
}

/**
 * Fetch models for a specific make
 * @param make - Make name (e.g., "Toyota")
 */
export async function fetchModels(make: string): Promise<VehicleModel[]> {
  try {
    const encodedMake = encodeURIComponent(make);
    const response = await fetch(
      `${NHTSA_BASE_URL}/GetModelsForMake/${encodedMake}?format=json`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch models for ${make}`);
    }

    const data: NHTSAResponse<NHTSAModel> = await response.json();

    if (!data.Results || data.Results.length === 0) {
      return [];
    }

    const models = data.Results.map(normalizeModel)
      .filter((model) => model.name && model.id)
      .sort((a, b) => a.name.localeCompare(b.name));

    return models;
  } catch (error) {
    console.error(`Error fetching models for ${make}:`, error);
    throw new Error("Failed to load vehicle models. Please try again later.");
  }
}

/**
 * Fetch models for a specific make and year
 * This is the most accurate endpoint for year-specific models
 * @param make - Make name (e.g., "Toyota")
 * @param year - Model year
 */
export async function fetchModelsForMakeAndYear(
  make: string,
  year: number
): Promise<VehicleModel[]> {
  try {
    const encodedMake = encodeURIComponent(make);
    const response = await fetch(
      `${NHTSA_BASE_URL}/GetModelsForMakeYear/make/${encodedMake}/modelyear/${year}?format=json`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch models for ${make} ${year}`);
    }

    const data: NHTSAResponse<NHTSAModel> = await response.json();

    if (!data.Results || data.Results.length === 0) {
      return [];
    }

    const models = data.Results.map(normalizeModel)
      .filter((model) => model.name && model.id)
      .sort((a, b) => a.name.localeCompare(b.name));

    return models;
  } catch (error) {
    console.error(`Error fetching models for ${make} ${year}:`, error);
    throw new Error("Failed to load vehicle models. Please try again later.");
  }
}

/**
 * Search makes by name
 * Client-side filtering for better UX
 */
export function filterMakes(
  makes: VehicleMake[],
  searchTerm: string
): VehicleMake[] {
  if (!searchTerm) return makes;

  const lowerSearch = searchTerm.toLowerCase().trim();
  return makes.filter((make) => make.name.toLowerCase().includes(lowerSearch));
}

/**
 * Search models by name
 * Client-side filtering for better UX
 */
export function filterModels(
  models: VehicleModel[],
  searchTerm: string
): VehicleModel[] {
  if (!searchTerm) return models;

  const lowerSearch = searchTerm.toLowerCase().trim();
  return models.filter((model) =>
    model.name.toLowerCase().includes(lowerSearch)
  );
}
