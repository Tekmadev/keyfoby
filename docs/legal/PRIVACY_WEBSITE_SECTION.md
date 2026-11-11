# Privacy policy: website section (draft)

**Status:** published in `app/privacy-policy/page.tsx` on 2026-11-10; the page (not this draft) is the source of truth since then, including the optional customer email added the same day (live once that change is deployed). The privacy policy is now **website-only**: the KeyFoby mobile app is discontinued (owner decision 2026-11-10), so the old app sections were removed. The page is built from the text below and expanded (what we do not collect, the `kf_attr` session storage, other services, cross-border processing, security, rights, children, changes). If the two differ, the page wins. First drafted 2026-11-07 and reviewed against the code and the database.

**Where it is:** the whole `/privacy-policy` page. Terms of use (`app/terms-of-service/page.tsx`) are also website-only since 2026-11-10.

**Before publishing, confirm these:**
1. ~~Supabase region~~: confirmed 2026-11-10, East US (Ohio), `us-east-2`.
2. ~~How long you keep job records for tax~~: confirmed 2026-11-10, 6 years.
3. **Google Ads remarketing:** in Google Ads → Tools → Audience manager. If remarketing is on, keep the last sentence of "Analytics and ads". If it is off, you can delete that sentence.
4. **Resend sending region:** on the Resend Domains page, when you add `send.keyfoby.com`. Use North Virginia (us-east-1), which matches "United States" in the text.
5. ~~Two promises only you can keep~~: confirmed true by the owner 2026-11-10 ("We only contact you about the quote you asked for"; "If you call, we do not record the call").
6. ~~Other services~~: checked 2026-11-10 against the new design. It loads the Elfsight reviews panel, Google Analytics and Ads tags, Firebase Analytics and WhatsApp links; the NHTSA make list and the Google map are gone, so they were removed below.
7. **Who can see requests:** does anyone besides KeyFoby (for example the website developer) have access to Supabase, Resend, Vercel or the Gmail inbox? The page no longer says "Only KeyFoby looks at your request". If only KeyFoby has access, that sentence can go back in; if the developer does, add "and the company that maintains our website, when it needs to fix a problem".
8. **Calls, texts, WhatsApp and email:** how long are these messages (and photos) kept? The page says what we get and why, but gives no time for these. Add it to "How long we keep it" once known.
9. **History log:** has `db/supabase/2026-11-10_02_lead_history.sql` been run in Supabase? The page says we "may" keep a dated record of changes, including earlier names and phone numbers.
10. **All-keys-lost jobs:** do you keep a copy or note of the customer's ID, registration or proof of ownership? If yes, add it to the job-records sentence; if you only look at them, say so.
11. **Firebase Hosting:** the page says copies of the site may also be served by Google Firebase Hosting during the move. Remove that sentence after step 6 of `docs/VERCEL_MIGRATION.md` (Firebase Hosting switched off).

This is plain-language policy text, not legal advice. Have it reviewed if you want that certainty.

---

## Quote requests on keyfoby.com

This policy explains what happens to your information when you ask us for a quote on keyfoby.com.

**Who we are.** KeyFoby, a mobile car key locksmith. Mailing address: 40 Courtland Ave, Hamilton, ON L9B 1X6. Phone: (905) 467-6860. Email: keyfoby@gmail.com.

**What we collect when you send the quote form**
- What you tell us about your key: key type, whether you still have a working key, and the ignition type.
- Your car: year, make and model.
- Where the car is: town.
- Your name and phone number. We do not ask for your email address.
- Anything else you choose to type in the "details" box. Please don't include sensitive information there.
- Proof of your consent: the exact wording you agreed to, the date and time, and, if you withdraw it, when.
- How you found us: the page you sent the form from, and, if you came from an ad, the campaign tags and Google Ads click ID in the link.
- Our own notes about your request and its status (for example, quoted or booked).

We do not store your IP address with your quote request.

**Why we use it.** To prepare your price, to call or text you about this quote and the job, and to know which of our ads work. We only contact you about the quote you asked for.

**Stopping messages.** You can withdraw your consent at any time. Reply STOP to any text from us, call (905) 467-6860 or email keyfoby@gmail.com. We act on it within 10 business days.

**Bot protection.** The form uses Cloudflare Turnstile to check that a person, not a bot, is sending it. Turnstile looks at signals from your browser and device, including your IP address. Cloudflare also uses these signals to improve its bot detection. See Cloudflare's Turnstile privacy policy: https://www.cloudflare.com/turnstile-privacy-policy/.

**Who handles your information for us**
- **Vercel** hosts the website and runs the form's server code (United States). Like any web host, Vercel keeps short-lived technical logs of requests, such as IP address and browser type, for security and troubleshooting.
- **Supabase** stores quote requests in our database (United States, Ohio).
- **Resend** sends us an email with the details of your request. Resend stores its data in the United States and keeps a copy of sent emails for 30 days.
- **Google (Gmail)** holds that email in our inbox (outside Canada, mainly the United States).
- **Cloudflare** runs the bot check (United States, with a global network).

Apart from Cloudflare's use of bot-check signals described above, these providers process your information only to provide their service to us. Your information may therefore be processed and stored outside Canada, and may be accessible to authorities there under their laws.

**WhatsApp and phone.** If you message us on WhatsApp instead, WhatsApp (Meta) handles that conversation under its own terms and privacy policy. If you call, we do not record the call.

**How long we keep it.** We review and delete old quote requests regularly, at least every three months:
- Spam and test entries: once they are more than 30 days old.
- Requests that did not become a job: once 12 months have passed since our last update to them.
- Requests that became a job: once 3 years have passed since our last update to them (normally when the job is done), so we can show the consent you gave.

We delete the notification emails on the same schedule. Deleted data may stay in our providers' backups for a short time.

If you hire us, we also keep a record of the job (such as your name, your car and the work done) in our business records for 6 years, as tax law requires.

**Other services on the site.** These load from other companies when you use the page, so those companies can see your IP address and may set cookies. Each follows its own privacy policy.
- The Google reviews panel is shown by Elfsight.

**Your choices.** You can ask us what we hold about you, ask us to correct it, or ask us to delete it. Call (905) 467-6860 or email keyfoby@gmail.com. If you are not satisfied with our answer, you can contact the Office of the Privacy Commissioner of Canada (priv.gc.ca).

**Analytics and ads.** keyfoby.com uses Google Analytics and Google Ads tags to measure visits and the results of our ads. These tags set cookies in your browser. You can block them in your browser settings, or install Google's opt-out add-on: https://tools.google.com/dlpage/gaoptout. Google may use them to show you our ads on other sites; you can turn that off at https://adssettings.google.com.

---

### Notes for the build (not part of the policy text)

- The consent checkbox must show exactly the stored wording, version `2026-11-10` (seeded by `db/supabase/2026-11-10_03_lead_email.sql`; the earlier `2026-11-07` wording without "email" stays valid for old records), character for character: "Yes, KeyFoby ((905) 467-6860, keyfoby@gmail.com, 40 Courtland Ave, Hamilton, ON L9B 1X6) may contact me by phone, text or email about this quote. I can withdraw consent at any time." Keep the "How we handle your details: Privacy policy" link under the form.
- The form sends `consent_version: "2026-11-10"`, an optional `email` (the customer then gets one confirmation email with their KF reference, containing none of the text they typed), and a `client_request_id` made with `crypto.randomUUID()` when the visitor presses Send, and reused only when re-sending the same details. If they edit any field after an error, the database treats it as a new request anyway. It renders the Turnstile widget with `action: "quote"`, shows the widget's privacy link, and includes a hidden, empty `website` input as a honeypot.
- The page is website-only (2026-11-10). The old app sections, the "template" notices and the GDPR/CCPA compliance list were removed.
- Review changes on the page (2026-11-10), not copied into the draft above: a "When you call, text, WhatsApp or email us" paragraph; the Turnstile check loads when the form comes into view; the Analytics opt-out add-on blocks Google Analytics only; quoted price, appointment time and change history in "Our own notes"; a deletion caveat for records the law requires, a 30-day answer time and the owner as the person responsible for privacy.
- Owner routine: label test submissions as `spam`. Run `db/supabase/2026-11-07_01_website_leads_retention.sql` monthly or quarterly, and delete the matching Gmail notifications at the same time. When someone replies STOP, fill in `consent_withdrawn_at`.
- If Phase 4 adds a consent banner or drops the Firebase SDK, update the "Analytics and ads" paragraph to match.
