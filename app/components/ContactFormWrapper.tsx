"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import ContactForm from "./ContactForm";

/**
 * Wrapper for ContactForm to provide React Query context
 * Creates a QueryClient instance for caching vehicle data
 */
export default function ContactFormWrapper() {
  // Create QueryClient with useState to ensure it's only created once
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Don't retry on mount - reduces unnecessary API calls
            refetchOnMount: false,
            // Don't refetch on window focus
            refetchOnWindowFocus: false,
            // Cache data for 24 hours (vehicle data doesn't change often)
            staleTime: 1000 * 60 * 60 * 24,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ContactForm />
    </QueryClientProvider>
  );
}
