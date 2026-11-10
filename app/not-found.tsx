import type { Metadata } from "next";
import { businessData } from "@/lib/business-data";
import SiteHeader from "./components/site/SiteHeader";
import SiteFooter from "./components/site/SiteFooter";
import { Ic } from "./components/site/Icons";
import { PHONE, TEL, WA_DEFAULT } from "./components/site/links";

// A missing page must not inherit the homepage's title, "index, follow" and
// canonical from the root layout. (Next also injects its own noindex tag.)
export const metadata: Metadata = {
  title: `Page not found | ${businessData.name}`,
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="nf" aria-labelledby="nf-h">
          <div className="wrap">
            <p className="nf__code mono">Error 404</p>
            <h1 className="display" id="nf-h">Page not found.</h1>
            <p className="lede">This page has gone missing, like a lost key. The key help is still here: call, message us, or go back to the homepage.</p>
            <div className="nf__acts">
              <a className="btn btn--primary btn--lg" href={TEL} data-track="call" data-track-loc="404"><Ic name="phone" /><span className="num">{PHONE}</span></a>
              <a className="btn btn--quiet btn--lg" href={WA_DEFAULT} target="_blank" rel="noopener" data-wa data-track="whatsapp" data-track-loc="404"><Ic name="msg" />WhatsApp</a>
            </div>
            <ul className="nf__links">
              <li><a href="/">Homepage <Ic name="arrow" /></a></li>
              <li><a href="/#keys">Which key do you have? <Ic name="arrow" /></a></li>
              <li><a href="/#services">Services <Ic name="arrow" /></a></li>
              <li><a href="/#quote">Get a quote <Ic name="arrow" /></a></li>
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
