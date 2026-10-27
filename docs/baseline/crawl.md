# Baseline crawl: www.keyfoby.com

Observed 2026-10-26 (server clock 2026-10-27 00:14 UTC), method: `curl -sL` with a desktop Chrome UA for raw HTML; headless Chrome 141 via puppeteer-core, run twice per page (JS off = raw parse; JS on = network idle + 3 s), plus a third pass after one full scroll; cheerio for parsing raw files; OSM Nominatim for one geocode check. All responses came from the Firebase/Fastly YYZ edge. No cloud resources were changed.

## Files

| Path | What |
|---|---|
| `crawl/<slug>.raw.html` | curl body (follows redirects) for `home`, `privacy-policy`, `terms-of-service`, `warranty`, `does-not-exist-xyz` |
| `crawl/<slug>.rendered.html` | Chrome DOM at network idle + 3 s, **before** scrolling, 1280x800 |
| `crawl/robots.txt`, `sitemap.xml`, `ads.txt` | As fetched |
| `screenshots/home-{375,768,1280}-full.png` | Full page after one scroll (fonts and images awaited), DPR 1 |
| `screenshots/home-375x812-fold.png`, `home-1280x800-fold.png` | Above the fold, no scroll |

Scripts and JSON output are in the session scratchpad (`phase0/crawl/`), not in the repo.

## 1. Brief section 2 claims, re-checked

| Brief claim | Result | Evidence |
|---|---|---|
| One page; sitemap has 4 URLs | **Confirmed.** 3 of the 4 sitemap URLs return 301 (see §7) | `crawl/sitemap.xml`; curl status codes |
| H1 has no keywords | **Confirmed.** "Lost Keys? Need a Spare? We've Got You.." (double period) | raw and rendered H1 |
| Meta description is 175 chars | **Confirmed:** 175 | `home.raw.html` `<meta name="description">` |
| 6 H2s, 3 `<img>`, emoji icons | **Confirmed.** All 3 `<img>` are the logo SVG (one is hidden). The hero photo is a CSS background (`herobannerKF.webp`). Emoji are used as icons in the body copy and in 13, 24 and 8 legal-page headings | rendered extraction |
| Reviews and map ship as "Loading…" in HTML | **Confirmed, and worse than stated.** Raw HTML shows only the nav and hero. Every section below the hero sits in React Suspense `<div hidden id="S:0..6">` blocks, and the visible fallback is "Loading..." ×6. The same document carries 7 inline `$RC("B:n","S:n")` calls (plus the `$RC=` definition) that swap each block in as it is parsed, without waiting for the JS bundles, so any JS-enabled user or renderer sees the sections. After JS runs, "Loading reviews..." and "Map loading..." still show until the user scrolls. Reviews come from a third-party Elfsight widget that loads on IntersectionObserver | `app/page.tsx:7-15,20,31-51`; `app/components/GoogleReviews.tsx:13-20,89,98-104`; `app/components/ContactForm.tsx:1063` |
| FAQ answers in HTML: not verified | **Answers are not in the HTML at all,** raw or rendered. They exist only in FAQPage JSON-LD. Click test: the answer string appears 1× before the click (JSON-LD only) and 2× after `aria-expanded=true` | `probe.js` result `{before:1, after:2}` |
| GA4 + Ads gtag logged 503 | **Not reproduced.** `gtag/js` for AW- and G- returned 200, GA4 `g/collect` returned 204 and Ads conversion returned 200. **New issues:** (a) `gtag('event','conversion')` fires on **every page load**; (b) a **second GA4 ID** (G-BV…, from the Firebase Analytics SDK) also sends a page_view | `app/layout.tsx:160`; network log |
| Data-conflict table (hours, reviews, area) | **Confirmed, and there are more conflicts** (§6) | — |
| robots.txt fine; Crawl-delay ignored by Google | **Confirmed.** It also blocks AhrefsBot, SemrushBot and MJ12bot (§7) | `crawl/robots.txt` |

## 2. Page summary

| Page (requested) | Status, final URL | Title (chars) | Meta description (chars) | Canonical | Robots | H1/H2/H3 | Words: raw visible / raw incl. hidden / rendered / after scroll | Links int / ext (anchors) | JSON-LD @types |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 200 | KeyFoby – Car Key Fob & Locksmith Services Hamilton, ON \| 24/7 (**62**) | Hamilton's trusted car key replacement… Call (905) 467-6860. (**175**) | `https://www.keyfoby.com/` | index, follow (+googlebot max-snippet:-1) | 1/6/10 | **40** (cheerio) / 64 (Chrome, JS off) / 555 / 772 / 1,020 | 16 / 4 (24) | Locksmith; Locksmith+LocalBusiness; FAQPage; HowTo; WebSite; Organization |
| `/privacy-policy/` | 301 → `/privacy-policy` 200 | Privacy Policy \| KeyFoby Automotive Locksmith Hamilton (54) | (154) | `…/privacy-policy/` (**redirects**) | index, follow | 1/12/32 | 1,174 (no JS dependency) / 1,388 rendered | 25 / 7 (37) | Locksmith (with 5.0/47 rating) |
| `/terms-of-service/` | 301 → `/terms-of-service` 200 | Terms of Service \| KeyFoby Automotive Locksmith Hamilton (56) | (133) | `…/terms-of-service/` (**redirects**) | index, follow | 1/16/41 | 1,870 / 2,130 rendered | 30 / 3 (36) | Locksmith (same) |
| `/warranty/` | 301 → `/warranty` 200 | 3-Month Service Warranty \| KeyFoby Automotive Locksmith Hamilton (**64**) | (139) | `…/warranty/` (**redirects**) | index, follow | 1/9/10 | 1,022 / 1,153 rendered | 17 / 3 (24) | Locksmith (same) |
| `/does-not-exist-xyz/` | **200** (soft 404): byte-identical to `/`, same ETag | homepage title | homepage | `https://www.keyfoby.com/` | index, follow | homepage | homepage | homepage | homepage set |

The raw and rendered title, description, canonical and robots are identical on every page. No hreflang anywhere (`lang="en-CA"`). Meta keywords are 1,244 chars on every page. There are no `<header>` or `<nav>` landmarks; only `<main>` and `<footer>`.

### OG / Twitter (identical on all 4 pages)

| Tag | Value | Issue |
|---|---|---|
| og:title / twitter:title | KeyFoby – Hamilton's Car Key & Locksmith Experts \| 24/7 Service | Legal pages share the homepage OG |
| og:url | `https://www.keyfoby.com/` | Wrong on legal pages |
| og:image / twitter:image | `/images/keyfobykeys.png?v=2025`, declared 1200x630 | **Actually 1024x1024 and 1.89 MB PNG** (`sips`) |
| og:locale / type | en_CA / website | — |
| twitter:site / creator | @KeyFoby | `twitter.com/keyfoby` 301s to `x.com/keyfoby`, which returned 404 to curl (X may block bots; unverified) |

## 3. Homepage content layers (raw vs JS)

| Layer | Content | Crawlable without JS? | Source |
|---|---|---|---|
| Visible in raw HTML | Nav, hero (H1, subline, 5 ticks, CTAs, trust bar) | Yes (40–64 words) | — |
| In raw HTML but `hidden` until React swaps it in | Services + Areas (S:0, 107 w), Why Choose (S:1, 54), App promo (S:2, 58), Reviews shell (S:3, 33), FAQ **questions** (S:4, 113), Quote form + contact (S:5, 118), Footer (S:6, 39) Text is present but in `div[hidden]`; the visible placeholder is "Loading...". Inline `$RC` scripts in the same HTML reveal each block as it parses, before the bundles load (JS-on only) | `app/page.tsx:7-15` (`React.lazy`), `:31-51` (`<Suspense fallback={<SectionLoader/>}>`) |
| JS + scroll only | Elfsight Google reviews ("4.9", "(222)", six recent reviews, "Free Google Reviews Widget" badge); Google Maps iframe | **No.** Absent from `home.rendered.html` (pre-scroll); present only after scrolling | `GoogleReviews.tsx:13-20` (IntersectionObserver), Elfsight app `8e58cda1…` |
| Click only | 12 FAQ answers (price ranges, areas, warranty) | **No.** Only in FAQPage JSON-LD | `FAQSection` (accordion mounts the answer on click) |

Map iframe target: `google.com/maps/embed?...!2sGreater Toronto Area, ON`. It shows the GTA, not KeyFoby's location or Hamilton.

### Homepage H1–H3 outline (identical raw and rendered)
H1 Lost Keys? Need a Spare? We've Got You.. · H2 Professional Key Fob & Locksmith Services in Hamilton (H3 Car Key Fobs, H3 Areas We Serve) · H2 Why Choose KeyFoby (H3 Fast Service, Personalization, Mobile-Friendly, Secure Process) · **H2 Introducing KeyFoby App** · H2 What Our Customers Say · H2 Frequently Asked Questions · H2 Get Your Free Quote (H3 Vehicle Information, Prefer to Talk?, Service Area) · H3 KeyFoby (footer). The H1 is the only heading that mentions neither the service nor the place.

The legal pages are mostly about the SaaS app (H2/H3 "User Accounts", "Google OAuth", "Inventory Management", "Account Termination", "Google Calendar API (Planned Feature)"), with emoji in their headings.

## 4. Links and images (homepage, rendered)

| Type | Targets (count) | Notes |
|---|---|---|
| Internal | `/` ×3, `/#services` ×5, `/#features`, `/#contact` ×2, `/terms-of-service` + `/terms-of-service/`, `/warranty` + `/warranty/`, `/privacy-policy/` | **Zero links to any service, location or make page** (none exist). Slash and no-slash forms are mixed |
| External | `app.keyfoby.com` ×2 (followed; nav "📱 App" + "Get Early Access"), `wa.me/+19054676860`, `tekmadev.com` | After scroll, the Elfsight badge link is added |
| tel: | `tel:+1 (905) 467-6860` ×4 | Not E.164 in the href |
| Broken / dead | Footer Facebook icon `href="#"`. On the legal pages the footer "Our Services" links go to `/privacy-policy#services` etc.; that anchor does not exist on those pages | `home.rendered.html` |

| Image | Size | alt | width/height attr | Notes |
|---|---|---|---|---|
| `/images/KeyFoby-logo/keyfobylogo.svg` ×3 | 2.3 KB | "KeyFoby Logo" | 40/40, 40/40 (hidden), 48/48 | `loading="lazy"` on the above-fold logo |
| `herobannerKF.webp` (CSS bg) | 157 KB, 1920x851 | none (CSS) | — | Stock-style hands-and-key photo |
| Sitemap image entries `carkey.webp`, `keyfobykeys.png` | 1.98 MB, 1.89 MB | — | — | Listed in the sitemap but not used as `<img>` on the page |

## 5. JSON-LD inventory (homepage has 6 blocks; each legal page has block 0 only)

| Block | @type | name / @id | telephone | address / geo | hours | aggregateRating / review | areaServed | sameAs | priceRange | Other |
|---|---|---|---|---|---|---|---|---|---|---|
| 0 | Locksmith | KeyFoby (alt "KeyFoby Keys"); **no @id** | +1-905-467-6860 | 40 Courtland Ave, Hamilton ON L9B 1X6; geo 43.2557, -79.8711 | `openingHours` Mo-Fr 08:00-18:00, Sa 09:00-16:00 | **5.0 / 47** (hard-coded) | 10 strings: Hamilton, Burlington, Oakville, Mississauga, Brampton, Toronto, Ancaster, Dundas, Stoney Creek, Grimsby | facebook.com/keyfoby, instagram.com/keyfoby, twitter.com/keyfoby | $$ | foundingDate 2022; 3 Offers; description "24/7 emergency lockout" |
| 1 | [Locksmith, LocalBusiness] | KeyFoby; **no @id** (duplicate entity) | +1 (905) 467-6860 | same | `openingHoursSpecification` same | **5.0 / 47** + **3 Reviews: "Sarah Johnson", "Mike Thompson", "Amanda R."** (one says "locked out… on a Sunday night") | same 10, as City objects | same | $$ | 5 Offers incl. "24/7 Emergency Car Lockout Service" |
| 2 | FAQPage | 12 Q&A | in text | — | "24/7 emergency lockout" | — | 10 towns | — | $50–$400 in answer text | Answers not visible on the page |
| 3 | HowTo | How to Get a Car Key Replacement in Hamilton | — | — | totalTime PT45M | — | — | — | estimatedCost CAD 50–400 | HowTo rich results are no longer shown by Google |
| 4 | WebSite | KeyFoby | — | — | "24/7" in description | — | — | — | — | SearchAction → `/#contact?q={search_term_string}` (the site has no search) |
| 5 | Organization | KeyFoby | +1-905-467-6860 | same street address | contactPoint `hoursAvailable` Mon–**Sun**, "Emergency service available 24/7"; availableLanguage English, **French** | — | contactPoint CA-ON | same 3 | — | logo = 1.89 MB PNG |

Sources: `lib/business-data.ts:27,290-298,362-365`; `app/components/LocalBusinessSchema.tsx:32,132-135,143-168,281`. **Where each block ships:** block 0 (with `aggregateRating` 5.0/47) is injected by `app/layout.tsx:138-143`, so it is on every page. Blocks 1–5 come from `LocalBusinessSchema`, which only `app/page.tsx:4,27` imports, so the 3 named reviews ship on `/` and on every soft-404 URL (same bytes), not on the legal pages. Check: `grep -c 'Sarah Johnson' crawl/*.raw.html` = home 1, does-not-exist-xyz 1, privacy-policy 0, terms-of-service 0, warranty 0. The three named reviews do not match any of the six reviews the live Elfsight widget shows, and they are not visible anywhere on the page. They cannot be verified and should be treated as unverified proof.

**Geo check:** 43.2557, -79.8711 reverse-geocodes to **Main St W, Durand** (lower city). "40 Courtland Ave, Hamilton" geocodes to 43.2171, -79.9139 (Falkirk East, Mountain), **about 5.5 km apart**. OSM gives postcode L9B 1A7 for that point; the site says L9B 1X6 (not verified).

## 6. NAP and claims consistency (rendered text after scroll, meta, JSON-LD)

| Item | Home: visible | Home: meta | Home: JSON-LD | Legal pages | Conflict? |
|---|---|---|---|---|---|
| Phone | +1 (905) 467-6860 (nav, contact), (905) 467-6860 (FAQ CTA); WhatsApp same number | (905) 467-6860 in desc/OG/Twitter | +1-905-467-6860 (b0, Org), +1 (905) 467-6860 (b1) | +1 (905) 467-6860 | Same number, 4 formats. OK |
| Email | none | — | keyfoby@gmail.com | keyfoby@gmail.com | — |
| Hours | Hero "24/7 Mobile Service", trust bar "24/7 Emergency Service", stat "24/7 Support Available"; contact "**Mon-Fri: 8AM-6PM**"; footer "**Coming Soon** → 24/7 Service" | Title "\| 24/7"; OG "24/7 Service" | Mo–Fr 08–18 + Sa 09–16 (b0, b1); Org contactPoint **Mon–Sun 24/7**; FAQ/WebSite "24/7 emergency lockout"; Review "Sunday night" | Terms: Mon–Fri 8–6, Sat 9–4 EST, **Sunday Closed**; footer "Coming Soon 24/7" | **YES, 5 versions** |
| Address | "Hamilton" only | "Hamilton, ON" | 40 Courtland Ave, Hamilton ON L9B 1X6; geo = Main St W (lower city) | **Street address visible** on Privacy + Terms | **YES:** street address is public on 2 pages and in schema; geo does not match it |
| Rating / reviews | Hero "5-Star Service"; "5-Star Rated"; **"4.9 Rating" (App promo mock, "iOS & Android")**; widget after scroll "4.9 (222)" | — | **5.0 / 47** + 3 unverified named reviews | 5.0 / 47 in schema | **YES** |
| Service area | Hero "Hamilton and surrounding areas"; services "Hamilton, Burlington, Oakville, and Greater Toronto Area"; Areas grid 10 towns; contact "We serve Hamilton and the Greater Toronto Area" + 6-town list; map = GTA | "Hamilton, Burlington, Oakville & GTA" | 10 towns; Org CA-ON | OG text only | **YES:** 10 vs 6 vs "GTA" |
| Response / speed | "15-30 minutes" duplications; "15-min average" response | — | FAQ: "within 30 minutes" lockout; programming "15 to 45 minutes" | — | 3 different figures, all unverified |
| Licence / insurance | "Licensed & Insured" ×3; "proper licensing and insurance coverage" | "Licensed & insured" | description + FAQ "fully licensed and insured… technicians certified" | — | No licence number or insurer published anywhere |
| Other unverified | "100+ Keys Made", "100% Satisfaction Guaranteed", "© 2025" | — | foundingDate 2022, French support | "© 2025" | — |
| Prices | None visible (only the App's "$50 → $25/mo") | — | FAQ $50–$400; cut ~$50; transponder $100–200; prox $200–400; HowTo 50–400 | — | Prices exist only in schema and click-only FAQ |

## 7. Crawl control

### Sitemap (`/sitemap.xml`, 4 URLs; every lastmod is 2025-06-10; the server `Last-Modified` for all files is 2026-09-03)

| loc | Status | Final URL | Canonical on final page | Matches? |
|---|---|---|---|---|
| `https://www.keyfoby.com/` | 200 | same | `https://www.keyfoby.com/` | Yes |
| `…/privacy-policy/` | **301** | `/privacy-policy` | `…/privacy-policy/` | **No.** Canonical points to a URL that redirects back to the page (loop) |
| `…/terms-of-service/` | **301** | `/terms-of-service` | `…/terms-of-service/` | **No** (same loop) |
| `…/warranty/` | **301** | `/warranty` | `…/warranty/` | **No** (same loop) |

Cause: `next.config.ts:16` `trailingSlash: true` vs `firebase.json:12` `trailingSlash: false`. Canonicals are set in `app/{privacy-policy,terms-of-service,warranty}/page.tsx:16`. Image entries point to 1.9–2 MB files.

### URL behaviour

| Request | Result |
|---|---|
| `http://keyfoby.com/` | 301 → `https://keyfoby.com/` → 301 → `https://www.keyfoby.com/` (2 hops) |
| `http://www.keyfoby.com/`, `/index.html` | 301 → `https://www.keyfoby.com/` |
| `/does-not-exist-xyz/`, `/services/`, `/app`, `/Warranty`, `/privacy-policy.html`, `/warranty.html`, `/manifest.json` | **200 + homepage HTML** (135,003 B), canonical `/`. Cause: `firebase.json:7-8` rewrites `**` to `/index.html`, so `errorDocument` (`out/404.html`, 39,723 B, exists) is never served for unknown paths |
| `/404` | **200 with `out/404.html`** (39,723 B, = `wc -c out/404.html`), not the homepage: `cleanUrls` maps `/404` to `404.html`. Its HTML has `<meta name="robots" content="noindex">` (plus a second `index, follow` robots meta from the layout). The not-found page exists and works; only the `**` rewrite keeps it from unknown paths (curl 2026-10-27 01:20 UTC) |
| `key-foby.web.app`, `key-foby.firebaseapp.com` (+ any path) | 200, full site; canonical → www (mitigated, not blocked) |
| Security headers on HTML | Only `strict-transport-security: max-age=31556926` (no includeSubDomains). The `nosniff` declared in firebase.json for `**/*.html` is absent on `/` and `/privacy-policy`. No CSP, X-Frame-Options, Referrer-Policy or Permissions-Policy |

### robots.txt (verbatim)
```
User-agent: *
Allow: /

# Sitemap
Sitemap: https://www.keyfoby.com/sitemap.xml

# Respectful crawl delay
Crawl-delay: 1

# Major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

# AI / Generative Engine crawlers - allowed for GEO visibility
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: meta-externalagent
Allow: /

# Block aggressive scrapers
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: SemrushBot
Disallow: /
```
AI crawlers are allowed. A crawler that does not run JS sees 40 visible words plus "Loading..."; the other ~515 words (555 in total) are in the same HTML but inside `hidden` divs, and whether a non-JS crawler indexes hidden text is crawler-specific. Which AI crawlers run JS was not tested. For every crawler, the FAQ answers (JSON-LD only) and the reviews (Elfsight, after scroll) are absent. `ads.txt` (200) only says the site has no ad monetization.

## 8. Tracking observed during the render (cross-check for Phase 1/4)

| Tag | Observed | Note |
|---|---|---|
| Google Ads AW-17289404018 | gtag/js 200; conversion 200; remarketing 200 | `gtag('event','conversion',{send_to:'AW-…/xI8E…'})` runs on **every page load** (`app/layout.tsx:160`), so every pageview counts as a conversion |
| GA4 G-BD… (gtag) | `g/collect` 204 | Fires |
| GA4 G-BV… (Firebase Analytics SDK, project `key-foby`) | gtag/js 200, `g/collect` 204 | **A second GA4 property gets page_views** (`lib/firebase.ts:2,32`) |
| Supabase REST `service_types` | 200 | Quote form service list. Its raw fallback is "Loading services..." (`ContactForm.tsx:708`) |
| Elfsight, Google Maps JS | Load after scroll | Third-party JS; the reviews are not first-party content |

Secret scan (masked): saved HTML and 17 live JS chunks contain one Supabase JWT with `role: anon` (public by design) and one Firebase web `AIza…` key (public identifier). **No service_role or private key was found.**

## 9. Screenshots

| File | Size | Notes |
|---|---|---|
| `home-375x812-fold.png` | 257 KB | No phone number text in the fold; "Call Now" button 311x52 at about y=610; H1 30 px |
| `home-1280x800-fold.png` | 810 KB | Phone in nav; Messenger + WhatsApp icons; centred hero with two pill CTAs |
| `home-375-full.png` | 1.44 MB | **Captured at 399 px wide:** the page overflows by 24 px at 375 (App-promo phone mock + decorative blobs, `AppPromo.tsx`); page height 12,841 px |
| `home-768-full.png` | 2.09 MB | Overflows by 16 px (784 wide) |
| `home-1280-full.png` | 2.28 MB | Reviews and map loaded after scroll; height 8,499 px |

## 10. Top SEO problems (ranked by impact on the local-pack and organic goals)

1. **Thin crawlable content and only one URL.** Raw HTML has 40 visible words and about 555 including the 7 hidden Suspense blocks, which inline `$RC` scripts reveal for any JS-enabled renderer (Googlebot included, untested here). The substantive gaps: FAQ answers exist only in JSON-LD (visible only after a click), and reviews and map appear only after scroll. There are no service, location, make or pricing pages, and the homepage links only to `#anchors` and legal pages. *Fix: Phase 1 puts the FAQ answers and first-party reviews in the HTML (the substantive fixes) and drops the Suspense placeholders; Phase 2 builds the URL architecture.*
2. **The entity data contradicts itself.** There are 5 versions of the hours (24/7 / Mon–Fri 8–6 / +Sat 9–4 / Sun closed / "24/7 Coming Soon"), 3 ratings (5.0/47, 4.9/222, "5-Star", plus an App "4.9 Rating"), and 3 area definitions. The geo coordinates are 5.5 km from the listed street address, and that address is public on 2 pages. *Needs Truth Table answers.*
3. **Structured data that breaks policy or misleads.** Hard-coded self-serving `aggregateRating` 5.0/47 in block 0 on every page, plus 3 unverified named reviews in block 1 on `/` and every soft-404 URL (not on the legal pages, §5), FAQPage answers not visible on the page, two Locksmith nodes with no `@id`, a deprecated HowTo, a fake SearchAction, a "French" contactPoint, and `sameAs` with an unverified X profile and no GBP link.
4. **Soft 404 across the whole site.** Any path returns 200 with the homepage and canonical `/` (`firebase.json:7-8`). This also affects the default `*.web.app`/`*.firebaseapp.com` hosts. Phase 2 URLs such as `/services/` currently "exist" as homepage duplicates.
5. **Trailing-slash, canonical and sitemap conflict.** 3 of 4 sitemap URLs 301; their canonicals point to the redirecting URL; internal links mix both forms; lastmod is stale (2025-06-10). Cause: `next.config.ts:16` vs `firebase.json:12`.
6. **On-page basics.** The H1 has no service or place; the title is 62 chars (warranty 64); the description is 175. The SaaS "KeyFoby App" takes a homepage H2, a nav item, followed links to `app.keyfoby.com` and a fake-looking app rating, and the legal pages are written for the app.
7. **Share and social signals.** Legal pages reuse the homepage og:url and og:title; og:image is 1024x1024 at 1.89 MB but declared as 1200x630; the footer Facebook icon is `href="#"`; footer service links point to anchors that don't exist on the legal pages.
8. **Measurement integrity.** The Ads conversion fires on every pageview, and two GA4 properties collect page_views. Any baseline "conversions" in Ads are inflated.
9. **Mobile and accessibility hygiene.** Horizontal overflow at 375/768, no `<header>`/`<nav>` landmarks, emoji icons, the above-fold logo is lazy-loaded, and `tel:` hrefs are not in E.164 form.
10. **Headers and housekeeping.** Only HSTS is set (no nosniff, CSP or framing policy on HTML). The apex → www chain takes 2 hops from http. Meta keywords are 1,244 chars. robots.txt blocks AhrefsBot and SemrushBot, which also blocks the client's own audits in those tools.

## Gaps

- Googlebot's actual render was not tested (no Search Console URL Inspection access). It is unknown whether Google's tall viewport triggers the review and map IntersectionObservers.
- The rating of 4.9/222 is as reported by the Elfsight widget, not read from the GBP directly.
- Whether the Facebook, Instagram and X profiles exist is unverified: curl got 400, a generic 200 and 404, and these sites block bots.
- The 3 JSON-LD reviews could in theory be older real reviews outside the widget's 6 most recent. The repo says otherwise: `SEO_STRATEGY.md:30` lists "Fake reviews for demonstration (replace with real ones)". The names "Sarah Johnson", "Mike Thompson" and "Amanda R." have not been checked against the 222 GBP reviews: TODO (no saved copy of the review texts; the browser-pane track loaded them but did not record names).
- Postal code L9B 1X6 vs OSM's L9B 1A7 was not verified against Canada Post.
- Performance and Lighthouse are covered by another track. Screenshots are unthrottled headless Chrome; the 375/768 runs used mobile and tablet UA plus touch emulation.
