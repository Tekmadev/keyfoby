import { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { businessData } from "@/lib/business-data";
import SiteHeader from "@/app/components/site/SiteHeader";
import SiteFooter from "@/app/components/site/SiteFooter";
import { pageSocial } from "@/app/components/site/social";

/* Website-only terms of use. Price and booking wording comes from
   lib/business-data.ts (hours.afterHours, faqItems) and the homepage
   (Hero, HowItWorks, Quote); the warranty terms live only on /warranty. */

const TITLE = "Terms of Use | KeyFoby Automotive Locksmith Hamilton";
const DESCRIPTION =
  "Terms of use for keyfoby.com, the website of KeyFoby, a mobile car key locksmith in Hamilton, Ontario: quote requests, prices, acceptable use and contact.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.keyfoby.com/terms-of-service",
  },
  ...pageSocial("/terms-of-service", TITLE, DESCRIPTION),
};

const { contact } = businessData;

const SECTIONS = [
  { id: "about-these-terms", title: "About these terms" },
  { id: "what-the-site-is-for", title: "What the site is for" },
  { id: "quotes-and-prices", title: "Quote requests and prices" },
  { id: "warranty", title: "Warranty" },
  { id: "acceptable-use", title: "Using the site fairly" },
  { id: "site-content", title: "Website content" },
  { id: "other-services", title: "Links and other services" },
  { id: "liability", title: "Limitation of liability" },
  { id: "privacy", title: "Privacy" },
  { id: "governing-law", title: "Governing law" },
  { id: "changes", title: "Changes to these terms" },
  { id: "contact", title: "Contact us" },
] as const;

const LINK =
  "text-blue-600 dark:text-blue-400 underline break-words hover:text-blue-700 dark:hover:text-blue-300";

function Section({
  id,
  shaded = false,
  children,
}: {
  id: (typeof SECTIONS)[number]["id"];
  shaded?: boolean;
  children: ReactNode;
}) {
  const title = SECTIONS.find((s) => s.id === id)!.title;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      className={`mb-12 scroll-mt-8${
        shaded ? " bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 sm:p-8" : ""
      }`}
    >
      <h2
        id={`${id}-h`}
        className="text-3xl font-bold text-slate-900 dark:text-white mb-6"
      >
        {title}
      </h2>
      <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function List({ children }: { children: ReactNode }) {
  return <ul className="list-disc ml-6 space-y-2">{children}</ul>;
}

const Phone = () => (
  <a href={contact.phoneHref} className={LINK}>
    {contact.phoneDisplay}
  </a>
);
const Email = () => (
  <a href={`mailto:${contact.email}`} className={LINK}>
    {contact.email}
  </a>
);

export default function TermsOfService() {
  const lastUpdated = "November 10, 2026";

  return (
    <>
      <SiteHeader />
      <main id="main" className="legal dark">
        {/* Hero Section */}
        <section className="legal-hero">
          <div className="legal-hero__in">
            <div className="legal-hero__body">
              <div className="legal-hero__icon" aria-hidden="true">
                <span>📜</span>
              </div>
              <h1>Terms of Use</h1>
              <p className="legal-hero__sub">
                The rules for using keyfoby.com and asking us for a quote
              </p>
              <div className="legal-hero__date">
                <svg
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Last Updated: {lastUpdated}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* In-page navigation */}
          <nav
            aria-labelledby="toc-h"
            className="mb-12 p-6 bg-blue-50 dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-slate-700"
          >
            <h2
              id="toc-h"
              className="text-lg font-semibold text-slate-900 dark:text-white mb-4"
            >
              On this page
            </h2>
            <ol className="grid md:grid-cols-2 gap-x-6">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <Section id="about-these-terms">
            <p>
              These terms cover your use of keyfoby.com, the website of
              KeyFoby, a mobile car key locksmith based in Hamilton, Ontario.
              By using the site, you agree to them. If you don&apos;t agree,
              please don&apos;t use the site.
            </p>
            <p>
              The car key work itself is agreed with you on the phone, as
              explained in{" "}
              <a href="#quotes-and-prices" className={LINK}>
                Quote requests and prices
              </a>
              .
            </p>
          </Section>

          <Section id="what-the-site-is-for" shaded>
            <p>
              The site gives information about our mobile car key and key fob
              service: car key replacement, key fob programming, all keys lost
              and car lockouts, done at your car. We work on cars only.
            </p>
            <p>
              It also gives you ways to reach us: the quote form, our phone
              number and WhatsApp.
            </p>
          </Section>

          <Section id="quotes-and-prices">
            <List>
              <li>
                Sending the quote form is a request for a price. It is not a
                booking or a contract, and it does not commit you or us to a
                job.
              </li>
              <li>
                We call you back with a price. Prices are quoted on the phone by
                your car&apos;s year, make and model and the type of key, and we
                quote the price on the phone before we book.
              </li>
              <li>{businessData.hours.afterHours}</li>
              <li>
                We confirm on the phone whether we can do the job for your car
                before we book, and we give you an arrival time on the phone.
              </li>
              <li>
                You do not pay anything on this website.
              </li>
            </List>
            <p>
              Locked out right now? Don&apos;t wait on the form. Call{" "}
              <Phone />.
            </p>
          </Section>

          <Section id="warranty" shaded>
            <p>
              Our warranty on completed work is described on our{" "}
              <Link href="/warranty" className={LINK}>
                Warranty page
              </Link>
              . Our warranty is in addition to your rights under Ontario
              consumer protection law, which it does not reduce.
            </p>
          </Section>

          <Section id="acceptable-use">
            <p>When you use the site, please don&apos;t:</p>
            <List>
              <li>send spam, or automated or repeated requests;</li>
              <li>
                give false information, or someone else&apos;s name or phone
                number without their permission;
              </li>
              <li>
                try to get around the form&apos;s bot check, overload the site,
                or get into parts of it that are not public;
              </li>
              <li>send harmful code through the site;</li>
              <li>use the form or our contact details to harass anyone.</li>
            </List>
            <p>
              We may ignore or delete requests that break these rules.
            </p>
          </Section>

          <Section id="site-content" shaded>
            <p>
              We try to keep the information on the site accurate and up to
              date, but it is general information, provided &quot;as is&quot;.
              It may change without notice. The details that matter for your
              job, such as the price, whether we can do your car and when we
              can get there, are the ones we give you on the phone.
            </p>
            <p>
              We don&apos;t promise that the site or the quote form will always
              be available or free of errors. If the form doesn&apos;t work,
              call <Phone /> or message us on WhatsApp.
            </p>
            <p>
              Please don&apos;t copy the site&apos;s text, logo or images for
              your own business without our written permission.
            </p>
          </Section>

          <Section id="other-services">
            <p>
              The site links to, or loads, services run by other companies,
              such as WhatsApp (Meta), Google (reviews, Analytics and Ads),
              Elfsight (the reviews panel) and Cloudflare (the bot check). They
              have their own terms and privacy policies. We don&apos;t control
              them and are not responsible for their content or availability.
            </p>
          </Section>

          <Section id="liability" shaded>
            <p>
              As far as the law allows, KeyFoby is not responsible for loss
              caused by using the website or by not being able to use it: for
              example, if the site is down, a quote request does not reach us,
              or general information on the site turns out to be out of date.
              If you sent a request and haven&apos;t heard from us, please call.
            </p>
            <p>
              Nothing in these terms takes away rights you have under consumer
              protection law that cannot be waived.
            </p>
          </Section>

          <Section id="privacy">
            <p>
              Our{" "}
              <Link href="/privacy-policy" className={LINK}>
                Privacy Policy
              </Link>{" "}
              explains what we collect when you use the site or send the quote
              form, and how we use it.
            </p>
          </Section>

          <Section id="governing-law" shaded>
            <p>
              These terms are governed by the laws of Ontario and the federal
              laws of Canada that apply there. You can bring a dispute about
              them in the courts of Ontario, including Small Claims Court.
            </p>
          </Section>

          <Section id="changes">
            <p>
              We may update these terms when the site changes. When we do, we
              change the &quot;Last Updated&quot; date at the top of this page.
              Using the site after a change means you accept the updated terms.
            </p>
          </Section>

          <Section id="contact" shaded>
            <p>Questions about these terms:</p>
            <List>
              <li>Mail: KeyFoby, {contact.address.full}</li>
              <li>
                Phone: <Phone />
              </li>
              <li>
                Email: <Email />
              </li>
            </List>
          </Section>

          {/* Navigation to Privacy */}
          <div className="text-center py-8">
            <Link href="/privacy-policy" className="btn btn--primary btn--lg">
              View Privacy Policy
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
