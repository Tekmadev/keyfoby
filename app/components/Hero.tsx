"use client";

import { businessData } from "@/lib/business-data";
import { IconCheck } from "@tabler/icons-react";

export default function Hero() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url(/images/herobannerKF.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Gradient overlay for enhanced visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-900/60 z-20"></div>

      {/* Hero Content */}
      <div className="relative z-30 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <div className="space-y-6 sm:space-y-8">
          {/* Main Headline - SEO Optimized */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
              <span className="block">Lost Keys?</span>
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Need a Spare?
              </span>
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2 sm:mt-4">
                We've Got You..
              </span>
            </h1>

            {/* SEO-friendly subtitle
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-200 font-medium max-w-4xl mx-auto leading-relaxed">
              {businessData.tagline}
            </p> */}
          </div>

          {/* Enhanced Description - SEO Content */}
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl">
              Professional automotive key replacement, key fob programming, and
              emergency lockout services in Hamilton and surrounding areas.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-slate-200">
              <span className="flex items-center gap-1">
                <IconCheck className="w-4 h-4 text-green-400" />
                Licensed & Insured
              </span>
              <span className="flex items-center gap-1">
                <IconCheck className="w-4 h-4 text-green-400" />
                Same-Day Service
              </span>
              <span className="flex items-center gap-1">
                <IconCheck className="w-4 h-4 text-green-400" />
                Emergency Car Lockout
              </span>
              <span className="flex items-center gap-1">
                <IconCheck className="w-4 h-4 text-green-400" />
                Automotive Key Programming
              </span>
              <span className="flex items-center gap-1">
                <IconCheck className="w-4 h-4 text-green-400" />
                24/7 Mobile Service
              </span>
            </div>
          </div>

          {/* Call-to-Action Buttons - Mobile optimized */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-6 sm:pt-8 px-4">
            <button
              onClick={scrollToContact}
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold text-base sm:text-lg rounded-full hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              <span className="relative z-10 flex items-center justify-center">
                Get Free Quote
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-y-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </span>
            </button>

            <a
              href={`tel:${businessData.contact.phone}`}
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-base sm:text-lg rounded-full border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/25"
            >
              <span className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
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
                Call Now
              </span>
            </a>
          </div>

          {/* Trust Indicators - Mobile optimized */}
          <div className="pt-8 sm:pt-12 border-t border-white/20 mx-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-slate-300">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-sm sm:text-base">
                  Licensed & Insured
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium text-sm sm:text-base">
                  5-Star Service
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0"
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
                <span className="font-medium text-sm sm:text-base">
                  24/7 Emergency Service
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - Hidden on small screens */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30 hidden sm:block">
        <div className="animate-bounce">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-white/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
