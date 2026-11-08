# KeyFoby: how the site is connected, and the Firebase → Vercel move

Checked 2026-11-07, read-only. Five readers mapped the code, docs, live site and DNS, and one skeptic per area re-checked each claim. I then re-checked the claims that matter here: DNS, redirects, 404s, env var names, `scripts/build.js` and the mobile app's legal links. Nothing in Firebase, Vercel, Supabase or DNS was changed. No secret values were printed.

Where this differs from Phase 0 (`docs/PHASE0_PLAN.md`, `docs/baseline/`), this file is current.

## 1. How it is connected today

keyfoby.com has **no server of its own.** It is a static Next.js export (`next.config.ts` `output: "export"`): plain files in `out/`, served by Firebase Hosting. Everything "backend" happens in the visitor's browser, which talks to outside services directly.

```
Visitor's browser ──► www.keyfoby.com (Firebase Hosting site key-foby, static files only)
   │
   ├─ Quote form ──► EmailJS (api.emailjs.com) ──► email to the inbox set in the EmailJS dashboard
   │                 (the only lead path; leads are NOT stored anywhere)
   ├─ Quote form ──► POST /api/intake ──► 404 (dead: the route is never deployed)
   ├─ Service list ─► Supabase grytdgpmewmxbdimpgrr, read-only, table service_types (anon key)
   ├─ Make/model ──► NHTSA vPIC (public, no key; fallback make list if it's down)
   ├─ Analytics ───► Firebase Analytics G-BVYSXDGWQL (project key-foby)
   │                 + gtag: GA4 G-BDZE2T9HR0 and Google Ads AW-17289404018
   └─ Widgets ─────► Elfsight Google reviews, Google Maps embed, WhatsApp links
```

| Piece | Where it runs | Status | What the move needs |
|---|---|---|---|
| **EmailJS** (lead delivery) | browser | Live; delivery not tested (that would send a real email) | Set the 3 `NEXT_PUBLIC_EMAILJS_*` vars in Vercel **before the first build**. If they're missing, every lead fails. If EmailJS has a domain allowlist, add the Vercel hosts. |
| **Supabase** `grytdgpmewmxbdimpgrr` | browser, read-only (`service_types`) | Live | Set the 2 `NEXT_PUBLIC_SUPABASE_*` vars, with the **same values**. Nothing else. |
| **Firebase Analytics** (project `key-foby`) | browser | Live, every page | Set the 7 `NEXT_PUBLIC_FIREBASE_*` vars. It doesn't depend on Firebase Hosting, so it keeps working on Vercel. |
| **gtag** (GA4 + Ads) | browser | Live, every page | IDs are hard-coded, so they move as is. (The page-load Ads conversion is still on and still awaits your answer from the Truth Table.) |
| NHTSA, Elfsight, Maps, WhatsApp | browser | Live | No change. Elfsight may have a domain allowlist (not verified). |
| **`/api/intake` + `automation/`** (OpenAI) | would be server | **Not deployed.** `scripts/build.js` moves `app/api` aside during the build. | Must stay off. See section 3. |
| Newsletter (`NewsletterSignup.tsx`, `AppPromo.tsx`) | — | Dead code, not in the build | None. |

**Keys:** only public-by-design keys ship: the Supabase anon key, the Firebase web key and the EmailJS public key. No service-role key, OpenAI key or owner token appears in `out/`, the build cache or git history (re-checked). The local `.env` holds 15 names: the 12 `NEXT_PUBLIC_*` above, plus `OPENAI_API_KEY`, `OPENAI_MODEL` and `AUTOMATION_OWNER_TOKEN`, which must **not** go to Vercel.

### Hosting and DNS today

- **Registrar and DNS:** Namecheap (NS `dns1/dns2.registrar-servers.com`).
- **Apex** `keyfoby.com`: A `199.36.158.100` (Firebase). Firebase 301s it to `https://www.keyfoby.com`.
- **www:** CNAME `key-foby.web.app` (Firebase site `key-foby`, project `key-foby`).
- **app.keyfoby.com:** CNAME `app-keyfoby.web.app`. This is a **separate Firebase site** (`app-keyfoby`) in the **same** project `key-foby`, built from `/Users/shajeed/Coding/Projects/NextJS/app-keyfoby` (local only, no git remote).
- **Email:** Namecheap forwarding: 5 MX `eforward1–5.registrar-servers.com`, plus SPF TXT. No DKIM or DMARC.
- **Other TXT:** apex `hosting-site=key-foby` (Firebase verification), and `_acme-challenge` (apex only).
- **Deploys:** by hand from this laptop with `firebase deploy`. No CI, no previews. Every deploy dirties the tracked `.firebase/hosting.b3V0.cache`.
- **Behaviour to keep:** clean URLs (`/warranty`), no trailing slash (`/warranty/` → `/warranty`), real 404 for unknown paths, apex → www.

### The two apps that share this backend (new since Phase 0)

1. **KeyFoby mobile app** (React Native/Expo, `/Users/shajeed/Coding/Projects/React Native/keyfobyapp`, GitHub `Tekmadev/keyfobyapp`). Its whole backend (accounts, Google sign-in, transactions, inventory) is the **same Supabase project** the website reads, with the **same anon key**.
   - Its sign-up screens open `https://keyfoby.com/privacy-policy` and `/terms-of-service` (`AuthScreen.tsx:211,217`, `CompleteProfileScreen.tsx:132,138`).
   - A `BEFORE INSERT ON auth.users` trigger reads `newsletter_subscribers` (migration 024). Dropping that table would break **every app sign-up**.
2. **app.keyfoby.com landing**: Firebase site `app-keyfoby`, same Firebase project.

So: **any Supabase change "for the website" is a change to the mobile app's live database.** The hosting move itself needs no Supabase change at all.

## 2. Rules for the move (what must not break)

1. Change **only two DNS records**: apex A and www CNAME. Keep NS at Namecheap. Leave MX, SPF, the `app` CNAME and TXT, `hosting-site`, and `_acme-challenge` alone. Vercel may ask for one extra `_vercel` TXT to prove ownership.
2. Apex → www stays a permanent redirect **that keeps the path**, because the mobile app links to `keyfoby.com/privacy-policy`.
3. `/privacy-policy` and `/terms-of-service` keep their URLs **and their app content** until the app's legal text has a new home.
4. Firebase project `key-foby` **never** gets deleted. It still runs the website's analytics and app.keyfoby.com. Retirement means a 301 release on **`--site key-foby` only**. Never a bare `hosting:disable`, and never anything on `app-keyfoby`.
5. Supabase: no change for the move. Same anon key value. Never put a service-role key in Vercel.
6. `/api/intake` stays off (section 3).
7. Firebase stays live as the rollback for at least 7 days after cutover. Its www certificate stops renewing once www points at Vercel (current cert runs to about 30 Dec 2026), so retire it before then.

## 3. The `/api/intake` trap

The quote form already POSTs every lead (name, email, phone, vehicle, message) to `/api/intake`. On Firebase that 404s. The route is kept out of the build only by `scripts/build.js`, which runs when the build command is `npm run build`.

If the Vercel build ever runs plain `next build` (for example `npm run export`, a dashboard override, or dropping `output: "export"` later for Phase 4), the route either breaks the build or **goes live**. Every real lead would then go to OpenAI with no auth, rate limit or durable store.

For the move:
- Keep `output: "export"`.
- Pin the build command to `npm run build`.
- Don't set `OPENAI_API_KEY` or `AUTOMATION_OWNER_TOKEN` in Vercel.
- Fix the two package.json scripts that bypass `build.js` (`export`, and `deploy`, which also calls the removed `next export`).

Deleting the route, `automation/` and the client POST is the real fix. That falls under the **deletion gate** and needs your go.

## 4. Plan

**Recommended order:** move the current site as is first (a static lift-and-shift, same files on a new host). The new design then ships later to the same Vercel project through a staging preview. This keeps the hosting risk apart from the redesign risk, and it gives Phase 4 preview links for staging sign-off.

| Step | What | Who | Gate |
|---|---|---|---|
| 0 | **Vercel plan.** Your Vercel account (`tekmadev`, team `tekmadev-8959s-projects`) is on **Hobby**, which is non-commercial only. Upgrade to Pro (a trial is available) or create a Pro team. The same team also holds other business sites (capitaldrywall, silverbackdetail.com, stoneworksinterlock.com, jokerburger, fixible.ca, dessertshot.ca), so the same rule applies to them. | You (billing) | Your call |
| 1 | **Repo prep PR** (branch `chore/vercel-prep`, built and reviewed 2026-11-07; see section 6). | Me | PR review (commit/push only on your say) |
| 2 | **Create the Vercel project** in the Pro team, linked to GitHub `Tekmadev/keyfoby` (previews on every PR). **Merge step 1 first**, so the first production build already has `vercel.json`. Add the **12** `NEXT_PUBLIC_*` vars to Production and Preview, piped from `.env` so no value is printed. **Not** the OpenAI or automation vars. | Me, with your go | Your go |
| 3 | **Preview check** on the `*.vercel.app` URL: clean URLs, slash redirects (Vercel uses 308; also permanent), 404s, headers, sitemap, robots, ads.txt, the legal pages, the service list from Supabase, analytics firing (no headless loads of production; preview only). One real test lead to confirm EmailJS delivery, if you OK sending one; check the EmailJS and Elfsight allowlists. | Me, you for the dashboard checks | — |
| 4 | **Add domains** `keyfoby.com` + `www.keyfoby.com` to the project, apex → www permanent. Lower the apex A and www CNAME TTL to 300 at Namecheap **≥ 24 h before** cutover. | You (Namecheap), me (Vercel) | — |
| 5 | **DNS cutover:** apex A → Vercel's IP, www CNAME → Vercel's target (values from the Vercel domain screen). Verify HTTPS, redirects, the form and the mobile app's legal links, then watch for 72 h. **Rollback:** put the two old records back (`199.36.158.100`, `key-foby.web.app`). | You (Namecheap), me (checks) | **DNS cutover go** |
| 6 | **Retire Firebase Hosting for the website**, ≥ 7 days after a clean cutover and before about 30 Dec: deploy a 301-to-www release to `--site key-foby` only, so `key-foby.web.app` copies redirect. Leave project `key-foby`, site `app-keyfoby` and Firebase Analytics alone. Then remove `.firebase/` from git, update `DEPLOYMENT.md`, and drop the `hosting-site` TXT later. | Me, with your go | **Firebase shutdown go** |

Effort on my side: about a day of work for steps 1–3, then mostly waiting (TTL, the 72 h watch, the 7-day hold).

## 5. Found along the way (not blockers for the move)

- **Leads are stored nowhere.** If EmailJS fails or hits its quota, the lead is lost. Phase 4 already plans a stored lead with an owner alert. That table must not touch the mobile app's tables (or the website gets its own Supabase project).
- **The EmailJS auto-reply could be abused as a relay** if it sends to `{{email}}`, because the IDs are public. Check the template settings in the EmailJS dashboard.
- **The same OpenAI key** is in this repo's `.env` and in `keyfoby-ai/.env`. Rotating one breaks the other.
- **The Terms page** the website's quote form links to is the app's Terms ("the App" ×56). Fixing it needs the app's legal text moved first (rule 3).
- **The service dropdown** filters `is_active` only, so app-archived rows could appear in it.
- **No consent banner:** tags load before any consent. This belongs to the Phase 4 privacy work.
- **Doc drift:** `DEPLOYMENT.md` and `FIREBASE_SUBDOMAIN_SETUP.md` are stale (SPA rewrite, `trailingSlash: true`, a wrong site ID). Don't follow them during cutover.

## 6. Step 1: what the prep PR changes (branch `chore/vercel-prep`)

- **`vercel.json`**: `framework: null` (Vercel's static "Other" preset, so the Next.js builder never runs and nothing can become a Function), `buildCommand: "npm run build"` (always via `scripts/build.js`, which hides `app/api`), `outputDirectory: "out"`, `cleanUrls: true` and `trailingSlash: false`, the same URL rules as Firebase. Vercel answers the slash and `.html` redirects with 308, where Firebase gives 301; both are permanent. Headers:
  - `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` and `X-Frame-Options: SAMEORIGIN` on everything. The last two are new; nothing frames the site today.
  - 1-year immutable cache on `/_next/static/*`, which is content-hashed.
  - 7 days plus stale-while-revalidate on `/images/*`. These are **not** hashed, so Firebase's 1-year immutable rule risked stale images; this change is deliberate.
  - HTML uses Vercel's default, which is purged on every deploy, instead of Firebase's 1 h.
  - `ads.txt` keeps text/plain and a 1-day cache.
  - The font CORS rule is dropped, because fonts are same-origin.
- **`.vercelignore`**: `.env*`, the Firebase files, `app/api`, `automation`. Vercel's CLI skips `.env.local` by default but **not** `.env`, so a laptop deploy would otherwise upload the OpenAI key.
- **`package.json`**:
  - `engines.node: 22.x`.
  - The `export` script now runs `npm run build`; before, it ran bare `next build`, which skipped the `/api` guard.
  - The broken `deploy` script (`next export`, removed from Next) is gone. `deploy:all` (Firebase) stays for rollback.
- **Next 16.0.7 → 16.4.5**, plus `npm audit fix`; all bumps are minor or patch.
  - 12 production advisories down to 4. The 4 left are high, all in Firebase's Firestore gRPC code, which the site never loads. They clear when Phase 4 drops the Firebase SDK, or with a major Firebase bump.
  - Total built JS: 470 → 354 KB gzipped.
- **`app/not-found.tsx`**: the 404 page now has its own title, `noindex, follow` and no canonical. Before, it inherited the homepage's `index, follow` and canonical next to Next's own `noindex`.

**Checked locally:**
- All 5 pages have the same visible text and JSON-LD as the live build.
- A clean-URL static server returns 200 for every page, 404 for unknown paths, and redirects `/warranty/` and `/warranty.html`.
- In-site navigation works, with no failed asset requests.
- A clean `npm ci` + build without `app/api`, `automation` or `.env` also passes.
- Three independent reviews (config parity, `/api` safety, code/deps) found no blockers.

### Preview checklist (step 3; only a real Vercel deploy can confirm these)

- [ ] Build log: Framework "Other", Node 22.x, Next 16.4.5, `Temporarily excluded app/api` / `Restored app/api`, and exactly **1 Function: `api/lead`** (once the lead PR is in; 0 before). Never `app/api/intake`.
- [ ] Environment variables: only the 12 `NEXT_PUBLIC_*` names.
- [ ] `/`, `/warranty`, `/privacy-policy`, `/terms-of-service`: 200. `/warranty/`, `/warranty.html`, `/index.html`: a single 308. `/nope`: 404 with the KeyFoby 404 page.
- [ ] `GET` and `POST /api/intake`: 404 (or 405), never 200, no function headers.
- [ ] RSC files (`/warranty/__next._tree.txt`): 200 text/plain. Prefetch from `/` shows no 404s.
- [ ] Headers as in section 6; check HSTS on `*.vercel.app` and, after cutover, on www.
- [ ] `sitemap.xml`, `robots.txt`, `ads.txt`, `favicon.ico`, web manifest are served with the right types.
- [ ] Service dropdown loads from Supabase. Analytics requests fire (preview only, never a headless run on production).
- [ ] One test lead via EmailJS, only with your OK. EmailJS and Elfsight allowlists include the new hosts.
