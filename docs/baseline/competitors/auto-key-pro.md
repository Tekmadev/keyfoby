# Competitor: Auto Key Pro (autokeypro.ca, Hamilton)

Observed 2026-10-26 (00:14–00:55 UTC Oct 27), method: curl with a desktop Chrome UA (every sitemap, 16 sampled pages, all 117 blog posts), headless Chrome via puppeteer-core at 375 / 1280, one Lighthouse 12.2.1 mobile run, the public Google Maps preload response fetched by curl (rating, reviews, categories, hours), WebSearch / WebFetch for directory and off-site cross-checks. Raw files are in `scratchpad/phase0/competitors-2/autokeypro/` and `.../gbp/` (session scratchpad, not committed).

**Bottom line.** Auto Key Pro is the strongest SEO operator in this set, and it wins on volume and age, not quality: about 464 indexable URLs, a site running since 2014, three GBP listings, a make/model/year price lookup, and paid off-site link building. On-page basics are poor: no meta descriptions, no JSON-LD, the brand name as H1, city pages that are find-and-replace copies, and a mobile Lighthouse score of 47. KeyFoby can beat every page type they have with fewer, better pages.

## 1. Identity, NAP and GBP

| Field | GBP: Rymal (Mountain) | GBP: Main St E (downtown) | GBP: "Hamilton Van" | Website | Directories |
|---|---|---|---|---|---|
| Rating / reviews | **4.8 / 661** | **4.3 / 84** | **5.0 / 61** | Trustindex widget: "EXCELLENT, based on 461 reviews" | n/a |
| Categories | Locksmith, Auto parts store, Auto repair shop, Computer repair service, Electronics repair shop, Key duplication service | Locksmith | Locksmith, Emergency locksmith service, Service establishment, Key duplication service | n/a | n/a |
| Address | 1154 Rymal Rd E Unit 6, L8W 3N7 | 961 Main St E, L8M 1N1 | none (service-area listing) | Footer lists both: "Downtown Location 961 Main St E" and "Mountain Location 1154 Rymal Rd E, Unit #6" | Canpages / YP: 961 Main St E |
| Phone | (289) 799-9585 | (289) 799-9585 | (289) 799-9585 | 289 799 9585 (header, sticky bar, footer). **FAQ page says 289-441-4446** | Canpages / YP: 289-441-4446 |
| Hours | Mon–Fri 11 a.m.–6 p.m., Sat–Sun closed | **Closed all 7 days** | Mon–Fri 11 a.m.–7 p.m., Sat–Sun closed | Contact page: "Shop Mon–Fri 11:00 AM–6:00 PM (by appointment)" and "Emergency Van Daily 8:00 AM–11:00 PM (by appointment)" | Canpages Mon–Fri 10–6; VyMaps 11–6 |

- The brief's figures (4.8/661, 4.3/84, 5.0/61, three listings on one number) are **confirmed** from Maps data. The site's testimonials page links three separate review URLs: "Mountain Shop", "Downtown shop" and "Van".
- The downtown listing shows **closed every day**, yet the site still advertises the downtown store. Proximity overlap matters here: Auto Key Pro's biggest listing (661 reviews) sits **on the Mountain** (Rymal Rd E), so KeyFoby's location gives it no unique proximity edge over this competitor.
- **Hours conflict, and it is exploitable.** GBP says weekdays only, with no weekend hours on any listing. The site claims "7 days a week" (home, all city pages), "day or night" (/services/car-key-replacement/), "round the clock" and "we will be with you within minutes" (/services/car-key-programming/). KeyFoby's GBP shows "Open 24 hours". If that is true (Truth Table #1), evenings and weekends are a real wedge against them.
- The widget's 461 does not match any GBP total (661 / 84 / 61; 806 combined). It is likely stale or tied to one listing; not reconcilable from outside.

## 2. Platform and tech

| Item | Value | Evidence |
|---|---|---|
| CMS | WordPress 7.1.3 + Elementor 4.3.5 / Elementor Pro, Astra theme | `<meta name="generator">` on every page |
| Host | Hostinger, LiteSpeed cache (`server: hws`, `platform: hostinger`) | `curl -I https://autokeypro.ca/` |
| Canonical host | apex `https://autokeypro.ca/` (www and http both 301 to it) | curl redirect checks |
| robots.txt | **404**, so there is no robots file and no Sitemap line | `curl https://autokeypro.ca/robots.txt` → 404 |
| Sitemap | WP core `wp-sitemap.xml` (`/sitemap.xml` 301s to it); no SEO plugin (no Yoast or Rank Math markup) | sitemap fetch |
| Forms | Gravity Forms (quote), Contact Form 7, Elementor forms (B2B) | script/src list |
| Third parties on home | GTM, GA4, Google Ads (googleadservices, doubleclick), Bing UET, **Google AdSense** (`adsbygoogle.js`), Trustindex, Google Maps JS, Google Fonts; 21 hosts total | headless request log |
| Lighthouse mobile, home (1 run, simulated throttle) | **Perf 47**, LCP 11.7 s, CLS 0.217, TBT 100 ms, FCP 3.5 s, 3,645 KB, 154 requests; SEO 92, A11y 87 | `lh-mobile.json` |

## 3. Indexable URL inventory

All sitemaps were fetched. Every sampled URL returns 200 with `robots: max-image-preview:large` (no noindex) and no `X-Robots-Tag`.

| Sitemap | URLs | Notes |
|---|---|---|
| wp-sitemap-posts-post-1 | 117 | blog |
| wp-sitemap-posts-page-1 | 43 | pages |
| wp-sitemap-posts-e-landing-page-1 | 1 | `/b2b/` |
| wp-sitemap-posts-elementor-hf-1 | 1 | `/elementor-hf/footer/` (301, so not indexable) |
| wp-sitemap-taxonomies-category-1 | 17 | category archives |
| wp-sitemap-taxonomies-post_tag-1 | 285 | tag archives |
| **Total listed / indexable** | **464 / 463** | |

| Type | Count | URLs / notes |
|---|---|---|
| Home | 1 | `/` (it doubles as the "Hamilton Locksmith" area page in the menu) |
| Service | 19 | `/services/` index + 16 children (car-key-replacement, car-key-programming, car-key-duplication, immobilized-key-programming, repair-damaged-remotes, refurbish-broken-key-shells, install-new-batteries, erase-keys-from-car-memory, ignition-repair, ignition-housing-rebuild, no-start-conditions, remote-starter, motor-cycle-keys, automotive, igla-alarm, ducati-all-keys-lost…) + `/lost-keys-and-lockouts/` + `/igla/` (product) |
| Location | 9 real + 2 junk | `/areas/` index + Ancaster, Brantford, Burlington, Caledonia, Grimsby, Oakville, Stoney Creek, Waterdown. **Junk, indexable:** `/areas/ancaster-locksmith11/` (title "Tampa Locksmith") and `/areas/elementor-5214/` ("Brandon Locksmith") |
| Make / vehicle | 0 dedicated pages | Closest: 12 make-named **category archives** (audi, bmw, chevrolet, dodgechryslerjeep, kawasaki, land-rover, mercedes, mini-cooper, nissan, porsche, subaru, vw-volkswagen), the Ducati service page, and 35 make-named blog posts |
| Blog / guides | 117 posts | 2014–2021: 66 posts, mostly short job write-ups (e.g. "Porsche Cayenne lost keys in Hamilton", 243 words). 2022–2023: 31 generic SEO articles. **20 posts dated 7 Jul 2026**, generic filler (e.g. "contact-our-expert-for-…", 267–603 words) |
| Taxonomy archives | 302 | 17 categories + 285 tags. Tag archives hold 1–2 posts each (checked: /tag/hamilton-ontario/, /tag/honda/, /tag/prox/) |
| Other | 13 + B2B | about, contact, faqs, testimonials, news, key-result-page, service-job-request, thank-you, **thanks-you, tets, sample-page, igla-2 ("IGLAtemp")**, plus `/b2b/` |

Blog body word counts (post-content widget only, all 117 fetched): median 324, min 31, max 839; 51 under 300 and 13 under 150. **116 of 117 posts have no H1**, none have a meta description, none have JSON-LD.

## 4. Sampled pages

| | Home `/` | Car key replacement `/services/car-key-replacement/` | Car key programming `/services/car-key-programming/` | Location `/areas/burlington-locksmith/` | Make hub `/category/audi/` | Make post `/mercedes-fob-key-lost-in-hamilton/` |
|---|---|---|---|---|---|---|
| Title (chars) | "Auto Key Pro – Emergency and Advanced Car Locksmith Services in Hamilton" (72, truncates) | "Car Key Replacement – Auto Key Pro" (34) | "Car Key Programming – Auto Key Pro" (34) | "Burlington Locksmith – Auto Key Pro" (35) | "Audi – Auto Key Pro" (19) | "Mercedes FOB Key Lost in Hamilton – Auto Key Pro" (48) |
| Meta description | **none** | none | none | none | none | none |
| H1 | "Auto Key Pro" (keyword line is an H5) | "Car Key  Replacement" | "Car Key Programming" | "Auto Key Pro" | "Audi" | **none** (title is an H2) |
| Main words | 1,058 (739 own copy + ~320 widget reviews) | 572 | 641 | 1,085 (766 own copy) | 636 (post excerpts) | 311 |
| JSON-LD | **none** | none | none | none | none | none |
| Microdata | Astra WebPage / CreativeWork / WPFooter only | same | same | same | Blog | Blog |
| In-body links (outside nav) | /contact/ + taol.net | /contact/ only | /contact/ only | /contact/ + taol.net + a broken `http://289 799 9585` href | 8 post links, mostly not Audi-specific | none |
| Prices | none | none | none | none | none | none |

Page-level notes:
- **Car key replacement has the wrong intent.** About 80% of the copy is about lockouts ("Locked Out Of Your Car And Don't Know What To Do?"). It does not cover key types, process, what to bring, cost or turnaround. This is the page type KeyFoby is fighting for.
- **Location pages are doorways.** Burlington and Ancaster are the home copy with the city name swapped. 5-gram Jaccard similarity to home, with the reviews widget excluded: Burlington 0.71, Ancaster 0.75, Stoney Creek 0.48 (it adds a city list). The H2 skeleton is identical ("Your Locksmith in X", "Why Choose Us?", "Google Reviews", "Auto Lockouts / Lost Car Keys", "We are the X Transponder Key Experts"). Unique additions per city are one sentence plus a Google Maps iframe of the city. The Stoney Creek page lists Toronto, Etobicoke, Mississauga, Milton, Brampton, Vaughan, Richmond Hill and Markham as served.
- **No make architecture.** The Audi category lists "Hamilton Transponder Keys Programming", "Lost All Car Keys?" and "Hamilton Spectator Article". Category archives have no canonical tag. The make list on home is a pipe-separated text line ("Chevrolet | Chrysler – Dodge – Jeep | Ford | …") with no links.
- **Internal linking** is the global mega-menu (Services: 16 items, Areas: 9) plus a footer that repeats the area list twice. Service and area pages carry almost no contextual links. 2026 blog posts each carry one exact-match link to a service page.

## 5. Conversion and CTAs

| CTA | Present | Notes |
|---|---|---|
| Click-to-call | Yes, 5–8 `tel:` links per page, 3 different href formats | Mobile: sticky bottom bar "CALL US AT 289 799 9585!" (Elementor fixed dialog) |
| **Make / Model / Year lookup** | Yes, in the header on every page, and the first thing on mobile | 57 makes, loaded by AJAX after page load (cars, plus Harley and Yamaha). Picking a year redirects to a per-vehicle result URL (`ada_kp-public.js`: `window.location.href = origin + "/" + response.data`). Result template `/key-result-page/` shows "Pricing Info". Result pages are not in the sitemap, so they are not crawlable |
| Quote form | Yes: Gravity Forms, 19 fields (name, email, phone, make, model, year 2000–2026, message, CAPTCHA) on contact and every blog post | Note above the form: "For key pricing inquiries, please use the Make-Model-Year search … if your vehicle is not found, please proceed with this form" |
| SMS / WhatsApp / booking | **None** (one review mentions texting them) | |
| B2B | `/b2b/` landing page (fleet / dealership / mechanics) with 2 forms | "Special dealer discount rates", "Same-day assistance" |
| Email | info@autokeypro.ca | |

## 6. Reviews and proof

| Item | Observation |
|---|---|
| On-site reviews | Trustindex Google widget, **server-rendered** on home and city pages (5 reviews with reviewer names and full text in raw HTML, header "EXCELLENT, based on 461 reviews"). No review dates in raw HTML |
| Review schema | none (no JSON-LD at all) |
| /testimonials/ | 51 words: only three "Click here to review" links (Mountain, Downtown, Van). No testimonials on the page |
| Real photos | Yes: branded van photo on home, galleries of real keys and fobs on /services/ and /lost-keys-and-lockouts/ (e.g. `Refurbished-Mercedes-Switchblade-Key.jpg`). Hero is a stock photo (smiling woman handed a key). Most images have empty alt |
| Badges | TAOL logo (alt "control module issue") and a CAA logo (empty alt) on home, with no accompanying claim text |
| Press | Hamilton Spectator article post (2014) |

## 7. Trust and response-time claims (as published, not verified)

| Claim | Where |
|---|---|
| "Since 2013" / family-owned and operated | home, about, city pages, /lost-keys-and-lockouts/ |
| "In business since 1999, the company expanded in 2013 to include automotive" | post excerpt on /category/audi/ (conflicts with "Since 2013") |
| "trusted licensed vehicle locksmith" | /services/car-key-programming/ (no licence number shown anywhere) |
| "7 days a week"; "day or night"; "round the clock"; "we will be with you within minutes" | home and city pages; car-key-replacement; car-key-programming |
| "on-site key cutting services for 90% of the cars"; FAQ: "85% of the vehicles on the road" | car-key-replacement; /faqs/ (inconsistent) |
| "within a few hours" for luxury brands vs "dealerships take a minimum of one week" | car-key-programming |
| Insured / warranty | **not claimed** anywhere sampled |

## 8. Off-site signals seen in search

- WebSearch "car key replacement hamilton" (a US-located index, **not** Google.ca) returned **nextjournal.com** and **hackmd.io** pages published by an "Auto Key Pro" account in its top two slots. Each is a short promotional article (about 100–260 words) with one exact-match anchor to autokeypro.ca (`/services/`, `/lost-keys-and-lockouts/`). WebFetch of both pages confirmed this. It is consistent with a paid parasite / link-building programme.
- Not verified: the brief's claim that autokeypro.ca is organic #1 on Google.ca for "car key replacement hamilton". The search tool is US-only and the ranking URL was not identified.

## 9. What they do well (match or beat)

| Strength | KeyFoby response |
|---|---|
| Make/Model/Year lookup above the fold on every page, aimed straight at the price question | Beat it: a server-rendered vehicle picker that lands on **crawlable** `/car-keys/{make}` pages with real price ranges and year ranges, plus a quote form prefilled with the vehicle. Make it the signature interaction |
| Sticky call bar on mobile; phone repeated 5–8 times per page | Match, and add WhatsApp / SMS, which they lack |
| Large service catalogue (16 service URLs incl. ignition, no-start, shell refurbish, erase keys, remote starter) | Match only the services KeyFoby actually performs, each with unique copy (Phase 2.1 list) |
| Review content in raw HTML; three GBP listings totalling 806 reviews | Server-render curated testimonials (initial, vehicle, area). Do not copy the multi-listing tactic: it risks a GBP suspension |
| Real job and key photos; branded van | Match with KeyFoby's own photos (Truth Table #6) |
| Age and volume: 117 posts since 2014, about 464 URLs, external links | Can't match on volume; win on quality per URL and on entity consistency |
| B2B page for dealers, fleets and mechanics | Consider a `/fleet` or partner block later (Phase 6 link partners) |

## 10. Weak or thin (exploit)

| Weakness | Evidence | Opportunity for KeyFoby |
|---|---|---|
| No meta descriptions (0 of 16 pages, 0 of 117 posts), no JSON-LD anywhere, brand-only H1 on home and city pages | §4 table | Keyword H1, ≤155-char metas, `Locksmith` + `Service` + `BreadcrumbList` schema |
| Doorway city pages (0.71–0.75 similarity to home) | §4 | Fewer city pages, each with real arrival times, jobs and FAQs |
| Car-key-replacement page targets lockouts, not replacement | §4 | Build the definitive `/services/car-key-replacement` (process, key types, ID/VIN, price ranges, turnaround) |
| No crawlable prices; pricing hidden behind JS lookup | §5 | Publish real price ranges by service and make (Truth Table #5); this also targets "car key replacement hamilton cost" and "cheapest…" |
| Weekday-only GBP hours on all three listings vs "7 days / round the clock" on site | §1, §7 | If true, own evenings, weekends and 24/7 consistently across GBP, site and schema |
| Mobile Lighthouse 47, LCP 11.7 s, CLS 0.22, AdSense on a service site | §2 | KeyFoby's current speed is already better; hold the Phase 3 budgets |
| Index bloat: 285 tag archives, 17 categories, test pages ("tets", "Sample Page", "Tampa Locksmith", "Brandon Locksmith") | §3 | Clean sitemap with only real pages |
| NAP noise: second phone (289-441-4446) on the FAQ page and directories; downtown store listed but GBP closed all week | §1 | One phone, one address truth, everywhere |
| No SMS / WhatsApp | §5 | Add both, tracked as events |

## 11. Gaps

- Prices returned by the Make/Model/Year lookup were not observed. Loading it requires the page's AJAX endpoint, and a direct call was refused by the session permission policy, so the lookup was not driven.
- Google.ca organic rank and which autokeypro.ca URL ranks: not verified (search tool is US-based).
- GBP services, products, Q&A and posts were not read (no browser on this track); only rating, reviews, categories, address, phone and hours from Maps data.
- Lighthouse is a single lab run; treat it as directional.
