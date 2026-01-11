"use client";

import { useState, useRef, useEffect } from "react";
import { businessData } from "@/lib/business-data";
import { useServiceTypes } from "@/hooks/useServiceTypes";
import emailjs from "@emailjs/browser";
import {
  parsePhoneNumber,
  isValidPhoneNumber,
  formatIncompletePhoneNumber,
} from "libphonenumber-js";
import { trackContactFormSubmit, trackWhatsAppClick } from "@/lib/analytics";
import { IconKey, IconPower } from "@tabler/icons-react";
import CarSelector from "./CarSelector";

export default function ContactForm() {
  // Fetch service types from Supabase
  const { services, isLoading: servicesLoading } = useServiceTypes();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    ignitionType: "",
    vehicleYear: "",
    vehicleMake: "",
    vehicleModel: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isValidatingPhone, setIsValidatingPhone] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  // Check if all required fields are filled
  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.service !== "" &&
    formData.ignitionType !== "" &&
    formData.vehicleYear !== "" &&
    formData.vehicleMake !== "" &&
    formData.vehicleModel !== "" &&
    formData.message.trim() !== "" &&
    termsAccepted &&
    !phoneError &&
    !emailError &&
    !isValidatingPhone &&
    !isValidatingEmail;

  // Lazy load Google Maps only when visible to reduce HTTP requests
  useEffect(() => {
    if (!mapContainerRef.current || shouldLoadMap) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load map when it's about to be visible (50% threshold)
            setShouldLoadMap(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "200px", // Start loading 200px before it's visible
        threshold: 0.1,
      }
    );

    observer.observe(mapContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoadMap]);

  // EmailJS configuration - Replace these with your actual EmailJS credentials
  const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
  const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
  const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

  // Format phone number as user types (Canadian format)
  const formatPhoneNumber = (value: string, previousValue: string = "") => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    const previousDigits = previousValue.replace(/\D/g, "");

    // If user is deleting and we have fewer digits, allow natural deletion
    if (digits.length < previousDigits.length) {
      // User is deleting, format with current digits
      if (digits.length === 0) return "";
      if (digits.length <= 3) return digits;
      if (digits.length <= 6)
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
        6,
        10
      )}`;
    }

    // For normal typing, use library formatting first
    if (digits.length === 0) return "";

    try {
      // Format as Canadian number
      const formatted = formatIncompletePhoneNumber(digits, "CA");
      return formatted;
    } catch {
      // Fallback formatting
      if (digits.length <= 3) return digits;
      if (digits.length <= 6)
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
        6,
        10
      )}`;
    }
  };

  // Validate email address
  const validateEmail = async (email: string) => {
    setIsValidatingEmail(true);
    setEmailError("");

    // Simulate API call delay for validation
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      // Basic email regex pattern
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

      if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email address");
      } else {
        // Additional validation for common issues
        const domain = email.split("@")[1];

        // Check for common typos in popular domains
        const commonDomains = {
          "gmail.com": ["gmai.com", "gmial.com", "gmail.co", "gmaill.com"],
          "yahoo.com": ["yaho.com", "yahoo.co", "yahooo.com"],
          "hotmail.com": ["hotmai.com", "hotmail.co", "hotmial.com"],
          "outlook.com": ["outlok.com", "outlook.co", "outllook.com"],
        };

        let suggestion = "";
        for (const [correct, typos] of Object.entries(commonDomains)) {
          if (typos.includes(domain)) {
            suggestion = ` Did you mean ${email.replace(domain, correct)}?`;
            setEmailError(`Please check your email address.${suggestion}`);
            break;
          }
        }

        if (!suggestion) {
          setEmailError("");
        }
      }
    } catch {
      setEmailError("Please enter a valid email address");
    } finally {
      setIsValidatingEmail(false);
    }
  };

  // Validate Canadian phone number
  const validatePhoneNumber = async (phoneNumber: string) => {
    setIsValidatingPhone(true);
    setPhoneError("");

    // Simulate API call delay for validation
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const isValid = isValidPhoneNumber(phoneNumber, "CA");

      if (!isValid) {
        // Try parsing to get more specific error
        try {
          const parsed = parsePhoneNumber(phoneNumber, "CA");
          if (!parsed.isValid()) {
            setPhoneError("Please enter a valid Canadian phone number");
          }
        } catch {
          setPhoneError("Please enter a valid Canadian phone number");
        }
      } else {
        setPhoneError("");
      }
    } catch {
      setPhoneError("Please enter a valid Canadian phone number");
    } finally {
      setIsValidatingPhone(false);
    }
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;
    const currentValue = input.value;

    // Handle backspace when cursor is right after formatting characters
    if (e.key === "Backspace") {
      const charBefore = currentValue[cursorPosition - 1];

      // If cursor is right after ), space, or -, move cursor back to delete the digit
      if (charBefore === ")" || charBefore === " " || charBefore === "-") {
        e.preventDefault();

        // Find the previous digit position
        let newPos = cursorPosition - 1;
        while (newPos > 0 && !/\d/.test(currentValue[newPos - 1])) {
          newPos--;
        }

        if (newPos > 0) {
          // Remove the digit and reformat
          const newValue =
            currentValue.substring(0, newPos - 1) +
            currentValue.substring(cursorPosition);
          const formattedPhone = formatPhoneNumber(newValue, currentValue);

          setFormData({
            ...formData,
            phone: formattedPhone,
          });

          // Set cursor position after the formatting
          setTimeout(() => {
            if (phoneInputRef.current) {
              // Position cursor where the deleted digit was
              let targetPos = newPos - 1;
              // Adjust for any formatting changes
              while (
                targetPos < formattedPhone.length &&
                !/\d/.test(formattedPhone[targetPos])
              ) {
                targetPos++;
              }
              phoneInputRef.current.setSelectionRange(targetPos, targetPos);
            }
          }, 0);
        }
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const newValue = input.value;
    const previousValue = formData.phone;

    // Format the phone number
    const formattedPhone = formatPhoneNumber(newValue, previousValue);

    // Update form data
    setFormData({
      ...formData,
      phone: formattedPhone,
    });

    // Validate phone number if it looks complete
    const digits = newValue.replace(/\D/g, "");
    if (digits.length >= 10) {
      validatePhoneNumber(formattedPhone);
    } else {
      setPhoneError("");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);
    } else if (name === "email") {
      setFormData({
        ...formData,
        [name]: value,
      });

      // Validate email if it looks like a complete email
      if (value.includes("@") && value.includes(".")) {
        validateEmail(value);
      } else {
        setEmailError("");
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    // Validate email before submission
    if (formData.email) {
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(formData.email)) {
        setSubmitMessage(
          "Please enter a valid email address before submitting."
        );
        setIsSubmitting(false);
        return;
      }
    }

    // Validate phone number before submission
    if (formData.phone) {
      const isValid = isValidPhoneNumber(formData.phone, "CA");
      if (!isValid) {
        setSubmitMessage(
          "Please enter a valid Canadian phone number before submitting."
        );
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Check if EmailJS is configured
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        throw new Error(
          "EmailJS configuration is missing. Please check your environment variables."
        );
      }

      // Format vehicle info for email
      let vehicleInfo = "";
      if (
        formData.vehicleYear ||
        formData.vehicleMake ||
        formData.vehicleModel
      ) {
        vehicleInfo = [
          formData.vehicleYear,
          formData.vehicleMake,
          formData.vehicleModel,
        ]
          .filter(Boolean)
          .join(" ");
      }

      // Prepare template parameters for EmailJS
      const templateParams = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        phone_clean: formData.phone.replace(/\D/g, ""), // Clean phone number for WhatsApp
        service: formData.service || "General Inquiry",
        ignitionType: formData.ignitionType || "",
        vehicleInfo: vehicleInfo || "Not specified",
        vehicleYear: formData.vehicleYear || "",
        vehicleMake: formData.vehicleMake || "",
        vehicleModel: formData.vehicleModel || "",
        message: formData.message,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };

      // Send email using EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      // Track successful form submission
      trackContactFormSubmit(formData.service || "General Inquiry");

      setSubmitMessage("Thank you! We'll get back to you within 2 hours.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        ignitionType: "",
        vehicleYear: "",
        vehicleMake: "",
        vehicleModel: "",
        message: "",
      });
      setTermsAccepted(false);
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitMessage(
        "Sorry, there was an error sending your message. Please try calling us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    // Track WhatsApp click
    trackWhatsAppClick();

    const message = encodeURIComponent(
      `Hi ${businessData.name}! I'm interested in your key services. ${
        formData.message ? `Message: ${formData.message}` : ""
      }`
    );
    window.open(
      `https://wa.me/${businessData.contact.whatsapp}?text=${message}`,
      "_blank"
    );
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Get Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Free Quote
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Ready to get started? Send us your details and we'll provide a quick
            quote for your key needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact form */}
          <div className="bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 pr-12 bg-slate-700 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      emailError
                        ? "border-red-500 focus:ring-red-500"
                        : formData.email && !emailError && !isValidatingEmail
                        ? "border-green-500 focus:ring-green-500"
                        : "border-slate-600 focus:ring-blue-500 focus:border-transparent"
                    }`}
                    placeholder="your.email@example.com"
                  />

                  {/* Email validation indicator */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isValidatingEmail ? (
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : formData.email && !emailError ? (
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : emailError ? (
                      <svg
                        className="w-5 h-5 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : null}
                  </div>
                </div>

                {/* Email validation error */}
                {emailError && (
                  <p className="mt-2 text-sm text-red-400 flex items-start space-x-1">
                    <svg
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{emailError}</span>
                  </p>
                )}

                {/* Email validation success */}
                {!emailError &&
                  formData.email &&
                  formData.email.includes("@") && (
                    <p className="mt-2 text-xs text-slate-400">
                      ✓ Email format looks good!
                    </p>
                  )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Phone Number <span className="text-red-400">*</span>
                  <span className="text-slate-400 text-xs ml-2">
                    (Canadian format)
                  </span>
                </label>
                <div className="relative">
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onKeyDown={handlePhoneKeyDown}
                    required
                    maxLength={17} // Max length for formatted Canadian number
                    className={`w-full px-4 py-3 pr-12 bg-slate-700 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      phoneError
                        ? "border-red-500 focus:ring-red-500"
                        : formData.phone && !phoneError && !isValidatingPhone
                        ? "border-green-500 focus:ring-green-500"
                        : "border-slate-600 focus:ring-blue-500 focus:border-transparent"
                    }`}
                    placeholder="(416) 123-4567"
                  />

                  {/* Validation indicator */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isValidatingPhone ? (
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : formData.phone && !phoneError ? (
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : phoneError ? (
                      <svg
                        className="w-5 h-5 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : null}
                  </div>
                </div>

                {/* Phone validation error */}
                {phoneError && (
                  <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{phoneError}</span>
                  </p>
                )}

                {/* Phone formatting help */}
                {!phoneError && formData.phone && (
                  <p className="mt-2 text-xs text-slate-400">
                    ✓ Format looks good! Canadian phone number detected.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Service Needed <span className="text-red-400">*</span>
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  disabled={servicesLoading}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {servicesLoading
                      ? "Loading services..."
                      : "Select a service"}
                  </option>
                  {services.map((service) => (
                    <option key={service.id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle Information - NHTSA API Integration */}
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Vehicle Information
                  {/* <span className="text-red-400 text-sm">*</span> */}
                </h3>

                {/* Ignition Type */}
                <div className="mb-4">
                  <span className="block text-sm font-medium text-slate-300 mb-2">
                    Ignition Type <span className="text-red-400">*</span>
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        formData.ignitionType === "Key Start"
                          ? "border-blue-500 bg-slate-700/60"
                          : "border-slate-600 bg-slate-700 hover:border-slate-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name="ignitionType"
                        value="Key Start"
                        checked={formData.ignitionType === "Key Start"}
                        onChange={handleChange}
                        className="sr-only"
                        required
                      />
                      <IconKey className="w-5 h-5 text-blue-400" />
                      <span className="text-slate-200">Key Start</span>
                    </label>
                    <label
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        formData.ignitionType === "Push Button Start"
                          ? "border-blue-500 bg-slate-700/60"
                          : "border-slate-600 bg-slate-700 hover:border-slate-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name="ignitionType"
                        value="Push Button Start"
                        checked={formData.ignitionType === "Push Button Start"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <IconPower className="w-5 h-5 text-blue-400" />
                      <span className="text-slate-200">Push Button Start</span>
                    </label>
                  </div>
                  {!formData.ignitionType && (
                    <p className="mt-2 text-xs text-slate-400">
                      Please select your vehicle's ignition type
                    </p>
                  )}
                </div>

                <CarSelector
                  year={formData.vehicleYear}
                  make={formData.vehicleMake}
                  model={formData.vehicleModel}
                  onYearChange={(year) =>
                    setFormData((prev) => ({ ...prev, vehicleYear: year }))
                  }
                  onMakeChange={(make) =>
                    setFormData((prev) => ({ ...prev, vehicleMake: make }))
                  }
                  onModelChange={(model) =>
                    setFormData((prev) => ({ ...prev, vehicleModel: model }))
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  What do you need? <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Describe your needs if you need Urgent Service please Call Us at 438-797-7776"
                ></textarea>
              </div>

              {/* Terms and Warranty Acceptance */}
              <div className="border-t border-slate-700 pt-6">
                <label className="flex items-start cursor-pointer group">
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      required
                      className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-slate-800 cursor-pointer transition-all"
                    />
                  </div>
                  <span className="ml-3 text-sm text-slate-300 leading-relaxed">
                    I have read and agree to the{" "}
                    <a
                      href="/terms-of-service"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Terms of Service
                    </a>
                    {" "}and{" "}
                    <a
                      href="/warranty"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Warranty Policy
                    </a>
                    <span className="text-red-400 ml-1">*</span>
                  </span>
                </label>
                {!termsAccepted && (
                  <p className="mt-2 ml-8 text-xs text-slate-400">
                    You must accept the terms and warranty policy to submit your request
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Quote Request"
                )}
              </button>

              {/* Form completion helper */}
              {!isFormValid && !isSubmitting && (
                <p className="text-center text-sm text-slate-400 mt-2">
                  Please fill in all required fields to submit
                </p>
              )}

              {/* Success/Error Message */}
              {submitMessage && (
                <div
                  className={`mt-4 p-4 rounded-xl ${
                    submitMessage.includes("Thank you")
                      ? "bg-green-900/50 border border-green-700 text-green-300"
                      : "bg-red-900/50 border border-red-700 text-red-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {submitMessage.includes("Thank you") ? (
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <p className="text-sm font-medium">{submitMessage}</p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Contact info and WhatsApp */}
          <div className="space-y-8">
            {/* Quick contact */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 border border-slate-600">
              <h3 className="text-2xl font-bold text-white mb-6">
                Prefer to Talk?
              </h3>

              <button
                onClick={handleWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center space-x-3"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                <span>WhatsApp Us</span>
              </button>

              <div className="mt-6 space-y-4 text-slate-300">
                <a
                  href={`tel:${businessData.contact.phone}`}
                  className="flex items-center space-x-3 hover:text-blue-400 transition-colors duration-200 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{businessData.contact.phoneDisplay}</span>
                </a>
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{businessData.hours.weekdays}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{businessData.contact.address.city}</span>
                </div>
              </div>
            </div>

            {/* Service Area Map */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 border border-slate-600">
              <h3 className="text-2xl font-bold text-white mb-6">
                Service Area
              </h3>
              <p className="text-slate-300 mb-6">
                We serve Hamilton and the Greater Toronto Area
              </p>

              {/* Google Map - Lazy loaded to reduce HTTP requests */}
              <div
                ref={mapContainerRef}
                className="relative overflow-hidden rounded-2xl border border-slate-600"
              >
                {shouldLoadMap ? (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1472086.7806840392!2d-80.61776837742386!3d43.89375619295225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b2a1d7471156d%3A0x4ecad8e272e4c2a2!2sGreater%20Toronto%20Area%2C%20ON!5e0!3m2!1sen!2sca!4v1750819492723!5m2!1sen!2sca"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-[300px] rounded-xl"
                    title="KeyFoby Service Area - Hamilton and Greater Toronto Area"
                  />
                ) : (
                  <div className="w-full h-[300px] rounded-xl bg-slate-700 flex items-center justify-center">
                    <div className="text-center text-slate-300">
                      <svg
                        className="w-12 h-12 mx-auto mb-2 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <p className="text-sm">Map loading...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Service area details */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Hamilton</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Burlington</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Oakville</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Mississauga</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Brampton</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Toronto</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
