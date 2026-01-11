"use client";

import { motion } from "motion/react";

export default function AppPromo() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"></div>

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-cyan-300 text-sm font-medium">
                Coming Soon
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Introducing{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                KeyFoby App
              </span>
            </h2>

            <p className="text-xl text-slate-300 mb-6 leading-relaxed">
              The all-in-one business management app built exclusively for
              locksmiths. AI-powered insights, smart analytics, and everything
              you need to grow your business.
            </p>

            {/* Key features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: "📊", label: "Smart Analytics" },
                { icon: "🤖", label: "AI Insights" },
                { icon: "📅", label: "Booking System" },
                { icon: "📦", label: "Inventory" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <span className="text-xl">{feature.icon}</span>
                  <span className="font-medium">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* Early Access Promotion Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-full mb-6">
              <span className="text-lg">🎉</span>
              <span className="text-amber-300 text-sm font-bold">
                Early Access: 50% OFF for 4 Months!
              </span>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <a
                href="https://app.keyfoby.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30"
              >
                Get Early Access
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 line-through text-lg">
                    $50
                  </span>
                  <span className="text-2xl font-bold text-emerald-400">
                    $25
                    <span className="text-base font-normal text-slate-400">
                      /mo
                    </span>
                  </span>
                </div>
                <span className="text-amber-400 text-xs font-medium">
                  First 4 months • Limited time
                </span>
              </div>
            </div>
          </motion.div>

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Phone Frame */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[3rem] blur-2xl opacity-30 scale-110"></div>

              {/* Phone */}
              <div className="relative w-[280px] sm:w-[320px] h-[580px] sm:h-[640px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] p-2 shadow-2xl border border-slate-700">
                {/* Screen */}
                <div className="w-full h-full bg-slate-900 rounded-[2.5rem] overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-2xl z-10"></div>

                  {/* App Screenshot Placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 flex flex-col">
                    {/* Status bar placeholder */}
                    <div className="h-12"></div>

                    {/* App Header */}
                    <div className="px-4 pt-4 pb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-slate-400 text-xs">Welcome back</p>
                          <p className="text-white font-bold text-lg">
                            KeyFoby Pro
                          </p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          KF
                        </div>
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="px-4 grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 rounded-2xl p-3">
                        <p className="text-blue-300 text-xs mb-1">
                          Today's Jobs
                        </p>
                        <p className="text-white text-2xl font-bold">12</p>
                        <p className="text-emerald-400 text-xs">↑ 20%</p>
                      </div>
                      <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/20 rounded-2xl p-3">
                        <p className="text-cyan-300 text-xs mb-1">Revenue</p>
                        <p className="text-white text-2xl font-bold">$2.4K</p>
                        <p className="text-emerald-400 text-xs">↑ 15%</p>
                      </div>
                    </div>

                    {/* AI Insight Card */}
                    <div className="px-4 mb-4">
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/20 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🤖</span>
                          <p className="text-purple-300 text-xs font-medium">
                            AI Insight
                          </p>
                        </div>
                        <p className="text-white text-sm">
                          Honda Civic key jobs up 40%. Consider stocking more
                          fobs.
                        </p>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="px-4">
                      <p className="text-slate-400 text-xs mb-3">
                        Quick Actions
                      </p>
                      <div className="flex gap-2">
                        {["+ Job", "Inventory", "Schedule"].map((action, i) => (
                          <div
                            key={i}
                            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl"
                          >
                            <p className="text-white text-xs font-medium">
                              {action}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -left-4 top-1/4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-white text-sm font-medium">
                    iOS & Android
                  </span>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-white text-sm font-medium">
                    4.9 Rating
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
