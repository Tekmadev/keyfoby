# Competitor: Alpha Locksmith (Hamilton)

Observed 2026-10-26 (server clock 2026-10-27 00:16 GMT), method: curl with a desktop Chrome UA on robots.txt, the Yoast sitemap index, all 7 child sitemaps and all 61 HTML sitemap URLs; a stdlib HTML parser for title, meta, headings, JSON-LD, links and word counts; WebFetch cross-check on `/automotive/` (the tool truncated the page). Raw files: `scratchpad/phase0/competitors-3/alpha/`.

## Identity (cross-checked)

| Field | Value | Evidence |
|---|---|---|
| Site | https://alphalocksmith.ca (www 301 → apex) | `curl` on `www.alphalocksmith.ca` → 301 |
| Owner | Bryce Ferrie, operating since 2012 | `/about/`; BBB profile 0107-1318822 (start date July 2012, not accredited) per search snippet |
| Address | 191 Maplewood Avenue, Hamilton ON L8M 1X6 (lower city). The site says "SERVICE BY APPOINTMENT ONLY, NO WALK-INS" | JSON-LD `PostalAddress` and the `/contact/` text; threebestrated.ca lists the same address |
| Phone | 905-818-3700 (local), with `tel:` links | Every page has `tel:905-818-3700`; the number is also in titles and meta |
| Google rating | **Not verified.** The brief says 4.9/442, but the site shows no rating or count anywhere, and Maps HTML is rendered by JS, so curl returned no listing data. It is also unconfirmed that the 442-review listing is this entity (a search snippet mentions an "Alpha Locksmith of Burlington" with other numbers, and the footer Facebook link is `/alphalockbur/`) | `gmaps/alpha.html` contains no rating data |

## Index footprint

robots.txt is a Yoast block (`Disallow:` empty) pointing to `/sitemap_index.xml`, which has 7 child sitemaps holding 62 `<loc>` entries (plus 57 `image:loc` entries). Of those, 58 are HTML pages returning 200 and indexable, 3 `element_category` URLs 301 to the home page, and 1 is `locations.kml` (Yoast Local geo sitemap). Two posts are `index, nofollow`.

| Type | URLs | Notes |
|---|---|---|
| Service | 5 | `/services/`, `/automotive/`, `/residential/`, `/commercial-industrial/`, `/safes/`. **Only 1 automotive page** |
| Location | 8 | `/hamilton/` + 7 `*-service-area/` pages (Stoney Creek, Grimsby, Brantford, Dundas, Milton, Ancaster, Waterdown). The home page lists Burlington, which has no page |
| Make | **0** | none |
| Blog / guides | 32 | 28 posts (2019-05 to 2023-11) + blog index + lock-reviews index + 2 category archives. **0 posts about car keys**; topics are residential locks, safes and locksmith-scam awareness |
| Other | 13 | home, about, contact, links + 9 empty portfolio category/tag archives (51–187 words of boilerplate) |
| **Total indexable** | **58** | |

Content freshness: location pages were last modified 2019-11-18, `/automotive/` 2023-11-27, and the home page 2025-12-18 (Avada `updated` stamps in the page).

## Sampled pages

Word counts are net of about 51 words of boilerplate, and include a 172-word "Why choose us" block repeated on several pages.

| | Home `/` | Top car page `/automotive/` | Location `/hamilton/` | Location `/stoney-creek-service-area/` |
|---|---|---|---|---|
| Title (chars) | "ALPHA LOCKSMITH \| 905-818-3700 \| Hamilton & Stoney Creek" (56) | "EMERGENCY AUTOMOTIVE LOCKSMITH SERVICES \| 905-818-3700" (54) | "ALPHA LOCKSMITH \| HAMILTON SERVICE AREA \| Emergency Unlocks" (59) | "ALPHA LOCKSMITH \| STONEY CREEK AREA \| Emergency Unlocks" (55) |
| Meta description (Yoast) | 156: "Hamilton Emergency Locksmith Services include Emergency Door Opening…" | 153: "Emergency Automotive Locksmith Services - 905-818-3700. Lockouts…" | 155: "For Hamilton service area call Alpha Locksmith 905-818-3700…" | 155, the same template as Hamilton |
| Duplicate meta | **Yes.** 47 of 61 pages emit a second `<meta name="description">` (Avada auto-extract of the page text, 150–380 chars, with line breaks) | yes | yes | yes |
| H1 | "ALPHA LOCKSMITH" | "AUTOMOTIVE LOCKSMITH SERVICES" | "Hamilton Locksmith Service Area" | "Stoney Creek Locksmith Service Area" |
| Main words | ~670 | ~475 | ~480 (about 180 of them a list of neighbourhood names) | ~350 |
| JSON-LD @types | WebPage, BreadcrumbList, WebSite, **Organization + Place** (geo, telephone, 2× OpeningHoursSpecification, PostalAddress, sameAs ×5, email, areaServed `"Hamilton, Stoney Creek,"`, taxID/vatID) | same | same, no ImageObject | same |
| aggregateRating / review markup | **None** sitewide | none | none | none |
| Reviews in raw HTML | No rating widget. 1–2 quoted reviews per service page, attributed to Yellow Pages, Facebook or Google Maps (crawlable) | yes, 2 quotes | no | no |
| Prices | None on service pages | none | none | none |
| Map | — | — | Google Maps iframe embed (city-level) | iframe |

Car-key scope is thin and inconsistent: `/automotive/` says "we cut and program most auto keys", but all location pages say "non-chip key copying". There is no fob, transponder or all-keys-lost copy.

## Duplication (doorway check)

6-word shingle overlap between location pages: Hamilton vs the others is 55–57%, and the other seven are **75–85% identical to each other** (Jaccard 0.61–0.70). The only unique part is a neighbourhood list; the paragraphs are the same with the town name swapped. These are classic doorway-style pages.

## CTAs and conversion

| CTA | Present? | Evidence |
|---|---|---|
| Click-to-call | Yes, on every page, plus a **sticky mobile-only "Call Now Button"** | plugin `call-now-button`, `id="callnowbutton"`, `cnb-displaymode-mobile-only` |
| Phone in title and meta | Yes | the titles above |
| SMS / WhatsApp | No | none found |
| Form | `/contact/` only (name, email, phone, subject, message, CAPTCHA), "for non-emergency work" | page text |
| Booking | No | — |
| Analytics | GTM container present | `GTM-MRWBNTB` in the home HTML |

## Trust and other claims (as published)

| Claim | Where |
|---|---|
| Owner named, with credentials: locksmith diploma (International Career School, Westmount QC), former SAVTA and National Safeman's Organization member, "screened and verified by Homestars", IAHSSP registered | home, about, service pages |
| **Insurer named**: "business liability insurance with Desjardins Insurance" | home, about |
| Written warranty: 3 months, parts and labour (full text in the footer of every page) | sitewide |
| Free lockout for children and pets | home, automotive, location pages |
| "THE HIGHEST RATED LOCKSMITH & SAFECRACKER SINCE 2012" | home H2 |
| No response-time or 24/7 claim | — |
| Hours conflict: schema says Mon–Sat 09:00–20:00 and Sun 12:00–20:00, but `/contact/` says Mon–Fri 9–8 with Sat and Sun closed | JSON-LD vs page text |
| Badges: HomeStars, Yellow Pages, "Best Locksmiths in Hamilton", "BestofHam" | home image alts |

Statements in their blog bear on KeyFoby's claims. These are dated posts and the opinions are theirs:

- "At the present time there is no licensing body for locksmiths in the province of Ontario" (`/false-ads-by-locksmiths/`, 2019-05-07). The same post lists "15 Minute Response", "24/7 Service" and "insured, licensed, and/or bonded" as the most common false-ad claims.
- Prices: "The true cost for opening your door will be between $40 and $80" (`/shady-locksmiths-…/`, 2019) · "a safe lockout might cost as much as $750, whereas a student room lockout will cost as little as $60" (`/lock-services-f-a-q/`).

## Platform

WordPress 7.1.3 with the Avada theme and Fusion Builder, Yoast SEO Premium 28.7 with Yoast Local SEO (`wpseo-local`), W3 Total Cache and the Call Now Button plugin, on Apache. Every HTML page is about 1.55–1.61 MB, of which ~1.55 MB is inline CSS; the home page transfers ~215 KB compressed (TTFB ~0.38 s on one run). Blog posts emit two H1s each.

## Internal linking

A sitewide menu links all 8 location pages and `/automotive/` from every page (58 inbound links each). There is no contextual linking from the automotive page to location pages, or the reverse. Blog posts link to each other through related-post widgets.

## Match or beat (what they do well)

| Strength | KeyFoby response |
|---|---|
| Named owner with verifiable credentials and a **named insurer** | Match: technician bio plus the insurer's name, and a licence number only if one exists (Truth Table #2) |
| Written warranty terms on every page | Match with KeyFoby's real warranty summary and a link to `/warranty` |
| Local Business schema with geo, hours, sameAs, phone | Beat: `Locksmith` type with `@id`, true hours, City `areaServed` objects, no conflicting hours |
| Sticky mobile call button, local 905 number, phone in titles | Match: sticky call + WhatsApp bar (Phase 3.4) |
| Anti-scam consumer content (fake reviews, $15 service-call ads, 15-minute claims) | Possible guide topic. Also a reason to drop KeyFoby's "15-min average" and "Licensed" claims unless they can be proven |

## Weak or thin (where KeyFoby wins)

- A general locksmith and safecracker, with **one** thin automotive page, no fob, transponder, all-keys-lost or make content, and no car-key blog posts.
- Doorway-style location pages (75–85% shared copy) that are 7 years old.
- No visible rating, no review widget and no price ranges.
- Technical debt: duplicate meta descriptions on 77% of pages, ~1.5 MB of inline CSS per page, all-caps H1s, double H1s on posts, and 9 empty portfolio archives indexed.
- NAP and hours drift: schema hours ≠ contact-page hours, and `areaServed` is a malformed string.
