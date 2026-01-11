"use client";

import { useState, useEffect } from "react";
import {
  getServiceTypes,
  ServiceType,
  fallbackServiceTypes,
} from "@/lib/supabase";

interface UseServiceTypesResult {
  services: ServiceType[];
  isLoading: boolean;
  error: string | null;
}

export function useServiceTypes(): UseServiceTypesResult {
  const [services, setServices] = useState<ServiceType[]>(fallbackServiceTypes);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchServices() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getServiceTypes();

        if (isMounted) {
          setServices(data);
        }
      } catch (err) {
        console.error("Error loading service types:", err);
        if (isMounted) {
          setError("Failed to load services");
          // Keep fallback services
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchServices();

    return () => {
      isMounted = false;
    };
  }, []);

  return { services, isLoading, error };
}

