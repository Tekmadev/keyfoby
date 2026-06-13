#!/usr/bin/env node
/**
 * Static export build script for Firebase Hosting.
 *
 * Next.js `output: "export"` does not support dynamic API routes.
 * The app/api routes are backend-only handlers (used by the mobile app)
 * and are not served from Firebase Hosting. This script temporarily moves
 * them out of the app directory during the build so Next.js ignores them,
 * then restores them afterward.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const apiDir = path.join(root, "app", "api");
const apiBackup = path.join(root, "_api_excluded");

// Resolve the next binary from node_modules so this works when called
// directly (node scripts/build.js) and via npm run (PATH already set).
const nextBin = path.join(root, "node_modules", ".bin", "next");
const nextCmd = fs.existsSync(nextBin) ? `"${nextBin}" build` : "next build";

const apiExists = fs.existsSync(apiDir);

try {
  if (apiExists) {
    fs.renameSync(apiDir, apiBackup);
    console.log("Temporarily excluded app/api from static build.");
  }

  execSync(nextCmd, { stdio: "inherit", cwd: root });
} finally {
  if (apiExists && fs.existsSync(apiBackup)) {
    fs.renameSync(apiBackup, apiDir);
    console.log("Restored app/api after build.");
  }
}
