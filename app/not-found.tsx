"use client";

import Link from "next/link";
import { businessData } from "@/lib/business-data";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* 404 Number with gradient */}
            <div className="space-y-4">
              <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold leading-none">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  4
                </span>
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
                  0
                </span>
                <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  4
                </span>
              </h1>
            </div>

            {/* Key Icon Animation */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-cyan-400 p-6 rounded-2xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-16 h-16 sm:w-20 sm:h-20 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Page Not Found
              </h2>
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Oops! It looks like this page has gone missing, just like those
                lost keys. But don't worry - we're here to help you find your
                way back!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Link
                href="/"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold text-lg rounded-full hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/50 w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Go Home
                </span>
              </Link>

              <Link
                href="#contact"
                className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-full border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/25 w-full sm:w-auto"
              >
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Contact Us
                </span>
              </Link>

              <a
                href={businessData.contact.phoneHref}
                className="group px-8 py-4 bg-green-500/20 backdrop-blur-sm text-white font-semibold text-lg rounded-full border-2 border-green-400/30 hover:bg-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/25 w-full sm:w-auto"
              >
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Call {businessData.contact.phoneDisplay}
                </span>
              </a>
            </div>

            {/* Quick Links */}
            <div className="pt-8 border-t border-white/10">
              <p className="text-slate-400 mb-4">Or explore our services:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/#services"
                  className="px-4 py-2 bg-slate-800/50 text-slate-300 rounded-lg hover:bg-slate-700/50 hover:text-white transition-colors text-sm"
                >
                  Our Services
                </Link>
                <Link
                  href="/#features"
                  className="px-4 py-2 bg-slate-800/50 text-slate-300 rounded-lg hover:bg-slate-700/50 hover:text-white transition-colors text-sm"
                >
                  Why KeyFoby
                </Link>
                <Link
                  href="/#contact"
                  className="px-4 py-2 bg-slate-800/50 text-slate-300 rounded-lg hover:bg-slate-700/50 hover:text-white transition-colors text-sm"
                >
                  Get a Quote
                </Link>
              </div>
            </div>

            {/* Helpful Message */}
            <div className="pt-8 max-w-2xl mx-auto">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
                <p className="text-slate-300 text-sm leading-relaxed">
                  <span className="font-semibold text-blue-400">
                    Need help finding something?
                  </span>
                  <br />
                  If you believe this is an error, please{" "}
                  <Link
                    href="/#contact"
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    contact us
                  </Link>{" "}
                  and let us know. We'll help you get back on track!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

