import { Metadata } from "next";
import Link from "next/link";
import { businessData } from "@/lib/business-data";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | KeyFoby Automotive Locksmith Hamilton",
  description:
    "KeyFoby privacy policy: how we collect, use, and protect your personal information for our automotive locksmith and key fob services in Hamilton, Ontario.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.keyfoby.com/privacy-policy/",
  },
};

export default function PrivacyPolicy() {
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
                <span className="text-6xl">🔒</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                Your privacy matters to us
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
                  This Privacy Policy should be reviewed by a qualified legal
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
                "Introduction",
                "Information We Collect",
                "How We Use Your Information",
                "Data Storage and Security",
                "Third-Party Services",
                "Your Rights",
                "Children's Privacy",
                "Changes to This Policy",
                "Contact Us",
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

          {/* Introduction */}
          <section id="introduction" className="mb-12 scroll-mt-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">📋</span>
              1. Introduction
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Welcome to <strong>KeyFoby</strong>. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you use our mobile application (the "App") and
                related services.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                <strong>KeyFoby</strong> is a professional mobile business
                management application designed specifically for locksmith
                businesses. The App helps you track sales, expenses, inventory,
                and business analytics.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                By using our App, you agree to the collection and use of
                information in accordance with this Privacy Policy. If you do
                not agree with this policy, please do not use our services.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section
            id="information-we-collect"
            className="mb-12 scroll-mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">📊</span>
              2. Information We Collect
            </h2>

            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  2.1 Personal Information
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  When you create an account, we collect the following personal
                  information:
                </p>
                <ul className="space-y-2 ml-6">
                  {[
                    {
                      title: "Email Address",
                      desc: "Required for account creation and authentication",
                    },
                    {
                      title: "Phone Number",
                      desc: "Required during sign-up (10-digit Canadian/US format)",
                    },
                    {
                      title: "Full Name",
                      desc: "Collected from your Google account if you sign in with Google OAuth (optional)",
                    },
                    {
                      title: "User ID",
                      desc: "Unique identifier automatically generated for data isolation and security",
                    },
                    {
                      title: "Account Creation Date",
                      desc: "Automatically recorded timestamp",
                    },
                    {
                      title: "Last Sign-In Date",
                      desc: "Automatically recorded for security purposes",
                    },
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start text-slate-700 dark:text-slate-300"
                    >
                      <span className="text-blue-500 mr-2">✓</span>
                      <div>
                        <strong>{item.title}:</strong> {item.desc}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Business Data */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  2.2 Business Data
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  To provide our business management services, we collect and
                  store:
                </p>

                <div className="space-y-6">
                  {/* Transactions */}
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                      <span className="text-green-500 mr-2">💰</span>
                      Transaction Data
                    </h4>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                      {[
                        "Sales and expense records",
                        "Transaction dates and times",
                        "Customer names",
                        "Vehicle information (make, model, year)",
                        "Service types and descriptions",
                        "Sale and expense amounts",
                        "Payment methods",
                        "Transaction notes",
                        "Automatic profit calculations",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Inventory */}
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                      <span className="text-purple-500 mr-2">📦</span>
                      Inventory Data
                    </h4>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                      {[
                        "Product SKU and names",
                        "Product descriptions",
                        "Categories",
                        "Quantity and stock levels",
                        "Cost per unit",
                        "Reorder points",
                        "Vendor information",
                        "Storage locations",
                        "Product notes",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Business Profile */}
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                      <span className="text-cyan-500 mr-2">🏢</span>
                      Business Profile Information
                    </h4>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                      {[
                        "Business name",
                        "Business email and phone",
                        "Business address",
                        "Service areas (cities)",
                        "Default city",
                        "Business license number",
                        "Website URL",
                        "Service categories",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Automatically Collected Information */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  2.3 Automatically Collected Information
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  When you use our App, we automatically collect:
                </p>
                <ul className="space-y-2 ml-6">
                  {[
                    "Device information (device type, operating system version)",
                    "Session data (authentication tokens)",
                    "Usage data (app features used, interaction patterns)",
                    "IP address (through our backend provider)",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start text-slate-700 dark:text-slate-300"
                    >
                      <span className="text-blue-500 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section
            id="how-we-use-your-information"
            className="mb-12 scroll-mt-8"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">🎯</span>
              3. How We Use Your Information
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                We use the collected information for the following purposes:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    icon: "✅",
                    title: "Service Provision",
                    desc: "To provide and maintain the App's core business management functionality",
                  },
                  {
                    icon: "🔐",
                    title: "Authentication",
                    desc: "To verify your identity and secure your account access",
                  },
                  {
                    icon: "🛡️",
                    title: "Security",
                    desc: "To ensure data security, isolation, and prevent unauthorized access",
                  },
                  {
                    icon: "📈",
                    title: "Analytics",
                    desc: "To generate business charts, statistics, and insights for your business",
                  },
                  {
                    icon: "💬",
                    title: "Communication",
                    desc: "To respond to support requests and send important service updates",
                  },
                  {
                    icon: "🔧",
                    title: "Improvements",
                    desc: "To analyze usage patterns and enhance App features",
                  },
                  {
                    icon: "📦",
                    title: "Inventory Management",
                    desc: "To track stock levels, costs, and vendor information",
                  },
                  {
                    icon: "💼",
                    title: "Transaction Management",
                    desc: "To record sales, expenses, and calculate business profits",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-lg p-6 border border-blue-100 dark:border-slate-600"
                  >
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Data Storage and Security */}
          <section
            id="data-storage-and-security"
            className="mb-12 scroll-mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">🔐</span>
              4. Data Storage and Security
            </h2>

            <div className="space-y-6">
              {/* Storage */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  4.1 Where We Store Your Data
                </h3>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                  <ul className="space-y-3">
                    {[
                      "All data is stored in Supabase's secure PostgreSQL database",
                      "Data is encrypted in transit using HTTPS/TLS encryption",
                      "Data is encrypted at rest by our infrastructure provider",
                      "Data centers comply with industry-standard security certifications",
                      "Data may be stored in multiple regions for redundancy and reliability",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start text-slate-700 dark:text-slate-300"
                      >
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Security Measures */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  4.2 Security Measures
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: "🔒",
                      title: "Row Level Security",
                      desc: "Only you can access your data - isolated by User ID",
                    },
                    {
                      icon: "🔑",
                      title: "Secure Authentication",
                      desc: "Tokens are securely stored on your device",
                    },
                    {
                      icon: "🛡️",
                      title: "Password Protection",
                      desc: "Passwords are hashed and never stored in plain text",
                    },
                    {
                      icon: "🌐",
                      title: "HTTPS Encryption",
                      desc: "All API communications use secure HTTPS",
                    },
                    {
                      icon: "🔐",
                      title: "OAuth Security",
                      desc: "Google passwords are never stored",
                    },
                    {
                      icon: "📱",
                      title: "Device Security",
                      desc: "Authentication credentials secured on device",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Retention */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  4.3 Data Retention
                </h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>
                        User data is retained for as long as your account
                        remains active
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>
                        You can request account deletion at any time through the
                        App settings
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>
                        Upon deletion, all associated data will be permanently
                        removed
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>
                        Some data may be retained in backups for up to 30 days
                        before permanent deletion
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Third-Party Services */}
          <section id="third-party-services" className="mb-12 scroll-mt-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">🔗</span>
              5. Third-Party Services
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              We use the following trusted third-party services to provide our
              App:
            </p>

            <div className="space-y-6">
              {/* Supabase */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-start">
                  <div className="text-4xl mr-4">🗄️</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      Supabase (Backend-as-a-Service)
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        <strong>Purpose:</strong> Database storage,
                        authentication, data hosting
                      </li>
                      <li>
                        <strong>Security:</strong> Row Level Security (RLS)
                        ensures your data is isolated
                      </li>
                      <li>
                        <strong>Privacy:</strong> Subject to{" "}
                        <a
                          href="https://supabase.com/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Supabase's Privacy Policy
                        </a>
                      </li>
                      <li>
                        <strong>Website:</strong>{" "}
                        <a
                          href="https://supabase.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          https://supabase.com
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Google OAuth */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                <div className="flex items-start">
                  <div className="text-4xl mr-4">🔐</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      Google OAuth (Authentication)
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        <strong>Purpose:</strong> User authentication via Google
                        account
                      </li>
                      <li>
                        <strong>Data Shared:</strong> Email address and name
                        (only if you choose Google sign-in)
                      </li>
                      <li>
                        <strong>Privacy:</strong> Subject to{" "}
                        <a
                          href="https://policies.google.com/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Google's Privacy Policy
                        </a>
                      </li>
                      <li>
                        <strong>Note:</strong> Your Google password is never
                        stored in our system
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Google Calendar (Future) */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start">
                  <div className="text-4xl mr-4">📅</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      Google Calendar API (Planned Feature)
                    </h3>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      <li>
                        <strong>Purpose:</strong> Booking system and calendar
                        synchronization (future feature)
                      </li>
                      <li>
                        <strong>Data Shared:</strong> Calendar events and
                        availability information
                      </li>
                      <li>
                        <strong>Privacy:</strong> Subject to{" "}
                        <a
                          href="https://policies.google.com/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Google's Privacy Policy
                        </a>
                      </li>
                      <li>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Coming Soon
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Sharing Statement */}
            <div className="mt-8 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center">
                <span className="text-2xl mr-2">✅</span>
                Our Data Sharing Commitment
              </h4>
              <ul className="space-y-2 text-green-800 dark:text-green-200">
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">
                    ✓
                  </span>
                  <span>
                    We <strong>DO NOT</strong> sell your data to third parties
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">
                    ✓
                  </span>
                  <span>
                    We <strong>DO NOT</strong> share your data with advertisers
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">
                    ✓
                  </span>
                  <span>
                    Data is only shared with service providers as necessary to
                    operate the App
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">
                    ✓
                  </span>
                  <span>
                    Your data is isolated using Row Level Security - only you
                    can access it
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section
            id="your-rights"
            className="mb-12 scroll-mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">⚖️</span>
              6. Your Privacy Rights
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              You have the following rights regarding your personal data:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: "👁️",
                  title: "Right to Access",
                  desc: "Request access to your personal data and receive a copy of the information we hold",
                },
                {
                  icon: "✏️",
                  title: "Right to Correction",
                  desc: "Request correction of any inaccurate or incomplete personal data",
                },
                {
                  icon: "🗑️",
                  title: "Right to Deletion",
                  desc: "Request deletion of your account and all associated personal data",
                },
                {
                  icon: "📤",
                  title: "Right to Portability",
                  desc: "Request a copy of your data in a portable format (CSV/JSON)",
                },
                {
                  icon: "🚫",
                  title: "Right to Object",
                  desc: "Object to the processing of your personal data under certain circumstances",
                },
                {
                  icon: "✋",
                  title: "Right to Withdraw Consent",
                  desc: "Withdraw your consent for data processing at any time",
                },
              ].map((right, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
                >
                  <div className="text-3xl mb-3">{right.icon}</div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {right.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {right.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* How to Exercise Rights */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <span className="text-2xl mr-2">📨</span>
                How to Exercise Your Rights
              </h3>
              <div className="space-y-3 text-slate-700 dark:text-slate-300">
                <p className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">1.</span>
                  <span>
                    <strong>Email us:</strong> Contact{" "}
                    <a
                      href={`mailto:${businessData.contact.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {businessData.contact.email}
                    </a>{" "}
                    with your request
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">2.</span>
                  <span>
                    <strong>In-App Request:</strong> Use the settings screen in
                    the KeyFoby App
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">3.</span>
                  <span>
                    <strong>Response Time:</strong> All requests will be
                    processed within 30 days
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* Children's Privacy */}
          <section id="children's-privacy" className="mb-12 scroll-mt-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">👶</span>
              7. Children's Privacy
            </h2>
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-lg">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-red-900 dark:text-red-100 mb-3">
                  <strong>Age Restriction:</strong> The KeyFoby App is NOT
                  intended for children under the age of 13.
                </p>
                <ul className="space-y-2 text-red-800 dark:text-red-200">
                  <li className="flex items-start">
                    <span className="text-red-600 dark:text-red-400 mr-2">
                      •
                    </span>
                    <span>
                      We do NOT knowingly collect personal information from
                      children under 13
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 dark:text-red-400 mr-2">
                      •
                    </span>
                    <span>
                      The App is designed for professional business use by
                      adults
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 dark:text-red-400 mr-2">
                      •
                    </span>
                    <span>
                      If you believe a child has provided information to us,
                      please contact us immediately at{" "}
                      <a
                        href={`mailto:${businessData.contact.email}`}
                        className="text-red-600 dark:text-red-400 hover:underline font-medium"
                      >
                        {businessData.contact.email}
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 dark:text-red-400 mr-2">
                      •
                    </span>
                    <span>
                      We will promptly delete any information we discover
                      belongs to a child under 13
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* International Data Transfers */}
          <section
            id="international-data-transfers"
            className="mb-12 scroll-mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">🌍</span>
              8. International Data Transfers
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Your information may be transferred to and stored in data
                centers outside your country of residence:
              </p>
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>
                    Data may be stored in data centers operated by Supabase in
                    various regions
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>
                    Data transfers comply with applicable data protection laws
                    (GDPR, CCPA, etc.)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>
                    Our service providers implement appropriate safeguards to
                    protect your data
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>
                    By using the App, you consent to the transfer of your
                    information to these facilities
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section id="cookies-and-tracking" className="mb-12 scroll-mt-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">🍪</span>
              9. Cookies and Tracking
            </h2>
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-lg">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-green-900 dark:text-green-100 font-semibold mb-4">
                  Good News for Your Privacy:
                </p>
                <ul className="space-y-3 text-green-800 dark:text-green-200">
                  <li className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2">
                      ✓
                    </span>
                    <span>
                      The App does <strong>NOT</strong> use cookies (it's a
                      mobile app, not a website)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2">
                      ✓
                    </span>
                    <span>
                      We do <strong>NOT</strong> track you across other apps or
                      websites
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2">
                      ✓
                    </span>
                    <span>
                      No advertising or marketing tracking is implemented
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 dark:text-green-400 mr-2">
                      ✓
                    </span>
                    <span>
                      Analytics are limited to app usage patterns for service
                      improvement only
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Changes to This Policy */}
          <section
            id="changes-to-this-policy"
            className="mb-12 scroll-mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">🔄</span>
              10. Changes to This Privacy Policy
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or legal requirements.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  How We Handle Updates:
                </h3>
                <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">1.</span>
                    <span>
                      We will notify you of any material changes through the App
                      or via email
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">2.</span>
                    <span>
                      The "Last Updated" date at the top of this policy will
                      reflect the revision date
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">3.</span>
                    <span>
                      Your continued use of the App after changes constitutes
                      acceptance of the updated policy
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">4.</span>
                    <span>
                      We encourage you to review this policy periodically for
                      any updates
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Us */}
          <section
            id="contact-us"
            className="mb-12 scroll-mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl p-8 border-2 border-blue-200 dark:border-blue-800"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">📞</span>
              11. Contact Us
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">📧</span>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Email
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

              {/* Address */}
              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">📍</span>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Address
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

            {/* Response Time */}
            <div className="mt-6 bg-blue-100 dark:bg-blue-900/40 rounded-lg p-4 border border-blue-300 dark:border-blue-700">
              <p className="text-sm text-blue-900 dark:text-blue-100 flex items-center">
                <span className="text-xl mr-2">⏱️</span>
                <strong>Response Time:</strong>
                <span className="ml-2">
                  We typically respond to privacy inquiries within 1-2 business
                  days
                </span>
              </p>
            </div>
          </section>

          {/* Final Notes */}
          <section className="mb-12 bg-slate-100 dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <span className="text-blue-500 mr-3">📝</span>
              Important Legal Notice
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                <strong>Governing Law:</strong> This Privacy Policy is governed
                by the laws of Ontario, Canada, without regard to conflict of
                law principles.
              </p>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                <strong>Compliance:</strong> This policy is designed to comply
                with:
              </p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300 ml-6">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>
                    General Data Protection Regulation (GDPR) for EU users
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>
                    California Consumer Privacy Act (CCPA) for California users
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>
                    Personal Information Protection and Electronic Documents Act
                    (PIPEDA) for Canadian users
                  </span>
                </li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 mt-4">
                <strong>Disclaimer:</strong> This Privacy Policy is provided as
                a comprehensive template. We strongly recommend consulting with
                a qualified legal professional to ensure it meets all applicable
                legal requirements for your jurisdiction.
              </p>
            </div>
          </section>

          {/* Navigation to Terms */}
          <div className="text-center py-8">
            <Link
              href="/terms-of-service"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
            >
              <span className="mr-2">📜</span>
              View Terms of Service
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
        </article>
      </main>
      <Footer />
    </>
  );
}
