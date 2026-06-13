import { lazy, Suspense } from "react";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import LocalBusinessSchema from "./components/LocalBusinessSchema";

// Lazy load below-the-fold components to reduce initial bundle size and HTTP requests
const Services = lazy(() => import("./components/Services"));
const Features = lazy(() => import("./components/Features"));
const AppPromo = lazy(() => import("./components/AppPromo"));
const GoogleReviews = lazy(() => import("./components/GoogleReviews"));
const FAQSection = lazy(() => import("./components/FAQSection"));
const ContactFormWrapper = lazy(
  () => import("./components/ContactFormWrapper")
);
const Footer = lazy(() => import("./components/Footer"));

// Loading placeholder component
const SectionLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="animate-pulse text-slate-400">Loading...</div>
  </div>
);

export default function Home() {
  return (
    <>
      <LocalBusinessSchema />
      <NavBar />
      <main className="min-h-screen">
        <Hero />
        <Suspense fallback={<SectionLoader />}>
          <Services />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Features />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <AppPromo />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <GoogleReviews />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <FAQSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ContactFormWrapper />
        </Suspense>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </main>
    </>
  );
}
