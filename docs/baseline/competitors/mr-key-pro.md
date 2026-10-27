# Competitor: Mr. Key Pro (Burlington)

Observed 2026-10-26 (server clock 2026-10-27 00:15 GMT), method: curl with a desktop Chrome UA on robots.txt, every sitemap and all 59 sitemap URLs; a stdlib HTML parser for title, meta, headings, JSON-LD, links and word counts; headless Chrome `--dump-dom` on `/`, `/toyota/` and `/stoney-creek/` to check JS-injected content; WebFetch cross-check on `/key-programming/`. Raw files: `scratchpad/phase0/competitors-3/mrkeypro/`.

## Identity (cross-checked)

| Field | Value | Evidence |
|---|---|---|
| Site | https://www.mrkey.pro (apex 301 → www) | `curl -I https://mrkey.pro/` → 301 to `https://www.mrkey.pro/` |
| Legal name | Mr. Key Pro Inc., federal corp. 16105556, incorporated 2024-06-07, active | federalcorporation.ca/corporation/16105556 |
| Address | 2014 Churchill Ave, Burlington ON L7R 3T7 | Only on `/privacy/` (not in footer or schema). Matches the corporate registry and the Yelp/MapQuest search snippets |
| Phone on site | 1-888-857-1430 (toll-free), plain text in the footer of all 59 pages | grep: 59 hits, no other number |
| Phone in directories | (647) 772-0443 | Search snippet only. Yelp returned 403, so this is unverified |
| Google rating | **4.9, "Over 633 reviews"** | Server-rendered by the site's own `mrkey-google-reviews` plugin (home HTML). Place ID `ChIJ36OsYwdhK4gR5naOgseqMD0` from the "…more" link. Matches the brief's 4.9/633 |

## Index footprint

robots.txt: `Disallow: /wp-admin/`, sitemap at `/wp-sitemap.xml` (WordPress core sitemaps, no SEO plugin). There are six child sitemaps and **59 URLs, all returning 200 and indexable**. Meta robots is `max-image-preview:large` only, with no noindex and no X-Robots-Tag.

| Type | URLs | With real content | Empty stubs (H1 only, 0 body words) |
|---|---|---|---|
| Service | 17 (incl. `/services-main/`) | 10: key-programming, automotive-lockouts, module-adaptation, electrical-diagnosis, instrument-cluster-correction, ecu-tcu-bcm-cloning, automotive-tuning, immobilizer-installation, ignition-cylinder-repair, services-main | 7: roadside-assistance, no-start-diagnosis, rv-trailer-keys, broken-key-extraction, android-auto, door-ignition-rekey, motorcycle-keys |
| Location | 10 (incl. `/service-areas/`) | 3: burlington, hamilton, oakville (+ the index, which is mostly lorem ipsum) | 6: mississauga, milton (H1 says "Waterdown"), stoney-creek, niagara, grimsby, st-cathrines (misspelt) |
| Make | 11 (incl. `/brands/`) | **0** | 11: audi, bmw, bentley, acura, ford, chevrolet, volkswagen, mercedes, toyota, lexus, brands |
| Blog / help | 8 | 3: 1 post (~1,050 words), blinking-immobilizer-light-help (~330), blog index | 5: help-center, key-fob-battery-help, no-start-help, stuck-key-help (plus the category archive) |
| Other | 13 | home, about-us, terms, privacy | our-roots, our-team, our-community-work, privacy-policy-2, plus junk: WP `/sample-page/`, `/author/mrkeypro/`, 3 ElementsKit template URLs (`/?elementskit_template=main-header` etc.) |
| **Total** | **59** | ~26 | **33 of 59 (56%)**, confirmed empty after JS render |

Lorem ipsum is live and indexed on `/service-areas/` (29 filler-word hits), `/immobilizer-installation/` (29) and `/key-programming/` (2). Most service pages were last modified 2025-12-28; the home page 2026-10-23.

## Sampled pages

Word counts are net of about 48 words of boilerplate (title, skip link, chat widget) measured on the empty stubs.

| | Home `/` | Top car-key page `/key-programming/` | Location `/hamilton/` | Make `/toyota/` |
|---|---|---|---|---|
| Title (chars) | "Mr Key Pro – Fast and Affordable Key Cut and Program" (52) | "Key Programming – Mr Key Pro – Fast and Affordable Key Cut and Program" (70) | "Hamilton – Mr Key Pro – …" (63) | "Toyota – Mr Key Pro – …" (61) |
| Meta description | **none** (none on any of the 59 URLs; no OG tags either) | none | none | none |
| H1 | "Fast and Affordable Automotive Keys" | "Dont risk bricking your car with the other guys." | "Win or Lose, Mr. Key Pro's got his Ti-Cats gear prepped and ready for your Key conundrums." | "Toyota" |
| Main words | ~1,450 (551 of them are review text) | ~830 | ~620 | 0 |
| JSON-LD | **none, sitewide** (0 `ld+json` blocks in 59 pages) | none | none | none |
| Reviews in raw HTML | Yes: 8 Google review cards with author names, rating 4.9, count, and a link to Google | No | No | No |
| Prices | None (one review mentions "extra blade for 130") | None ("$500 amazon key programmer" is about a rival's tool) | None | None |

Home H2s: "Mr Key Pro: Your Key to Auto Locksmith Excellence." · "Keys to Safety, Solutions at Your Fingertips." · "What's we do, and do well." · "Client Feedback & Reviews" (twice) · "Frequently Ask Questions." The FAQ section has no questions in it.

## CTAs and conversion

| CTA | Present? | Evidence |
|---|---|---|
| Click-to-call (`tel:`) | **No, on any page** | 0 `tel:` links in the 59 raw pages and in the rendered home DOM |
| SMS / WhatsApp | No | none found |
| Quote / contact form | **No.** "Get Started", "Request a Quote", "Contact us", "Submit a Support Ticket" and "Discover more" all have `href="#"` | home anchors; WebFetch on `/key-programming/` agrees |
| Forms | Newsletter (email only), plus a chat form | `form_fields[email]`, `mrkey-chat-form` |
| Chat | Custom AI chat ("Mr. Key Pro Assistant", "AI can make mistakes") with "Talk to a person" handoff to Microsoft Teams, behind Cloudflare Turnstile | plugin `mrkey-webchat` 0.3.0 |
| Analytics | No GA4 or GTM tag in raw or rendered HTML | grep gtag/GTM/G-: none |

## Trust, response time and other claims (as published, not verified)

| Claim | Where |
|---|---|
| "Licensed and Insured", "NASTF Certified automotive locksmiths, fully bonded and insured" | home, services-main |
| "25+ Years of Experience" (the company was incorporated 2024-06-07, so this presumably means personal experience) | home, about-us |
| "24/7/365", "Our Operators are ready to dispatch a technician out immediately" | home, lockouts |
| "Sub 1 Hour Response time*" (the asterisk has no footnote) · "usually within 30 minutes (time may vary by location)" | key-programming, lockouts, module-adaptation |
| "1 year warranty" · "NO SURPRISE PRICING" · complimentary emergency key, battery health check, IMMO scan | key-programming |
| "5 Star Rating on Google with over 520 reviews" (contradicts the "Over 633" widget on the same page) | home |
| Counters of 1,200+ clients, 300+ all-keys-lost jobs and 18+ OEM partnerships, which **render as "0 +" in raw HTML** (JS animation) | home `data-to-value` |
| Dealer logo carousel: Burlington Toyota, Red Hill Toyota, Halton Honda, Paramount, Leggat Group, Budds Group | home image alts |

## Platform

WordPress with the Hello Elementor theme, Elementor 4.3.5 and Elementor Pro, ElementsKit Lite, WP-Optimize Premium (lazy-loaded `data-src` images behind a 1×1 GIF), two custom plugins (`mrkey-webchat`, `mrkey-google-reviews`) and Turnstile, on Apache/Debian. Home HTML is 189 KB raw and 31 KB compressed, with TTFB about 1.0 s on one curl run. 14 of 22 images on the home page have no alt text.

## Internal linking

A sitewide mega-menu links all ~50 pages from every page, including the 33 empty stubs (each has 57 inbound internal links). Body copy has almost no contextual links between pages. Location pages link out to local partners (Rev It Up for Hunger, RedHill Toyota, Ultimate Exotics, the Oakville Dads Facebook group, Trinity Christian School).

## Match or beat (what they do well)

| Strength | KeyFoby response |
|---|---|
| Server-rendered Google reviews with names, rating, count and a link to Google, all crawlable | Ship the same pattern (Phase 1/2.4): server-rendered, attributed, linked to the GBP, with no self-serving `aggregateRating` |
| Genuinely local city pages (Tim Hortons Field and Ti-Cats game-day lockouts, RedHill Toyota, Rev It Up for Hunger; Hamilton copy names "the Mountain", Stoney Creek and Dundas). Only 18–21% of 6-word shingles are shared between Burlington, Hamilton and Oakville, so these are not doorway pages | Match with real KeyFoby jobs, arrival times and neighbourhoods. Mr. Key Pro explicitly targets "replacing lost keys on the Mountain" |
| Process transparency on `/key-programming/`: 5 steps, value-adds, OEM tooling, 1-year warranty | Beat with a shorter, answer-first version plus real price ranges and the "we show you the system readout" proof |
| Topical breadth (module cloning, immobilizers, no-start, cluster) builds automotive-electronics authority | Out of scope for KeyFoby unless offered. Stay deep on keys and fobs instead |
| 633 reviews (about 2.9× KeyFoby's 222) and dealer B2B logos | Prominence gap; this is off-site work (Phase 6) |

## Weak or thin (where KeyFoby wins)

- 56% of indexed URLs are empty, including **all 10 make pages** and 6 of 9 city pages. KeyFoby's planned `/car-keys/kia` etc. pages with real content would have no make-page rival here.
- No meta descriptions, no OG tags and **no schema at all**. Titles use a long boilerplate suffix (58–91 chars, truncated in SERPs).
- H1s are jokes or slogans with no service or city keyword ("Win or Lose…", "Dont risk bricking…").
- Lorem ipsum, the WP Sample Page and template URLs are indexed; the `/milton/` H1 says "Waterdown"; `st-cathrines` is misspelt.
- Mobile conversion is weak: no tap-to-call anywhere, a toll-free number instead of a local one, and dead `#` CTAs, so chat is the only real action.
- Inconsistent proof: review counts of 520 and 633 on the same page, and counters crawled as "0 +".
- No prices anywhere.
