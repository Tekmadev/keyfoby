import { Metadata } from "next";
import Link from "next/link";
import { businessData } from "@/lib/business-data";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | KeyFoby - Mobile App & Services",
  description:
    "Terms of Service for KeyFoby mobile application and services. Review the terms and conditions for using our business management platform.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfService() {
  const lastUpdated = "December 5, 2025";

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-cyan-500 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-block mb-4">
                <span className="text-6xl">📜</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Terms of Service
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                Please read these terms carefully before using KeyFoby
              </p>
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-white text-sm font-medium">
                  Last Updated: {lastUpdated}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Important Notice */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-6 rounded-r-lg mb-12">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Legal Notice
                </h3>
                <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
                  These Terms of Service should be reviewed by a qualified legal
                  professional before publication. It is provided as a template
                  and may need to be customized based on your specific business
                  practices and jurisdiction requirements.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mb-12 p-6 bg-blue-50 dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Quick Navigation
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Agreement to Terms",
                "User Accounts",
                "Acceptable Use",
                "Service Availability",
                "User Content and Data",
                "Service Warranty",
                "Intellectual Property",
                "Limitation of Liability",
                "Indemnification",
                "Termination",
                "Changes to Terms",
                "Governing Law",
                "Contact Information",
              ].map((section) => (
                <a
                  key={section}
                  href={`#${section.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium hover:underline"
                >
                  → {section}
                </a>
              ))}
            </div>
          </div>

          {/* Agreement to Terms */}
          <section id="agreement-to-terms" className="mb-12 scroll-mt-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">🤝</span>
              1. Agreement to Terms
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                By accessing or using the <strong>KeyFoby</strong> mobile
                application (the "App"), you agree to be bound by these Terms of
                Service ("Terms"). If you do not agree to these Terms, please do
                not use the App.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  By using KeyFoby, you acknowledge that:
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  {[
                    "You have read and understood these Terms",
                    "You agree to comply with all applicable laws and regulations",
                    "You are at least 13 years old or have parental/guardian consent",
                    "You have the authority to enter into this agreement",
                    "The information you provide is accurate and truthful",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section
            id="user-accounts"
            className="mb-12 scroll-mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">👤</span>
              2. User Accounts
            </h2>

            <div className="space-y-6">
              {/* Account Creation */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  2.1 Account Creation
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  To use the App, you must create an account by providing:
                </p>
                <ul className="space-y-2 ml-6 text-slate-700 dark:text-slate-300">
                  {[
                    "A valid email address",
                    "A secure password (or use Google OAuth authentication)",
                    "A phone number (10-digit Canadian/US format)",
                    "Any other required registration information",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Account Security */}
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center">
                  <span className="text-2xl mr-2">🔐</span>
                  2.2 Account Security - Your Responsibilities
                </h3>
                <ul className="space-y-2 text-red-800 dark:text-red-200">
                  {[
                    "You are responsible for maintaining the confidentiality of your account credentials",
                    "You must NOT share your password or account access with others",
                    "You must notify us immediately of any unauthorized access to your account",
                    "You are responsible for all activities that occur under your account",
                    "We are NOT liable for any loss or damage from unauthorized use of your account",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-600 dark:text-red-400 mr-2">
                        ⚠️
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Account Information */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  2.3 Accurate Information
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  You agree to provide accurate, current, and complete
                  information during registration and to update such information
                  to keep it accurate and current. Providing false information
                  may result in account suspension or termination.
                </p>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section id="acceptable-use" className="mb-12 scroll-mt-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">✅</span>
              3. Acceptable Use Policy
            </h2>

            <div className="space-y-6">
              {/* Permitted Use */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✓</span>
                  Permitted Use
                </h3>
                <p className="text-green-800 dark:text-green-200 mb-3">
                  You may use the App for:
                </p>
                <ul className="space-y-2 text-green-800 dark:text-green-200">
                  {[
                    "Managing your locksmith business operations",
                    "Tracking sales, expenses, and inventory",
                    "Generating business reports and analytics",
                    "Storing customer and transaction information",
                    "Any other lawful business management purposes",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 dark:text-green-400 mr-2">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prohibited Use */}
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🚫</span>
                  Prohibited Use
                </h3>
                <p className="text-red-800 dark:text-red-200 mb-3">
                  You must NOT use the App to:
                </p>
                <ul className="space-y-2 text-red-800 dark:text-red-200">
                  {[
                    "Engage in any illegal activities or violate any laws",
                    "Infringe on intellectual property rights of others",
                    "Transmit viruses, malware, or harmful code",
                    "Attempt to gain unauthorized access to the App or user data",
                    "Reverse engineer, decompile, or disassemble the App",
                    "Use the App for fraudulent or deceptive purposes",
                    "Harass, abuse, or harm other users",
                    "Scrape, harvest, or collect user data without permission",
                    "Interfere with or disrupt the App's operation",
                    "Use automated systems (bots) without authorization",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-600 dark:text-red-400 mr-2">
                        ✕
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/40 rounded-lg">
                  <p className="text-sm text-red-900 dark:text-red-100 font-semibold">
                    ⚠️ Violation of these terms may result in immediate account
                    suspension or termination.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Service Availability */}
          <section
            id="service-availability"
            className="mb-12 scroll-mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">⚡</span>
              4. Service Availability and Modifications
            </h2>

            <div className="space-y-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-4">
                  "As Is" Service
                </h3>
                <ul className="space-y-3 text-amber-800 dark:text-amber-200">
                  {[
                    "The App is provided 'AS IS' and 'AS AVAILABLE' without warranties of any kind",
                    "We do NOT guarantee uninterrupted, timely, secure, or error-free service",
                    "We reserve the right to modify, suspend, or discontinue features at any time",
                    "We are NOT responsible for service interruptions due to maintenance, updates, or technical issues",
                    "We may change or update features, user interface, or functionality without notice",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-amber-600 dark:text-amber-400 mr-2">
                        ⚠️
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  4.1 Planned Maintenance
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  We may perform scheduled maintenance that temporarily
                  interrupts service. We will attempt to notify users in advance
                  of planned downtime when possible.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  4.2 Third-Party Dependencies
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  The App relies on third-party services (Supabase, Google
                  OAuth). We are not responsible for outages or issues caused by
                  these third-party providers.
                </p>
              </div>
            </div>
          </section>

          {/* User Content and Data */}
          <section id="user-content-and-data" className="mb-12 scroll-mt-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">💾</span>
              5. User Content and Data
            </h2>

            <div className="space-y-6">
              {/* Data Ownership */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <span className="text-2xl mr-2">👑</span>
                  5.1 Your Data Ownership
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  <strong>You retain ownership</strong> of all business data,
                  transactions, inventory records, and other content you create
                  or upload to the App.
                </p>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  {[
                    "Your business data belongs to you",
                    "We do not claim ownership of your content",
                    "You can export your data at any time",
                    "Upon account deletion, your data will be permanently removed",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* License to Use */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  5.2 License to KeyFoby
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  By using the App, you grant KeyFoby a limited, non-exclusive,
                  royalty-free license to:
                </p>
                <ul className="space-y-2 ml-6 text-slate-700 dark:text-slate-300">
                  {[
                    "Store and process your data to provide the service",
                    "Display your data back to you through the App interface",
                    "Create backups of your data for security and recovery purposes",
                    "Analyze anonymized usage data to improve the App",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-slate-700 dark:text-slate-300 mt-4 text-sm italic">
                  This license terminates when you delete your account or remove
                  content from the App.
                </p>
              </div>

              {/* Data Responsibility */}
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">
                  5.3 Your Data Responsibilities
                </h3>
                <ul className="space-y-2 text-red-800 dark:text-red-200">
                  {[
                    "You are responsible for the accuracy of your business data",
                    "You are responsible for backing up your own data",
                    "We are NOT liable for data loss due to user error or system failures",
                    "You should regularly export your data for safekeeping",
                    "We recommend maintaining offline backups of critical business information",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-600 dark:text-red-400 mr-2">
                        ⚠️
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section
            id="intellectual-property"
            className="mb-12 scroll-mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">©️</span>
              6. Intellectual Property Rights
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  6.1 Our Intellectual Property
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  The KeyFoby App, including its:
                </p>
                <ul className="grid md:grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
                  {[
                    "Source code and software",
                    "Design and user interface",
                    "Graphics, logos, and branding",
                    "Text, content, and documentation",
                    "Features and functionality",
                    "Trademarks and service marks",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <span className="text-blue-500 mr-2">©</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-slate-700 dark:text-slate-300 mt-4">
                  ...are owned by <strong>KeyFoby</strong> and protected by
                  copyright, trademark, and other intellectual property laws.
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-3">
                  6.2 Restrictions
                </h3>
                <p className="text-amber-800 dark:text-amber-200 mb-3">
                  You may NOT:
                </p>
                <ul className="space-y-2 text-amber-800 dark:text-amber-200">
                  {[
                    "Copy, modify, or distribute the App or its content",
                    "Reverse engineer or decompile the App",
                    "Remove copyright or proprietary notices",
                    "Use KeyFoby's trademarks or branding without permission",
                    "Create derivative works based on the App",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-amber-600 dark:text-amber-400 mr-2">
                        ✕
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Service Warranty */}
          <section
            id="service-warranty"
            className="mb-12 scroll-mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">🛡️</span>
              7. Service Warranty & Disclaimers
            </h2>

            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <span className="text-2xl mr-2">✅</span>
                  Warranty Overview
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                  KeyFoby provides a{" "}
                  <strong className="text-blue-600 dark:text-blue-400">
                    3-month warranty
                  </strong>{" "}
                  on all key fob services. This warranty covers problems that
                  happen because of our work.
                </p>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  {[
                    "3 months of warranty coverage",
                    "Covers: Key fob not working, car won't start, or lock/unlock not working",
                    "YOU MUST test everything before our technician leaves",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 border-2 border-slate-300 dark:border-slate-600">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <span className="text-2xl mr-2">⚖️</span>
                  What Happens After We Leave
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  KeyFoby works on key fobs. After our technician leaves,
                  KeyFoby is{" "}
                  <strong>
                    only responsible for problems with the key fob not working
                  </strong>
                  , including if the fob won't start your car or the lock/unlock
                  buttons don't work. KeyFoby is{" "}
                  <strong>
                    NOT responsible for any other problems, damage, car issues,
                    problems that already existed, or anything else
                  </strong>{" "}
                  that happens after our technician leaves. By using our
                  service, you agree to these terms.
                </p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <span className="text-2xl mr-2">❌</span>
                  Warranty Exclusions
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  The following are <strong>NOT covered</strong> under warranty:
                </p>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  {[
                    "Water damage (if it gets wet)",
                    "Drops, cracks, or physical damage",
                    "If you take it apart or someone else fixes it",
                    "Car problems, electrical issues, or problems that were already there",
                    "Any other problems or damage after we leave",
                    "Anything you didn't test before we left",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <span className="text-2xl mr-2">🔧</span>
                  We Only Work On Key Fobs
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-3">
                  <strong>KeyFoby does NOT fix cars.</strong> We only work on
                  key fobs only. We do NOT work on cars. We are not responsible
                  for:
                </p>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Problems with your car's ignition (where the key goes)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Car door lock problems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Car electrical, engine, or transmission problems
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Any car problems (we only fix key fobs)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Complete Warranty Details
                    </h3>
                    <p className="text-blue-100 text-sm">
                      For full warranty terms, coverage details, claim
                      procedures, and important disclaimers, please review our
                      comprehensive warranty policy.
                    </p>
                  </div>
                  <Link
                    href="/warranty"
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all duration-300 hover:scale-105 whitespace-nowrap ml-4"
                  >
                    View Full Warranty →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section id="limitation-of-liability" className="mb-12 scroll-mt-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">⚖️</span>
              8. Limitation of Liability
            </h2>

            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-xl p-8">
              <div className="flex items-start mb-6">
                <span className="text-4xl mr-4">⚠️</span>
                <div>
                  <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-2">
                    IMPORTANT LEGAL LIMITATION
                  </h3>
                  <p className="text-red-800 dark:text-red-200">
                    Please read this section carefully as it limits our
                    liability.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-red-800 dark:text-red-200">
                <div>
                  <h4 className="font-semibold mb-2">7.1 No Liability For:</h4>
                  <p className="mb-3">
                    To the maximum extent permitted by law, KeyFoby shall NOT be
                    liable for:
                  </p>
                  <ul className="space-y-2 ml-6">
                    {[
                      "Indirect, incidental, special, consequential, or punitive damages",
                      "Loss of profits, revenue, data, or business opportunities",
                      "Business interruption or loss of goodwill",
                      "Errors or inaccuracies in the App or data",
                      "Unauthorized access to or use of your account",
                      "Third-party service failures or outages",
                      "Business decisions made based on App data or reports",
                      "Data loss due to user error, device failure, or system issues",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-600 dark:text-red-400 mr-2">
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-100 dark:bg-red-900/40 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">
                    7.2 Maximum Liability Cap:
                  </h4>
                  <p>
                    Our total liability for any claim arising from your use of
                    the App is limited to the amount you paid for the service in
                    the 12 months preceding the claim (if applicable), or $100,
                    whichever is greater.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">7.3 No Warranties:</h4>
                  <p className="mb-2">
                    The App is provided WITHOUT WARRANTIES of any kind,
                    including but not limited to:
                  </p>
                  <ul className="space-y-1 ml-6">
                    {[
                      "Warranties of merchantability or fitness for a particular purpose",
                      "Warranties that the App will be error-free or uninterrupted",
                      "Warranties regarding security or data protection",
                      "Warranties regarding accuracy or completeness of data",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="text-red-600 dark:text-red-400 mr-2">
                          -
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Indemnification */}
          <section
            id="indemnification"
            className="mb-12 scroll-mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">🛡️</span>
              9. Indemnification
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                You agree to indemnify, defend, and hold harmless KeyFoby, its
                affiliates, officers, directors, employees, and agents from and
                against any and all claims, damages, losses, liabilities, costs,
                and expenses (including reasonable attorney's fees) arising
                from:
              </p>
              <ul className="space-y-2 ml-6 text-slate-700 dark:text-slate-300">
                {[
                  "Your use or misuse of the App",
                  "Your violation of these Terms of Service",
                  "Your violation of any laws or regulations",
                  "Your violation of any third-party rights",
                  "Your business data or content uploaded to the App",
                  "Your business operations or decisions made using the App",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section id="termination" className="mb-12 scroll-mt-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">🚪</span>
              10. Account Termination
            </h2>

            <div className="space-y-6">
              {/* User Termination */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  9.1 Termination by You
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-3">
                  You may terminate your account at any time through:
                </p>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  {[
                    "The account settings screen in the App",
                    "Contacting our support team via email",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-900 dark:text-amber-100">
                    <strong>⚠️ Important:</strong> Before deleting your account,
                    please export your data. Once deleted, your data cannot be
                    recovered.
                  </p>
                </div>
              </div>

              {/* KeyFoby Termination */}
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">
                  9.2 Termination by KeyFoby
                </h3>
                <p className="text-red-800 dark:text-red-200 mb-3">
                  We reserve the right to suspend or terminate your account
                  immediately if:
                </p>
                <ul className="space-y-2 text-red-800 dark:text-red-200">
                  {[
                    "You violate these Terms of Service",
                    "You engage in fraudulent or illegal activities",
                    "Your account poses a security risk",
                    "We receive a legal request or court order",
                    "You fail to pay any applicable fees (if applicable)",
                    "Your account has been inactive for an extended period",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-600 dark:text-red-400 mr-2">
                        ✕
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Effect of Termination */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  9.3 Effect of Termination
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  Upon termination of your account:
                </p>
                <ul className="space-y-2 ml-6 text-slate-700 dark:text-slate-300">
                  {[
                    "Your access to the App will be immediately revoked",
                    "Your account data will be deleted according to our Privacy Policy",
                    "Some data may be retained in backups for up to 30 days",
                    "You remain liable for any obligations incurred before termination",
                    "Provisions regarding liability, indemnification, and intellectual property survive termination",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Changes to Terms */}
          <section
            id="changes-to-terms"
            className="mb-12 scroll-mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">🔄</span>
              11. Changes to Terms of Service
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                We reserve the right to modify or update these Terms at any time
                to reflect changes in our practices, legal requirements, or
                service offerings.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  When Terms Change:
                </h3>
                <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                  {[
                    "We will notify you of material changes via email or in-app notification",
                    "The 'Last Updated' date at the top will reflect the revision date",
                    "Continued use of the App after changes constitutes acceptance of the new Terms",
                    "If you do not agree to the updated Terms, you must stop using the App and delete your account",
                    "We encourage you to review these Terms periodically",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">
                        {index + 1}.
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section id="governing-law" className="mb-12 scroll-mt-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">⚖️</span>
              12. Governing Law and Dispute Resolution
            </h2>

            <div className="space-y-6">
              {/* Governing Law */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  11.1 Governing Law
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  These Terms are governed by and construed in accordance with
                  the laws of the <strong>Province of Ontario, Canada</strong>,
                  without regard to its conflict of law principles.
                </p>
              </div>

              {/* Jurisdiction */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  11.2 Jurisdiction
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  You agree that any legal action or proceeding arising from
                  these Terms shall be brought exclusively in the courts located
                  in Hamilton, Ontario, Canada, and you consent to the
                  jurisdiction of such courts.
                </p>
              </div>

              {/* Dispute Resolution */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  11.3 Dispute Resolution Process
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  In the event of a dispute, we encourage the following process:
                </p>
                <ol className="space-y-3 text-slate-700 dark:text-slate-300">
                  {[
                    {
                      step: "Informal Resolution",
                      desc: "Contact us to attempt to resolve the dispute informally through good faith negotiation",
                    },
                    {
                      step: "Mediation",
                      desc: "If informal resolution fails, parties may agree to mediation",
                    },
                    {
                      step: "Arbitration or Litigation",
                      desc: "If mediation fails, disputes may be resolved through binding arbitration or litigation in accordance with the governing law",
                    },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold mr-3 mt-1">
                        {index + 1}.
                      </span>
                      <div>
                        <strong>{item.step}:</strong> {item.desc}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* Miscellaneous */}
          <section
            id="miscellaneous"
            className="mb-12 scroll-mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">📋</span>
              13. Miscellaneous Provisions
            </h2>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Entire Agreement",
                    desc: "These Terms constitute the entire agreement between you and KeyFoby regarding your use of the App.",
                  },
                  {
                    title: "Severability",
                    desc: "If any provision is found invalid or unenforceable, the remaining provisions remain in full effect.",
                  },
                  {
                    title: "No Waiver",
                    desc: "Our failure to enforce any provision does not constitute a waiver of that provision or our right to enforce it later.",
                  },
                  {
                    title: "Assignment",
                    desc: "You may not transfer or assign these Terms. We may assign our rights and obligations without restriction.",
                  },
                  {
                    title: "Force Majeure",
                    desc: "We are not liable for delays or failures due to circumstances beyond our reasonable control.",
                  },
                  {
                    title: "Relationship",
                    desc: "Nothing in these Terms creates a partnership, joint venture, employment, or agency relationship.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-700"
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section
            id="contact-information"
            className="mb-12 scroll-mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl p-8 border-2 border-blue-200 dark:border-blue-800"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">📞</span>
              14. Contact Information
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              If you have any questions about these Terms of Service, please
              contact us:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">📧</span>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Email Support
                  </h3>
                </div>
                <a
                  href={`mailto:${businessData.contact.email}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-lg font-medium"
                >
                  {businessData.contact.email}
                </a>
              </div>

              {/* Phone */}
              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">📱</span>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Phone
                  </h3>
                </div>
                <a
                  href={`tel:${businessData.contact.phone}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-lg font-medium"
                >
                  {businessData.contact.phoneDisplay}
                </a>
              </div>

              {/* Business Address */}
              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">📍</span>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Business Address
                  </h3>
                </div>
                <address className="not-italic text-slate-700 dark:text-slate-300">
                  {businessData.contact.address.street}
                  <br />
                  {businessData.contact.address.city},{" "}
                  {businessData.contact.address.state}{" "}
                  {businessData.contact.address.zip}
                  <br />
                  Canada
                </address>
              </div>

              {/* Website */}
              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">🌐</span>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Website
                  </h3>
                </div>
                <a
                  href="https://www.keyfoby.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-lg font-medium"
                >
                  www.keyfoby.com
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-6 bg-blue-100 dark:bg-blue-900/40 rounded-lg p-5 border border-blue-300 dark:border-blue-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                <span className="text-2xl mr-2">⏰</span>
                Support Hours
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-700 dark:text-slate-300">
                <div>
                  <strong>Monday - Friday:</strong>
                  <br />
                  8:00 AM - 6:00 PM EST
                </div>
                <div>
                  <strong>Saturday:</strong>
                  <br />
                  9:00 AM - 4:00 PM EST
                </div>
                <div>
                  <strong>Sunday:</strong>
                  <br />
                  Closed
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">
                Emergency support may be available for critical issues.
              </p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="mb-12 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8 border-2 border-green-200 dark:border-green-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <span className="text-green-500 mr-3">✅</span>
              Acknowledgment
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                <strong>BY USING THE KEYFOBY APP, YOU ACKNOWLEDGE THAT:</strong>
              </p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                {[
                  "You have read and understood these Terms of Service",
                  "You agree to be bound by these Terms",
                  "You meet all eligibility requirements to use the App",
                  "You understand the limitations of liability and warranties",
                  "You agree to the governing law and dispute resolution provisions",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2 mt-1">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Legal Disclaimer */}
          <section className="mb-12 bg-slate-100 dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <span className="text-blue-500 mr-3">⚖️</span>
              Legal Disclaimer
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                <strong>IMPORTANT:</strong> These Terms of Service are provided
                as a comprehensive template for the KeyFoby mobile application.
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <p className="text-amber-900 dark:text-amber-100 text-sm">
                  <strong>⚠️ Legal Review Required:</strong> We strongly
                  recommend consulting with a qualified legal professional to
                  review and customize these Terms to ensure they meet all
                  applicable legal requirements for your jurisdiction and
                  specific business practices. Laws vary by region, and this
                  template may need modification to ensure full compliance.
                </p>
              </div>
            </div>
          </section>

          {/* Navigation to Privacy Policy */}
          <div className="text-center py-8">
            <Link
              href="/privacy-policy"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
            >
              <span className="mr-2">🔒</span>
              View Privacy Policy
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* Bottom Notice */}
          <div className="text-center text-sm text-slate-500 dark:text-slate-400 pt-8 border-t border-slate-200 dark:border-slate-700">
            <p>
              © 2025 KeyFoby. All rights reserved. | Effective Date:{" "}
              {lastUpdated}
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
