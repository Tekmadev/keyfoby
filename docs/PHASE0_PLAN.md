# KeyFoby revamp: Phase 0 plan

Observed 2026-10-26 to 01:30 UTC Oct 27, method: synthesis of 11 tracks plus review fixes; evidence in `docs/baseline/`. No existing repo file or config changed. Side effects: ≥ 26 headless loads hit GA4/Ads (TT #10); a reviewer's `firebase ext:list` probably enabled the Firebase Extensions API (no cost; disable on your go).

## 0. Stop and tell

1. **Fake reviews in live JSON-LD:** `aggregateRating` 5.0/47 on every page; 3 named 5★ `Review`s on `/` and soft-404 URLs. GBP: 4.9/222. `SEO_STRATEGY.md:30`: "Fake reviews for demonstration". Remove in Phase 1 regardless.
2. **The quote form can't submit while NHTSA vPIC is down** (Make required, no manual entry, `lib/nhtsa.ts:105-121`). vPIC: 503 at 00:24 UTC, 200 at 00:53.

Secrets: no privileged key in client code, build, live JS or git history (only the `anon` JWT ships).

## 1. Audit summary

1. Next 16.0.7 static export; live = `out/` = `master`; manual deploys, no CI.
2. Firebase: Hosting (2 sites) + Analytics. RTDB, Extensions none; Storage/Auth unchecked.
3. Supabase reads 12 service rows only. Leads go browser → EmailJS, unstored, unprotected.
4. `app/api/intake` + OpenAI automation are hidden at build; on Vercel they'd go live.
5. Two GA4 properties collect. An Ads "conversion" fires on every page load.
6. Raw HTML: 40 visible words (~555 incl. hidden blocks); FAQ answers, reviews absent.
7. Soft 404s site-wide. The 3 legal pages' canonical and sitemap URLs 301.
8. Five versions of the hours, 3 ratings, 3 areas. Legal pages describe the app.
9. Mobile Lighthouse 60, desktop 100. 1,191 KiB (1.22 MB) on load; JS 2× budget.
10. Maps #1 ×4, not the brief's #5–#8 (evening, Mississauga IP, no geo-grid); organic #3/#1/#13.

## 2. Truth Table (one message; all TODO(confirm) until answered)

1. **Hours.** 24/7 (GBP, hero) vs Mon–Fri 8–6 (contact), Sat 9–4 (schema), Sun closed (Terms). Which? After-hours surcharge?
2. **Licence + insurance.** "Licensed & Insured" has no number or insurer; we found no Ontario locksmith licence. Basis?
3. **Address.** 40 Courtland Ave is public. Do customers come there? If not: GBP service-area only, address off the site.
4. **Towns.** Site lists 10 (incl. Toronto, Mississauga, Brampton); reviews name 3. Which towns, and arrival time each?
5. **Prices.** Ranges by service and make? Diagnostic fee (a review cites $50)? Customer-bought fobs? Payment methods?
6. **Technician.** "Mohammad" (14 reviews): name, photo OK? Years (2022 vs "3+"), certifications, keys made, French, legal name?
7. **Phone.** (438) 797-7776 was the site's main and schema number ~2026-01-11 to the 2026-09-03 deploy (`49dd58b`→`f746758`) and is in the GBP text. Only (905) 467-6860? Call tracking for paid only?
8. **Access.** Who owns Namecheap, GBP, Ads, both GA4, EmailJS, Elfsight, Supabase, Firebase `key-foby` (Owner)? Search Console set up? If not, verify a Domain property by DNS TXT now. Vercel Hobby is non-commercial: go Pro?
9. **Higgsfield.** Assets only or its scroll-scrub template? OK to create `keyfoby-revamp` and run a small, cost-checked test batch?
10. **Analytics.** Which GA4 property holds your history? Git has code dates only (Firebase 2025-06, gtag 2026-06-29); check creation dates in GA4 Admin. Is page-load label `xI8E…` Primary? Exclude our ≥ 26 test loads (00:14–00:42 UTC Oct 27).
11. **Services.** House keys, safe locks (on GBP), broken-key extraction, ignition, remote starters, door locks?
12. **Leads.** Which email and SMS get alerts? Store leads in Supabase, drop EmailJS? Is "reply within 2 hours" true?
13. **Deletions + app.** Delete the OpenAI intake, orphan newsletter, unused images? New home for the App promo? Push `app-keyfoby` to GitHub?
14. **Legal + proof.** Who reviews Privacy/Terms/CASL? Who shoots the 17 photos, when? Hero photo licensed? 3-month warranty true? Keep "100% Satisfaction Guaranteed"?

## 3. Phase plan (about 27–37 working days plus client wait)

| Phase · days | Key deliverables | Gate(s) |
|---|---|---|
| 1 Truth hotfix, Firebase, 1 PR · 2–3 | Fake Reviews + rating out; one truth (text, meta, footer, one `@id`); keyword H1; meta ≤ 155; FAQ answers + reviews in HTML; App promo off; static make list; page-load conversion off; non-AI OG; real 404s (`404.html` exists); one slash rule | Truth answers; PR review; client edits GBP |
| 2 SEO + content · 6–9 | ~20 URLs per `keyword-map.md` (3 renames, 4 merges, 4 dropped, 1 conditional); make pages from job data only, not the brief's Kia-first; schema; build check | Truth #4–6, #11 |
| 3 Design · 5–7 + shoot | `DESIGN.md` (ui-ux-pro-max); 3 directions; Higgsfield test batch; after the direction go, a web note superseding skill `keyfoby-brand` (outside repo, client OK; never removed without a deletion go) | **Direction**; **Higgsfield spend**; **deletion** |
| 4 Build + QA · 10–14 | Sticky call bar; quote form (zod, Turnstile, insert-only RLS, owner alert); one GA4 via gtag, SDK out; patched Next; Lighthouse CI median of 3; `QA_REPORT.md` | **Staging sign-off**; **deletion** |
| 5 Vercel · 3 + ≥ 10 calendar | Pro project; `REDIRECTS.md`; TTL 300 ≥ 24 h ahead; apex A + www CNAME only; 72 h watch; Firebase live as rollback; shutdown ≥ 7 days after cutover: 301 release on `key-foby` only (replaces brief's `hosting:disable`; client OK) | **DNS cutover**; **Firebase shutdown** |
| 6 Off-site · 1 | GBP text (drop 438, "#1"), categories, services, posts, replies; citations (incl. 438); geo-grid; LSA | Client runs it |

Start now: Vercel Pro, access, photos, Search Console, daytime geo-grid. Phases 2–3 in parallel. `/api` decided before Vercel. Production headless runs block Google tags; no API-enabling `firebase` commands.

## 4. Risks (ranked) → mitigation

1. Fake reviews, self-serving rating (manual action, Competition Act) → out in the first Phase 1 commit.
2. Lost leads (browser-only EmailJS, NHTSA-dependent) → static make list; server route, store, alert.
3. Split or polluted tracking (2 GA4, page-view conversions) → client picks property, checks Ads first.
4. Ranking churn (slash loop, soft 404s, `*.web.app`) → one slash form, real 404s, redirect map.
5. Cutover breaks app.keyfoby.com or email (5 MX) → touch site `key-foby` and apex/www only.
6. Vercel runtime exposure (OpenAI POST, Next advisories, open sign-up) → harden or delete `/api`; upgrade.
7. Mobile budget missed (Perf 60, JS 2×) → trim initial JS; server-render reviews; poster LCP.
8. Off-site conflicts (GBP 438, "#1", licence, GTA) → client edits GBP with Phase 1; citation audit.
9. No real photos; OG and logo are GPT-4o → book the shoot; logo-based OG.
10. Legal pages describe the app; cookies before consent → website Privacy/Terms/CASL before Phase 4.

## 5. Access needed + not verified

**Access:** all of TT #8, plus Search Console (set up, then 16-month export) and admin on both GA4 properties.

**Not verified:** CrUX/INP; daytime geo-grid ranks; GA4 event counts; click/submit events, EmailJS delivery; POST `/api/intake`; Supabase RLS; Firebase Storage/Auth/IAM; "mostly residential" area; GBP About/Q&A; socials; 3 review names vs 222 GBP reviews; Googlebot render; historical rank; 438 live dates; plus every TT item.
