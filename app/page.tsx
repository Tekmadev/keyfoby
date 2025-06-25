import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Features from "./components/Features";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import LocalBusinessSchema from "./components/LocalBusinessSchema";

export default function Home() {
  return (
    <>
      <LocalBusinessSchema />
      <NavBar />
      <main className="min-h-screen">
        <Hero />
        <Services />
        <Features />
        <ContactForm />
        <Footer />
      </main>
    </>
  );
}
