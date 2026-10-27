# KeyFoby — SEO Recovery, Front-End Revamp & Vercel Migration

> **Use:** save as `BRIEF.md` in the repo root. First message to Claude Code: *"Read BRIEF.md fully. Plan Mode. Do Phase 0 only, then stop and report."*

---

## 1. Role, goals, rules

You are a senior full-stack engineer, art director and local-SEO lead. The client is **KeyFoby** (keyfoby.com), a mobile automotive locksmith in Hamilton, ON: car-key replacement, key-fob programming, all-keys-lost, lockouts. It is also a flagship Tekmadev case study, so the result must be portfolio-grade.

**Goals**
1. Win back top-3 in Google Maps / local pack and top-3 organic for Hamilton car-key searches.
2. Ship a front end that looks custom and cinematic: unmistakably not a template or an "AI-built" site.
3. Move hosting from Firebase to Vercel with no ranking loss, no tracking loss, no downtime.

**Rules**
- Plan Mode first. Phase 0 changes nothing.
- Branch `revamp/v2`, small commits, a Vercel Preview per PR.
- **Gates. Stop and wait for my explicit "go":** design direction · staging sign-off · DNS cutover · Firebase shutdown · Higgsfield spend beyond a small test batch · any deletion.
- Speed is a feature. The homepage is fast today (LCP ≈ 0.5 s, CLS ≈ 0.01, ~520 KB; one desktop load). Generated media must not change that.
- No unverified claims. No invented proof: no AI technicians, customers, reviews, job photos, licences or before/afters.
- Never commit secrets. If you find a service-role key or similar in client code or git history, stop and tell me.
- Canadian English (en-CA). Plain, concrete copy.

---

## 2. Verified findings (Oct 26, 2026). Re-verify; don't trust blindly.

**Google Business Profile ("Keyfoby", category: Locksmith)**
- 4.9★ / 222 reviews. About 10 new reviews in the last month; owner replies. Review quality and velocity are not the bottleneck.
- Listed "Open 24 hours". About tab shows only "Onsite services" (no services list or attributes). Street address is public, in a mostly residential area of Hamilton Mountain.
- Review themes: Kia key fob (22), key programming (18), key fob replacement (13), car key replacement (12), key cutting (8), friendly technician (8). Reviewers cite savings vs dealership, speed, same-day, Saturday/after-hours, "came to my house".

**Rankings** (from my browser; query-anchored Google Maps results, not a geo-grid scan)
- Maps: **#5** "car key replacement Hamilton Ontario" · **#5** "key fob programming Hamilton Ontario" · **#8** "automotive locksmith Hamilton Ontario" · **#6** "car key fob Hamilton Mountain".
- Ahead of us (varies by query): CanDo Lock and Key (5.0/128), Nation Auto Locksmith (4.5/173), About Town Lock & Key (4.5/118), AllSafe Locksmith (5.0/13), Auto Key Pro on Main St E (4.3/84). The leaders sit in the lower city (Cannon / Main / Hughson); KeyFoby is on the Mountain. Proximity is a factor we can't change, so relevance and prominence signals have to carry us.
- Auto Key Pro runs three listings on one phone number (also Rymal Rd E 4.8/661 and a "Van" listing 5.0/61). Other big review counts: Mr. Key Pro Burlington 4.9/633, Alpha Locksmith 4.9/442.
- Web search "car key replacement hamilton": a sponsored locksmith unit and sponsored results sit above organic. KeyFoby is organic #2, behind autokeypro.ca.
- Related searches to target: "cheapest car key replacement hamilton", "mobile car key replacement hamilton", "car key replacement hamilton cost", "car locksmith hamilton", "key cutting hamilton mountain".

**Site**
- Next.js (Turbopack), served from Firebase Hosting. Client-side calls: Supabase REST (`service_types`), Firebase JS SDK (a webConfig fetch, likely Analytics), GA4, Google Ads tag. In my session both gtag requests logged 503, which may be a local blocker. Verify they actually fire.
- It is **one page**. Sitemap = 4 URLs (`/`, privacy, terms, warranty). No service, location, make, pricing, about, reviews or guide pages.
- H1 has no keywords ("Lost Keys? Need a Spare? We've Got You.."). Meta description is 175 chars (truncates). 6 H2s, 3 `<img>`, emoji used as icons.
- Reviews and map sections ship as "Loading…" placeholders in the HTML. No review content is crawlable. FAQ answers not verified in HTML.
- Homepage sells the "KeyFoby App" (SaaS for locksmiths, app.keyfoby.com, "Coming Soon", early-access pricing) to car owners. That dilutes topical focus.
- robots.txt is fine (AI crawlers allowed); `Crawl-delay` is ignored by Google.

**Data conflicts. All must be reconciled to one truth.**

| Item | Google listing | Site | JSON-LD |
|---|---|---|---|
| Hours | Open 24 hours | Title + hero say 24/7; contact block says Mon–Fri 8AM–6PM | Mo–Fr 08:00–18:00, Sa 09:00–16:00 |
| Reviews | 4.9 / 222 | "5-Star", "4.9 Rating" | 5.0 / 47 (hard-coded) |
| Area | n/a | Hamilton → Toronto, Brampton, Mississauga | same 10 cities |

Other unverified claims: "Licensed & Insured", "100% Satisfaction Guaranteed", "15-min average" response, "100+ Keys Made", "© 2025".

**Could not verify:** historical rank, Search Console data, secondary GBP categories, whether the listed address is customer-facing.

---

## 3. Truth Table. Ask me ALL of these in ONE message before writing any copy.

1. **Hours:** true 24/7, or Mon–Fri 8–6 + Sat 9–4? After-hours surcharge?
2. **Licence + insurance:** what can we state and publish (licence #, insurer, how to display)?
3. **Address:** is the Mountain address customer-facing? If not, the GBP should be service-area-only (address hidden) and the street address must come out of the site, schema and footer.
4. **Towns truly served** and real arrival time for each. Toronto / Mississauga / Brampton: keep or remove?
5. **Prices:** real ranges by service and by make.
6. **Technician:** name, photo OK?, years in business, certifications, keys made to date.
7. **Phone:** one primary number; is call tracking OK?
8. **Access:** who controls DNS/registrar? Search Console, GA4, Google Ads, GBP, Supabase, Firebase, Vercel. (Vercel Hobby is non-commercial. Use a Pro team; check current terms.)
9. **Higgsfield:** assets only (default) or its scroll-scrub site template as the front-end base?

Anything unanswered is marked `TODO(confirm)` and does not ship as a claim.

---

## 4. Phases

### Phase 0. Discovery (read-only)
1. **Repo audit:** framework/version, routing, data sources, Supabase usage + RLS policies, *everything* Firebase is used for (Hosting, analytics SDK, anything else), env vars, CI/CD workflows, third-party scripts, quote-form flow, exposed keys, and how `app.keyfoby.com` relates (same repo? same Firebase site?).
2. **Baseline in `docs/baseline/`:** Lighthouse mobile + desktop for `/`; rendered-HTML crawl (title, meta, headings, schema, links); screenshots at 375 / 768 / 1280; Search Console export (queries, pages, avg position, impressions, clicks, 16 months) and GA4 summary if I grant access.
3. **Competitor matrix:** CanDo Lock and Key, Nation Auto Locksmith, About Town Lock & Key, Auto Key Pro, Mr. Key Pro, Alpha Locksmith: page count, service / location / make pages, word counts, title patterns, schema, GBP categories and services (visible on Maps), rating + review count.
4. **Keyword map:** seed with the related searches above plus People-Also-Ask questions. Cluster by intent. Assign each cluster to exactly one URL.
5. **Output:** ≤ 2-page plan, risk list, and the Truth Table. Then STOP.

### Phase 1. Truth hotfix (current host, one small PR, after my answers)
- One truth for hours, rating, area, phone and address across GBP, visible text, title/meta, footer and JSON-LD.
- Remove the hard-coded `aggregateRating` (self-serving LocalBusiness reviews earn no stars, and it contradicts GBP).
- Keyword-bearing H1 (e.g. "Car Key & Key Fob Replacement in Hamilton: Mobile, Same Day"); meta description ≤ 155 chars.
- Remove or soften unverified claims. Move the "KeyFoby App" promo off the homepage.
- Replace "Loading…" placeholders with server-rendered content.
- Verify GA4 + Ads tags fire (Tag Assistant / DebugView).

### Phase 2. SEO architecture & content

**2.1 URL architecture.** One URL = one intent. Only pages we can fill with genuinely unique content. No doorway pages.
```
/                              hub: service + city H1, answer-first intro, links to every spoke
/services/                     index
/services/car-key-replacement  /key-fob-programming  /all-keys-lost  /emergency-car-lockout
/services/transponder-key-programming  /smart-proximity-key  /key-fob-shell-replacement  /broken-key-extraction
/locations/                    index (service-area list; no pin if address is hidden)
/locations/hamilton  /hamilton-mountain  /ancaster  /dundas  /stoney-creek  /burlington  /oakville  /grimsby
                               (only towns confirmed in the Truth Table)
/car-keys/                     index
/car-keys/kia  /honda  /hyundai  /toyota  /jeep  /ford …
                               (launch with top 5 by review volume + search demand; Kia first)
/pricing  /about  /reviews  /faq  /guides/…  /quote  /contact
legal pages keep their current URLs
```
Each location/make page needs a unique intro, real arrival times / jobs / photos, fob types + year ranges (make pages), price range, specific FAQs, internal links. The build **fails** on duplicate title/H1/meta or < ~350 words of unique copy.

**2.2 On-page.** Title ≤ 60, meta ≤ 155. One H1 with service + place. Answer-first 40–60-word intro. Breadcrumbs. Descriptive alt text. Phone, hours and service area as real text. Click-to-call everywhere.

**2.3 Structured data (JSON-LD, validated).** `Locksmith` with `@id`; true hours via `openingHoursSpecification`; confirmed `areaServed` City objects; `sameAs` (GBP, Yelp, Facebook, Instagram…); logo + image; street address only if customer-facing. `Service` per service page. `BreadcrumbList`. `FAQPage` optional (rich results are limited, keep for structure and AI answers). `aggregateRating` only if generated from real, visible, first-party reviews, and never contradicting GBP.

**2.4 Reviews & proof.** Server-rendered curated testimonials with permission (initial, vehicle, area, service) plus a link to the GBP. Google API only with required attribution and server-side caching. Real job photos (strip EXIF/GPS, hide plates). Technician bio, licence/insurance block, warranty summary, and the "we show you the system readout" process that reviewers mention.

**2.5 Technical.** Canonical `https://www.keyfoby.com` (apex 301 → www, as today). Consistent trailing slashes. Sitemap with every indexable URL + `lastmod`. robots.txt: keep AI crawlers allowed, drop `Crawl-delay`. Per-page OG images. Custom 404. Security headers. **No `noindex` / `X-Robots-Tag` leaking from preview to production.** Self-hosted fonts. Click-to-load map (static region map if the address is hidden).

**2.6 AEO / GEO.** Concise Q&A blocks with specific facts (price ranges, turnaround, what's required: proof of ownership, VIN). Entity-consistent name/address/phone everywhere.

**2.7 Tracking.** Keep the existing GA4 property and Google Ads tag. Events: `call_click`, `whatsapp_click`, `messenger_click`, `quote_start`, `quote_submit` → Ads conversions. Call tracking only as dynamic swap for paid traffic; the primary number stays in page text and schema.

### Phase 3. Design (Higgsfield + UI/UX Pro Max)

1. **Invoke the `ui-ux-pro-max` skill first** (look in `.claude/skills`, `~/.claude/skills`, installed plugins). If it isn't installed, stop and tell me. Don't silently substitute. Use it to produce the design system and save `docs/design/DESIGN.md`: style direction, palette tokens, type pairing, spacing, radius, elevation, motion rules, components, UX + accessibility checklist.
2. Keep KeyFoby's logo and brand cues (the blue "KF" key mark). Evolve palette and type; don't import another brand's colours.
3. Present **three genuinely different directions** (name, rationale, palette, type, hero concept, one mock each). I pick. **Gate.**
4. **Mobile-first.** Most visits are urgent phone searches. Sticky call + WhatsApp bar, "Locked out right now?" fast path, short quote form (year / make / model, ignition type, optional photo of the key), tap targets ≥ 48 px.

**Higgsfield: assets only (default).** Do NOT use `create_website` / `deploy_website` for production. They scaffold a separate TanStack Start app on Cloudflare. Ask me first if you think that's better.
- Run `models_explore`; preflight every batch with `get_cost: true`; keep everything in one Higgsfield project/folder `keyfoby-revamp`; small test batch first, then ask before spending more. Log prompt + model + settings in `docs/design/assets.md`.
- Upload the KF logo and real photos as references so output stays on-brand.
- Candidate assets: (a) **one signature hero moment**: a seamless 6–10 s loop or a scroll-scrubbed key-fob "unlock / proximity" sequence; (b) background-removed fob/key cut-outs with consistent lighting; (c) abstract light/texture backgrounds; (d) optional short 3D fob turntable; (e) OG/social images.
- **Never use AI for proof.** Real photos only for technician, van, tools, jobs, before/afters (ask me to shoot them). No automaker logos or marks in generated imagery: generic or abstract fobs only.
- **Delivery:** commit optimized outputs only (originals stay out of git). Hero video MP4 (H.264) + WebM ≤ ~2.5 MB with a WebP/AVIF poster that is the LCP element; `muted playsinline`, starts after load, off for `prefers-reduced-motion` and Save-Data. Scroll-scrub is a progressive enhancement with a static fallback. No critical text inside video or canvas. Images via `next/image` with explicit sizes.
- **Hard budgets (the visual loses if it breaks one):** mobile Lighthouse Performance ≥ 90 · LCP ≤ 2.0 s (never > 2.5 s) · INP ≤ 200 ms · CLS ≤ 0.1 · initial JS ≲ 170 KB gz · hero media ≤ 2.5 MB · no layout shift from media.

**Anti-slop rules**
- **Banned:** emoji as icons (the current site does this) · stock handshake / padlock / hoodie-hacker photos · purple or blue-cyan gradient-on-dark default · glassmorphism everywhere · gradient-text headlines · identical 3-up icon-card grids · centred hero with two pill buttons · fake or vague stats ("100+", "100%") · "cutting-edge technology" filler · unstyled shadcn / Inter / Poppins defaults · decorative blobs and particles · bento grids for their own sake · carousels hiding key content.
- **Do:** a distinct type pairing (via the skill) · restrained palette with one sharp accent from the KF logo · asymmetric editorial layouts with real scale contrast · copy that names makes, minutes and prices · real photography direction (van, tools, hands, actual keys) · motion only where it explains something (max 3 patterns) · ONE signature interaction tied to the product · designed focus / hover / pressed states.
- **Accessibility:** WCAG 2.2 AA, visible focus, keyboard nav, reduced-motion, semantic landmarks.

### Phase 4. Build & QA
- Keep Next.js App Router. Content in typed TS/MDX data files (services, locations, makes, FAQs, reviews). CMS is out of scope for now.
- **Quote form:** server-side validation (zod), honeypot or Turnstile, rate limiting. Supabase RLS: anon can insert only, never select. CASL-compliant consent text. Notify the owner by email/SMS. If the Supabase MCP is connected, run `get_advisors` and fix RLS findings.
- **Analytics:** if the Firebase JS SDK is only used for analytics, remove it and use GA4 directly (e.g. `@next/third-parties`), **same measurement ID**, so history is preserved.
- `next/font` self-hosted; third-party scripts deferred; no render-blocking.
- **QA on the Preview:** Lighthouse CI against the budgets above · axe · link check · schema / Rich Results validation · rendered-HTML crawl · 360 / 390 / 768 / 1280 / 1920 · throttled 4G · form end-to-end (including the owner notification) · GA4 / Ads events · confirm no `noindex` anywhere. Write `docs/QA_REPORT.md`. **Gate: staging sign-off.**

### Phase 5. Vercel migration & Firebase removal (gated)
1. Create/confirm the Vercel project on a **Pro team**. Link the repo, set env vars (never commit them), protect Preview URLs.
2. Full QA on the Preview, then on the production-config deployment before DNS changes.
3. **DNS prep:** lower TTL to 300 s at least 24 h ahead. Export every existing record (MX, SPF/DKIM/DMARC, TXT incl. Google/Bing verification, CNAMEs). **Don't move nameservers.** Change only the A/CNAME for apex + www so email and Search Console verification survive.
4. Add apex + www in Vercel (apex → 301 → www). Check SSL, HSTS, redirects, sitemap, robots.
5. **Gate: cutover on my "go".** Switch DNS. Monitor 72 h: 4xx/5xx, Search Console coverage, GA4 realtime, form submissions. Rollback = point DNS back at Firebase (keep it live until verified).
6. Post-cutover: submit the sitemap in Search Console, request indexing for the new key URLs, confirm the GBP website link resolves.
7. **Gate: Firebase shutdown on my "go", ≥ 7 days after cutover.** Remove Hosting only: `firebase.json`, `.firebaserc`, Firebase Hosting GitHub workflows, `firebase-tools`. Disable the default `*.web.app` / `*.firebaseapp.com` sites so they can't be indexed as duplicates. **Do NOT delete the Firebase project or other services** unless Phase 0 proves them unused and I approve. Don't break `app.keyfoby.com`.
8. Write `docs/REDIRECTS.md` and a README on how to edit content and deploy.

### Phase 6. Off-site checklist for me (Claude Code can't edit these). Write `docs/OFFSITE_CHECKLIST.md`.
- **GBP:** address visibility per Truth Table · primary Locksmith + secondaries that top competitors use (e.g. emergency locksmith, key duplication) · services with descriptions + price ranges · service areas (confirmed towns only) · hours identical to the site · products by make · real photos weekly · weekly posts · seeded Q&A · appointment link → `/quote` · UTM-tagged website link · review requests that mention service, area and vehicle (no gating) · reply to every review · confirm no duplicate listings.
- **Citations** with identical NAP: Yelp, YellowPages.ca, Canpages, BBB, Facebook, Apple Business Connect, Bing Places, Foursquare.
- **Grid rank tracking** (Local Falcon / BrightLocal / Places Scout or similar): 5 core queries, monthly, baseline now. Add Search Console + Bing Webmaster.
- **Local Services Ads:** evaluate, since paid locksmith units sit above organic results. Needs licence/insurance verification and a budget.
- **Links/partners:** tow companies, body shops, used-car lots, property managers, local sponsorships. Keep the "Developed by Tekmadev" link.
- **Case study capture:** before/after screenshots, Lighthouse, Search Console graphs.

---

## 5. Definition of done
- Every gate passed and logged.
- Mobile Lighthouse ≥ 90 on `/`, one service, one location and one make page.
- Every page has a unique title, H1 and meta. Schema validates. Zero broken links.
- GBP, site text, title/meta and JSON-LD show identical hours, area, phone and address.
- GA4 + Ads events fire; the quote form is verified end-to-end.
- DNS cutover verified, redirects tested, sitemap submitted, Firebase Hosting retired.
- Docs delivered: baseline, plan, design system, assets log, QA report, redirects, off-site checklist, README.

## 6. First reply (after Phase 0)
1. A ≤ 10-line audit summary: what's in the repo, what Firebase is used for, surprises.
2. The Truth Table as one numbered list.
3. Phase plan with rough effort per phase and the top risks.
4. Then wait.
