# Privacy policy: website section (draft)

**Status:** draft, 2026-11-07. Reviewed against the code and the database. It goes live **at the same time as the new quote form** (Phase 4), not before. Today's site still sends leads through EmailJS, and this text describes the new setup.

**Where it goes:** a new section at the top of `/privacy-policy`, titled "Quote requests on keyfoby.com". The existing app sections stay word for word, because the KeyFoby mobile app links to this page. See "Notes for the build" below.

**Before publishing, confirm these:**
1. **Supabase region:** in the Supabase dashboard, Project Settings → General → Region, for project `grytdgpmewmxbdimpgrr`. Replace `[Supabase region]` with it, e.g. "Canada (Central)" or "United States (East)".
2. **How long you keep job records for tax.** It's usually 6 years in Canada; your accountant can confirm. Replace `[6 years]` if different.
3. **Google Ads remarketing:** in Google Ads → Tools → Audience manager. If remarketing is on, keep the last sentence of "Analytics and ads". If it is off, you can delete that sentence.
4. **Resend sending region:** on the Resend Domains page, when you add `send.keyfoby.com`. Use North Virginia (us-east-1), which matches "United States" in the text.
5. **Two promises only you can keep:** "We only contact you about the quote you asked for" and "If you call, we do not record the call". Delete either one if it is not true for how you work.
6. **Other services:** delete each line under "Other services on the site" for anything the new design no longer uses (the make list from NHTSA, the Elfsight reviews widget, the Google map).

This is plain-language policy text, not legal advice. Have it reviewed if you want that certainty.

---

## Quote requests on keyfoby.com

This section explains what happens to your information when you ask us for a quote on keyfoby.com. The other sections of this policy cover the KeyFoby mobile app.

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
- **Supabase** stores quote requests in our database ([Supabase region]).
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

If you hire us, we also keep a record of the job (such as your name, your car and the work done) in our business records for [6 years], as tax law requires.

**Other services on the site.** These load from other companies when you use the page, so those companies can see your IP address and may set cookies. Each follows its own privacy policy.
- The list of car makes and models comes from the US government's NHTSA vPIC service. It sees the year and make you pick.
- The Google reviews panel is shown by Elfsight.
- The map is shown by Google Maps.

**Your choices.** You can ask us what we hold about you, ask us to correct it, or ask us to delete it. Call (905) 467-6860 or email keyfoby@gmail.com. If you are not satisfied with our answer, you can contact the Office of the Privacy Commissioner of Canada (priv.gc.ca).

**Analytics and ads.** keyfoby.com uses Google Analytics and Google Ads tags to measure visits and the results of our ads. These tags set cookies in your browser. You can block them in your browser settings, or install Google's opt-out add-on: https://tools.google.com/dlpage/gaoptout. Google may use them to show you our ads on other sites; you can turn that off at https://adssettings.google.com.

---

### Notes for the build (not part of the policy text)

- The consent checkbox must show exactly the stored wording, version `2026-11-07`, matching the SQL seed character for character: "Yes, KeyFoby ((905) 467-6860, keyfoby@gmail.com) may contact me by phone or text about this quote. I can withdraw consent at any time. Our mailing address is in our privacy policy." Link "privacy policy" to `/privacy-policy`.
- The form sends `consent_version: "2026-11-07"` and a `client_request_id` made with `crypto.randomUUID()` when the visitor presses Send, and reused only when re-sending the same details. If they edit any field after an error, the database treats it as a new request anyway. It renders the Turnstile widget with `action: "quote"`, shows the widget's privacy link, and includes a hidden, empty `website` input as a honeypot.
- On the existing page, keep the app sections word for word, but:
  - add this section to the Quick Navigation list;
  - add a one-line scope note above section 1 ("Sections 1–N cover the KeyFoby mobile app"), so the app's "no cookies" statement doesn't read as covering the website;
  - remove the "template" legal-notice banner when "Last updated" is bumped, and the "provided as a comprehensive template" paragraph in the closing Important Legal Notice (the governing-law and compliance lines can stay).
- Owner routine: label test submissions as `spam`. Run `db/supabase/2026-11-07_01_website_leads_retention.sql` monthly or quarterly, and delete the matching Gmail notifications at the same time. When someone replies STOP, fill in `consent_withdrawn_at`.
- If Phase 4 adds a consent banner or drops the Firebase SDK, update the "Analytics and ads" paragraph to match.
