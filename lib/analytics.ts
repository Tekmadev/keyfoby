import { analytics } from "./firebase";
import { logEvent } from "firebase/analytics";

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
    phone_number: "+1 (438) 797-7776",
  });
};

export const trackWhatsAppClick = () => {
  trackEvent("whatsapp_click", {
    contact_method: "whatsapp",
    phone_number: "+14387977776",
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
