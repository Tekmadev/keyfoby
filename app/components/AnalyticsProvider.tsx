"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { analytics } from "@/lib/firebase";
import { trackPageView } from "@/lib/analytics";

interface AnalyticsContextType {
  isLoaded: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  isLoaded: false,
});

export const useAnalytics = () => useContext(AnalyticsContext);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export default function AnalyticsProvider({
  children,
}: AnalyticsProviderProps) {
  useEffect(() => {
    // Defer analytics loading to prevent render blocking
    // Use requestIdleCallback for non-critical analytics
    const loadAnalytics = () => {
      if (analytics) {
        trackPageView("KeyFoby Landing Page");
      }
    };

    // Load analytics after page is interactive
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(loadAnalytics, { timeout: 2000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(loadAnalytics, 1000);
      }
    }

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && analytics) {
        trackPageView("Page Return");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <AnalyticsContext.Provider value={{ isLoaded: !!analytics }}>
      {children}
    </AnalyticsContext.Provider>
  );
}
