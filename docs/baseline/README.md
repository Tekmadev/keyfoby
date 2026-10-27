# Phase 0 baseline: file index

Observed 2026-10-26 (to 00:55 UTC Oct 27; revised after review 2026-10-27 ~01:30 UTC). Method: I listed every file under `docs/baseline/` and wrote one line on each from its own header or the doc that produced it. Plan and Truth Table: `docs/PHASE0_PLAN.md`. Scripts and raw scratch data stayed in the session scratchpad (`phase0/<track>/`) and are not committed. No file here contains a secret: a masked scan found only mentions of the word `service_role`.

## Reports (Markdown)

| File | One line |
|---|---|
| `repo-audit.md` | Code audit of `master` @ `6c6a9af`: stack, routes, data sources, quote-form flow, `/api/intake` + automation, third-party IDs, claims/NAP inventory with file:line, SEO plumbing |
| `security-infra.md` | Masked secret scan (source, `out/`, `.next/`, live JS, git history), env var names, Supabase anon probes, Firebase usage, app.keyfoby.com, DNS records, headers, Vercel plan, CI/CD |
| `lighthouse.md` | Lighthouse 13.5.0 (3 mobile + 3 desktop runs plus a DevTools-throttled run), JS weight vs the 170 KB budget, tracking-tag check, brief vs measured |
| `crawl.md` | Raw vs rendered crawl of 5 URLs: titles, meta, headings, JSON-LD, links, NAP/claims consistency, sitemap/robots/redirects, ranked SEO problems |
| `gbp-maps.md` | KeyFoby GBP fields, review topics/velocity/facts, Maps and web rank checks for 4 + 3 queries, competitor GBPs, brief claims vs observed |
| `competitors.md` | Competitor matrix (KeyFoby + 6), visibility snapshot, what leaders do, gaps to own, do-not-copy list, brief vs observed |
| `keyword-map.md` | Autocomplete-based keyword clusters, one URL per cluster, proposed changes to brief §2.1, cannibalisation rules, AEO questions, Truth Table inputs |
| `design-readiness.md` | ui-ux-pro-max status, logo/brand assets, current tokens and accessibility defects, anti-slop violations, Higgsfield account and models, 17-shot real-photo list |

## Pending: needs client access

| File (planned) | Waits on |
|---|---|
| `search-console/queries.csv`, `search-console/pages.csv` | 16-month Search Console export (queries, pages, clicks, impressions, avg position). Blocked: no access, and Search Console may not be set up at all (no `google-site-verification` in DNS or HTML, `security-infra.md` §6). Truth Table #8 |
| `ga4-summary.md` | GA4 admin on `G-BVYSXDGWQL` and `G-BDZE2T9HR0`: creation date, data range, sessions, key events per property. Truth Table #8, #10 |

## Competitor audits (`competitors/`)

| File | One line |
|---|---|
| `competitors/cando-lock-and-key.md` | CanDo (5.0/128): broken domain (503/NXDOMAIN), robots-blocked JS site, "starting at" prices, weekly GBP posts, move to 203 Cannon St E |
| `competitors/nation-auto-locksmith.md` | Nation (4.5/173): 11 clean server-rendered pages with no fob, make or price content; templated copy and recycled testimonials |
| `competitors/auto-key-pro.md` | Auto Key Pro (4.8/661 + 2 listings): 463 URLs, doorway town pages, no meta descriptions or JSON-LD, make/model/year price lookup, parasite links |
| `competitors/about-town-lock-and-key.md` | About Town (4.5/118): 17-page Wix generalist site, real storefront/owner proof, Mon–Fri 10–4 |
| `competitors/mr-key-pro.md` | Mr. Key Pro (4.9/633): 59 URLs of which 33 are empty stubs (all make pages), server-rendered Google reviews, no `tel:` links |
| `competitors/alpha-locksmith.md` | Alpha (4.9/442): general locksmith, named owner and insurer, 3-month warranty, templated location pages, Yoast schema |

## Keyword data

| File | One line |
|---|---|
| `keyword-map.csv` | 272 keyword rows (incl. 12 PAA and 11 SERP-related added 2026-10-27), columns `keyword, cluster_id, topic, intent, target_url, source, notes`; each `cluster_id` maps to exactly one URL (data behind `keyword-map.md`) |

## Lighthouse (`lighthouse/`)

| File | One line |
|---|---|
| `lighthouse/mobile.report.html` | Median mobile run (run 3 of 3, Performance 60), HTML viewer |
| `lighthouse/mobile.report.json` | Same mobile run, JSON |
| `lighthouse/desktop.report.html` | Median desktop run (run 2 of 3, Performance 100), HTML viewer |
| `lighthouse/desktop.report.json` | Same desktop run, JSON |
| `lighthouse/mobile-devtools-throttling.report.json` | Cross-check mobile run with DevTools throttling (Performance 84, LCP 2.27 s) |
| `lighthouse/tracking-desktop.json` | Puppeteer network capture of tag requests at desktop width (keys masked) |
| `lighthouse/tracking-mobile.json` | Same capture at 390 px (keys masked) |

## Crawl snapshots (`crawl/`)

| File | One line |
|---|---|
| `crawl/home.raw.html` | Homepage as served (curl), 135,003 B, same bytes as the soft-404 response |
| `crawl/home.rendered.html` | Homepage DOM after JS at network idle + 3 s, before scrolling (1280x800) |
| `crawl/privacy-policy.raw.html` | `/privacy-policy` as served |
| `crawl/privacy-policy.rendered.html` | `/privacy-policy` DOM after JS |
| `crawl/terms-of-service.raw.html` | `/terms-of-service` as served |
| `crawl/terms-of-service.rendered.html` | `/terms-of-service` DOM after JS |
| `crawl/warranty.raw.html` | `/warranty` as served |
| `crawl/warranty.rendered.html` | `/warranty` DOM after JS |
| `crawl/does-not-exist-xyz.raw.html` | Unknown path as served: 200 with homepage bytes (soft 404 proof) |
| `crawl/does-not-exist-xyz.rendered.html` | Unknown path DOM after JS |
| `crawl/robots.txt` | Live robots.txt as fetched (AI crawlers allowed, Crawl-delay 1, Ahrefs/Semrush/MJ12 blocked) |
| `crawl/sitemap.xml` | Live sitemap as fetched (4 URLs, lastmod 2025-06-10) |
| `crawl/ads.txt` | Live ads.txt as fetched (comment only: no ad monetisation) |

## Screenshots (`screenshots/`)

| File | One line |
|---|---|
| `screenshots/home-375x812-fold.png` | Mobile fold, no scroll: no phone number text visible |
| `screenshots/home-1280x800-fold.png` | Desktop fold: centred hero, two pill CTAs |
| `screenshots/home-375-full.png` | Full page at 375 after one scroll; captured 399 px wide because of overflow |
| `screenshots/home-768-full.png` | Full page at 768; overflows to 784 px |
| `screenshots/home-1280-full.png` | Full page at 1280 with reviews and map loaded after scroll |
