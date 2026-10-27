# Security and infrastructure baseline

Observed 2026-10-26, method: read-only repo/git inspection, masked secret scans (source, `out/`, `.next/`, live JS, full `git log --all -p`), curl and dig against live hosts, headless Chrome network capture of `/`, read-only Firebase CLI, Vercel MCP and CLI GET, GitHub API GET. No files changed except this doc. Secret values are masked as first 4 chars + length.

## 0. Summary

| # | Finding | Severity | Evidence |
|---|---|---|---|
| 1 | No privileged secret in client code, build output, live JS or git history. Only public-by-design keys ship (Supabase anon, Firebase web key, EmailJS public key). | info | §2 |
| 2 | Supabase project `grytdgpmewmxbdimpgrr` is **not in the connected Supabase account**. RLS, policies and advisors could not be read. | high (gap) | §3 |
| 3 | Supabase Auth is open: sign-up enabled, email auto-confirm on, Google provider on. Anyone can get an `authenticated` session with the public anon key. | medium | §3 |
| 4 | Two GA4 properties collect on every load: `G-BDZE2T9HR0` (gtag) and `G-BVYSXDGWQL` (Firebase Analytics). Each got at least one `g/collect` 204 per load; event names and counts were not captured (`lighthouse.md`). | high (tracking) | §4 |
| 5 | Soft 404: every unknown path returns 200 + homepage (`**` rewrite). | high (SEO) | §7 |
| 6 | Trailing slash conflict: sitemap and canonicals use `/privacy-policy/`, which 301s to `/privacy-policy`. The canonical points at a URL that redirects. | high (SEO) | §7 |
| 7 | No CSP, X-Frame-Options, Referrer-Policy or Permissions-Policy on any HTML. HSTS is 1 year, no `includeSubDomains`/`preload`. | medium | §7 |
| 8 | `app/api/intake` (OpenAI drafts, owner token) is **not deployed**. `scripts/build.js` moves it out before export. On Vercel it would go live unless removed or hardened. | high (Phase 5) | §5, §9 |
| 9 | Vercel team `tekmadev-8959s-projects` is on the **Hobby** plan. No keyfoby project or domain exists. | high (Phase 5) | §8 |
| 10 | No CI/CD. Deploys are manual (`npm run deploy:all`) from this machine. | info | §9 |
| 11 | `app.keyfoby.com` is a separate local repo on Firebase site `app-keyfoby`, **in the same Firebase project `key-foby`**. | high (Phase 5) | §5 |
| 12 | No DMARC, no DKIM, no CAA, DNSSEC unsigned. Mail is Namecheap forwarding only. | low | §6 |

## 1. Environment variables

`.env` (gitignored, never committed, see §2d). Names only.

| Name | Public (`NEXT_PUBLIC_`) | Used at | In live JS |
|---|---|---|---|
| NEXT_PUBLIC_EMAILJS_SERVICE_ID | yes | app/components/ContactForm.tsx:94 | yes |
| NEXT_PUBLIC_EMAILJS_TEMPLATE_ID | yes | ContactForm.tsx:95 | yes |
| NEXT_PUBLIC_EMAILJS_PUBLIC_KEY | yes | ContactForm.tsx:96 | yes |
| NEXT_PUBLIC_FIREBASE_API_KEY | yes | lib/firebase.ts:5 | yes |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | yes | lib/firebase.ts:6 | yes |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | yes | lib/firebase.ts:7 | yes |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | yes | lib/firebase.ts:8 | yes |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | yes | lib/firebase.ts:9 | yes |
| NEXT_PUBLIC_FIREBASE_APP_ID | yes | lib/firebase.ts:10 | yes |
| NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (`G-BVYSXDGWQL`) | yes | lib/firebase.ts:11 | yes |
| NEXT_PUBLIC_SUPABASE_URL | yes | lib/supabase.ts:8 | yes |
| NEXT_PUBLIC_SUPABASE_ANON_KEY (JWT role=anon) | yes | lib/supabase.ts:9 | yes |
| OPENAI_API_KEY (`sk-p...`, len 164) | no | automation/ai/emailDraftAgent.ts:86 via `env()` at :9 | no |
| OPENAI_MODEL | no | emailDraftAgent.ts:90 | no |
| AUTOMATION_OWNER_TOKEN (len 64) | no | app/api/intake/route.ts:7, app/api/intake/[id]/route.ts:5 | no |
| NODE_ENV | n/a | next.config.ts:25 | n/a |

The three server-only values are not found in `out/`, `.next/` (including cache) or live JS (byte search, 0 hits). No deployed code uses them today (§5).

## 2. Secrets scan (masked)

| Scope | Result |
|---|---|
| (a) Source tree | `.env` only: Supabase JWT `{"role":"anon","ref":"grytdgpmewmxbdimpgrr","iss":"supabase"}`, `AIza...`(39), `sk-p...`(164), owner token. No secrets in tracked files. `automation/services/calendarService.ts:26` `accessToken` is a type field only. |
| (b) `out/`, `.next/static`, `.next/server` | Anon JWT + Firebase `AIza` key only. `sk-image-*` hits are Tailwind `mask-image` vars. `SUPABASE_SERVICE_ROLE_KEY` hit is a doc comment inside the supabase-js source map (`.next/server/chunks/ssr/_3d0fdc74._.js.map`). `password=` hits are library identifiers (`password=r.password`). |
| (c) Live JS (17 scripts + CSS from `https://www.keyfoby.com/`) | Same as (b): anon JWT in `12f39a79a0019d25.js`, Firebase key in `613b071b434482da.js`, EmailJS public IDs. Live `index.html` SHA-1 = local `out/index.html` (`0fe086e0…`); all 17 chunks byte-identical to `out/`. No source maps served. |
| (d) Git history (23 commits, all refs incl. `refs/pull/1/head`, 0 unreachable objects, 0 stashes) | No JWT, `service_role`, `sk_`, `sk-`, `AIza`, `private_key`, `BEGIN PRIVATE KEY`, EmailJS private/access key, SMTP or `password=` literal ever committed. Only the *names* `OPENAI_API_KEY`/`OPENAI_MODEL` (commit b7417d11). |
| `.env` ever committed? | No. `git log --all --full-history -- '.env*' '**/.env*'` is empty. `.gitignore` has `.env*`. |
| GitHub repo | `Tekmadev/keyfoby` is **private**. 0 workflows, 0 Actions secrets, 0 webhooks, 0 deployments (GitHub API GET). |

Public-by-design keys and what they allow:

| Key | Can do | Notes |
|---|---|---|
| Supabase anon JWT | See §3 | Safety depends entirely on RLS, which we could not read. |
| Firebase web `apiKey` | Fetch webConfig, Installations, Analytics | **No HTTP-referrer restriction**: `webConfig` returns 200 with `Referer: https://evil.example/`. Restrict to keyfoby.com and the APIs in use. |
| EmailJS public key + service + template | Send the contact template from any origin | No CAPTCHA, honeypot or rate limit in ContactForm.tsx (grep: none). EmailJS dashboard settings (domain allowlist, reCAPTCHA) not verifiable here. Spam or quota-burn risk. |

## 3. Supabase

| Item | Finding | Evidence |
|---|---|---|
| Client | `createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)` in the browser, null if env is missing | lib/supabase.ts:8-17 |
| Key type | anon (`role: anon`, `iss: supabase`, ref `grytdgpmewmxbdimpgrr`) | decoded JWT payload, claims only |
| `service_types` | `select * where is_active order by display_order` → useServiceTypes → ContactForm service dropdown; falls back to 12 hard-coded rows | lib/supabase.ts:175-201, hooks/useServiceTypes.ts |
| `newsletter_subscribers` | select by email, update, insert | lib/supabase.ts:52-91, 125-131. Only caller is `NewsletterSignup.tsx`, which **no page imports** (grep). Dead on the main site. |
| RPCs / storage / auth / edge functions | None called by the code | grep |
| Leads/PII | **Not stored in Supabase.** The contact form goes to EmailJS + `/api/intake/` (not deployed). | ContactForm.tsx:402-417 |
| MCP access | `list_projects` shows 3 other projects (Tekmadev App, Tekmadev, CMS). `get_project grytdgpmewmxbdimpgrr` → "You do not have permission". **`get_advisors`, `pg_policies`, `pg_class` RLS flags and grants were not run.** | Supabase MCP |

Anon probes (public anon key, HEAD with `Prefer: count=exact`, so no rows fetched):

| Path | Result | Reading |
|---|---|---|
| `/rest/v1/` (OpenAPI) | 401 "Only the service_role API key can be used" | Schema not listable by anon |
| `service_types` | 200, `content-range 0-11/12` | Public by design |
| `newsletter_subscribers` | 200, `*/0` | Either empty, or RLS hides rows (no SELECT policy). Cannot tell which without catalog access. |
| `leads`, `quotes`, `contacts`, `contact_submissions`, `intakes`, `customers`, `bookings` | 404 | Not in the exposed schema |
| `/storage/v1/bucket` | 200 `[]` | No buckets visible to anon |
| `/auth/v1/settings` | `disable_signup: false`, `mailer_autoconfirm: true`, providers `email`, `google` | Open self-sign-up. Anything granted to `authenticated` is effectively public. |

The comment SQL in lib/supabase.ts:227-234 creates `FOR UPDATE TO anon USING (true)` on `newsletter_subscribers`. If that was applied, a filter-less PATCH (no WHERE, no RETURNING) may let anon bulk-update every row. **Plausible, not tested** (it would be a write).

To close this gap, the owner must connect the Supabase account that owns `grytdgpmewmxbdimpgrr` (Truth Table #8), then run `get_advisors` (security + performance) and the read-only catalog queries.

## 4. Firebase

| Item | Finding | Evidence |
|---|---|---|
| Project | `key-foby` (display "KeyFoby", number 291646793044), resource location not specified | `firebase projects:list` |
| Web apps | 1 (`KeyFoby`, `1:291646793044:web:0d11…`) | `firebase apps:list` |
| Hosting sites | `key-foby` → www.keyfoby.com (+ apex redirect). `app-keyfoby` → app.keyfoby.com | `firebase hosting:sites:list` |
| Channels | `key-foby`: `live` only, last release 2026-09-03 11:12:54. `app-keyfoby`: `live` only, 2025-12-19 01:58:31. No preview channels. | `hosting:channel:list` |
| Firestore | "No databases found." | `firestore:databases:list` |
| Functions | `functions:list` failed (API probably not enabled). None evident. Cloud Functions need the Blaze plan, and the project looks like Spark (next row), so none can be deployed today | CLI |
| Billing plan | **Spark (inferred).** A reviewer's `firebase apphosting:backends:list` (2026-10-27 ~01:05 UTC) said the project "must be on the Blaze (pay-as-you-go) plan" | reviewer CLI output, not re-run |
| Realtime Database | "No database instances found" | reviewer's `firebase database:instances:list`, ~01:05 UTC, not re-run |
| Extensions | "there are no extensions installed on project key-foby". **Side effect:** that same call printed "missing required API firebaseextensions.googleapis.com. Enabling now...", so the Extensions API is probably now enabled on `key-foby` (no resources, no cost on Spark). Disable only on the client's go | reviewer's `firebase ext:list`, ~01:05 UTC, not re-run |
| Storage, Auth, Remote Config | **Not checked (TODO).** `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` is set, but the SDK imports no storage or auth module (next row). `gcloud services list --enabled --project key-foby` would settle which APIs are on, but the local gcloud credentials are expired (`invalid_grant`, 2026-10-27 01:24 UTC, with `CLOUDSDK_PYTHON=/usr/bin/python3` 3.9.6). Client to read them in the console, or re-auth gcloud | gcloud, this revision |
| JS SDK | `firebase/app` + `firebase/analytics` only. No auth, firestore, storage or messaging imports. Live traffic: `webConfig`, `firebaseinstallations`, GA collect. | lib/firebase.ts:1-2, lib/analytics.ts:2, network capture |
| Analytics init | Deferred to `load` + `requestIdleCallback`. `AnalyticsProvider` fires its own `page_view` at idle (2 s timeout), often before analytics exists, so custom events can drop. | lib/firebase.ts:20-50, AnalyticsProvider.tsx:24-40 |
| GA duplication | gtag config `G-BDZE2T9HR0` (app/layout.tsx:163; in code since 0866c64, 2026-06-29; deploy date unverified). Firebase Analytics code since 297881a (2025-06-28); the ID `G-BVYSXDGWQL` itself is **not in git** (`git log --all -p -S G-BVYSXDGWQL` is empty): it comes from the untracked `.env` and the webConfig `measurementId`. Commit dates say when code changed, not when either property started collecting. One headless load: collect hits (204) to **both**. Cookies `_ga_BDZE2T9HR0` and `_ga_BVYSXDGWQL` both set. | network capture |
| Google Ads | `AW-17289404018`. A **conversion fires on every page load** (`send_to …/xI8ECM7q0ZEcEPK8nbRA`). The form fires 3 more Ads conversions. | app/layout.tsx:159-160, ContactForm.tsx:433-436, lib/analytics.ts:18-32 |
| Brief claim "gtag 503" | **Not reproduced.** gtag.js loads 200, `g/collect` 204 for both IDs, Ads `1p-conversion` 200. Some duplicate beacons show `ERR_ABORTED`, which is normal transport fallback. | network capture |
| Consent | GA and Ads cookies are set on first load with no consent banner or Consent Mode. | cookies list |
| Hosting config | `public: out`, rewrite `** → /index.html`, `cleanUrls: true`, `trailingSlash: false`, `errorDocument` (not a Firebase key, and dead anyway because of the rewrite). The `**/*.html` header glob does not match clean URLs, so HTML is served without `nosniff` and with the default `max-age=3600`. | firebase.json:3-13, 68; live headers |
| `.firebaserc` | default `key-foby` | .firebaserc |
| `.firebase/hosting.b3V0.cache` | **Tracked in git**. 95 entries hashed 2026-01-11. Stale deploy cache. | `git ls-files` |
| `firebase-tools` | Not a repo dependency. Global CLI v15.29.0, logged in as `tek***@gmail.com` (masked; the Tekmadev account). Its IAM role on `key-foby` and the project Owner were not read (gcloud expired, see above). Ask the client who is Owner | package.json, `which firebase`, `firebase login:list` |

Default domains (duplicate content check):

| Host | Status | Same bytes as www? | Canonical | robots / X-Robots-Tag |
|---|---|---|---|---|
| key-foby.web.app | 200 | yes (SHA `0fe086e0…`) | `https://www.keyfoby.com/` | index, follow / none |
| key-foby.firebaseapp.com | 200 | yes | `https://www.keyfoby.com/` | index, follow / none |
| app-keyfoby.web.app | 200 | = app.keyfoby.com (`addaf461…`) | **none** | none / none |
| app-keyfoby.firebaseapp.com | 200 | = app.keyfoby.com | **none** | none / none |

Canonicals limit the damage, but these duplicates are indexable.

Verdict for Phase 4/5: Firebase is used for **Hosting (2 sites) + Analytics**; Firestore, RTDB and Extensions are empty, Functions cannot run on Spark, and Storage, Auth and Remote Config are **unproven (TODO)**, so Phase 5 may not delete anything beyond Hosting yet. The SDK can go if GA4 is kept via gtag. First the owner must say **which GA4 property is "the" property**. Code dates only: Firebase Analytics code since 2025-06-28 (ID not in git), gtag `G-BDZE2T9HR0` code since 2026-06-29 (deploy date unverified). The client should read each property's creation date and data range in GA4 Admin. Removing the SDK also drops the critical `protobufjs` and high `@grpc/grpc-js` audit findings.

## 5. app.keyfoby.com

| Item | Finding | Evidence |
|---|---|---|
| What | "KeyFoby App - Business Management for Locksmiths, Coming Soon". Next.js (Turbopack) static export. | live HTML (`_next/static`, `turbopack`), title |
| Repo | **Separate.** Local `/Users/shajeed/Coding/Projects/NextJS/app-keyfoby`, branch `main`, 3 commits, **no git remote** (not backed up to GitHub). Not in this repo's branches. | `git remote -v` empty |
| Hosting | Firebase site `app-keyfoby` in the **same project `key-foby`**. Deploy is `firebase deploy --only hosting:app-keyfoby --project key-foby`. | app-keyfoby/firebase.json `"site": "app-keyfoby"`, package.json `deploy:prod` |
| DNS | `app CNAME app-keyfoby.web.app`, `app TXT hosting-site=app-keyfoby` | dig @dns1.registrar-servers.com |
| Headers | 200, `max-age=3600`, HSTS 1 y, last-modified 2025-12-19, no canonical, no robots meta | curl -I |
| Supabase | Ships supabase-js + `newsletter_subscribers`, but **no Supabase URL in its bundle** (built without env). Newsletter is likely non-functional (not submitted to test). No GA/Ads IDs. | grep of 10 live scripts |
| Links | Links to `https://keyfoby.com` (apex, 301 to www). Main site links to it from NavBar.tsx:34 and AppPromo.tsx:88. | live HTML, source |

Phase 5 must not break:
- Firebase project `key-foby` stays.
- Site `app-keyfoby` stays deployed.
- DNS `app` CNAME + TXT stay.
- Never run `firebase hosting:disable` or delete on `app-keyfoby`.
- Retiring the `key-foby` site must use `--site key-foby`. Prefer a 301-to-www release over `hosting:disable`, so the `*.web.app` copies redirect instead of 404ing.
- If the "KeyFoby App" promo leaves the homepage, the NavBar/AppPromo links go with it. That is intended, not a break.

`/api/intake` (main repo): route handlers exist (app/api/intake/route.ts, [id]/route.ts). `scripts/build.js` renames `app/api` to `_api_excluded` before `next build`, so they are **never deployed**. Live `GET /api/intake/` returns 200 + homepage. POST was not tested. In production the form's intake call silently does nothing, and EmailJS is the only lead path. The store is in-memory (automation/services/intakeStore.ts:23-44), which would not persist on serverless.

## 6. DNS and domain (authoritative `dns1.registrar-servers.com` unless noted)

| Name | Type | Value | TTL |
|---|---|---|---|
| keyfoby.com | NS | dns1/dns2.registrar-servers.com (Namecheap BasicDNS) | 1800 |
| keyfoby.com | SOA | dns1.registrar-servers.com, serial 1765136806 | 3601 |
| keyfoby.com | A | 199.36.158.100 (Firebase) | 1799 |
| keyfoby.com | AAAA | **none** at authoritative. The local resolver returned `2604:5580:22::c724:9e64` (Rogers range = DNS64 synthesis of 199.36.158.100; not a real record) | — |
| keyfoby.com | MX | 10 eforward1/2/3, 15 eforward4, 20 eforward5 .registrar-servers.com (Namecheap forwarding) | 1800 |
| keyfoby.com | TXT | `v=spf1 include:spf.efwd.registrar-servers.com ~all` | 1799 |
| keyfoby.com | TXT | `hosting-site=key-foby` (Firebase ownership) | 1799 |
| _acme-challenge.keyfoby.com | TXT | present (Firebase cert token, value omitted) | 1799 |
| www.keyfoby.com | CNAME | key-foby.web.app | 1799 |
| app.keyfoby.com | CNAME | app-keyfoby.web.app | 1799 |
| app.keyfoby.com | TXT | `hosting-site=app-keyfoby` | 1799 |
| _dmarc | TXT | **none** | — |
| DKIM (google, default, selector1/2, k1, s1/s2, mail, dkim, zoho, resend) | TXT/CNAME | **none** | — |
| CAA | — | **none** | — |
| google-site-verification | TXT / meta | **none** in DNS or HTML. Search Console is not DNS-verified: it uses another method or is not set up. | — |
| Wildcard | — | none (`zz-nonexistent-123` empty) | — |

Whois: registrar NameCheap, Inc. (IANA 1068). Created 2025-06-24, **expires 2027-06-24**, `clientTransferProhibited`, DNSSEC unsigned. Contact data omitted.

Phase 5 must preserve: NS (do not move), all 5 MX, SPF TXT, `app` CNAME + `app` TXT. Keep `hosting-site=key-foby` and `_acme-challenge` until Firebase retirement is verified, as they are harmless. Change only the apex A and the `www` CNAME. Lower both to TTL 300 at least 24 h ahead (now 1799). Add Vercel's verification TXT if requested.

## 7. Live HTTP behaviour

Redirects:

| Request | Chain |
|---|---|
| http://keyfoby.com/ | 301 → https://keyfoby.com/ → 301 → https://www.keyfoby.com/ (2 hops) |
| https://keyfoby.com/ | 301 → https://www.keyfoby.com/ (no HSTS on the 301) |
| http://www.keyfoby.com/ | 301 → https://www.keyfoby.com/ |

Headers on HTML (`/`, `/privacy-policy`, `/warranty`):

| Header | Value |
|---|---|
| Strict-Transport-Security | `max-age=31556926` (no includeSubDomains, no preload) |
| Content-Security-Policy | absent |
| X-Frame-Options / frame-ancestors | absent |
| Referrer-Policy | absent |
| Permissions-Policy | absent |
| X-Content-Type-Options | absent on HTML, present on JS/images |
| X-Robots-Tag | absent (meta robots `index, follow`) |
| Cache-Control | `max-age=3600`; JS/images `public, max-age=31536000, immutable` |

Trailing slash and errors:

| Request | Status | Notes |
|---|---|---|
| /privacy-policy/, /warranty/ | 301 → no-slash | firebase.json `trailingSlash: false` |
| /privacy-policy, /warranty, /terms-of-service | 200 | canonical = **slash** version (`…/privacy-policy/`). Canonical → 301 → page: a loop. |
| sitemap.xml | 4 URLs, all slash form, lastmod 2025-06-10 | each `<loc>` except `/` 301s |
| Internal links | mixed: `/terms-of-service` and `/terms-of-service/`, `/warranty` and `/warranty/` | live index.html |
| /does-not-exist-xyz/ and without slash | **200, homepage bytes** (canonical `/`) | soft 404 via `**` rewrite |
| /.DS_Store, /.firebaserc, /api/intake/ | 200, homepage HTML | same rewrite |
| /404 | 200, **`out/404.html`** (39,723 B, `noindex` meta), not the homepage | `cleanUrls` maps it to 404.html, so the not-found page exists. Phase 1's real-404 fix = replace the `**` rewrite and serve this file for unknown paths with a 404 status (curl 2026-10-27 01:20 UTC: `200 39723`) |
| /index.html → / , /404.html → /404 | 301 | cleanUrls |
| /images/KeyFoby-logo/keyfobylogo.ai | 200 (227 KB brand source file public) | low |

Root cause: next.config.ts:16 `trailingSlash: true` conflicts with firebase.json:12 `trailingSlash: false`. Phase 2.5/5 should pick one form, make canonical + sitemap + links + server agree, and 301 the other. Which form Google indexes now is unknown without Search Console.

robots.txt: allows all plus AI crawlers, `Crawl-delay: 1`, and **blocks AhrefsBot, MJ12bot and SemrushBot**. That limits Ahrefs/Semrush data on keyfoby.com for competitor/backlink work.

## 8. Vercel (MCP + CLI, read-only)

| Item | Finding |
|---|---|
| Teams | 1: "Tekmadev", slug `tekmadev-8959s-projects` |
| Plan | **`hobby`**, status active, no trial (`vercel api /v2/teams/<id>` GET, billing fields only) |
| Projects | 14. None named or searchable as "key" (`list_projects search=key` → 0) |
| Domains | 6 other client domains. **keyfoby.com not present** |

Vercel's terms, fetched 2026-10-27 ~01:25 UTC: "Hobby teams are restricted to non-commercial personal use only" (https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage, page `last_updated` 2026-09-14; same rule on https://vercel.com/docs/plans/hobby). The page says commercial use needs Pro or Enterprise, and its examples include advertising a product or service and being paid to build or host the site. Both fit keyfoby.com. Phase 5 therefore needs a Pro (or Enterprise) team (Truth Table #8) before the project is created.

## 9. CI/CD and deploy

| Item | Finding | Evidence |
|---|---|---|
| `.github/` | absent in working tree and in `origin/master`, `origin/claude/seo-aeo-geo-optimization-x5ql9p`, `origin/fix/build-deploy-static-export` | `git ls-tree -r --name-only` |
| Firebase GitHub integration | none (no workflow, no Actions secrets, no webhooks, no deployments) | GitHub API |
| Deploy path | `npm run deploy:all` = `node scripts/build.js` (clears `.next`, hides `app/api`, `next build`) + `firebase deploy` to the default site | package.json:11-12, scripts/build.js |
| Broken script | `deploy` = `next build && next export` (`next export` was removed in Next 14+) | package.json:11 |
| Last deploy | 2026-09-03 11:12:54, matching local `out/` (same SHA). Deployed from this machine, from master 6c6a9af. | channel list, shasum |
| Branch state | master = origin/master 6c6a9af. `claude/seo-aeo-geo-optimization-x5ql9p` is 1 commit ahead (82bc1d0, API route tweak). Untracked: `KEYFOBY_REVAMP_BRIEF.md`, `docs/`. | git |

Dependencies (lockfile audit, prod): 12 vulnerabilities (4 critical, 7 high, 1 moderate). `next@16.0.7` critical (Server Actions source exposure, RSC DoS) cannot be reached on a static export, but **can be once on Vercel's runtime**: upgrade to a patched 16.x before Phase 5. `protobufjs`/`@grpc/grpc-js` come with `firebase` and go away when the SDK is removed. Installed: react 19.1.0, firebase 11.9.1, supabase-js 2.86.0, emailjs 4.4.1.

## 10. Phase 5 / Phase 4 checklist from this track

Inputs for `docs/PHASE0_PLAN.md` §3, which is the authority on order and gates. Every item below waits for the gate shown; none runs from this list alone. Brief gates (brief §1): design direction · staging sign-off · DNS cutover · Firebase shutdown · Higgsfield spend · **any deletion**.

| # | Item | Gate before acting |
|---|---|---|
| 1 | Get access to Supabase `grytdgpmewmxbdimpgrr`. Run advisors and the read-only RLS/grant catalog queries. Propose disabling Auth sign-ups if unused. Phase 4 quote table: anon insert-only, no select | Client access (Truth Table #8). Any change to Auth settings or schema: client approval |
| 2 | Owner picks one GA4 property (`G-BVYSXDGWQL` vs `G-BDZE2T9HR0`); then remove the duplicate tag and the page-load Ads "conversion" | Truth Table #10 answer, and the client checks Ads Primary conversions first. Removing tags or code: **deletion gate** |
| 3 | Decide the fate of `app/api/intake` before Vercel: delete, or harden (zod, rate limit, Turnstile, durable store, constant-time token compare). Do not put `OPENAI_API_KEY` in Vercel unless it is kept | Truth Table #13. Delete: **deletion gate** |
| 4 | Vercel Pro team. Security headers (CSP, frame-ancestors, Referrer-Policy, Permissions-Policy, nosniff, HSTS 2 y + includeSubDomains once app.* is confirmed HTTPS-only). Real 404s. One trailing-slash rule | Pro upgrade: client (Truth Table #8). Ships via **staging sign-off** |
| 5 | DNS: TTL 300 at least 24 h ahead. Change apex A + www CNAME only. Preserve NS, MX, SPF and `app` records | **DNS cutover gate** |
| 5b | *Optional, outside brief scope:* DMARC `p=none` and CAA records. A CAA record must list every CA in use: today both `app.keyfoby.com` and `www.keyfoby.com` carry Google Trust Services WR3 certs (`openssl s_client`, 2026-10-27 ~01:30 UTC), so `pki.goog` at minimum; Firebase has also issued via Let's Encrypt in the past (`letsencrypt.org`, unverified for this project); plus whichever CA Vercel uses for apex and www (check Vercel docs at the time). A wrong CAA blocks certificate renewal | Brief limits Phase 5 DNS writes to apex A + www CNAME, so this needs an **explicit client go**; better placed in `OFFSITE_CHECKLIST.md` for the client to decide |
| 6 | Retire Hosting on site `key-foby` only, with a 301-to-www release (instead of the brief's `hosting:disable`, so `*.web.app` copies redirect, not 404). Never touch `app-keyfoby` or the project. Push `app-keyfoby` to a remote | **Firebase-shutdown gate**, no earlier than 7 days after a verified cutover (brief Phase 5 step 7); Firebase stays live as the rollback target until then. Departure from the brief's `hosting:disable`: client OK |
| 7 | Restrict the Firebase web API key by referrer (or retire it with the SDK). Add an EmailJS domain allowlist/reCAPTCHA or move the form server-side | Client approval + console access (Truth Table #8): these change client-owned cloud settings |
| 8 | Untrack `.firebase/hosting.b3V0.cache`. Fix or drop the `deploy` script | **Deletion gate** (Truth Table #13) |
