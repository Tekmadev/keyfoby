# Quote form backend: accounts and keys to set up

The new quote form works like this:

```
form → Vercel function api/lead.ts → Cloudflare Turnstile (bot check) → Supabase (stores the lead) → Resend (emails you)
```

The code is built and tested. These are the steps only you can do, because they need your accounts. **Never paste a secret into chat or into the code.** Secrets go only into Vercel's Environment Variables screen and your password manager.

## 1. Supabase: create the tables

Follow `db/supabase/README.md`. You run 1 script, make 1 secret on your Mac, paste its fingerprint, then run the check script (12 rows, all `true`).

- **Keep the secret itself** in your password manager as `LEAD_INGEST_SECRET`. It goes into Vercel in step 4.
- While you're in Supabase, note the **Region** (Project Settings → General). The privacy text needs it.

## 2. Cloudflare Turnstile: bot protection (free)

1. Create a free Cloudflare account at https://dash.cloudflare.com/sign-up. You don't need to move your domain or DNS to Cloudflare.
2. In the dashboard, open **Turnstile** → **Add widget**.
   - Name: `keyfoby quote form`.
   - Hostnames: `keyfoby.com`, `www.keyfoby.com`, and the Vercel preview domain once the project exists (for example `keyfoby.vercel.app`).
   - Widget mode: **Managed**.
3. Copy the two keys it shows:
   - **Site key**, which is public. It becomes `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
   - **Secret key**, which is private. It becomes `TURNSTILE_SECRET_KEY`.

## 3. Resend: emails to you (free plan: 3,000 a month, 100 a day)

1. Sign up at https://resend.com, preferably with keyfoby@gmail.com.
2. **Done 2026-11-10:** Resend verified the domain **`keyfoby.com`**, using records only on subdomains (`send`, `rsend`, `resend._domainkey`). The root MX/SPF records for Namecheap email forwarding are unchanged (checked with dig).
   - Use the `send.` subdomain, not `keyfoby.com` itself. That way your Namecheap email forwarding is never touched.
3. Resend shows a few DNS records: MX and TXT, or CNAME. **Add exactly those records at Namecheap**: Domain List → keyfoby.com → Advanced DNS → Add new record.
   - Their names all end in `send` (for example `send`, `resend._domainkey.send`).
   - Do **not** change or delete any existing record. Leave alone the 5 `eforward` MX records, the SPF TXT, `app`, `www` and `@`.
   - Then press **Verify** in Resend. It usually takes minutes, sometimes up to 72 hours.
4. **API Keys** → **Create**: name `keyfoby-website`, permission **Sending access**, domain `keyfoby.com`. Copy it. It becomes `RESEND_API_KEY`.

## 4. Vercel: environment variables (after the Vercel project exists)

Go to Project → Settings → Environment Variables. Use type **Sensitive** for every secret, and tick Production (and Preview if you want previews to send).

| Name | Value | Secret? |
|---|---|---|
| `LEAD_INGEST_SECRET` | the 64-character secret from step 1 | yes |
| `TURNSTILE_SECRET_KEY` | Turnstile secret key | yes |
| `RESEND_API_KEY` | Resend API key | yes |
| `LEAD_NOTIFY_TO` | `keyfoby@gmail.com` | no |
| `LEAD_NOTIFY_FROM` | `KeyFoby Web Query <leads@keyfoby.com>` | no |
| `LEAD_CONFIRM_FROM` | optional: address for the customer confirmation (shown as "KeyFoby"); defaults to the `LEAD_NOTIFY_FROM` address | no |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key | no (public) |

`NEXT_PUBLIC_TURNSTILE_SITE_KEY` is built into the page when Vercel builds the site. If you add or change it after a deploy, **redeploy**: until then the quote form shows "Online quote requests are switched off right now". To check a deploy, view the page source of the homepage and look for `data-sitekey="` followed by your site key (not `data-sitekey=""`).

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are already on the list of 12 to copy over. The function reuses them.

**Do not add** `OPENAI_API_KEY`, `OPENAI_MODEL` or `AUTOMATION_OWNER_TOKEN`.

For previews to work with real bot checks, add the preview hostname to the Turnstile widget (step 2).

## 5. Optional extra protection (Vercel Pro)

In Project → Firewall → **Rate limiting**, add a rule: path `/api/lead`, **5 requests per minute per IP**, action **Deny**. The database already limits floods, so this just stops them earlier.

## 6. First real test (on the preview, with your OK)

Send one test request from the preview. You should see:
- the success message with a `KF-…` reference;
- a row in Supabase (`website.leads`);
- an email in keyfoby@gmail.com.

Then set that row's status to `spam`, so the clean-up script deletes it.

## How the protections fit together

- **Cloudflare Turnstile** proves a person sent the form. The token must come from keyfoby.com and from the quote form, and Cloudflare's test keys are refused in production.
- **A hidden trap field** catches simple bots, which get a fake success and nothing is stored.
- **The database only accepts leads from our function,** using the secret, and checks every field.
- **Flood limits:**
  - 3 per phone number in 10 minutes;
  - over 20 an hour, leads are saved but you get one alert email instead of many;
  - over 200 an hour, new ones are refused.
- **The same request sent twice is saved once.**
- **If the email fails, the lead is still saved,** and a retry sends the email.
