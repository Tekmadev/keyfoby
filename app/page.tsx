import { preload } from "react-dom";
import SiteHeader from "./components/site/SiteHeader";
import SiteFooter from "./components/site/SiteFooter";
import HomeSchema from "./components/site/HomeSchema";
import Hero from "./components/site/home/Hero";
import HowItWorks from "./components/site/home/HowItWorks";
import Services from "./components/site/home/Services";
import Unlock from "./components/site/home/Unlock";
import Proof from "./components/site/home/Proof";
import Area from "./components/site/home/Area";
import Faq from "./components/site/home/Faq";
import Quote from "./components/site/home/Quote";
import { IMG } from "./components/site/links";

// The approved "Night Shift" homepage. Every section is a server component,
// so all text is in the static HTML; SiteFooter mounts the one small client
// component that adds the behaviours (clock, menu, picker, scroll-cut, unlock,
// hero loop, reveal, quote form, analytics).
export default function Home() {
  preload(`${IMG}/hero-night-sodium.webp`, {
    as: "image",
    imageSrcSet: `${IMG}/hero-night-sodium-960.webp 960w, ${IMG}/hero-night-sodium.webp 1920w`,
    imageSizes: "(min-width: 1024px) 125vw, (min-width: 768px) 130vw, 160vw",
    fetchPriority: "high",
  });
  return (
    <>
      <HomeSchema />
      <SiteHeader home />
      <main id="main">
        <Hero />
        <HowItWorks />
        <Services />
        <Unlock />
        <Proof />
        <Area />
        <Faq />
        <Quote />
      </main>
      <SiteFooter />
    </>
  );
}
