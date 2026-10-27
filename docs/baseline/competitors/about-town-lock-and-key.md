# Competitor: About Town Lock & Key (Hamilton)

Observed 2026-10-26 (00:20–00:55 UTC Oct 27), method: WebSearch for the official site (directories gave no site; candidate domains probed with curl and matched on phone and address), curl with a desktop Chrome UA (robots, sitemap, all 17 sitemap URLs), headless Chrome via puppeteer-core (desktop 1280 and mobile UA 375), one Lighthouse 12.2.1 mobile run, the public Google Maps preload response fetched by curl. Raw files are in `scratchpad/phase0/competitors-2/abouttown/` and `.../gbp/` (session scratchpad, not committed).

**Bottom line.** About Town is a general (residential, commercial and auto) locksmith with a showroom on Cannon St E. It ranks on GBP prominence (since 1994, 118 reviews, lower-city pin), not on its website. The site is a 17-page Wix brochure with one automotive page (238 words), no location, make or blog pages, and only Wix's default `WebSite` schema. It does have authentic proof that KeyFoby should match: real storefront and van photos, a named owner, trade memberships and first-party testimonials in raw HTML.

## 1. Identity, NAP and GBP

| Field | GBP (Maps data) | Website | Directories | Match? |
|---|---|---|---|---|
| Official site | `http://abouttownlockandkey.com/` | `https://www.abouttownlockandkey.com/` (apex and http 301 to www) | none of Canpages, PagesJaunes or Circulaire link a site | ok |
| Rating / reviews | **4.5 / 118** | "Google Reviews" heading; the widget rendered **empty** in headless Chrome | n/a | brief confirmed |
| Categories | Locksmith, Door supplier, Emergency locksmith service, Lock Store, Locks supplier, Security system installation service | n/a | n/a | n/a |
| Address | 393 Cannon St E, Hamilton L8L 2C5 | same (home, contact) | same (PagesJaunes "393 Cannon Lwr E") | ok |
| Phone | (905) 525-5564 | 905-525-5564 (header); contact page also lists **Stoney Creek 905-662-7649** | Canpages: 905-662-7649; Circulaire: 905-525-5564 | two numbers in use |
| Hours | Mon–Fri 10 a.m.–4 p.m., Sat–Sun closed | "Showroom Hours Monday – Friday: 10:00 AM – 4:00 PM"; /services/: lockouts "available 5 days a week" | directories: 9–5 weekdays | site = GBP; directories stale |

- The brief's figure (4.5 / 118) is **confirmed**. The lower-city pin (Cannon St E) is confirmed.
- Weekday daytime only, by its own statement. It has no evening, weekend or 24/7 claim, which is a clear service gap against KeyFoby if KeyFoby's 24-hour GBP hours are true (Truth Table #1).
- It also holds the "Emergency locksmith service" secondary category despite 10–4 weekday hours.

## 2. Platform and tech

| Item | Value | Evidence |
|---|---|---|
| CMS / host | **Wix** (`server: Pepyaka`, `x-wix-request-id`, static.wixstatic.com assets); Wix apps: Data Binding, Old Wix Forms, ShoutOut (Legacy) | `curl -I`, page source |
| Mobile | Separate Wix mobile layout. With a mobile UA it uses `<meta viewport width=320>`, has no horizontal overflow, shows a hamburger menu, and **no phone number in the first screen** | `overflow.js` at 375 px |
| robots.txt | Wix default: Allow all, blocks PetalBot, crawl-delay for dotbot and AhrefsBot, `Sitemap:` line present | `robots.txt` |
| Sitemap | `sitemap.xml` → one child `pages-sitemap.xml`, 17 URLs, every `lastmod` 2026-04-30 (bulk) | sitemap fetch |
| Third parties | Wix stack, GTM, Google Analytics, Google Ads (doubleclick), Facebook, Twitter "Tweet" widget, Sentry, Google Maps, `js.web-2-tel.com` (probably click-to-call or call tracking; not verified) | headless request log |
| Lighthouse mobile, home (1 run) | **Perf 65**, LCP 10.5 s, CLS 0, TBT 130 ms, FCP 3.9 s, 2,604 KB, 203 requests; SEO 100, A11y 96 | `lh-mobile.json` |

## 3. Indexable URL inventory

| Type | Count | URLs |
|---|---|---|
| Home | 1 | `/` |
| Service | 13 | `/services` (index) + lock-installations, transponder-keys-and-remote-fobs, lock-rekeying-and-re-coding, safe-combination-changes, door-closers, padlocks, exit-bars, key-in-knob-lever-locks, high-security-locks, specialty-keys-and-locks, boat-keys, motorcycle-keys |
| of which automotive | 3 | transponder-keys-and-remote-fobs, motorcycle-keys, boat-keys (plus part of specialty-keys-and-locks) |
| Location | **0** | none. Area is stated as "Hamilton, Stoney Creek and the Golden Horseshoe" |
| Make / vehicle | **0** | Makes appear only as 36 logo images on the transponder page ("we do not service Mercedes and Rolls Royce") |
| Blog / guides | **0** | none |
| Other | 3 | about-us, testimonials, contact-us |
| **Total indexable** | **17** | all 200, canonical self, no robots meta |

## 4. Sampled pages

| | Home `/` | Car-key page `/transponder-keys-and-remote-fobs` | Services `/services` | Testimonials `/testimonials` |
|---|---|---|---|---|
| Title (chars) | "Locksmiths to Hamilton & Stoney Creek \| Home \| About Town Lock & Key" (68) | "Key Fobs for Cars in Hamilton \| Transponder Keys & Remote Fobs \| About Town Lock & Key" (86) | "Lockout Service in Hamilton \| Services \| About Town Lock & Key" (62) | "Padlock Install Stoney Creek \| Testimonials \| About Town Lock & Key" (67) |
| Meta description (chars) | 154 | 158 | 150 | 158 |
| H1 | "About Town Lock & Key: Hamilton & Stoney Creek's Locksmith" | "Remote Fob & Transponder Key Replacements in Hamilton & Stoney Creek" | "Locksmith Services for Hamilton & Stoney Creek" | "About Town Lock & Key Wants to Hear from Our Customers" |
| Main words | 265 | 238 | 261 | 693 |
| JSON-LD | `WebSite` only (Wix default); no LocalBusiness, no aggregateRating | none | none | none |
| Prices | none ("everyday low prices") | none | none | one "$500.00" saved, inside a testimonial |
| Internal links | header nav only (17 unique) | nav only | nav + 2 | nav only |

Site-wide: 12 of 17 titles are longer than 60 characters and 7 of 17 metas are longer than 155, so many truncate. Every page has exactly one keyword-bearing H1 with the city. Page copy is thin (median 130 main words; padlocks 63, lock-installations 67). No breadcrumbs, no FAQ, no contextual links between services.

## 5. Conversion and CTAs

| CTA | Present | Notes |
|---|---|---|
| Click-to-call | Yes, but 1 `tel:` link per page (3 on contact) | No sticky call bar. On mobile the phone is not visible above the fold |
| Form | Contact form (name, phone, email, comment) on /contact-us; testimonial submission form on /testimonials | No vehicle fields |
| SMS / WhatsApp / booking | **None** | |
| Showroom visit | Strong: address, "accessible by bus", "free parking front and rear", payment options | walk-in key cutting and programming |

## 6. Reviews and proof

| Item | Observation |
|---|---|
| First-party testimonials in raw HTML | **Yes**: 10 testimonials on /testimonials with title, text, first name + initial and "Rating: 5 Stars"; several name the owner, **"Richard"**, and the vehicle ("2004 Buick key fobs programmed in minutes") |
| Review schema | none |
| Google reviews widget | heading only; rendered empty in headless Chrome |
| Real photos | **Yes**: storefront with two branded vans on home (both show phone numbers and the URL); the shop dogs "Max" and "Nikita" in the header |
| Badges / affiliations | TAOL, ALOA and CFIB member (linked to taol.net, aloa.org, cfib-fcei.ca); "Abloy® high security lock dealership"; Yellow Pages badge |

## 7. Trust and response-time claims (as published, not verified)

| Claim | Where |
|---|---|
| "Family Owned & Operated Since 1994"; "more than 30 years"; "over three decades" | home banner, home, about |
| TAOL / ALOA / CFIB membership | home |
| "two mobile units" / "two mobile trucks" / "two mobile vehicles" | home, transponder page, contact |
| "up and running in no time"; "fast service" | transponder page, home |
| Lockouts "available 5 days a week" | /services |
| Licensed / insured / warranty / 24/7 | **not claimed** anywhere (grep of all 17 pages) |
| Response time | only inside testimonials ("Less Than 30 Minute Wait", "within an hour") |

## 8. What they do well (match or beat)

| Strength | KeyFoby response |
|---|---|
| Authentic proof: real storefront and branded vans, named owner, 30+ years, trade memberships with links | Match with a technician bio, a real van and tools photo, and licence/insurance and memberships *only if true* (Truth Table #2, #6) |
| First-party testimonials with vehicle detail, crawlable | Match and exceed: curated, permissioned testimonials with initial, vehicle, area and service, server-rendered (Phase 2.4) |
| Keyword-bearing H1 and a hand-written meta on every page | Match, within the 60 / 155 limits |
| Practical details (bus access, parking, payment options) | Put KeyFoby equivalents in plain text: payment methods, what to bring (ID, ownership, VIN), arrival time |
| Strong GBP category spread (6 categories incl. Emergency locksmith service) | Phase 6: review KeyFoby secondaries. KeyFoby's GBP currently shows Locksmith + Key duplication service |

## 9. Weak or thin (exploit)

| Weakness | Evidence | Opportunity for KeyFoby |
|---|---|---|
| Only 1 car-key page (238 words); no make, location or guide pages | §3 | Own the automotive long tail: service × make pages with prices and year ranges |
| Weekday 10–4 only; lockouts "5 days a week" | §1, §7 | Evenings, weekends and 24/7 (if true) as the headline differentiator |
| No schema beyond Wix `WebSite` | §4 | Full `Locksmith` entity with hours, areaServed and sameAs |
| Weak mobile conversion: no sticky call, phone not above the fold, no SMS / WhatsApp | §5 | Mobile-first sticky call + WhatsApp bar (Phase 3.4) |
| Heavy, dated Wix build (Perf 65, LCP 10.5 s, 2.6 MB, 203 requests, Tweet widget) | §2 | Speed budget is a visible edge |
| Generalist focus (padlocks, exit bars, door closers, safes) dilutes automotive relevance | §3 | KeyFoby's single automotive focus is a relevance advantage for car-key queries |
| Two phone numbers across site and directories; directory hours stale (9–5) | §1 | One NAP everywhere plus a citation clean-up (Phase 6) |

## 10. Gaps

- GBP services, products, posts and Q&A were not read (no browser on this track).
- Organic rank for KeyFoby's target queries: not measured (search tool is US-based). The site has no page targeting "car key replacement" by name.
- Google reviews widget content: it rendered empty in headless Chrome; whether it shows for real users was not verified.
