"use client";

import { useState, useMemo, useEffect } from "react";
import { useMakesForYear, useModelsForMakeAndYear } from "@/hooks/useCarData";
import { getCommonYears, filterMakes, filterModels } from "@/lib/nhtsa";

interface CarSelectorProps {
  year: string;
  make: string;
  model: string;
  onYearChange: (year: string) => void;
  onMakeChange: (make: string) => void;
  onModelChange: (model: string) => void;
  yearError?: string;
  makeError?: string;
  modelError?: string;
}

export default function CarSelector({
  year,
  make,
  model,
  onYearChange,
  onMakeChange,
  onModelChange,
  yearError,
  makeError,
  modelError,
}: CarSelectorProps) {
  const [makeSearch, setMakeSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [isManualModel, setIsManualModel] = useState(false);

  // Get years (static list - no API call)
  const years = useMemo(() => getCommonYears(), []);

  // Convert year string to number for API
  const yearNumber = year ? parseInt(year, 10) : null;

  // Fetch makes for selected year
  const {
    data: makes = [],
    isLoading: makesLoading,
    error: makesError,
  } = useMakesForYear(yearNumber);

  // Fetch models for selected make and year
  const {
    data: models = [],
    isLoading: modelsLoading,
    error: modelsError,
  } = useModelsForMakeAndYear(make, yearNumber);

  // Filter makes based on search
  const filteredMakes = useMemo(() => {
    return filterMakes(makes, makeSearch);
  }, [makes, makeSearch]);

  // Filter models based on search
  const filteredModels = useMemo(() => {
    return filterModels(models, modelSearch);
  }, [models, modelSearch]);

  // Show search input if list is long (>5 items)
  const showMakeSearch = makes.length > 5;
  const showModelSearch = models.length > 5;

  // Reset make when year changes
  useEffect(() => {
    if (year && make) {
      // If year changed and make was already selected, reset it
      const makeExists = makes.some((m) => m.name === make);
      if (!makeExists && !makesLoading) {
        onMakeChange("");
        setMakeSearch("");
      }
    }
  }, [year, makes, makesLoading]);

  // Reset model when make changes
  useEffect(() => {
    if (make && model && !isManualModel) {
      // If make changed and model was already selected, reset it
      const modelExists = models.some((m) => m.name === model);
      if (!modelExists && !modelsLoading) {
        onModelChange("");
        setModelSearch("");
      }
    }
  }, [make, models, modelsLoading, isManualModel]);

  // Handle year change
  const handleYearChange = (newYear: string) => {
    onYearChange(newYear);
    onMakeChange(""); // Reset make
    onModelChange(""); // Reset model
    setMakeSearch("");
    setModelSearch("");
    setIsManualModel(false);
  };

  // Handle make change
  const handleMakeChange = (newMake: string) => {
    onMakeChange(newMake);
    onModelChange(""); // Reset model
    setModelSearch("");
    setIsManualModel(false);
  };

  // Handle manual model toggle
  const handleManualModelToggle = () => {
    setIsManualModel(!isManualModel);
    if (!isManualModel) {
      // Switching to manual
      setModelSearch("");
    } else {
      // Switching to dropdown
      onModelChange("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Year Dropdown */}
      <div>
        <label
          htmlFor="vehicle-year"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Vehicle Year <span className="text-slate-500">(Optional)</span>
        </label>
        <select
          id="vehicle-year"
          value={year}
          onChange={(e) => handleYearChange(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="">Select Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        {yearError && <p className="mt-1 text-sm text-red-400">{yearError}</p>}
      </div>

      {/* Make Dropdown */}
      <div>
        <label
          htmlFor="vehicle-make"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Vehicle Make{" "}
          <span className="text-slate-500">(Select year first)</span>
        </label>

        {/* Search input for makes (if list is long) */}
        {showMakeSearch && year && !makesLoading && (
          <input
            type="text"
            placeholder="Search makes..."
            value={makeSearch}
            onChange={(e) => setMakeSearch(e.target.value)}
            className="w-full px-4 py-2 mb-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          />
        )}

        <select
          id="vehicle-make"
          value={make}
          onChange={(e) => handleMakeChange(e.target.value)}
          disabled={!year || makesLoading}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {!year
              ? "Select year first"
              : makesLoading
              ? "Loading makes..."
              : "Select Make"}
          </option>
          {filteredMakes.map((m) => (
            <option key={m.id} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>

        {makesError && (
          <p className="mt-1 text-sm text-red-400">
            Error loading makes. Please try again.
          </p>
        )}
        {makeError && <p className="mt-1 text-sm text-red-400">{makeError}</p>}
        {makeSearch && filteredMakes.length === 0 && !makesLoading && (
          <p className="mt-1 text-sm text-slate-400">
            No makes found for "{makeSearch}"
          </p>
        )}
      </div>

      {/* Model Field - Dropdown or Manual Entry */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="vehicle-model"
            className="block text-sm font-medium text-slate-300"
          >
            Vehicle Model{" "}
            <span className="text-slate-500">(Select make first)</span>
          </label>

          {/* Manual entry toggle - only show if make is selected */}
          {make && (
            <button
              type="button"
              onClick={handleManualModelToggle}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              {isManualModel ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  Use Dropdown
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Manual Entry
                </>
              )}
            </button>
          )}
        </div>

        {isManualModel ? (
          /* Manual text input for model */
          <input
            type="text"
            id="vehicle-model"
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            placeholder="Enter model name (e.g., Camry, Model 3)"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        ) : (
          <>
            {/* Search input for models (if list is long) */}
            {showModelSearch && make && year && !modelsLoading && (
              <input
                type="text"
                placeholder="Search models..."
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                className="w-full px-4 py-2 mb-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            )}

            {/* Model dropdown */}
            <select
              id="vehicle-model"
              value={model}
              onChange={(e) => onModelChange(e.target.value)}
              disabled={!make || !year || modelsLoading}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {!year
                  ? "Select year first"
                  : !make
                  ? "Select make first"
                  : modelsLoading
                  ? "Loading models..."
                  : "Select Model"}
              </option>
              {filteredModels.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>

            {modelsError && (
              <p className="mt-1 text-sm text-red-400">
                Error loading models. Try manual entry instead.
              </p>
            )}
            {modelSearch && filteredModels.length === 0 && !modelsLoading && (
              <p className="mt-1 text-sm text-slate-400">
                No models found for "{modelSearch}". Try manual entry.
              </p>
            )}
          </>
        )}

        {modelError && (
          <p className="mt-1 text-sm text-red-400">{modelError}</p>
        )}

        {/* Helper text */}
        {isManualModel && (
          <p className="mt-1 text-xs text-slate-400">
            Enter the exact model name (useful for EV variants or newer models)
          </p>
        )}
        {!isManualModel && make && !modelsLoading && models.length === 0 && (
          <p className="mt-1 text-xs text-slate-400">
            No models found. Try manual entry above.
          </p>
        )}
      </div>
    </div>
  );
}
