import { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { businessData } from "@/lib/business-data";
import SiteHeader from "@/app/components/site/SiteHeader";
import SiteFooter from "@/app/components/site/SiteFooter";
import { pageSocial } from "@/app/components/site/social";

/* Website-only privacy policy. Source text: docs/legal/PRIVACY_WEBSITE_SECTION.md.
   The quote form's consent wording (version 2026-11-10, db/supabase/2026-11-10_03_lead_email.sql)
   names our mailing address; keep it on this page too. */

const TITLE = "Privacy Policy | KeyFoby Automotive Locksmith Hamilton";
const DESCRIPTION =
  "KeyFoby privacy policy: how we collect, use, and protect your personal information for our automotive locksmith and key fob services in Hamilton, Ontario.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.keyfoby.com/privacy-policy",
  },
  ...pageSocial("/privacy-policy", TITLE, DESCRIPTION),
};

const { contact } = businessData;

const SECTIONS = [
  { id: "who-we-are", title: "Who we are" },
  { id: "what-we-collect", title: "What we collect" },
  { id: "how-we-use-it", title: "How we use it" },
  { id: "stopping-messages", title: "Stopping messages" },
  { id: "bot-protection", title: "Bot protection" },
  { id: "who-handles-it", title: "Who handles your information for us" },
  { id: "other-services", title: "Other services on the site" },
  { id: "outside-canada", title: "Information outside Canada" },
  { id: "how-long-we-keep-it", title: "How long we keep it" },
  { id: "security", title: "How we protect it" },
  { id: "your-rights", title: "Your rights" },
  { id: "children", title: "Children" },
  { id: "changes", title: "Changes to this policy" },
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

function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xl font-semibold text-slate-900 dark:text-white pt-2">
      {children}
    </h3>
  );
}

function List({ children }: { children: ReactNode }) {
  return <ul className="list-disc ml-6 space-y-2">{children}</ul>;
}

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className={LINK} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
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

export default function PrivacyPolicy() {
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
                <span>🔒</span>
              </div>
              <h1>Privacy Policy</h1>
              <p className="legal-hero__sub">
                How KeyFoby handles your information when you use keyfoby.com
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

          <Section id="who-we-are">
            <p>
              KeyFoby is a mobile car key locksmith based in Hamilton, Ontario.
              This policy explains what happens to your information when you
              visit keyfoby.com, ask us for a quote on it, or contact us from
              it.
            </p>
            <p>
              Mailing address: {contact.address.full}. Phone: <Phone />.
              Email: <Email />.
            </p>
          </Section>

          <Section id="what-we-collect" shaded>
            <H3>When you send the quote form</H3>
            <List>
              <li>
                What you tell us about your key: key type, whether you still
                have a working key, and the ignition type.
              </li>
              <li>Your car: year, make and model.</li>
              <li>Where the car is: town.</li>
              <li>Your name and phone number.</li>
              <li>
                Your email address, only if you choose to give it. We use it to
                send you one confirmation with your reference number, and to
                answer you about this quote.
              </li>
              <li>
                Anything else you choose to type in the &quot;details&quot; box.
                Please don&apos;t include sensitive information there.
              </li>
              <li>
                Proof of your consent: the exact wording you agreed to, the date
                and time, and, if you withdraw it, when.
              </li>
            </List>

            <H3>How you found us</H3>
            <p>
              With your quote request we also record the page you sent it from
              and, if you came from an ad, the campaign tags and Google Ads
              click ID in the link you followed. So that this still works if you
              visit another page first, the site keeps those tags in your
              browser&apos;s session storage for that tab, under the name
              &quot;kf_attr&quot;. It holds only the tags from the link, not
              your name or phone number, and your browser normally deletes it
              when you close the tab.
            </p>

            <H3>Our own notes</H3>
            <p>
              We add our own notes to your request, such as its status (for
              example, quoted or booked), the price we quoted and the
              appointment time. We keep a dated record of changes to your
              request, including your earlier name, phone number or email
              address if they change. It does not keep earlier versions of our
              notes.
            </p>

            <H3>When you call, text, WhatsApp or email us</H3>
            <p>
              We get your phone number or email address and what you send us,
              for example a photo of your key. We use it only to answer you
              and to quote and do the job. We do not record phone calls.
            </p>

            <H3>What we do not collect</H3>
            <List>
              <li>We do not store your IP address with your quote request.</li>
              <li>
                There are no accounts or logins on keyfoby.com, and you cannot
                pay on the website.
              </li>
            </List>
          </Section>

          <Section id="how-we-use-it">
            <p>We use your information to:</p>
            <List>
              <li>prepare your price;</li>
              <li>call, text or email you about this quote and the job;</li>
              <li>
                send you one email confirming we received your request, if you
                gave your email address;
              </li>
              <li>know which of our ads work.</li>
            </List>
            <p>We only contact you about the quote you asked for.</p>
          </Section>

          <Section id="stopping-messages" shaded>
            <p>
              You can withdraw your consent at any time. Reply STOP to any text
              from us, reply &quot;unsubscribe&quot; to our email, call <Phone />{" "}
              or email <Email />. We act on it within 10 business days.
            </p>
          </Section>

          <Section id="bot-protection">
            <p>
              The quote form uses Cloudflare Turnstile to check that a person,
              not a bot, is sending it. Turnstile looks at signals from your
              browser and device, including your IP address. Cloudflare also
              uses these signals to improve its bot detection. The check loads
              when the form comes into view, even if you don&apos;t send it.
              See{" "}
              <Ext href="https://www.cloudflare.com/turnstile-privacy-policy/">
                Cloudflare&apos;s Turnstile privacy policy
              </Ext>
              .
            </p>
          </Section>

          <Section id="who-handles-it" shaded>
            <List>
              <li>
                <strong>Vercel</strong> hosts the website and runs the
                form&apos;s server code (United States). Like any web host,
                Vercel keeps short-lived technical logs of requests, such as IP
                address and browser type, for security and troubleshooting.
                While we move the site to Vercel, copies of it may also be
                served by Google Firebase Hosting.
              </li>
              <li>
                <strong>Supabase</strong> stores quote requests in our database
                (United States, Ohio).
              </li>
              <li>
                <strong>Resend</strong> sends us an email with the details of
                your request, from leads@keyfoby.com to our inbox, and, if you
                gave your email address, your confirmation email. Resend stores
                its data in the United States and keeps a copy of sent emails
                for 30 days.
              </li>
              <li>
                <strong>Google (Gmail)</strong> holds that email in our inbox
                (outside Canada, mainly the United States).
              </li>
              <li>
                <strong>Cloudflare</strong> runs the bot check (United States,
                with a global network).
              </li>
            </List>
            <p>
              Apart from Cloudflare&apos;s use of bot-check signals described
              above, these providers process your information only to provide
              their service to us.
            </p>
          </Section>

          <Section id="other-services">
            <p>
              These services load from other companies when you use the site,
              so those companies can see your IP address and may set cookies.
              Each follows its own privacy policy. The Cloudflare bot check is
              described in{" "}
              <a href="#bot-protection" className={LINK}>
                Bot protection
              </a>
              .
            </p>

            <H3>Google Analytics and Google Ads</H3>
            <p>
              keyfoby.com uses Google Analytics (including Google Analytics for
              Firebase) and Google Ads tags to measure visits and the results
              of our ads. These tags set cookies and similar browser storage.
              You can block them in your browser settings, or install{" "}
              <Ext href="https://tools.google.com/dlpage/gaoptout">
                Google&apos;s Analytics opt-out add-on
              </Ext>{" "}
              (it blocks Google Analytics only). Google may use them to show you our ads on other sites; you can
              turn that off in{" "}
              <Ext href="https://adssettings.google.com">
                Google&apos;s ad settings
              </Ext>
              .
            </p>

            <H3>Google reviews panel</H3>
            <p>
              The Google reviews panel on our home page is shown by Elfsight.
              It loads from Elfsight when you scroll near it.
            </p>

            <H3>WhatsApp</H3>
            <p>
              Our WhatsApp buttons open WhatsApp with a message ready for you
              to edit and send. If you message us on WhatsApp, WhatsApp (Meta)
              handles that conversation under its own terms and privacy
              policy.
            </p>
          </Section>

          <Section id="outside-canada" shaded>
            <p>
              The providers above are mainly in the United States. Your
              information may therefore be processed and stored outside Canada,
              and may be accessible to courts, law enforcement and other
              authorities there under their laws.
            </p>
          </Section>

          <Section id="how-long-we-keep-it">
            <p>
              We review and delete old quote requests regularly, at least every
              three months:
            </p>
            <List>
              <li>Spam and test entries: once they are more than 30 days old.</li>
              <li>
                Requests that did not become a job: once 12 months have passed
                since our last update to them.
              </li>
              <li>
                Requests that became a job: once 3 years have passed since our
                last update to them (normally when the job is done), so we can
                show the consent you gave.
              </li>
            </List>
            <p>
              We delete the notification emails in our inbox on the same
              schedule. Resend deletes its copy after 30 days. Deleted data may
              stay in our providers&apos; backups for a short time.
            </p>
            <p>
              If you hire us, we also keep a record of the job (such as your
              name, your car and the work done) in our business records for 6
              years, as tax law requires.
            </p>
          </Section>

          <Section id="security" shaded>
            <p>
              Quote requests are kept in a private database that the public
              website cannot read. The notification emails about your request
              go only to our own inbox, and your confirmation (if you gave an
              email address) goes only to the address you gave. No way of sending
              or storing information online is completely secure, so please
              keep the &quot;details&quot; box to what we need for the quote.
            </p>
          </Section>

          <Section id="your-rights">
            <p>
              You can ask us what information we hold about you, ask us to
              correct it, or ask us to delete it. We may need to keep some
              records the law requires, such as job records for tax; if so, we
              will tell you. You can also withdraw your consent to be
              contacted, as described in{" "}
              <a href="#stopping-messages" className={LINK}>
                Stopping messages
              </a>
              . Call <Phone /> or email <Email />. We answer within 30 days, as
              the law requires.
            </p>
            <p>
              The owner of KeyFoby is responsible for how we handle your
              personal information. You can reach the owner by phone, email or
              mail using the details in{" "}
              <a href="#contact" className={LINK}>
                Contact us
              </a>
              .
            </p>
            <p>
              If you are not satisfied with our answer, you can contact the{" "}
              <Ext href="https://www.priv.gc.ca">
                Office of the Privacy Commissioner of Canada
              </Ext>{" "}
              (priv.gc.ca).
            </p>
          </Section>

          <Section id="children" shaded>
            <p>
              keyfoby.com is for car owners and is not aimed at children. We do
              not knowingly collect information from children. If you think a
              child has sent us their details, contact us and we will delete
              them.
            </p>
          </Section>

          <Section id="changes">
            <p>
              We may update this policy when our website or the services we use
              change. When we do, we change the &quot;Last Updated&quot; date at
              the top of this page. We keep a record of the exact consent
              wording you agreed to when you sent your request.
            </p>
          </Section>

          <Section id="contact" shaded>
            <p>Questions about this policy or your information:</p>
            <List>
              <li>
                Mail: KeyFoby, {contact.address.full}
              </li>
              <li>
                Phone: <Phone />
              </li>
              <li>
                Email: <Email />
              </li>
            </List>
          </Section>

          {/* Navigation to Terms */}
          <div className="text-center py-8">
            <Link href="/terms-of-service" className="btn btn--primary btn--lg">
              View Terms of Use
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
