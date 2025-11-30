import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics - Deferred to reduce initial HTTP requests
let analytics: any = null;
let analyticsInitialized = false;

if (typeof window !== "undefined") {
  // Defer Firebase Analytics initialization to reduce initial HTTP requests
  const initAnalytics = () => {
    if (analyticsInitialized) return;
    analyticsInitialized = true;

    // Use requestIdleCallback to load analytics after page is interactive
    const loadAnalytics = () => {
      isSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      });
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(loadAnalytics, { timeout: 3000 });
    } else {
      // Fallback: load after 2 seconds
      setTimeout(loadAnalytics, 2000);
    }
  };

  // Only initialize when page is fully loaded and user is idle
  if (document.readyState === "complete") {
    initAnalytics();
  } else {
    window.addEventListener("load", initAnalytics);
  }
}

export { app, analytics };
