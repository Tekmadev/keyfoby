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

  // Performance optimizations
  compress: true, // Enable gzip compression
  // Note: swcMinify is now default in Next.js 15+

  // Optimize bundle size
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Optimize webpack chunk splitting to reduce HTTP requests
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimize chunk splitting strategy
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Combine vendor chunks
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Framework chunks (React, Next.js)
            framework: {
              name: "framework",
              chunks: "all",
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // Common chunks
            common: {
              name: "common",
              minChunks: 2,
              chunks: "all",
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },

  // Disable server-side features for static export
  experimental: {
    // Remove any server-side features if present
  },

  // Turbopack configuration (Next.js 16+)
  // Empty config acknowledges Turbopack is being used
  // Webpack config above is kept as fallback for compatibility
  turbopack: {},
};

export default nextConfig;
