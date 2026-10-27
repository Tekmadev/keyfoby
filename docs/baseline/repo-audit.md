# Repo audit (code)

Observed 2026-10-26 (local; live checks 2026-10-27 00:20–00:30 UTC), method: read-only review of `master` @ `6c6a9af`, inspection of the existing `out/` build, `curl` against the live site, `tsc --noEmit`. Nothing built, installed or edited. Secrets referred to by variable name only.

---

## 0. Ten-line summary

1. Next 16.0.7 App Router, `output: "export"`, built with **Turbopack** (the webpack `splitChunks` config is dead). Live site = byte-identical to `out/` = current `master`.
2. **Fabricated reviews are live in JSON-LD**: `aggregateRating 5.0/47` on every page (`lib/business-data.ts:362-368` via `app/layout.tsx:138-143`), and 3 named 5-star `Review` objects in the homepage JSON-LD (`LocalBusinessSchema`, imported only by `app/page.tsx:4,27`), which the `**` rewrite also serves on every soft-404 URL. The repo's own doc calls them fake (`SEO_STRATEGY.md:30`).
3. The quote form sends via **EmailJS from the browser only**. No server validation, no spam protection, no stored copy of the lead. `/api/intake` is never served in production.
4. **The quote form can't be submitted when NHTSA vPIC is down.** It returned 503 "Maintenance" during this audit, and Make is required with no manual fallback.
5. **Two GA4 properties** (`G-BDZE2T9HR0` via gtag, `G-BVYSXDGWQL` via the Firebase SDK) plus one Ads account. An Ads conversion fires on **every page load**, and each form submit fires 3 more.
6. The homepage ships **about 1.18 MB raw / about 339 KB gzip of JS**, about 2× the brief's 170 KB budget. The ContactForm deps chunk alone is 420 KB raw.
7. Static HTML shows 6 Suspense "Loading..." placeholders. The real section content sits in `<div hidden>` until JS swaps it in. FAQ answers appear only in JSON-LD.
8. Firebase `**` → `/index.html` rewrite: every unknown URL returns 200 with the homepage (soft 404s, broken manifest icons). `trailingSlash` conflicts: canonicals and the sitemap point to URLs that 301.
9. The Privacy Policy and Terms describe the **SaaS mobile app**, not the locksmith website, yet the quote form makes visitors accept those Terms.
10. `tsc` is clean (0 errors). `npm run lint` and `npm run deploy` are broken under Next 16.

---

## 1. Stack

### 1.1 Versions

| Package | package.json | Installed (`node_modules/*/package.json`) | npm latest (2026-10-27) |
|---|---|---|---|
| next | ^16.0.7 | 16.0.7 | 16.4.3 |
| react / react-dom | ^19.0.0 | 19.1.0 | 19.3.1 |
| tailwindcss / @tailwindcss/postcss | ^4.1.10 | 4.1.10 | 4.3.3 |
| motion | ^12.19.1 | 12.19.1 | 14.6.0 |
| firebase | ^11.9.1 | 11.9.1 | 13.1.0 |
| @supabase/supabase-js | ^2.86.0 | 2.86.0 | 2.118.0 |
| @emailjs/browser | ^4.4.1 | 4.4.1 | n/c |
| @tanstack/react-query | ^5.90.11 | 5.90.11 | n/c |
| @tabler/icons-react | ^3.34.0 | 3.34.0 | n/c |
| libphonenumber-js | ^1.12.9 | 1.12.9 | n/c |
| typescript | ^5 | 5.8.3 | n/c |
| Node (local) | n/a | v22.12.0 | n/a |

Also listed: `@tailwindcss/cli` (in dependencies, unused), `clsx`, `tailwind-merge`. Not installed: ESLint, `firebase-tools` (a global CLI is assumed by `deploy:all`), zod. No `.github/` directory, so no CI in the repo.

### 1.2 `next.config.ts`

| Line | Setting | Effect |
|---|---|---|
| 5 | `output: "export"` | Static HTML into `out/`. Route handlers that use `POST` or request data can't run. |
| 8–10 | `images.unoptimized: true` | `next/image` emits a plain `<img>`, with no resizing or AVIF/WebP. |
| 16 | `trailingSlash: true` | Emits `/warranty/index.html` and links to `/warranty/`. **Conflicts with `firebase.json` `trailingSlash: false`** (§7.6). |
| 19 | `compress: true` | No effect with export. |
| 23–30 | `compiler.removeConsole` (production, keeps error and warn) | |
| 33–71 | `webpack` `splitChunks` (vendor / framework / common) | **Dead.** Next 16 builds with Turbopack by default: `out/_next/static/chunks/turbopack-f6cb5f1b9a48e4b2.js` exists, and `next build --help` lists `--webpack` as opt-in. |
| 81 | `turbopack: {}` | Silences the "webpack config with Turbopack" error. |

### 1.3 `firebase.json` (affects routing and SEO)

`public: out`, `rewrites: ** → /index.html` (L5–10), `cleanUrls: true`, `trailingSlash: false` (L12–13), `errorDocument: 404.html` (L14; never reached because of the catch-all rewrite), cache headers (1 year `immutable` on js/css/images by extension, so images with unhashed names never refresh). `.firebaserc` → project `key-foby`. `.firebase/hosting.b3V0.cache` is committed to git (deploy cache).

### 1.4 Scripts (read, not run)

| Script | Does | Status |
|---|---|---|
| `build` → `scripts/build.js` | Deletes `.next/` (L65–67), renames `app/api` → `_api_excluded` (L69–72), runs `next build`, restores on exit or SIGINT/SIGTERM/SIGHUP and recovers a leftover backup on start (L36–58). | Works, but **moves source files**. A SIGKILL leaves `app/api` missing until the next run. |
| `export` | `next build` (without the move) | Would include `app/api`, which is incompatible with export. |
| `deploy` | `next build && next export` | **Broken**: `next export` was removed (the Next 16 CLI has no such command). |
| `deploy:all` | `npm run build && firebase deploy` | Needs a global firebase-tools. |
| `lint` | `next lint` | **Broken**: removed in Next 16, and no ESLint is installed. |
| `verify` → `scripts/verify-build.js` | Checks 6 paths in `out/` (incl. unused `images/carkey.webp`). Prints a fixed "✅ No server-side dependencies" line whatever it finds. | Cosmetic only. |

### 1.5 Routes

| Route | File | Type | Built |
|---|---|---|---|
| `/` | `app/page.tsx` | server page | yes |
| `/privacy-policy` | `app/privacy-policy/page.tsx` (1,177 lines) | server | yes |
| `/terms-of-service` | `app/terms-of-service/page.tsx` (1,229 lines) | server | yes |
| `/warranty` | `app/warranty/page.tsx` (725 lines) | server | yes |
| 404 | `app/not-found.tsx` | client | `out/404.html` (`noindex`) |
| `POST/GET /api/intake` | `app/api/intake/route.ts` | route handler | **excluded** by `build.js` |
| `GET /api/intake/[id]` | `app/api/intake/[id]/route.ts` | route handler | **excluded** |

No `sitemap.ts`, `robots.ts`, middleware, or OG image routes. `public/sitemap.xml` and `public/robots.txt` are static.

### 1.6 Homepage tree (render order)

```
app/layout.tsx (server)  <html lang="en-CA">
  <head> dns-prefetch + preconnect fonts.googleapis/gstatic (pointless: next/font self-hosts Geist)
         preload /images/herobannerKF.webp (emitted twice in out/index.html)
  <body> JSON-LD #1 Locksmith (businessData.seo.schema)            layout.tsx:138-143
         AnalyticsProvider (client, Firebase Analytics)             layout.tsx:144
           app/page.tsx (server)
             LocalBusinessSchema (client) → JSON-LD #2-6            page.tsx:27
             NavBar (client) → ui/resizable-navbar (client, motion) page.tsx:28
             <main>
               Hero (client, IconCheck)                             page.tsx:30
               Suspense(Loading...) Services (server, lazy)         :31-33
               Suspense(Loading...) Features (server, lazy)         :34-36
               Suspense(Loading...) AppPromo (client, motion)       :37-39
               Suspense(Loading...) GoogleReviews (client, Elfsight):40-42
               Suspense(Loading...) FAQSection (client)             :43-45
               Suspense(Loading...) ContactFormWrapper (client)     :46-48
                 QueryClientProvider → ContactForm → CarSelector
               Suspense(null) Footer (server)  ← inside <main>      :49-51
         next/script gtag.js?id=AW-17289404018 (afterInteractive)  layout.tsx:148-151
         next/script inline gtag config (afterInteractive)          layout.tsx:152-165
```

`"use client"` count: **14 files** (13 under `app/` + `hooks/useServiceTypes.ts`). Client: AnalyticsProvider, AppPromo, CarSelector, ContactForm, ContactFormWrapper, FAQSection, GoogleReviews, Hero, LocalBusinessSchema, NavBar, NewsletterSignup (orphan), ui/resizable-navbar, not-found. Server: layout, page, 3 legal pages, Services, Features, Footer.

Dead code: `NewsletterSignup.tsx` (imported nowhere), `NavbarLogo`/`NavbarButton` in `resizable-navbar.tsx:246-301` (an Aceternity demo `<img src="https://assets.aceternity.com/logo-dark.png" alt="logo">` at L252-254), `trackQuoteRequest`, `trackEmailClick`, `trackServiceView`, `trackGoogleAdsPageView` (`lib/analytics.ts`), `businessData.serviceOptions`, `businessData.tagline` (only in a JSX comment, Hero.tsx:58-61), `public/file.svg|globe.svg|window.svg` (create-next-app leftovers, still deployed).

### 1.7 What ships as client JS (`out/index.html`, gzip -9 measured locally)

16 `async` module scripts + 1 `noModule` polyfill. **React.lazy doesn't defer them**: every chunk is referenced in the HTML because the lazy sections are server-rendered and hydrated.

| Chunk | Raw B | gz B | Contents (string evidence) |
|---|---|---|---|
| 12f39a79a0019d25.js | 419,600 | 105,279 | supabase-js (GoTrue, realtime), @emailjs, libphonenumber, react-query, NHTSA, Maps embed URL, `/api/intake/` |
| 94bde6376cf279be.js | 213,852 | 67,053 | react-dom |
| b7fb678b240e2bc9.js | 109,702 | 36,021 | framer-motion |
| e78c916902b24873.js | 86,592 | 21,714 | Next client runtime (inferred: `__next` strings) |
| d1574d369488d1cf.js | 84,127 | 22,618 | Next client runtime (inferred) |
| 7f6091eb6a2b4c5a.js | 45,791 | 15,576 | motion `useScroll` (navbar) |
| 613b071b434482da.js | 45,398 | 14,507 | Firebase app + analytics + installations (`G-BVYSXDGWQL`) |
| 35ac768940c1115f.js / 3f2cbef1354d0dd6.js | 33,949 ×2 | 12,184 ×2 | Tabler icons + `businessData` incl. FAQ text: **near-duplicate chunks** |
| a6cab1c384844ee5.js | 31,951 | 8,416 | Elfsight loader, AppPromo, LocalBusinessSchema (fake review text is in JS too) |
| others (6: 247eb132, e9929ae9, 70f2a386, turbopack-f6cb…, 03ed8baa, ff1a16fa) | 74,652 | 23,241 | Turbopack runtime, page |
| **Module total** | **1,179,563** | **≈338,794** | excludes polyfill |
| a6dad97d9634a72d.js (noModule) | 112,594 | 39,393 | polyfills (legacy browsers only) |

CSS: `10755e39a1c02a91.css` 91,342 B. HTML: 135,003 B (24,842 gz). Hero image `herobannerKF.webp` 157,614 B is actually **JPEG** data (`file` output) with a `.webp` name, served as `image/webp`. The OG image `keyfobykeys.png` is 1,886,266 B, 1024×1024, but declared as 1200×630 (`layout.tsx:87-88`).

---

## 2. Data sources (all runtime calls happen in the browser; the build makes no data fetches except next/font)

| Source | Called from | When | Loading UI | Failure UI | Observed |
|---|---|---|---|---|---|
| Supabase REST `service_types` (`grytdgpmewmxbdimpgrr.supabase.co`, anon key) | `hooks/useServiceTypes.ts:29` → `lib/supabase.ts:183-187` | ContactForm mount | `<select disabled>` "Loading services..." (`ContactForm.tsx:707`). The SSR HTML already lists the 12 fallback options. | Silent fallback to `fallbackServiceTypes` (`lib/supabase.ts:159-172`) | HTTP 200, 12 rows, same names as the fallback (`Other` order 12 vs 99). **Supabase does nothing here that a static list couldn't.** |
| Supabase `newsletter_subscribers` | `lib/supabase.ts:34-106` | never (NewsletterSignup is an orphan) | n/a | n/a | Not present in the built JS |
| NHTSA vPIC `GetMakesForVehicleType/{car,van,truck,mpv}` ×4 + `GetModelsForMakeYear` | `lib/nhtsa.ts:99-243` via `hooks/useCarData.ts` | after a Year is picked | "Loading makes..." / "Loading models..." (`CarSelector.tsx:183,305`) | Make errors are swallowed per type → **empty list, no message** (`nhtsa.ts:118-121`). Models: "Error loading models. Try manual entry instead." (`CarSelector.tsx:315-318`) | **503 "vPIC API application is currently undergoing Maintenance"** at 2026-10-27 00:24 UTC. `fetchMakesForYear` ignores the year (`nhtsa.ts:164-169`). `cacheTime` is a v4 option name and is ignored in v5 (`useCarData.ts:21`). |
| EmailJS `api.emailjs.com` | `ContactForm.tsx:405-410` | on submit | "Sending..." spinner | "Sorry, there was an error sending your message. Please try calling us directly." (`:453-455`) | Not exercised (it would send a real email) |
| `/api/intake/` (same origin) | `ContactForm.tsx:412-416` | on submit, in parallel | none | `console.warn` only (`:419-426`) | Live GET returns 200 + homepage HTML (the Firebase rewrite). POST not tested. **Never reaches automation code.** |
| Firebase JS SDK (Analytics, webConfig + installations) | `lib/firebase.ts:15-51`, `AnalyticsProvider.tsx` | window load → requestIdleCallback | n/a | n/a | measurementId `G-BVYSXDGWQL` (in the built chunk 613b071) |
| gtag.js (Ads `AW-17289404018`, GA4 `G-BDZE2T9HR0`) | `layout.tsx:148-165` | afterInteractive | n/a | n/a | Whether they fire: not verified here (browser track) |
| Elfsight Google Reviews widget `8e58cda1-9372-4ac0-954e-927b5ca5d3a7` | `GoogleReviews.tsx:95-106` | IntersectionObserver, then `lazyOnload` | "Loading reviews..." with 5 pulsing stars (`:73-92`) | The placeholder **stays forever** if the script is blocked | Boot API 200: app `google-reviews`, source place ID `ChIJ9RaHaNli04URoLQMcbf5stI`, layout `carousel`, **`filterMinRating: 4`** (shows only 4–5★). Not crawlable. Place ID not verified to be KeyFoby's GBP. |
| Google Maps embed iframe | `ContactForm.tsx:1029-1040` | IntersectionObserver | "Map loading..." (`:1063`) | none | Embed `pb=` targets the **"Greater Toronto Area"** place, not the business or Hamilton |
| wa.me / m.me links | `NavBar.tsx:96,123-127`, `Footer.tsx:47`, `ContactForm.tsx:471` | click | n/a | n/a | Uses `wa.me/+19054676860` (WhatsApp documents the number without `+`). **Messenger button builds `https://m.me/#`** because `social.facebook` is `"#"` (`business-data.ts:108`): a broken link. |

---

## 3. Quote / contact form end to end

### 3.1 Fields (`ContactForm.tsx`, `CarSelector.tsx`)

| Field | Required | Validation (client only) |
|---|---|---|
| Name | yes | non-empty |
| Email | yes | regex + typo hints for gmail/yahoo/hotmail/outlook (`:137-181`), with a fake 300 ms "validating" delay |
| Phone | yes | `libphonenumber-js` `isValidPhoneNumber(…,"CA")` (`:184-212`), 500 ms fake delay; placeholder "(416) 123-4567" |
| Service | yes | from `service_types` (internal jargon: "Add Key", "Key Sell", "Diagnosis & Open") |
| Ignition type | yes | radio "Key Start" / "Push Button Start" (`sr-only` inputs; `required` only on the first) |
| Year / Make / Model | yes ×3 | Year static 1990–2027. Make comes **only from NHTSA, no manual entry**. Model has a manual-entry toggle once a Make is chosen. |
| Message | yes | non-empty |
| Terms checkbox | yes | "I have read and agree to the Terms of Service and Warranty Policy" (`:837-858`) |

The submit button stays disabled until all of the above pass (`isFormValid`, `:50-64`). **There is no photo upload, no postcode or location field, and no "locked out now?" fast path.**

### 3.2 Flow

1. Submit → re-check the email regex and phone (`:322-345`).
2. `Promise.allSettled([emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY), fetch("/api/intake/")])` (`:404-417`). Env names: `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`.
3. EmailJS params: name, email, phone, phone_clean, service, ignitionType, vehicleInfo, vehicleYear/Make/Model, message, date, time (`:386-400`).
4. Owner notification: the EmailJS template. Repo copy is `email-template.html` ("New KeyFoby Contact Request"). The recipient address is set in the EmailJS dashboard and **is not in the repo, so unverified**. Customer auto-reply: `customer-auto-reply-template.html`; whether it's enabled in EmailJS is unverified.
5. Success → "Thank you! We'll get back to you within 2 hours." (`:438`), the form resets, and these fire: Firebase `contact_form_submit` + **3 Ads conversions** (`pbByCMvq…`, `eKQgCNfq…`, `aXiECNTq…`) (`:433-436`).
6. EmailJS failure → error message. **The lead is lost**: nothing is stored anywhere.

### 3.3 Gaps vs brief Phase 4

| Requirement | Today |
|---|---|
| Server-side validation (zod) | none; browser to EmailJS directly |
| Honeypot / Turnstile / rate limit | none. EmailJS public key is in the client (by design). Whether the EmailJS domain allowlist is on is unverified. |
| Supabase insert, anon insert-only | none; the lead isn't persisted |
| CASL consent text | none. The only checkbox accepts Terms that describe the **mobile App** (`terms-of-service/page.tsx:119-121`). No privacy notice at the form. |
| Privacy disclosure | The Privacy Policy covers "our mobile application (the 'App')" (`privacy-policy/page.tsx:115-121`) and says "The App does NOT use cookies (it's a mobile app, not a website)" (`:920-921`). It doesn't mention EmailJS, GA4, Google Ads, Firebase Analytics, Elfsight, Google Maps or OpenAI. |
| Owner email/SMS | EmailJS email only (config unverified); no SMS |
| Resilience | **The form is blocked whenever NHTSA is down** (observed 503) |

### 3.4 NewsletterSignup and AppPromo

| Component | Status | Behaviour / claims |
|---|---|---|
| `NewsletterSignup.tsx` | **Orphan**: imported nowhere, not in the built JS | Would do a Supabase select-then-insert/update on `newsletter_subscribers` (`lib/supabase.ts:52-91`). The commented SQL grants anon `UPDATE … USING (true)` (`:232-234`): any visitor could rewrite any row. Copy: "Join 100+ locksmiths waiting for the launch" (`:132`). No consent text. Belongs to app.keyfoby.com. |
| `AppPromo.tsx` | Rendered on the homepage | Static, `motion` whileInView, link to `https://app.keyfoby.com`. Claims: "Coming Soon" (:45), "Early Access: 50% OFF for 4 Months!" (:81), "$50 → $25/mo, First 4 months • Limited time" (:110-121), "iOS & Android" (:226), **"4.9 Rating"** (:235) for an unreleased app, and mock stats "12 jobs / $2.4K / Honda Civic key jobs up 40%" (:173-195). Uses 7 emoji as icons. |

---

## 4. `automation/` + `app/api/intake`

| Item | Finding |
|---|---|
| Purpose | Intake pipeline (added in `b7417d1`, 2026-03-13). Catalogue-based feasibility (`decisionEngine.ts`), keyword urgency and same-day heuristics, "pricing readiness" (never quotes; catalogue has no prices), and an AI-drafted reply email stored for owner review. `emailService.ts` and `calendarService.ts` are stubs that return `ok:false`. |
| AI provider | **OpenAI Responses API** `https://api.openai.com/v1/responses` (`emailDraftAgent.ts:120`), model `OPENAI_MODEL` defaulting to `gpt-4o-mini` (`:90`). Falls back to a template when the key is missing or the call errors. The full payload (name, email, phone) goes into the prompt (`:104-105`). |
| Env var names | `OPENAI_API_KEY`, `OPENAI_MODEL`, `AUTOMATION_OWNER_TOKEN` (all set in local `.env`; not `NEXT_PUBLIC_`; absent from `out/` and `.next/static`; `.env` was never committed) |
| Storage | In-memory `Map` on `globalThis`, capped at 500 (`intakeStore.ts:23-58`). **Not durable**, and on serverless every instance has its own store, so the owner `GET` endpoints would return near-empty lists. |
| Auth | `GET` owner endpoints require `Authorization: Bearer $AUTOMATION_OWNER_TOKEN` (`route.ts:11-17`), checked with a plain string comparison. `POST` is public, with **no rate limit or captcha, and it triggers an OpenAI call** (a cost-abuse vector if ever hosted). |
| Runs under `output: export`? | **No.** `build.js` moves `app/api` out before building (`build.js:69-72`). In production the form's `fetch("/api/intake/")` hits the Firebase `**` rewrite (a GET returns 200 + homepage HTML). |
| Callers | Only `ContactForm.tsx:412`. `AUTOMATION_API.md` also mentions a future React Native or owner app. |
| Type debt | `[id]/route.ts:17` types `params` synchronously (`{ params: { id: string } }`), which Next 16 rejects in build-time route validation. Commit `4d157e8`'s message claims this was fixed, but that commit only touched `package.json` + `scripts/build.js`. The fix exists only on the unmerged branch `origin/claude/seo-aeo-geo-optimization-x5ql9p` (`82bc1d0`). |

---

## 5. Third-party scripts and IDs

| Script | Where | Strategy | IDs (public) |
|---|---|---|---|
| gtag.js | `layout.tsx:148-151` | `afterInteractive` (+ auto `<link rel=preload>`) | loader id `AW-17289404018` |
| Inline gtag config | `layout.tsx:152-165` | `afterInteractive` | `config AW-17289404018`; **`event conversion send_to AW-17289404018/xI8ECM7q0ZEcEPK8nbRA` on every page load** (:160); `config G-BDZE2T9HR0` (added `0866c64`, 2026-06-29) |
| Firebase Analytics SDK (bundled) | `lib/firebase.ts`, `AnalyticsProvider.tsx` | on window load + requestIdleCallback | project `key-foby`, measurementId **`G-BVYSXDGWQL`** (`.env` and built chunk 613b071), app ID in env (not printed) |
| Elfsight platform.js | `GoogleReviews.tsx:97-101` | on intersection + `lazyOnload` | widget `8e58cda1-9372-4ac0-954e-927b5ca5d3a7` |
| Google Maps embed | `ContactForm.tsx:1030` | on intersection, `loading="lazy"` | GTA place `0x882b2a1d7471156d:0x4ecad8e272e4c2a2` |
| next/font Geist + Geist Mono | `layout.tsx:8-20` | self-hosted woff2, `preload:false` | n/a |

Ads conversion labels in `lib/analytics.ts:18-32`: `xI8ECM7q0ZEcEPK8nbRA` (page view, but fired inline, not via the helper), `pbByCMvq0ZEcEPK8nbRA` (lead form), `eKQgCNfq0ZEcEPK8nbRA` (contact), `aXiECNTq0ZEcEPK8nbRA` (request quote).

**Duplicates and double counting**
- Two GA4 properties receive page views: `G-BDZE2T9HR0` (gtag) and `G-BVYSXDGWQL` (Firebase).
- Inside `G-BVYSXDGWQL`, page views are counted up to 3 ways: the SDK's automatic `page_view`, a manual `page_view` "KeyFoby Landing Page" (`AnalyticsProvider.tsx:29`), and another `page_view` "Page Return" on **every tab refocus** (`:44-47`).
- Custom events (`phone_click`, `whatsapp_click`, `contact_form_submit`, `navigation_click`) go **only to the Firebase property**, never to `G-BDZE2T9HR0`.
- `phone_click` is tracked only on the desktop navbar number (`NavBar.tsx:194`, hidden below `lg`). Hero "Call Now", FAQ call, mobile menu call, contact block, 404 and warranty `tel:` links are untracked. There's no call conversion in Ads.
- Brief Phase 4 says "same measurement ID": **which property holds the history is ambiguous.** Only code dates are known: Firebase Analytics code since 297881a (2025-06-28), but the ID `G-BVYSXDGWQL` is not in git (it is in the untracked `.env` and the webConfig; `FIREBASE_ANALYTICS_SETUP.md:40` has only the placeholder `G-XXXXXXXXXX`); gtag `G-BDZE2T9HR0` in code since 0866c64 (2026-06-29), deploy date unverified. The client must read each property's creation date and data range in GA4 Admin (Truth Table #10).

---

## 6. Claims + NAP inventory (exact strings)

R = rendered visibly; S = structured data / meta only; T = email template; N = not rendered.

### 6.1 Hours / availability

| String | File:line | R/S |
|---|---|---|
| `"Mon-Fri: 8AM-6PM"` | lib/business-data.ts:27 → ContactForm.tsx:988 (contact block shows weekdays only; Sat omitted) | R |
| `"Sat: 9AM-4PM"`, `"Sun: Closed"`, `"24/7 Emergency Service Available"` | lib/business-data.ts:28-30 | N |
| `"KeyFoby – Car Key Fob & Locksmith Services Hamilton, ON \| 24/7"` (title) | lib/business-data.ts:187 | S |
| `"KeyFoby – Hamilton's Car Key & Locksmith Experts \| 24/7 Service"` (OG/Twitter) | lib/business-data.ts:269 | S |
| `"24/7 Mobile Service"` | Hero.tsx:91 | R |
| `"24/7 Emergency Service"` | Hero.tsx:191 | R |
| `"24/7"` + `"Support Available"` | business-data.ts:101 → Features.tsx:141-144 | R |
| `"24/7 Service"` listed under **"Coming Soon"** (contradicts the 24/7 claims) | business-data.ts:118 → Footer.tsx:105-117 | R |
| FAQ: "Do you provide 24/7 emergency lockout services?" "Yes. KeyFoby offers 24/7 emergency car lockout services…" | business-data.ts:129-131 | R (question) / S (answer) |
| `openingHours: ["Mo-Fr 08:00-18:00", "Sa 09:00-16:00"]` | business-data.ts:301 | S |
| `openingHoursSpecification` Mon–Fri 08:00–18:00, Sat 09:00–16:00 | LocalBusinessSchema.tsx:36-49 | S |
| Offer "24/7 Emergency Car Lockout Service" / "Around-the-clock…" | LocalBusinessSchema.tsx:89-91; business-data.ts:348 | S |
| ContactPoint `hoursAvailable` Mon–Sun, "Emergency service available 24/7" | LocalBusinessSchema.tsx:293-305 | S |
| ToS "Support Hours" Mon–Fri 8:00 AM–6:00 PM **EST**, Sat 9:00 AM–4:00 PM EST, Sun Closed | terms-of-service/page.tsx:1112-1131 | R |
| `Hours: Mon-Fri 8AM-6PM, Sat 9AM-4PM` | customer-auto-reply-template.html:304 | T |

### 6.2 Ratings / reviews

| String | File:line | R/S |
|---|---|---|
| `aggregateRating ratingValue "5.0", reviewCount "47"` | business-data.ts:362-368 (all pages, via layout); LocalBusinessSchema.tsx:132-138 (home) | S |
| **Fabricated reviews**: "Sarah Johnson" ("…back on the road in 30 minutes…"), "Mike Thompson" (BMW), "Amanda R." ("…Sunday night… within 25 minutes") | LocalBusinessSchema.tsx:140-174 (also in client JS chunk a6cab1c) | S |
| Repo admits it: "Reviews Schema: Fake reviews for demonstration (replace with real ones)" | SEO_STRATEGY.md:30 | doc |
| `"5-Star Service"` | Hero.tsx:172 | R |
| `"5-Star Rated"` | GoogleReviews.tsx:47 | R |
| `"Verified customers"` | GoogleReviews.tsx:136 | R |
| `"4.9 Rating"` (on the App mock-up) | AppPromo.tsx:235 | R |

### 6.3 Service area

| String | File:line | R/S |
|---|---|---|
| 10 cities: Hamilton, Burlington, Oakville, Mississauga, Brampton, Toronto, Ancaster, Dundas, Stoney Creek, Grimsby | business-data.ts:249-260 (`localSeo.serviceArea` → LocalBusinessSchema `areaServed` City ×10), 305-316 (`schema.areaServed`) | S |
| Same 10, each with a detail ("Primary service hub, fastest response" / "Same-day service available" / "Mobile service available") | Services.tsx:3-14 | R |
| "Serving Hamilton, Burlington, Oakville, and Greater Toronto Area with same-day solutions." | Services.tsx:53-55 | R |
| FAQ "What areas do you serve?" → 10 cities | business-data.ts:144-146 | R/S |
| FAQ 24/7 answer: "Hamilton, Burlington, Oakville, Mississauga, and the Greater Toronto Area" | business-data.ts:131 | S |
| "We serve Hamilton and the Greater Toronto Area" + GTA map + 6-city list (Hamilton…Toronto) | ContactForm.tsx:1021, 1031, 1070-1095 | R |
| OG description "…across Hamilton, Burlington, Oakville & GTA" | business-data.ts:271 | S |
| Schema description "Serving Hamilton, Burlington, Oakville, Mississauga, Brampton, Toronto…" | business-data.ts:283; LocalBusinessSchema.tsx:12 | S |
| Sitemap image caption "…across Hamilton, Burlington, Oakville, and the GTA" | public/sitemap.xml:24 | S |
| 8 city keywords (Burlington…Grimsby) | business-data.ts:222-229 | S (meta keywords) |
| "Serving Hamilton & Greater Toronto Area" | customer-auto-reply-template.html:324 | T |

### 6.4 NAP + identity

| Item | String | File:line | R/S |
|---|---|---|---|
| Phone | `+1 (905) 467-6860` | business-data.ts:12-13 → NavBar.tsx:211,270; ContactForm.tsx:972; tel: links Hero.tsx:121, FAQSection.tsx:84, NavBar.tsx:193,253, not-found.tsx:118, warranty/page.tsx:471,652, privacy:1047, terms:1068 | R |
| Phone | `(905) 467-6860` | FAQSection.tsx:101; business-data.ts:126,131,189,271; LocalBusinessSchema.tsx:215; email-template.html:476; customer-auto-reply-template.html:289 | R/S/T |
| Phone | `905-467-6860` | ContactForm.tsx:821 (placeholder) | R |
| Phone | `+1-905-467-6860` | business-data.ts:285; LocalBusinessSchema.tsx:277,289 | S |
| WhatsApp | `+19054676860` | business-data.ts:15; lib/analytics.ts:62; auto-reply:310 (`wa.me/19054676860`) | link |
| `tel:` href format | `tel:+1 (905) 467-6860` (spaces and parentheses) | built index.html (×4) | link |
| Phone history | 905 → **438-797-7776** on 2026-01-11 (`49dd58b`) → 905 on 2026-08-28 (`f746758`). Citations or GBP may still carry 438. | git | n/a |
| Street address | `40 Courtland Ave, Hamilton, ON L9B 1X6` | business-data.ts:16-22, 289-295; LocalBusinessSchema.tsx:21-28, 280-286 | S |
| Street address (visible) | from `businessData.contact.address` | privacy-policy/page.tsx:1063-1067; terms-of-service/page.tsx:1084-1088 | R (legal pages) |
| Street address (visible on home) | city only, `"Hamilton"` | ContactForm.tsx:1010 | R |
| Street address | same | customer-auto-reply-template.html:299, 337 | T |
| Geo | `43.2557, -79.8711` | business-data.ts:262-263, 297-299 | S. **Reverse-geocodes to Main St W, Durand (downtown, L8P).** OSM puts 40 Courtland Ave at 43.2171, -79.9139 (Falkirk East), about 5 km away. Mismatch. |
| Email | `keyfoby@gmail.com` | business-data.ts:14, 286; LocalBusinessSchema.tsx:278; lib/analytics.ts:69; privacy:770-838,1031; terms:1052; warranty:671; templates | R/S/T |
| legalName | `"KeyFoby"` | business-data.ts:5 | S. BRAND_BRIEF.md:10 says "KeyFoby Inc". |
| foundingDate | `"2022"` | business-data.ts:287; LocalBusinessSchema.tsx:16 | S |
| Languages | `availableLanguage: ["English", "French"]` | LocalBusinessSchema.tsx:292 | S |
| sameAs | facebook.com/keyfoby, instagram.com/keyfoby, twitter.com/keyfoby | business-data.ts:369-373; LocalBusinessSchema.tsx:176-180, 307-311 | S (accounts unverified) |
| Visible Facebook link | `href="#"` | business-data.ts:107-110 → Footer.tsx:34 | R (dead) |
| Twitter handle | `@KeyFoby` | layout.tsx:100-101 | S |
| Logo in schema | `keyfobykeys.png` (a key photo, not the KF mark) | LocalBusinessSchema.tsx:274 | S |

### 6.5 Trust, guarantee, stats

| String | File:line | R/S |
|---|---|---|
| `"Licensed & Insured"` | Hero.tsx:75, 159; Services.tsx:62 ("🛡️ Licensed & Insured") | R |
| "Verified locksmith services with proper licensing and insurance coverage." | business-data.ts:94 → Features.tsx | R |
| FAQ "Is KeyFoby licensed and insured?" → "Yes… fully licensed and insured… All technicians are trained and certified… backed by our satisfaction guarantee." | business-data.ts:164-166 | R (Q) / S (A) |
| "…Licensed & insured. Call (905) 467-6860." (meta description, 175 chars) | business-data.ts:189 | S |
| "licensed and insured automotive locksmith" (schema description) | business-data.ts:283; LocalBusinessSchema.tsx:12 | S |
| "A certified technician cuts and programs…" | LocalBusinessSchema.tsx:233 | S |
| "licensed, insured" sitemap caption | public/sitemap.xml:24 | S |
| `"100+"` "Keys Made" | business-data.ts:100 → Features.tsx:133-137 | R |
| `"100%"` "Satisfaction Guaranteed" | business-data.ts:102 → Features.tsx:149-152 | R |
| "100% Satisfaction" / "Guaranteed service" | GoogleReviews.tsx:157-158 | R |
| "Fast Response" / **"15-min average"** | GoogleReviews.tsx:179-180 | R |
| "Hamilton's Premier Key Specialists" | Services.tsx:52 | R |
| "Hamilton's trusted car key replacement & locksmith experts" | business-data.ts:189 | S |
| "Hamilton Ontario's trusted automotive locksmith" | LocalBusinessSchema.tsx:276 | S |
| "We combine cutting-edge technology with trusted craftsmanship…" | Features.tsx:98-99 | R |
| "Custom engraving, color options, and personalized key chains available." | business-data.ts:84 | R |
| "Your trusted local key fob specialists… key services for cars and homes." | Footer.tsx:28-29 (also email-template.html:473) | R |
| "Hamilton's #1 Key Fob & Locksmith Specialists" | customer-auto-reply-template.html:336 | T |
| "Licensed & Insured Professionals", "Same-Day Service Available", "100% Satisfaction Guarantee" | customer-auto-reply-template.html:320-323 | T |
| `© 2025 KeyFoby. All rights reserved.` | Footer.tsx:125; terms-of-service/page.tsx:1220 | R |
| "Developed By Tekmadev" → tekmadev.com | Footer.tsx:127-136 | R (keep) |
| Scope conflict: warranty "**We Only Work On Key Fobs, Not Cars**". Excludes ignition, door locks, trunk latch. | warranty/page.tsx:527-600 | R. Conflicts with "Emergency Lockout", "Broken Key Extraction", "Immobilizer" and "cars and homes". |

### 6.6 Prices, times, warranty

| String | File:line | R/S |
|---|---|---|
| "…typically costs between $50 and $400… Basic cut keys start around $50, transponder keys range from $100–$200, and proximity smart keys… $200–$400." | business-data.ts:126 | S (FAQ answer, hidden until opened) |
| HowTo `estimatedCost` CAD 50–400, `totalTime PT45M` | LocalBusinessSchema.tsx:204-210 | S |
| "Receive an upfront price quote with no hidden fees." | LocalBusinessSchema.tsx:227 | S |
| `priceRange: "$$"` | business-data.ts:302; LocalBusinessSchema.tsx:17 | S |
| Payment "cash, all major credit cards (Visa, Mastercard, American Express), debit cards, and e-transfer… after service" | business-data.ts:176; schema `paymentAccepted` 304 | S |
| "Get Free Quote" / "Get Your Free Quote" | Hero.tsx:103; ContactForm.tsx:482-485 | R |
| App pricing "$50" → "$25/mo", "50% OFF for 4 Months" | AppPromo.tsx:81, 110-121 | R |
| "Most key duplications completed within 15-30 minutes." | business-data.ts:79 → Features.tsx | R |
| "Most key programming… 15 to 45 minutes… transponder… 15–20… proximity… 30–45" | business-data.ts:141 | S |
| "Most services are completed in 15–45 minutes." | LocalBusinessSchema.tsx:233 | S |
| "Emergency lockout calls are typically handled within 30 minutes." / "within a few hours of booking" | business-data.ts:171 | S |
| "Same-Day Service" | Hero.tsx:79 | R |
| "Thank you! We'll get back to you within 2 hours." | ContactForm.tsx:438 | R (post-submit) |
| "…contact you within 2 hours (during business hours)" | customer-auto-reply-template.html:257 | T |
| "We typically reply within 2 hours." | automation/ai/emailDraftAgent.ts:33, 98 | N |
| Warranty "3 months" / "3-month warranty" | warranty/page.tsx:8, 10, 77, 127; terms-of-service/page.tsx:529, 536 | R |
| "3-month warranty… within 90 days… repair or replace it at no additional charge" | business-data.ts:181 | S |
| Legal "Last updated" dates | privacy & terms `December 5, 2025` (:21); warranty `January 10, 2026` (:21) | R |

---

## 7. SEO plumbing (from the built HTML in `out/`, which is identical to live)

### 7.1 Per page

| Page | Title (chars) | Description (chars) | Canonical | OG |
|---|---|---|---|---|
| `/` | "KeyFoby – Car Key Fob & Locksmith Services Hamilton, ON \| 24/7" (62) | "Hamilton's trusted… Call (905) 467-6860." (**175**) | `https://www.keyfoby.com/` | og:title 63, og:description 237, image `keyfobykeys.png?v=2025` declared 1200×630 (actual 1024×1024, 1.9 MB) |
| `/privacy-policy/` | "Privacy Policy \| KeyFoby Automotive Locksmith Hamilton" (54) | (154) | `/privacy-policy/` → **301** | inherits the homepage og:url/title/description (wrong) |
| `/terms-of-service/` | "Terms of Service \| KeyFoby Automotive Locksmith Hamilton" (56) | (133) | `/terms-of-service/` → **301** | inherited (wrong) |
| `/warranty/` | "3-Month Service Warranty \| KeyFoby Automotive Locksmith Hamilton" (64) | (139) | `/warranty/` → **301** | inherited (wrong) |
| 404 | the homepage title | the homepage description | homepage | `noindex` |

`<meta name="keywords">` holds 42 terms (business-data.ts:190-244). robots meta is `index, follow` plus googleBot max-snippet/max-image-preview (layout.tsx:33-43).

### 7.2 JSON-LD

| Page | Blocks | Types |
|---|---|---|
| `/` | 6 | `Locksmith` (layout, `openingHours` strings) + `[Locksmith, LocalBusiness]` (component, `openingHoursSpecification`): **two business entities, no `@id`**, both with the fake `aggregateRating`. Plus `FAQPage` (12 Q&A), `HowTo` (rich result retired), `WebSite` with `SearchAction` → `/#contact?q={search_term_string}` (no site search exists), `Organization` (logo = key photo). |
| legal pages, 404 | 1 | `Locksmith` from layout, including `aggregateRating 5.0/47` |

### 7.3 Headings

| Page | H1 | H2 | Notes |
|---|---|---|---|
| `/` | 1: "Lost Keys? Need a Spare? We've Got You.." (no keyword, double full stop, gradient text) | 6: Professional Key Fob & Locksmith Services in Hamilton · Why Choose KeyFoby · Introducing KeyFoby App · What Our Customers Say · Frequently Asked Questions · Get Your Free Quote | Footer `h3/h4` are inside `<main>` |
| `/privacy-policy` | 1 | 12 (emoji-prefixed, e.g. "📋 1. Introduction") | App-focused content |
| `/terms-of-service` | 1 | 16 (emoji-prefixed) | App-focused content |
| `/warranty` | 1: "Service Warranty Policy" | 9 (emoji-prefixed) | |
| 404 | 1: "4 0 4" | 1 | |

### 7.4 Images / alt

Each page has 3 `<img>`, all `/images/KeyFoby-logo/keyfobylogo.svg` with alt "KeyFoby Logo" (NavBar.tsx:47-53, 67-73; Footer.tsx:15-21). The hero is a CSS `background-image` (Hero.tsx:27-34), so it has no alt and no `<img>` LCP. The orphan Aceternity `<img alt="logo">` isn't rendered. `carkey.webp` (actually PNG, 1.98 MB) is unused but listed in the sitemap. `keyfobylogo.ai` (227 KB Illustrator source) is publicly deployed.

### 7.5 Emoji used as icons (file: line(emoji))

- NavBar.tsx: 33(📱 in the "📱 App" nav label)
- Services.tsx: 61(🔧 🚗 📱) 62(⚡ 🛡️)
- AppPromo.tsx: 65(📊) 66(🤖) 67(📅) 68(📦) 79(🎉) 187(🤖) 224(✓) 233(⭐)
- ContactForm.tsx: 596(✓) 685(✓)
- NewsletterSignup.tsx (orphan): 115, 227(🎉) 161(✓)
- privacy-policy/page.tsx: 60+ instances, e.g. 32(🔒) 113(📋) 143(📊) 211(💰) 263(🏢) 321(🎯) 394(🔐) 523(🔗) 703(⚖) 906(🍪) 1013(📞) 1057(📍)
- terms-of-service/page.tsx: 55+ instances, e.g. 32(📜) 117(🤝) 155(👤) 303(⚡) 357(💾) 516(🛡) 597(🔧) 777(🚪) 1113(⏰)
- warranty/page.tsx: 70+ instances, e.g. 32(🛡) 66(📋) 71(🕒) 133(🔑) 138(🔓) 178(💧) 183(🔨) 198(🔋) 203(🚗) 213(🏪) 417(📞) 489(📸) 528(🔧)
- Email templates: 📞 💬 📧 📘 🚗 ⚡ 🔧 ✅ (customer-auto-reply-template.html:270-333)

### 7.6 Crawlability and technical issues (verified)

| Issue | Evidence |
|---|---|
| 6 visible "Loading..." Suspense fallbacks; real section HTML sits in `<div hidden id="S:0…6">` and is swapped in by inline `$RC()` scripts | `out/index.html`: `<template id="B:0…6">` ×7, `$RC(` ×7. Cause: `React.lazy` + `Suspense` in `app/page.tsx:7-51`. |
| FAQ answers not in visible HTML (accordion renders the answer only when open) | FAQSection.tsx:68-74. The answer text appears once in `index.html`, inside the JSON-LD. |
| Reviews: "Loading reviews..." only; Elfsight renders client-side in a carousel | GoogleReviews.tsx:89 |
| **Soft 404s**: `/does-not-exist/`, `/api/intake/` and `/android-chrome-192x192.png` all return 200 with the 135,003-byte homepage | curl. Cause: firebase.json `rewrites ** → /index.html` |
| Manifest icons broken | site.webmanifest:9, 15 point to `/android-chrome-*.png` at the root; the files are under `/images/KeyFoby-logo/favicons/` |
| Trailing-slash conflict | Sitemap and canonicals use `/privacy-policy/`; live returns **301 → `/privacy-policy`**. Internal links mix both forms (`/warranty/` and `/warranty` in the same page). |
| Duplicate hosts | `https://key-foby.web.app/` and `https://key-foby.firebaseapp.com/` return 200 with the identical homepage (canonical tag mitigates) |
| Sitemap `lastmod` 2025-06-10 on all 4 URLs (stale; the SEO commit was 2026-06-10) | public/sitemap.xml:8, 31, 39, 47 |
| robots.txt `Crawl-delay: 1` (:8); blocks AhrefsBot, MJ12bot, SemrushBot (:52-59). This blocks third-party SEO audits of our own site. | public/robots.txt |
| Live response headers on `/`: only HSTS (`max-age=31556926`, no includeSubDomains); no CSP, X-Frame-Options, Referrer-Policy; `nosniff` absent on `/` (the firebase.json rule matches `**/*.html` only) | `curl -sI https://www.keyfoby.com/` |

---

## 8. Live vs repo parity

| Check | Result |
|---|---|
| `git log -1` | `6c6a9af` 2026-09-03 03:38:30 UTC "fix: make build script restore app/api even when interrupted"; `master` == `origin/master` after `git fetch` |
| Working tree | clean, apart from untracked `KEYFOBY_REVAMP_BRIEF.md` and `docs/` |
| `out/` mtime | 2026-09-03 11:12:47 EDT (15:12:47 UTC) |
| Live `last-modified` | Thu, 03 Sep 2026 15:12:54 GMT (Fastly `cache-yyz`, Firebase Hosting) |
| md5 `out/index.html` vs live `/` | both `0f6c38bb82d258c40b1084c7d9c05e2e` (**identical**) |
| md5 `out/privacy-policy/index.html` vs live | identical (`3b5aa207…`) |
| Chunks `12f39a79…`, `613b071b…` | identical md5 |
| Distinctive strings (live / out) | `We&#x27;ve Got You..` 1/1 · `+1 (905) 467-6860` 2/2 · `40 Courtland Ave` 2/2 · `Early Access: 50% OFF for 4 Months!` 1/1 · `"ratingValue":"5.0","reviewCount":"47"` present in both |
| Verdict | **Live = the build of current `master`.** Source files touched after the commit (6 files, mtime 11:12 EDT) have no diff against HEAD. |
| app.keyfoby.com | 200, separate Next build titled "KeyFoby App - Business Management for Locksmiths \| Coming Soon", Fastly/Firebase headers, last-modified 2025-12-19. **Not in this repo.** `APP_MIGRATION_GUIDE.md` describes a separate project `keyfoby-app-landing` (no such sibling folder exists locally) with suggested Firebase site ID `keyfoby-app`. This repo's `firebase.json` has no `site`/`target`, so it deploys to the default site of `key-foby`. Whether app.keyfoby.com is in the same Firebase project is unverified (infra track). |

---

## 9. Existing repo docs

| File | Last commit | One line | Still accurate? |
|---|---|---|---|
| README.md | 2025-06-24 | create-next-app boilerplate ("Deploy on Vercel") | No. Says nothing about this project. |
| SEO_STRATEGY.md | 2025-08-20 | "SEO Domination Strategy" checklist | No. Claims H1 "Hamilton's #1 Key Fob…" (:19) and emoji in meta (:9). **Admits fake review schema (:30).** |
| BRAND_BRIEF.md | 2026-08-28 | Brand, services, area, hours, NAP, warranty summary | Partly. It mirrors the unverified site claims; "Legal name: KeyFoby Inc" (:10) differs from the site. |
| NEW_PROJECT_PROMPT.md | 2026-08-28 | Cursor prompt to build the app.keyfoby.com landing (Next 14, Firebase) | Historical; about a different project |
| APP_MIGRATION_GUIDE.md | 2026-01-10 | How `/keyfoby-app` moved to a separate project; DNS at **Namecheap** | Mostly. The route was removed and AppPromo links out. Useful evidence that the registrar or DNS is Namecheap (unverified). |
| SEPARATION_COMPLETE.md | 2026-01-10 | Checklist of the same separation | Same as above; its checkboxes were never updated |
| AUTOMATION_API.md | 2026-03-13 | Intake API spec, env names, owner auth | Accurate as code, but the endpoint **isn't deployed anywhere** |
| DEPLOYMENT.md | 2025-06-24 | Build and Firebase deploy guide | No. Uses `npm run deploy` (`next export`, removed); predates build.js. |
| EMAILJS_SETUP.md | 2025-06-24 | EmailJS account, template and env setup | Roughly yes (same env names) |
| FIREBASE_ANALYTICS_SETUP.md | 2025-06-28 | Firebase Analytics env and events | Yes for Firebase. Silent on the later gtag GA4 property (double tracking). |
| FIREBASE_SUBDOMAIN_SETUP.md | 2026-01-10 | Steps to add app.keyfoby.com as a Firebase site + Namecheap DNS | Unverified whether this was followed |
| NHTSA_INTEGRATION.md | 2025-11-30 | NHTSA client, hooks, CarSelector | Yes. Doesn't cover the outage failure mode. |

---

## 10. Type health and tooling

| Check | Result |
|---|---|
| `./node_modules/.bin/tsc --noEmit --incremental false -p .` | **exit 0, 0 errors** (4.6 s). `strict: true`. |
| Caveat | `tsconfig.json` includes `.next/types/**` from the 2026-09-03 build, where `validator.ts` covers only the 5 page/layout files (app/api was excluded). Next's own build-time route validation of `app/api/intake/[id]` would flag the sync `params` (§4). |
| Lint | No ESLint installed; `next lint` doesn't exist in 16.0.7 |
| Minor | `useCarData.ts:21` `cacheTime` (v4 name) is ignored by react-query v5 |

---

## 11. Corrections and additions to brief §2

| Brief says | Repo/live shows |
|---|---|
| "Next.js (Turbopack)" | Confirmed (Turbopack runtime chunk). The webpack config is dead. |
| Firebase JS SDK "likely Analytics" | Confirmed: `firebase/app` + `firebase/analytics` only (no Auth, Firestore, Storage or Functions). It feeds a **second GA4 property `G-BVYSXDGWQL`**. |
| Reviews: "5-Star", "4.9 Rating" | The "4.9 Rating" is on the **App mock-up** (AppPromo.tsx:235), not the business. The JSON-LD also carries **3 fabricated named reviews**, not just a hard-coded aggregate. |
| Hours conflict | Confirmed, plus the footer lists "24/7 Service" as **Coming Soon** and ContactPoint claims 7-day 24/7. |
| "Reviews and map sections ship as Loading…" | Confirmed, and **all 6 lazy sections** render "Loading..." first (React.lazy/Suspense). |
| "FAQ answers not verified in HTML" | Verified absent from visible HTML; present only in FAQPage JSON-LD |
| "3 `<img>`" | Confirmed, all 3 are the logo |
| Sitemap = 4 URLs | Confirmed. All 3 non-root URLs 301, and lastmod is 2025. |
| robots.txt fine | It also blocks Ahrefs, Semrush and MJ12 |
| Not in the brief | Quote form blocked by NHTSA outages; leads not persisted; Ads conversion on every page view; soft 404s; Privacy and Terms are for the app; phone in source was 438-797-7776 from 2026-01-11 to 2026-08-28 (live during that window unverified); geo coordinates don't match the address; "cars and homes" and "key fobs only" contradict the lockout and extraction claims. |
