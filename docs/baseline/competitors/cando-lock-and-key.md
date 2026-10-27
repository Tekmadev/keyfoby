# Competitor: CanDo Lock and Key (Hamilton)

Observed 2026-10-26 (00:15–00:32 UTC Oct 27), method: curl with a desktop Chrome UA, headless Chrome render (`--dump-dom`, puppeteer-core at 375 / 1280), `dig` against 8.8.8.8, Google Maps preload data fetched by curl, WebSearch / WebFetch for directory cross-checks. Raw fetches are in `scratchpad/phase0/competitors-1/cando/` (session scratchpad, not committed).

## 1. Identity and NAP

| Field | Google Business Profile (Maps data) | Website (rendered + JSON-LD) | Match? |
|---|---|---|---|
| Name | CanDo Lock and Key | CanDo Lock & Key | ok |
| Primary category | Locksmith | Locksmith (`@type`) | ok |
| Secondary categories | not exposed in Maps data | n/a | unverified |
| Phone | (289) 984-2212 | 289-984-2212 (`tel:2899842212`) | ok |
| Address | **203 Cannon St E, Hamilton L8L 2B7** ("Central Hamilton") | **730 Brigadoon Drive** (West Mountain, Gourley; geocoded 43.2152, -79.9020); JSON-LD `postalCode` empty | **conflict** |
| JSON-LD geo | n/a | 43.2557, -79.8711 (generic downtown Hamilton point, not either address) | wrong |
| Hours | Open 24 hours (all 7 days) | Visible: "Mon–Sun 8:00 AM–6:00 PM" plus "24/7 Emergency Lockout"; JSON-LD: 08:00–18:00 daily | **conflict** |
| Rating | 5.0 / 128 reviews | Visible "5.0 (128+ reviews) Live from Google"; JSON-LD hard-coded 5 / 100 | JSON-LD stale |
| Website on GBP | `https://cando-key.ca/` | n/a | **link is broken (see 2)** |

- Brief's figure (5.0 / 128) is **confirmed**.
- Brief says the leaders sit in the lower city. For CanDo this is only **recently** true. A GBP post dated 2026-10-23 says: "I'm getting a new shop ready at 203 Cannon Street East, with a dedicated focus on automotive locksmith services and car key programming … The shop isn't open just yet." The website, MapQuest and ProsGrade still show 730 Brigadoon Dr on the Mountain.
- Directory cross-check: ProsGrade lists website cando-key.ca, Open 24 hours, 4.90 / 115 (stale snapshot).

## 2. Domain and indexability (the main finding)

| Check | Result | Evidence |
|---|---|---|
| `cando-key.ca` (apex, on GBP) | **HTTP 503 "no healthy upstream"** (3 retries at 00:17 and 00:31 UTC) | `curl -k https://cando-key.ca/` → 503, 19 B |
| Apex DNS | CNAME → `3000-i9qjq…sg1.manus.computer.` (a Manus sandbox preview host) → 34.110.191.241 | `dig @8.8.8.8 cando-key.ca` |
| Apex TLS | Certificate is for `preview.tu5vvid9cm4o.europe-west3.livestream.goog`, so the name does not match | `openssl s_client` |
| `www.cando-key.ca` (the canonical) | **NXDOMAIN** | `dig @8.8.8.8 www.cando-key.ca` |
| Registrar / NS | Network Solutions Canada; NS ns1/ns2.bluehost.com; created 2025-03-09 | `whois` |
| Live copy | `https://candolocknkey.manus.space/` (200) | curl |
| robots.txt on live copy | `User-Agent: *` / `Disallow: /`, so **all crawling is blocked** | `raw_robots_txt.txt` |
| Canonical on every route | `https://www.cando-key.ca/...` (dead host). `/quote` canonical points to `/` | rendered DOM |
| Unknown routes | HTTP 200 with the same 374,932 B shell (soft 404; renders H1 "404") | `/nonexistent-page-xyz` |
| Indexed pages | could not verify (the search tool ignores `site:`) | — |

**Net effect:** CanDo has close to zero usable organic footprint today, and the GBP "Website" button leads to an error. Its Maps rank rests on GBP signals alone: 5.0 / 128 reviews, weekly posts, and now a lower-city pin.

## 3. Sitemap and URL inventory

Sitemap (`/sitemap.xml` on manus.space, 8 URLs, all lastmod 2026-03-28, all on the dead `www.cando-key.ca`):

| Type | Count | URLs |
|---|---|---|
| Service | 2 | /services, /catalog |
| Location | 0 | — |
| Make / vehicle | 0 | — |
| Blog / guides | 1 | /news (3 short posts, all dated 2026-03-28, no individual URLs) |
| Other | 5 | /, /quote, /gallery, /reviews, /contact |
| **Indexable today** | **0** | dead canonical host, and robots blocks the live host |

## 4. Page samples (rendered DOM; raw HTML is an empty `<div id="root">`)

| Page | Title (chars) | Meta desc (chars) | H1 | Main words | JSON-LD @types |
|---|---|---|---|---|---|
| / (raw HTML) | CanDo Lock & Key \| Hamilton's Trusted 24/7 Auto Locksmith (57) | 254 | none | 9 (whole body) | Locksmith, WebSite+SearchAction, OfferCatalog/Offer/Service ×4, AggregateRating 5/100 |
| / (rendered) | Hamilton's Trusted 24/7 Auto Locksmith \| CanDo Lock & Key (57) | 197 | Hamilton's Trusted Auto Locksmith | 673 | same block on every route |
| /services (closest to a car-key page) | Locksmith Services \| CanDo Lock & Key (37) | 179 | What We Can Do For You | 301 | same |
| /catalog (prices) | Service Catalog \| CanDo Lock & Key (34) | 149 | Service Catalog | 542 | same |
| /reviews | Customer Reviews \| CanDo Lock & Key (35) | 148 | What Our Customers Say | 409 | same |
| /contact | Contact Us \| CanDo Lock & Key (29) | 125 | Visit Us in Hamilton | 75 | same |
| Location page | none exists | | | | |
| Make page | none exists | | | | |

- Duplication: 0–6% of 8-word shingles are shared between pages. The copy is thin rather than duplicated.
- Internal linking: global nav + footer only (8 routes). No contextual links, no breadcrumbs.
- FAQ: 6 questions. Answers sit only in the JS bundle, not in the DOM until clicked, and there is no FAQPage schema. Sample answer: lockout arrival "typically … within 30-45 minutes in the Hamilton area".

## 5. Conversion, proof and trust

| Item | Observed |
|---|---|
| CTAs | Call (header on desktop, hero, footer, 5 `tel:` links); WhatsApp (`wa.me/12899842212`, hero + contact); quote form `/quote` (name*, phone*, email, service*, location, notes; no photo upload); floating chat widget (`ChatWidget.tsx`, tRPC `chat.send`); "Review Us" Google review link in the main nav. No SMS, no booking. |
| Mobile (375, emulated) | The fixed top nav in the 390 px screenshot shows the logo and "Review Us", not the phone. One `tel:` link above the fold (hero "Call Now"). `innerWidth` reported 389 px on a 375 px emulated device, which suggests about 14 px of horizontal overflow (not confirmed on a real phone). `maximum-scale=1` blocks pinch-zoom. |
| Prices | **Yes: "Starting at":** car key replacement $149, key fob programming $99, transponder key $129, key copy $59, smart/proximity key $199, car lockout $79, ignition repair $179 (rendered /catalog only) |
| Offers | Free lockout if a child or pet is locked in; "SPRING2026" 10% off key copies |
| Reviews on-site | 5 Google reviews loaded client-side via `/api/trpc` ("Live from Google"). **Not in raw HTML.** |
| Trust claims | "Licensed & Insured" (no licence number or insurer); "Locally Canadian-owned"; "100+ Five-Star Reviews"; "Affordable Prices" |
| Response time | 30–45 min for lockouts (FAQ, JS only) |
| People / photos | Technician "Ryan" named in reviews and GBP posts; gallery has 6 real job photos (Nissan Intelligent Key, branded keys, programming machine) |
| Placeholder copy live | "Video placeholder - Upload in CanDo App … Share your customer's story here." The contact-page map embed uses placeholder coordinates (`!1d2898.1234567890`, `0x882c9c8b1234567b`). |
| Off-topic | "Manage Your Keys On the Go" section promoting a customer web app and mobile app (Manus app builder) |
| Platform | Manus-generated React/Vite SPA, Express + tRPC backend on `*.manus.space` behind Cloudflare. "Made with Manus" badge is visible. Analytics: Umami + Plausible (Manus). No GA4 / Ads tag found. |
| Weight | ≥ 4.4 MB desktop / ≥ 6.1 MB mobile (sum of `content-length`, 24–27 requests); HTML 107 KB gz + JS 223 KB gz |
| Design | Dark navy + gold, Space Grotesk / DM Sans, real car-interior hero photo. Clean, but a recognisable AI-builder template. |

## 6. GBP activity (from Maps data)

| Date | Post theme |
|---|---|
| 2026-10-23 | New automotive-focused shop at 203 Cannon St E, "not open yet" |
| 2026-10-05 | Story: Ryan found a customer's lost keys, no charge |
| 2026-10-01 | Story: VW key blade repair, Tyandaga (Burlington), Sunday |
| 2026-09-26 | Story: nurse, late shift, fob battery; names Hamilton, Ancaster, Dundas, Stoney Creek |
| 2026-09-22 | Tool-kit explainer |
| 2026-09-17 | Story: fob failure fixed by Ryan while out of town |

That is 6 posts in 5 weeks, 148–228 words each, built from reviews and real jobs, and naming neighbourhoods and vehicles.

## 7. What KeyFoby should match or beat

| CanDo does well | KeyFoby response |
|---|---|
| Publishes "starting at" prices for 7 auto services | Publish real ranges by service and by make (Truth Table Q5). Server-render them on `/pricing` and on each service and make page. |
| GBP posts about weekly: story format, technician name, vehicle, neighbourhood | Match the cadence (Phase 6). KeyFoby's 222 reviews give more story material. |
| Names the technician; shows real job photos | Technician bio + real photos (Truth Table Q6); never AI proof |
| Honest split: regular hours + 24/7 lockouts | Use the same pattern if KeyFoby is not truly 24/7 (Truth Table Q1) |
| Child/pet lockout goodwill offer | Optional; only if the owner commits to it |
| WhatsApp + call + quote + "Review Us" in nav | Brief's sticky call/WhatsApp bar + a review link already cover this; add the review link to nav or footer |
| Moving to a lower-city shop focused on car keys | **Rising threat.** If CanDo fixes its domain, it competes directly on "car key" queries. Re-check its Maps rank and site monthly. |

## 8. Weak or thin (do not copy)

- Website unreachable from GBP (503), canonical host does not resolve, live copy robots-blocked: zero organic presence.
- Client-side rendering only. Reviews, FAQ answers and prices are invisible in raw HTML.
- NAP conflict between GBP (Cannon St E) and site/schema (Brigadoon Dr), with a fake geo point and a placeholder map embed.
- Hours conflict (GBP 24 h vs schema 8–6).
- Hard-coded self-serving `aggregateRating` 5/100 on every route (GBP says 128).
- No service, location or make URLs. Generic H1s ("What We Can Do For You"). Soft 404s. Meta descriptions up to 254 chars.
- Live template placeholders, plus a customer-app promo on the homepage (the same focus dilution the brief flags for KeyFoby).
