import { analytics } from "./firebase";
import { logEvent } from "firebase/analytics";

// Google Ads gtag conversion helper
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const fireGtagConversion = (sendTo: string) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "conversion", { send_to: sendTo });
  }
};

export const trackGoogleAdsPageView = () => {
  fireGtagConversion("AW-17289404018/xI8ECM7q0ZEcEPK8nbRA");
};

export const trackGoogleAdsLeadFormSubmit = () => {
  fireGtagConversion("AW-17289404018/pbByCMvq0ZEcEPK8nbRA");
};

export const trackGoogleAdsContact = () => {
  fireGtagConversion("AW-17289404018/eKQgCNfq0ZEcEPK8nbRA");
};

export const trackGoogleAdsRequestQuote = () => {
  fireGtagConversion("AW-17289404018/aXiECNTq0ZEcEPK8nbRA");
};

// Custom event tracking functions for KeyFoby
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (analytics) {
    logEvent(analytics, eventName, parameters);
  }
};

// Specific business events for KeyFoby
export const trackQuoteRequest = (serviceType: string) => {
  trackEvent("quote_request", {
    service_type: serviceType,
    page_location: window.location.href,
  });
};

export const trackPhoneClick = () => {
  trackEvent("phone_click", {
    contact_method: "phone",
    phone_number: "+1 (905) 467-6860",
  });
};

export const trackWhatsAppClick = () => {
  trackEvent("whatsapp_click", {
    contact_method: "whatsapp",
    phone_number: "+19054676860",
  });
};

export const trackEmailClick = () => {
  trackEvent("email_click", {
    contact_method: "email",
    email_address: "keyfoby@gmail.com",
  });
};

export const trackServiceView = (serviceType: string) => {
  trackEvent("service_view", {
    service_type: serviceType,
  });
};

export const trackContactFormSubmit = (serviceType: string) => {
  trackEvent("contact_form_submit", {
    service_type: serviceType,
    form_type: "main_contact",
  });
};

export const trackNavigation = (section: string) => {
  trackEvent("navigation_click", {
    section_name: section,
  });
};

export const trackPageView = (pageName: string) => {
  trackEvent("page_view", {
    page_title: pageName,
    page_location: window.location.href,
  });
};
