import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for deployment
  output: "export",

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Set base path if deploying to subdirectory (optional)
  // basePath: '/keyfoby',

  // Ensure trailing slash consistency
  trailingSlash: true,

  // Disable server-side features for static export
  experimental: {
    // Remove any server-side features if present
  },
};

export default nextConfig;
