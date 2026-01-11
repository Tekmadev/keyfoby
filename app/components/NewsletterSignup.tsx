"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/supabase";

interface NewsletterSignupProps {
  source?: string;
  variant?: "default" | "compact" | "hero";
  className?: string;
}

export default function NewsletterSignup({
  source = "app-page",
  variant = "default",
  className = "",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    const result = await subscribeToNewsletter(email, source);

    if (result.success) {
      setStatus("success");
      setMessage(result.message);
      setEmail("");
    } else {
      setStatus("error");
      setMessage(result.message);
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      if (status !== "loading") {
        setStatus("idle");
        setMessage("");
      }
    }, 5000);
  };

  if (variant === "hero") {
    return (
      <div className={`w-full max-w-lg mx-auto ${className}`}>
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={status === "loading" || status === "success"}
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-300 text-lg"
              />
              {status === "success" && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg
                    className="w-6 h-6 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
            >
              {status === "loading" ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Joining...
                </span>
              ) : status === "success" ? (
                "You're In! 🎉"
              ) : (
                "Notify Me"
              )}
            </button>
          </div>
          {message && (
            <p
              className={`mt-3 text-sm ${
                status === "error" ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>
        <p className="mt-4 text-white/60 text-sm text-center">
          Join 100+ locksmiths waiting for the launch. No spam, ever.
        </p>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={status === "loading" || status === "success"}
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-sm"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
          >
            {status === "loading"
              ? "..."
              : status === "success"
              ? "✓"
              : "Notify Me"}
          </button>
        </form>
        {message && (
          <p
            className={`mt-2 text-xs ${
              status === "error" ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 ${className}`}
    >
      <h3 className="text-lg font-bold text-white mb-2">
        Get Notified on Launch
      </h3>
      <p className="text-slate-400 text-sm mb-4">
        Be the first to know when KeyFoby App launches.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={status === "loading" || status === "success"}
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Joining...
            </span>
          ) : status === "success" ? (
            "You're In! 🎉"
          ) : (
            "Notify Me"
          )}
        </button>
      </form>
      {message && (
        <p
          className={`mt-3 text-sm ${
            status === "error" ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
