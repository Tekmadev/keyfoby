# Website leads database: run guide

These SQL files store quote requests from the new keyfoby.com form in Supabase. You run them by hand in the Supabase SQL editor (project `grytdgpmewmxbdimpgrr`). We have no access to that account.

**That project is also the KeyFoby mobile app's live database.** So the scripts only add things:

- a private schema `website`;
- one function, `public.submit_website_lead`.

They never touch the app's tables, triggers, policies or extensions. A grep of all 36 app migrations found no name clash.

## Files

| File | What it does | Changes data? |
|---|---|---|
| `2026-11-07_01_website_leads.sql` | Creates everything (see below). Safe to run twice. | Adds only |
| `2026-11-07_01_website_leads_verify.sql` | Twelve checks; every row should say `true`. | No |
| `2026-11-07_01_website_leads_retention.sql` | Clean-up, **at least every 3 months** (the privacy policy promises it): a preview first, then a delete you run on purpose. Delete the matching Gmail notifications at the same time. | Only step 2 |
| `2026-11-07_01_website_leads_rollback.sql` | Removes it all. Refuses while any lead is stored. | Removes |
| `2026-11-10_02_lead_history.sql` (+ `_rollback`) | History log `website.lead_events`, `form_version` and empty job columns for the future app. **Run 2026-11-10.** | Adds only |
| `2026-11-10_03_lead_email.sql` | Optional customer `email` column, consent wording `2026-11-10` ("phone, text or email"), and the lead function accepting `email`. Must run **before** the website version with the email field goes live. | Adds only |

## What it creates

- **`website.leads`**: one row per quote request.
  - The request: key type, working key / all lost, year, make, model, ignition, town (or "somewhere else" plus a name), name, phone.
  - Ad source: page, UTM tags, gclid.
  - Consent proof: the wording version, its exact text (copied by the database, not sent by the browser), the time, and a `consent_withdrawn_at` field for when someone says stop.
  - Your workflow: `status` (a dropdown: new, quoted, booked, completed, lost, spam) and `owner_notes`.
  - A customer reference: `KF-1001`, `KF-1002` and so on, always increasing. Gaps can appear when a bad request is rejected.
- **`website.towns`**: the 10 towns. Change the list here, no code needed.
- **`website.consent_versions`**: every consent wording the form has used. To change the wording, add a new row; never edit an old one.
- **`website.settings`**: holds only the SHA-256 fingerprint of the secret password, never the password.
- **`public.submit_website_lead(secret, lead)`**: the only way in.
  - It needs the secret, which will live only on Vercel.
  - It accepts only known fields and validates everything: phone (stored as `+1…`), year 1980 to next year, town in the list, consent ticked, known consent version.
  - Same form attempt sent twice (a double click, or a retry after a network error): it returns the lead it already has, so you never get duplicates. If the visitor changed any detail before re-sending, it is saved as a new lead.
  - Flood limits:
    - at most 3 requests per phone number in 10 minutes;
    - after 20 requests in an hour, new ones are still saved, but you get one "unusual number of quote requests" email instead of one email each;
    - after 200 in an hour, new ones are refused.

    A spam wave can't fill your inbox, use up the email quota, or silently block real customers.

**Who can see leads:** only you, in the dashboard (Table Editor → schema `website` → `leads`). The public key and the app's signed-in users have no access.

**Tested** in real Postgres 18 (PGlite) with Supabase's roles stubbed:
- 51 SQL checks for setup, validation, permissions, rate limit, verify script and re-runs, all passing.
- 54 end-to-end checks through the Vercel function (`api/lead.ts`), using Cloudflare's real Turnstile test keys and a simulated Resend, all passing.
- The rollback, the retention script, and re-running over an older draft of the table, all passing.

One thing a single-connection test cannot prove is two requests arriving at the very same instant. The database uses locks for that. We'll check it on the Vercel preview against your real Supabase.

Supabase runs Postgres 15 or 17, and every feature used works on both.

## How to run it

1. Supabase dashboard → project `grytdgpmewmxbdimpgrr` → **SQL Editor** → New query. Paste all of `2026-11-07_01_website_leads.sql` → **Run**. It ends with `commit`, so either everything is created or nothing is.
2. **Make the secret on your Mac** (Terminal):

   ```bash
   SECRET=$(openssl rand -hex 32); printf %s "$SECRET" | pbcopy
   ```

   The secret is now on your clipboard. Paste it into your password manager as "KeyFoby LEAD_INGEST_SECRET". It goes into Vercel later.
3. **Print its fingerprint** in the same Terminal window:

   ```bash
   printf %s "$SECRET" | shasum -a 256 | cut -d' ' -f1
   ```

4. Back in the SQL editor, run this, pasting the **64-character fingerprint**, not the secret:

   ```sql
   insert into website.settings (key, value)
   values ('ingest_secret_sha256', 'PASTE_THE_64_CHARACTER_HASH_HERE')
   on conflict (key) do update set value = excluded.value, updated_at = now();
   ```

5. Run `2026-11-07_01_website_leads_verify.sql`. All 12 rows should say `true`.
6. **Security Advisor** will show two expected notices:
   - 0028: anon can execute a SECURITY DEFINER function (`submit_website_lead`).
   - 0008: RLS enabled with no policy, on `website.*`.

   Both are intentional: a password-protected entry point, and a schema closed to the public by default.

If something fails halfway, nothing is left behind, because the script runs in one transaction. Send me the error text.

## What still has to happen before leads arrive (Phase 4)

- The **Vercel function** `api/lead.ts` is built and tested. It checks the form and the Cloudflare Turnstile bot check, calls `submit_website_lead`, then emails you the lead through Resend. It goes live with the new form. Account and key setup is in `docs/LEAD_SETUP.md`.
- **Form changes in the new design:**
  - Consent wording is the stored version `2026-11-10` ("…by phone, text or email…"), plus a link to the privacy policy for the mailing address.
  - The photo field is replaced by "Send a photo on WhatsApp", unless you want photo storage (decision below).
  - The make/model split in the picker must handle two-word makes.
- **Privacy policy:** the website section is drafted in `docs/legal/PRIVACY_WEBSITE_SECTION.md` (a few items to confirm). It goes live with the form.
- The live (old) form keeps sending email through EmailJS until the new site ships. It is not wired to this table.
- Optional: copy this migration into the app repo's `supabase/migrations` so the database history stays in one place.
