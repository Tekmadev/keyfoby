import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import LocalBusinessSchema from "./components/LocalBusinessSchema";
import Services from "./components/Services";
import Features from "./components/Features";
import GoogleReviews from "./components/GoogleReviews";
import FAQSection from "./components/FAQSection";
import ContactFormWrapper from "./components/ContactFormWrapper";
import Footer from "./components/Footer";

// Every section renders into the static HTML, so crawlers and no-JS visitors
// see the full page (no Suspense "Loading..." placeholders).
export default function Home() {
  return (
    <>
      <LocalBusinessSchema />
      <NavBar />
      <main className="min-h-screen">
        <Hero />
        <Services />
        <Features />
        <GoogleReviews />
        <FAQSection />
        <ContactFormWrapper />
      </main>
      <Footer />
    </>
  );
}
