# Lighthouse and tracking baseline: https://www.keyfoby.com/

Observed 2026-10-26 (20:15–20:30 EDT, 00:15–00:30 UTC Oct 27), method: Lighthouse 13.5.0 CLI with installed Chrome 156.0.8078.47 (`--headless=new`), 3 mobile + 3 desktop runs in sequence on an Apple M1 Max running macOS 26.6.2; puppeteer-core 25.16.0 network capture; curl + gzip for bundle sizes. Fastly served from the YYZ PoP (`x-served-by: cache-yyz-…`).

## Headline

| # | Finding | Evidence |
|---|---|---|
| 1 | **Mobile fails the budget**: Performance 60 (median, range 58–68) vs target ≥ 90. Simulated LCP 8.33 s (5.64–9.27). | `lighthouse/mobile.report.json` (run 3 of 3) |
| 2 | **Desktop is fast**: Performance 100, LCP 0.50 s. The brief's "LCP ≈ 0.5 s" is a desktop-only number. | `lighthouse/desktop.report.json` (run 2 of 3) |
| 3 | **The page weighs 1,191 KiB (1.22 MB; 1.16 MiB), not ~520 KB.** 57% is Google tag JS: `gtag.js` downloads **4 times** (677 KiB). First-party weight alone is about 516 KB, which matches the brief's figure. The brief's session probably had gtag blocked (its 503s). | LH `network-requests`, `third-parties-insight` |
| 4 | **Two GA4 properties collect at once**: `G-BDZE2T9HR0` (gtag in `app/layout.tsx:163`) and `G-BVYSXDGWQL` (Firebase Analytics, `lib/firebase.ts:11` env `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`). Each property received at least one `g/collect` hit (204) per load. Event names and counts were **not captured**: the saved URLs are cut at 260 characters (no `en=` present) and no POST bodies were stored. The code suggests more than one page_view to `G-BVYSXDGWQL` (`AnalyticsProvider.tsx:29`, plus one on every refocus at `:44-47`; `repo-audit.md` §5). | puppeteer capture, `tracking-*.json` |
| 5 | **A Google Ads conversion fires on every page load** (`AW-17289404018/xI8ECM7q0ZEcEPK8nbRA`, the "page view" label). Each quote-form submit fires 3 more conversion labels. | `app/layout.tsx:160` (inline gtag config), `app/components/ContactForm.tsx:434-436`, network 200/302. `lib/analytics.ts:18-20` (`trackGoogleAdsPageView`) is dead code: `grep -rn trackGoogleAdsPageView app lib` finds only its definition, so delete it (deletion gate) |
| 6 | Initial first-party JS is **330.8 KiB gzip (338.7 KB)**, about **2× the 170 KB gz budget**, before the Google tags. | curl + `gzip -9` of the 16 module scripts in the HTML |
| 7 | The brief's "gtag 503" did **not** reproduce: 0 × 4xx/5xx across 413 logged requests in 10 page loads (6 LH, 1 LH DevTools-throttled, 3 puppeteer). | statuses below; check script over all run JSONs |

## Setup

| Item | Mobile (default) | Desktop (`--preset=desktop`) |
|---|---|---|
| Throttling | simulate: RTT 150 ms, 1.6 Mbps, CPU ×4 | simulate: RTT 40 ms, 10 Mbps, CPU ×1 |
| Screen | 412×823 @1.75 (moto g power UA) | 1350×940 @1 |
| benchmarkIndex | 3005 / 3012 / 3005 | 3009 / 3001 / 3045 |
| Median rule | median Performance score; ties broken by median LCP | same |
| Median run copied | run 3 (perf 60) | run 2 (perf 100, LCP 0.50 s) |

## Mobile (3 runs)

| Metric | Median run | Run 1 / 2 / 3 | Spread (min–max) |
|---|---|---|---|
| Performance | **60** | 68 / 58 / 60 | 58–68 |
| Accessibility | 97 | 97 / 97 / 97 | 0 |
| Best Practices | 77 | 77 / 77 / 77 | 0 |
| SEO | 100 | 100 / 100 / 100 | 0 |
| FCP | 3.12 s | 3.19 / 3.30 / 3.12 s | 3.12–3.30 s |
| LCP | **8.33 s** | 5.64 / 9.27 / 8.33 s | 5.64–9.27 s |
| LCP element | `p.text-lg` hero sub-paragraph ("Professional automotive key replacement, key fob programming…"), text | same in all 3 | — |
| TBT | 270 ms | 230 / 259 / 270 ms | 230–270 ms |
| CLS | 0.017 | 0.022 / 0.017 / 0.017 | 0.017–0.022 |
| Speed Index | 5.60 s | 3.32 / 6.32 / 5.60 s | 3.32–6.32 s |
| TTI (hidden metric) | 10.2 s | 10.3 / 9.7 / 10.2 s | 9.7–10.3 s |
| Total byte weight | 1,191 KiB (1,219,369 B) | 1,190 / 1,190 / 1,191 KiB | ±1 KiB |
| JS, first-party (transfer) | 289.9 KiB, 16 files | 289.8 / 289.9 / 289.9 | ±0.1 |
| JS, third-party (transfer) | 680.7 KiB, 5 files (4 × gtag.js + 1 Ads script) | 680.6 / 680.6 / 680.7 | ±0.1 |
| Requests | 48 | 48 / 54 / 48 | 48–54 |

Cross-check: 1 extra mobile run with `--throttling-method=devtools` (real throttling, same profile) gave **Performance 84, FCP = LCP 2.27 s, TBT 461 ms, CLS 0.042, SI 2.88 s** (`lighthouse/mobile-devtools-throttling.report.json`). The simulated LCP is inflated because Lantern treats the text LCP as gated on the JS that runs before first paint. Even with real throttling, LCP misses the 2.0 s target. PageSpeed Insights (also simulated) is the number Google shows, so plan around about 60.

## Desktop (3 runs)

| Metric | Median run | Run 1 / 2 / 3 | Spread (min–max) |
|---|---|---|---|
| Performance | **100** | 96 / 100 / 100 | 96–100 |
| Accessibility | 97 | 97 / 97 / 97 | 0 |
| Best Practices | 77 | 77 / 77 / 77 | 0 |
| SEO | 100 | 100 / 100 / 100 | 0 |
| FCP | 0.50 s | 0.83 / 0.50 / 0.47 s | 0.47–0.83 s |
| LCP | **0.50 s** | 1.26 / 0.50 / 0.47 s | 0.47–1.26 s |
| LCP element | `h1 > span.block` "Lost Keys?" (text; the span has `content-visibility:auto`) | same in all 3 | — |
| TBT | 0 ms | 0 / 0 / 0 | 0 |
| CLS | 0.017 | 0.017 ×3 | 0 |
| Speed Index | 0.60 s | 1.13 / 0.60 / 0.55 s | 0.55–1.13 s |
| Total byte weight | 1,192 KiB | 1,192 / 1,192 / 1,193 KiB | ±1 KiB |
| JS, first-party / third-party | 289.9 / 680.7 KiB | same | ±0.5 |
| Requests | 49 | 48 / 49 / 48 | 48–49 |

## LCP and CLS detail

| Item | Mobile | Desktop |
|---|---|---|
| LCP breakdown (observed, median run) | TTFB 446 ms + element render delay 2,147 ms (render delay 933–2,621 ms across runs) | TTFB 254 ms + render delay 219 ms |
| Observed (unthrottled) FCP vs `load` | FCP 1.44–3.03 s happens **after** `load` (0.90–1.29 s). First paint waits behind main-thread JS. | FCP 0.36–0.89 s |
| Hero image | `/images/herobannerKF.webp`, 157,614 B, CSS background (`app/components/Hero.tsx:30`), `aria-hidden`. **Preloaded twice** at `fetchpriority=high` (`app/layout.tsx:128` plus a second identical tag in the HTML) but it is **not** the LCP element. It competes with JS and CSS on 4G. | same |
| CLS source | 0.017: shift of the fixed nav container (logo) | 0.016 hero section + 0.0006 h1 span |

## JS weight and the 170 KB budget

Initial scripts = the 17 `<script src>` tags in the live HTML. One of them, `a6dad97d…js` (38.5 KiB gz), is `noModule` and modern browsers skip it, so 16 count.

| Chunk | Raw | gzip -9 | Brotli (served) | Contents (string fingerprint) |
|---|---|---|---|---|
| `12f39a79…js` | 409.8 KiB | 102.8 KiB | 88.8 KiB | Supabase, EmailJS, libphonenumber, React Query (form-only code, loaded upfront) |
| `94bde637…js` | 208.8 KiB | 65.5 KiB | 56.0 KiB | react-dom / Next runtime; 548 ms bootup on mobile; 12 KiB legacy JS |
| `b7fb678b…js` + `7f6091eb…js` + `a6cab1c3…js` | 183.0 KiB | 58.6 KiB | 51.7 KiB | motion (framer) |
| `e78c9169…js`, `d1574d36…js`, `247eb132…js`, `e9929ae9…js` | 212.2 KiB | 56.3 KiB | 49.1 KiB | Next/app chunks (`__NEXT` markers) |
| `613b071b…js` | 44.3 KiB | 14.2 KiB | 12.7 KiB | Firebase app + installations (the Analytics SDK pulls gtag.js separately) |
| `35ac7689…js` + `3f2cbef1…js` | 66.3 KiB | 23.8 KiB | 20.9 KiB | Two near-identical 33,949 B chunks (Tabler icons + Next link); different md5 |
| other 4 small | 27.4 KiB | 9.6 KiB | 8.4 KiB | turbopack runtime etc. |
| **First-party initial total** | **1,151.9 KiB** | **330.8 KiB (338.7 KB)** | **287.6 KiB** | **1.99× the 170 KB gz budget** |
| Google tag JS (third-party, also on every load) | — | — | 677.4 KiB transfer | `gtag/js?id=AW-…` 166.6 · `?id=G-BDZE…&cx=c` 193.0 · `?l=dataLayer&id=G-BVYS…` 158.9 · `?id=G-BVYS…&cx=c` 158.9 KiB |

Weight after scroll (puppeteer, 390 px, scrolled to bottom): **+556 KiB more**. The Elfsight reviews widget is 514 KiB (`universe-static.elfsightcdn.com` 466 KiB script, `static.elfsight.com`, `service-reviews-ultimate.elfsight.com`, `core.service.elfsight.com`). There are also 20 first-party fetches (42 KiB, likely RSC prefetch) and a Google Maps embed iframe whose contents were not measured (OOPIF). The page is 1,191 KiB (1.22 MB) on load and about 1,747 KiB (1.71 MiB, 1.79 MB) after one scroll.

## Top opportunities and diagnostics (median mobile run)

| # | Audit | Result | Main contributors |
|---|---|---|---|
| 1 | Reduce unused JavaScript | **377 KiB** est. savings, LCP −1.2 s | gtag ×4 = 324 KiB unused (G-BVYS loader 74% unused); `12f39a79` 53 KiB |
| 2 | 3rd parties | Google Tag Manager 693,772 B (677.5 KiB) transfer, 131 ms main thread | 4 gtag.js copies |
| 3 | Long main-thread tasks | 6 tasks, TBT contribution 250 ms | gtag G-BDZE 156 ms, G-BVYS 131 ms, AW 111 + 82 ms, react-dom 71 ms, motion 59 ms |
| 4 | JS execution time / main thread | 1.0 s / 1.8 s | react-dom chunk 548 ms, gtag AW 196 ms, G-BDZE 159 ms, G-BVYS 132 ms |
| 5 | Render-blocking requests | 1 CSS file, 11.2 KiB (89 KiB raw); est. saving 0 ms | `10755e39a1c02a91.css` |
| 6 | Legacy JavaScript | 12 KiB, FCP −200 ms | `94bde637…js` |
| 7 | Network dependency tree | longest chain 688 ms: HTML → CSS → Geist woff2 (29.6 KiB) | Unused preconnects to `fonts.googleapis.com` and `fonts.gstatic.com` (`app/layout.tsx:114-121`); no Google Fonts are requested |
| 8 | TTI | 10.2 s | JS volume |
| Passed | Caching (`_next/static` and images `max-age=31536000, immutable`; HTML `max-age=3600`), image delivery, font-display, unsized images, DOM size (696 elements), duplicated JS | — | — |

## Failing audits

| Category | Audit | Detail |
|---|---|---|
| Accessibility (97) | `color-contrast` (only failure, both form factors) | "WhatsApp Us" button `div.space-y-8 > div.bg-gradient-to-br > button.w-full > span`: #ffffff on #00c950 = **2.21:1** at 16 px normal (needs 4.5:1) |
| SEO (100) | none | All 10 scored audits pass (title, meta description, crawlable, robots.txt, canonical, hreflang, link text, image alt, status). The `structured-data` audit is manual and not run. Lighthouse does not check meta-description length (175 chars) or H1 keywords. |
| Best Practices (77) | `third-party-cookies` | `test_cookie` set by `googleads.g.doubleclick.net/pagead/viewthroughconversion/17289404018/` |
| Best Practices | `inspector-issues` | 3 Cookie issues, same doubleclick URL |
| Security (informative, unscored) | `csp-xss`, `trusted-types-xss`, `origin-isolation`, `clickjacking-mitigation`, `has-hsts` | No CSP, no COOP, no X-Frame-Options/frame-ancestors. HSTS is `max-age=31556926` without `includeSubDomains`/`preload`. `curl -I /` shows no Referrer-Policy, Permissions-Policy or X-Content-Type-Options on the HTML (XCTO is present on `_next` chunks) |

## Third-party / tracking check

Method: puppeteer-core + installed Chrome (new headless). Desktop: 1440×900, normal macOS Chrome 156 UA. Mobile: 390×844 @3, Android Chrome UA. Load, wait 10 s, scroll to bottom, wait 5 s; mobile was repeated with a 15 s wait. Logged via CDP Network. URL `key=` values are masked. Both form factors show the same sequence; times are seconds from start (desktop / mobile).

| t (s) | Method | Status | Request | What it is |
|---|---|---|---|---|
| 0.7 / 1.0 | GET | 200 | `www.googletagmanager.com/gtag/js?id=AW-17289404018` | gtag loader from `app/layout.tsx:149` |
| 1.5 / 1.9 | OPTIONS+GET | 200 | `grytdgpmewmxbdimpgrr.supabase.co/rest/v1/service_types?select=*&is_active=eq.true…` | quote-form service list, on every load |
| 1.5 / 1.9 | OPTIONS+GET | 200 | `firebase.googleapis.com/v1alpha/projects/-/apps/1:291646793044:web:…/webConfig` | Firebase Analytics config |
| 1.5 / 1.9 | OPTIONS+POST | 200 | `firebaseinstallations.googleapis.com/v1/projects/key-foby/installations` | Firebase Installations (Analytics dependency) |
| 1.7 / 1.9 | GET | 200 | `googleads.g.doubleclick.net/pagead/viewthroughconversion/17289404018/` (en=gtag.config) | Ads remarketing |
| 1.7 / 1.9 | GET | **200** | `www.googleadservices.com/pagead/conversion/17289404018/?label=xI8ECM7q0ZEcEPK8nbRA` (en=conversion) | **Ads "page view" conversion on load** |
| 1.7 / 1.9 | POST | 200* | `www.google.com/ccm/collect` tid=AW-17289404018 en=page_view; `www.google.com/rmkt/collect/17289404018/` | Ads page_view + remarketing |
| 1.7 / 1.9 | POST | 204* | `ad.doubleclick.net/ccm/s/collect` | Ads |
| 2.0 / 1.9–2.2 | GET | 200 | `gtag/js?id=G-BDZE2T9HR0&cx=c`, `gtag/js?l=dataLayer&id=G-BVYSXDGWQL`, `gtag/js?id=G-BVYSXDGWQL&cx=c` | gtag copies 2–4 |
| 2.0 / 2.1 | GET | 200 | `www.google.com/pagead/1p-user-list/…`, `www.google.ca/pagead/1p-user-list/…` | Ads audiences |
| **2.1 / 2.1** | POST | **204*** | `analytics.google.com/g/collect` **tid=G-BDZE2T9HR0** (event name not captured; + `stats.g.doubleclick.net/g/collect` 204) | GA4 property A |
| 2.2 / 2.1 | POST | 302 | `googleads.g.doubleclick.net/pagead/viewthroughconversion/…` label=xI8E… en=conversion | Ads conversion (redirect is normal) |
| 2.5 / 2.8 | GET | 302 → 200* | `www.google.com/pagead/1p-conversion/…` → `www.google.ca/pagead/1p-conversion/…` label=xI8E… | Ads conversion |
| **2.5 / 2.9** | POST | **204*** | `www.google-analytics.com/g/collect` **tid=G-BVYSXDGWQL** (event name not captured) | GA4 property B (Firebase) |
| 21.2 (mobile, 15 s run) | POST | 204* | `analytics.google.com/g/collect` tid=G-BDZE2T9HR0 (event name not captured; timing fits enhanced-measurement `scroll`, inferred) | A second hit to property A after the scroll; property B sent none in the window |
| on scroll | various | 200 | Elfsight ×10 requests, `google.com/maps/embed` iframe | reviews widget + map, lazy |
| — | — | — | **No EmailJS requests** on load or scroll (submit only, not tested) | — |

\* Chrome logged `net::ERR_ABORTED` after the response arrived. This is normal for keepalive/no-cors beacons. The 2xx response means the hit was delivered.

`window.google_tag_manager` keys after load: `AW-17289404018`, `G-BDZE2T9HR0`, `G-BVYSXDGWQL`. `dataLayer` holds `config AW-…`, `event conversion send_to AW-…/xI8ECM7q0ZEcEPK8nbRA`, `config G-BDZE…`, then Firebase's `config G-BVYS… {origin:"firebase", update:true}`. The Ads and GA hits carry `gcd=13l3l3l3l1l1`, which suggests Consent Mode is not configured (inference). No console errors.

| Question | Answer |
|---|---|
| Does GA4 fire with 2xx? | **Yes, to two properties**: at least one `g/collect` 204 each per load, desktop and 390 px. Whether each hit is a `page_view`, and how many, was not captured (URLs truncated, no bodies). Re-capture with full URLs and bodies, or use DebugView, before the property decision. |
| Do the Ads tags fire? | **Yes**: conversion 200, viewthrough 302, 1p-conversion 302→200, ccm 200/204. The conversion label `xI8ECM7q0ZEcEPK8nbRA` fires on **every** load (`app/layout.tsx:160`). If that action is "Primary" in Google Ads, every visit counts as a conversion. This cannot be verified without Ads access. |
| Is GA4 loaded twice? | **Yes**: gtag in the layout (`G-BDZE2T9HR0`) and Firebase Analytics (`G-BVYSXDGWQL`), which are **different properties**. Custom events (`phone_click`, `whatsapp_click`, `quote_request`, `contact_form_submit`) go through Firebase `logEvent` (`lib/analytics.ts:35-42`), so they reach **property B only**. Property A gets the gtag `config` hits (a page_view by default) and a later hit that is probably `scroll`. |
| Brief's 503s? | Not reproduced. 0 × 4xx/5xx across 413 requests in 10 loads. Most likely a local blocker in that session. |

## Brief baseline vs measured

| Brief (§1: "one desktop load") | Measured desktop | Measured mobile | Holds? |
|---|---|---|---|
| LCP ≈ 0.5 s | 0.50 s (0.47–1.26) | 8.33 s simulated (5.64–9.27); 2.27 s with DevTools throttling | Desktop yes. **Mobile no.** |
| CLS ≈ 0.01 | 0.017 | 0.017–0.022 (0.042 with DevTools throttling) | Roughly; all ≤ 0.1 |
| ~520 KB | 1,192 KiB (1.22 MB) | 1,191 KiB | **No.** Only first-party bytes (~516 KB) match. Google tags add 677 KiB, and Elfsight adds 514 KiB after scroll. |
| Budget: mobile Perf ≥ 90 | 100 | **60** | Mobile fails |
| Budget: LCP ≤ 2.0 s | 0.50 s | 8.33 s sim / 2.27 s devtools | Mobile fails |
| Budget: initial JS ≲ 170 KB gz | 330.8 KiB gz first-party (+677 KiB br Google tags) | same | **Fails, about 2×** |
| Budget: CLS ≤ 0.1 | 0.017 | 0.017 | Passes |

## Side effects of this audit, and gaps

| Item | Note |
|---|---|
| Analytics pollution | This track: **11 page loads** (7 Lighthouse with a HeadlessChrome UA, 4 puppeteer with a normal Chrome UA), each sending collect hits to both GA4 properties and firing the on-load Ads conversion, 2026-10-27 00:14–00:32 UTC. **All Phase 0 tracks together: at least 26 JS-enabled loads of keyfoby.com, 00:14–00:42 UTC** (lighthouse 11; crawl 11: 5 JS-on renders incl. 3 legal pages and 1 soft-404, 5 screenshots, 1 FAQ probe; design-readiness 3; security-infra 1), counted from the scripts in the scratchpad at one run each (re-runs not logged). Every one loads the layout tags, so expect ≥ 26 fake Ads conversions and ≥ 26 new-user sessions in each GA4 property from this machine's IP. Later phases must block `googletagmanager.com`, `google-analytics.com`, `googleadservices.com` and `doubleclick.net` in headless runs against production. |
| Firebase side effect (not this track) | A reviewer's `firebase ext:list --project key-foby` (~01:05 UTC) printed that it was enabling `firebaseextensions.googleapis.com`. The API is probably now on (no resources, no cost on Spark). Disable only on the client's go. Phase 1+ must not run `firebase ext:*`, `apphosting:*` or any CLI call that auto-enables an API (`security-infra.md` §4). |
| CrUX / field data | Not obtained: the PageSpeed Insights API returned 429 (keyless daily quota). Real-user LCP/INP is unknown. |
| INP | Not measurable in lab navigation runs. TBT 230–270 ms (simulated) / 461 ms (DevTools) suggests a risk to the INP ≤ 200 ms target. |
| Google Maps iframe weight | Out-of-process iframe; its subresources were not counted. |
| Which GA4 property holds history | Cannot be checked without GA4 access. Needed before Phase 4 "same measurement ID". |
| Run-to-run noise | Mobile LCP spread is 3.6 s across 3 simulated runs. A single run is not reliable; use the median of 3 or more for Phase 4 gates. |

## Files

| Path | Content |
|---|---|
| `docs/baseline/lighthouse/mobile.report.{html,json}` | median mobile run (run 3, perf 60) |
| `docs/baseline/lighthouse/desktop.report.{html,json}` | median desktop run (run 2, perf 100) |
| `docs/baseline/lighthouse/mobile-devtools-throttling.report.json` | cross-check run with DevTools throttling |
| `docs/baseline/lighthouse/tracking-desktop.json`, `tracking-mobile.json` | raw request capture (keys masked) |
