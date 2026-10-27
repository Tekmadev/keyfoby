# GBP, Maps and SERP baseline

Observed 2026-10-26, 20:15–20:36 EDT (Monday evening), method: Claude desktop browser pane (signed out, Google "limited view" of Maps), Maps place data read from the page's own `preview/place` response, Google Search knowledge panel and Places (`udm=local`) panel, plus a clean-profile headless Chrome cross-check for Maps. Nothing was clicked that writes, reports, claims, calls or messages.

**Location caveat.** Google showed "Hamilton, Ontario - Based on your past activity" on the pane's normal searches (the pane profile has history) and "Mississauga, Ontario - From your IP address" with `&pws=0`. The clean headless profile also resolved by IP (Mississauga). Maps queries are query-anchored ("Hamilton Ontario"), not a geo-grid. Checks ran at about 20:20 EDT, when several competitors showed "Closed" and KeyFoby showed "Open 24 hours"; open-now status can shift local rankings, so a daytime re-check is needed before treating any rank as settled.

**Blocked step.** The clean-profile Google *web* search was stopped by Google's "unusual traffic" page (`/sorry/`) on the first query. Not retried and not solved. Web results below therefore come from the pane only (normal + `pws=0`).

---

## 1. KeyFoby Google Business Profile

| Field | Observed | Evidence |
|---|---|---|
| Name | Keyfoby | Maps place `0x85d362d9688716f5:0xd2b2f9b7710cb4a0`, Place ID `ChIJ9RaHaNli04URoLQMcbf5stI`, `/g/11xkwt42g3` |
| Primary category | Locksmith | Maps header; knowledge panel "Locksmith in Hamilton, Ontario" |
| Secondary categories | Key duplication service | Maps `preview/place` category array `["Locksmith","Key duplication service"]`. Not shown in the signed-out UI |
| Rating / reviews | 4.9 / 222 | Maps + knowledge panel. Star count from the 222 loaded reviews: 216 × 5★, 1 × 4★, 5 × 1★ (= 4.905) |
| Hours | Open 24 hours, all 7 days | Maps hours rows "Monday … Sunday, Open 24 hours" |
| Address visibility | Street address shown: 40 Courtland Ave, Hamilton, ON L9B 1X6. Google neighbourhood "West Mountain". Also "Serves Hamilton and nearby areas" | Maps, knowledge panel, Places panel |
| Phone | (905) 467-6860 | Maps, knowledge panel |
| Website link | `https://www.keyfoby.com/`, no UTM | Maps link `data-item-id="authority"` href |
| Appointment / booking link | `https://www.keyfoby.com/` (homepage), no UTM | Maps "Open booking link"; knowledge panel "Appointments: keyfoby.com" |
| Business description ("From Keyfoby") | Present. Emoji bullets; claims "Hamilton's #1", "Licensed & Insured", "15-minute programming", "Licensed professionals", "100% satisfaction guarantee", "Emergency lockouts 24/7"; serves "Hamilton, Burlington, Oakville, Mississauga, Brampton, Toronto"; lists a **second phone, (438) 797-7776**, plus WhatsApp | Knowledge panel full text in page HTML (`data-long-text`) |
| Services (GBP) | 5 predefined, no descriptions or prices: Car digital & remote key reprogramming · Car lockouts · New key fob creation · Safe lock install, open & repair · Car key cut | Search Places panel → Services tab |
| Products | None | No Products block in knowledge panel |
| Posts / updates | None shown | No "on Google" / "Updates" block in knowledge panel |
| Linked profiles | Facebook only | Knowledge panel "Profiles" |
| Years in business | "3+ years in business" | Local pack / Places list card |
| Photos | 29 | Maps "29 Photos"; owner photo + video uploaded via GBP iOS app (2025-07-16 in place data) |
| About tab / attributes | **Not visible**: signed-out Maps shows only Overview and Reviews tabs | Maps tab list; `preview/place` has no attribute block |
| Q&A | Not shown (signed-out) | No Q&A block on Maps or knowledge panel |
| Claimed | Yes. Owner replies as "Keyfoby (Owner)" | Review replies; place data owner field |

### Review topic chips (all 10)

| Chip | Count | Brief said |
|---|---|---|
| kia key fob | 22 | 22 ✔ |
| key programming | 18 | 18 ✔ |
| key fob replacement | 13 | 13 ✔ |
| car key replacement | 12 | 12 ✔ |
| key cutting | 8 | 8 ✔ |
| friendly technician | 8 | 8 ✔ |
| spare key | 5 | — |
| battery replacement | 3 | — |
| new fob | 2 | — |
| responsive team | 2 | — |

**The "kia key fob" chip is not Kia demand.** Filtering by that chip returns 22 reviews; only 1 mentions Kia (a fob battery swap, "a year ago"). The rest are Civic, F150, Jeep, Camry, Altima etc. It is Google's label for the key-fob cluster.

### Review velocity and owner replies (all 222 loaded, sorted Newest)

| Age (Google relative label) | Reviews | With owner reply |
|---|---|---|
| ≤ 4 weeks | 9 | 0 |
| "a month ago" | 4 | 0 |
| 2 months | 22 | 7 |
| 3 months | 10 | 3 |
| 4 months | 16 | 0 |
| 5 months | 11 | 0 |
| 6 months | 8 | 1 |
| 7 months | 0 | 0 |
| 8 months | 6 | 6 |
| 9 months | 17 | 4 |
| 10 months | 12 | 4 |
| 11 months | 4 | 4 |
| "a year ago" (12–23 months) | 103 | 71 |
| **Total** | **222** | **100 (45%)** |

No review is older than "a year ago", so every review is under about 2 years old.

**5 most recent reviews** (dates approximate, from relative labels on 2026-10-26): ~Oct 25 (5★, CA$100–150, lockout + reprogramming + new fob), ~Oct 24 (5★, duplicate key), ~Oct 21 (5★, 2 new fobs, CA$100–150), ~Oct 21 (5★, rating only, CA$50–100 lockout), ~Oct 12 (5★, Saturday same-day new key, CA$200–250). **Owner replies: 0 of 5.** The most recent owner reply is about 2 months old.

**Low ratings (6).** 1★ 2 months: programmed a customer-bought Amazon fob, which then failed; dispute over warranty (owner replied at length). 1★ 4 months: rating only. 1★ 5 months: door repair didn't last. 1★ 6 months: misdiagnosis; "$50 assessment fee" refund dispute (owner replied). 1★ 8 months: car opened via "theft mode" without permission (owner replied). 4★ 10 months: missed and late appointments (owner replied).

### Recurring facts reviewers state (Truth Table inputs)

Counts are reviews whose text matches, out of 222. Quotes are a few words only.

| Fact | Observed | Count / examples |
|---|---|---|
| Technician name | "Mohammad" (also spelled Mohammed / Mohamad / Muhammad) | 14 reviews; owner reply also names Mohammad |
| Makes named | Honda/Civic 6 · Jeep 3 · Nissan 2 (incl. "2008 Nissan Altima") · Toyota 2 (incl. "toyota camry 2024") · Kia 1 · Ford F150 1 · Chevy Cruze 2014 1 · Lincoln MKX 2011 1 · Mazda CX-5 1 · VW 1 · Dodge Caravan 1 · Suzuki SX4 1 · Hyundai 0 | Makes are rarely named; no make dominates |
| Arrival / turnaround | "within the hour" or similar: 8; job times "10 minutes", "20 minutes", "20-25minutes", lockout "15mins"; "Just over an hour" from the call to a new key; "texted eta" | 25 reviews mention minutes |
| Comes to the customer | "came to my house", "came to my home", "met me", "drove to Oakville" | ~21 |
| After-hours | "after hours" ×4 (2 months ago); "around midnight"; a call at "11:30pm"; "730 pm on a Sunday" | 5 explicit after-hours, plus the two late calls |
| Weekend | "on a Saturday" ×2; "on the weekend" ×1; Sunday ×1 | 4 |
| Same day | "same day" / "same-day" | 4 |
| Savings vs dealer | dealer mentioned in 11; "saved me $700 from the dealership" (2 fobs); "fraction of the price"; dealer "almost 1000" | 11 |
| Prices reviewers tagged (Google's "How much did you pay?") | CA$50–100 ×1 (lockout) · CA$100–150 ×7 · CA$150–200 ×2 · CA$200–250 ×5 · CA$300–350 ×2 (one after-hours lockout, one programming a customer-supplied fob) | 17 tagged; labels "Great price" 14, "Reasonable price" 6, "Expensive" 0 |
| Prices in text | "~$200 for a new key programmed"; "$80 … for programming"; "$50 assessment fee" | 1 each |
| Services reviewers tagged | New key fob creation 14 · Car lockouts 10 · Car digital & remote key reprogramming 6 · Safe lock install, open & repair 6 · Service not listed 1 | The 6 "safe" tags come with car-key text, so they look mis-tagged |
| All keys lost | "all key lost", "lost my keys" | 9 |
| Areas named | Ancaster 1 · Oakville 1 ("a year ago") · Hamilton 2 · Burlington / Stoney Creek / Dundas / Grimsby / Mississauga / Brampton / Toronto 0 | Reviews do not support the GTA list |
| Warranty | One reviewer "Advised 3 month warranty"; owner reply says programming is redone free and their own fobs are replaced free, with no guarantee on customer-supplied fobs | 2 |
| "System readout" process | Owner reply: show "the system readout" so the old fob is locked out; reviewer: "showed me on his computer" | 1 + 1 |
| Licence / insurance | No reviewer mentions it | 0 |

---

## 2. Rank checks

### 2a. Google Maps: KeyFoby position

| Query | Brief | Pane (personalized) | Clean headless profile (IP location) |
|---|---|---|---|
| car key replacement Hamilton Ontario | #5 | **#1** | **#1** |
| key fob programming Hamilton Ontario | #5 | **#1** | **#1** |
| automotive locksmith Hamilton Ontario | #8 | **#1** | **#1** |
| car key fob Hamilton Mountain | #6 | **#1** | **#1** |

No "Sponsored" pins in any Maps list. The brief's ranks cannot be reproduced here. Possible causes, none verified: evening open-now boost (24-hour listings vs closed competitors), IP location, signed-out view, or a real ranking change since the brief.

### 2b. Maps top 10 (clean profile; the pane matched for queries 2–4)

| # | car key replacement Hamilton Ontario | key fob programming Hamilton Ontario | automotive locksmith Hamilton Ontario | car key fob Hamilton Mountain |
|---|---|---|---|---|
| 1 | Keyfoby 4.9/222, Courtland Ave (Mountain) | Keyfoby | Keyfoby | Keyfoby |
| 2 | Auto Key Pro 4.8/661, Rymal Rd E (East Mountain) | CanDo Lock and Key 5.0/128, Cannon St E | Auto Key Pro (Rymal) | Auto Key Pro (Rymal) |
| 3 | Nation Auto Locksmith 4.5/173, Main St E | Auto Key Pro (Rymal) | About Town Lock & Key 4.5/118, Cannon St E | Nation Auto Locksmith |
| 4 | Ideal Lock and Service 4.9/222, 484 Parkview Blvd | Nation Auto Locksmith | CanDo Lock and Key | CanDo Lock and Key |
| 5 | CanDo Lock and Key | Hamilton Prime Locksmith 4.8/90, Dodman Cres (Ancaster) | Hamilton Prime Locksmith | Auto Key Pro 4.3/84, Main St E |
| 6 | Mr. Key Pro – Burlington 4.9/633, Churchill Ave | ABC Locksmith & Security 4.9/145 (no address) | ABC Locksmith & Security | About Town Lock & Key |
| 7 | Auto Key Pro (Main St E) | About Town Lock & Key | Dundas Lock & Key 4.7/112, King St W | Hamilton Prime Locksmith |
| 8 | Hamilton Prime Locksmith | Auto Key Pro (Main St E) | Nation Auto Locksmith | Ottawa Key Shop 4.5/87, Ottawa St N |
| 9 | About Town Lock & Key | Locksmith Hamilton 2.0/4, Dundurn St S | Auto Key Pro Hamilton Van 5.0/61 (service area) | Locksmith Hamilton |
| 10 | Locksmith Hamilton | Auto Key Pro Hamilton Van | Locksmith Hamilton | Minute Key 4.3/47, Centennial Pkwy N |

Pane variant of query 1, from #2 down: CanDo, Nation, Locksmith Hamilton, Hamilton Prime, Auto Key Pro (Rymal), AllSafe Locksmith 5.0/13 (Hughson St N), ABC, Eddie Locksmith 5.0/71, Dundas Lock & Key.

### 2c. Google web search (`gl=ca&hl=en`, pane; `pws=0` load used for positions)

| | car key replacement hamilton | key fob programming hamilton | car locksmith hamilton |
|---|---|---|---|
| Sponsored | LSA unit "Sponsored · Locksmiths \| Hamilton" on the personalized load (Hamilton Prime 4.8/90 "11+ years"; Diligent Locksmith 4.8/164 "7+ years"); none on the `pws=0` load; no text ads seen | None | LSA unit on both loads: Hamilton Prime + Diligent Locksmith (`pws=0`) / Toronto Locksmith Solutions 5.0/1 (personalized) |
| Local pack (`pws=0`) | Auto Key Pro · Nation · **Keyfoby (#3)** | **Keyfoby (#1)** · Auto Key Pro · CanDo | City Key Locksmith 4.9/75 · Hamilton Prime · KeyDash Locksmith 4.9/135. **Keyfoby absent** |
| Local pack (personalized) | **Keyfoby #1** · Auto Key Pro · CanDo | **Keyfoby #1** · CanDo · Auto Key Pro | Hamilton Prime · **Keyfoby #2** · Nation |
| Organic 1 | autokeypro.ca | **keyfoby.com** | autokeypro.ca |
| 2 | ecclesautoservice.ca | ecclesautoservice.ca | popalock.ca |
| 3 | **keyfoby.com** | autokeypro.ca | alphalocksmith.ca |
| 4 | yelp.ca | abouttownlockandkey.com | yelp.ca |
| 5 | alphalocksmith.ca | yelp.ca | carkeyfixers.ca |
| 6 | carkeyfixers.ca | popalock.ca | abouttownlockandkey.com |
| 7 | popalock.ca | ecclesautoservice.ca (blog) | mikeslocksmith.ca |
| 8 | abouttownlockandkey.com | reddit.com (r/Hamilton) | nextlevellocksmith.ca |
| 9 | tkscarkeys.ca | facebook.com (group thread) | bbb.org |
| 10 | royalcarkeys.ca | alphalocksmith.ca | ealocksmith.ca |
| KeyFoby organic | **#3** (also #3 on the personalized load) | **#1** | **#13** (page 2, 4th) |
| People also ask (visible) | How much does it cost to replace a key for my car? · How much should it cost to replace a key? · Can you program a car key without the original? · Where can I get a remote starter installed in Hamilton, Ontario? | How much does it normally cost to program a key fob? · How much does it cost to program a car key fob? · Does Home Depot reprogram key fobs? · Can you program a key fob without going to the dealership? | How much does a locksmith cost in Hamilton? · What do I do if I have locked my keys in my car? · Can my car get locked with a key inside? · Do you need a license to be a locksmith in Ontario? |
| Related searches | Cheapest car key replacement hamilton · Mobile car key replacement hamilton · Car key replacement hamilton cost · Car key replacement near me · Auto Key Pro Hamilton · Car locksmith Hamilton · Key cutting Hamilton mountain · Auto Key Pro rymal | Mobile key fob programming hamilton · Free key fob programming hamilton · Car key fob programming hamilton · Key fob programming hamilton cost · Auto Key Pro Hamilton · Key fob replacement near me · Auto key programming near me · Key cutting Hamilton mountain (personalized load: + Chevy key fob programming hamilton) | Cheapest car locksmith hamilton · Mobile car locksmith hamilton · 24 hour car locksmith hamilton · Best car locksmith hamilton · Car key replacement Hamilton · Auto Key Pro Hamilton · Locksmith Hamilton mountain · Alpha Locksmith Hamilton |

KeyFoby SERP title: "KeyFoby – Car Key Fob & Locksmith Services Hamilton, ON". One snippet variant ends "Licensed & insured."

---

## 3. Competitor GBPs

Categories come from the Maps place data (`preview/place`). The signed-out UI shows only the primary. Service counts come from the Search Places panel "Services:" line.

| Listing | Primary | Secondary | Rating / reviews | Hours | Storefront vs service area | GBP services | Website | Posts | Photos | Other |
|---|---|---|---|---|---|---|---|---|---|---|
| **Keyfoby** | Locksmith | Key duplication service | 4.9 / 222 | 24 h × 7 | Street address shown (West Mountain) + "Serves Hamilton and nearby areas" | 5 predefined | keyfoby.com | none | 29 | 3+ yrs; description with 2nd phone |
| CanDo Lock and Key | Locksmith | — | 5.0 / 128 | 24 h × 7 | Storefront 203 Cannon St E (Central Hamilton) + serves Hamilton and nearby | 10 custom (lockout, lost key, duplication, fob programming, transponder, broken key extraction, ignition repair, smart key, motorcycle key, replacement keys) | cando-key.ca | ~weekly (6 posts, Sep 17 – ~Oct 23) | 43 + 3 videos | Description "24/7 mobile automotive locksmith … Hamilton, Burlington"; Yelp lists a different address (730 Brigadoon Dr) |
| Nation Auto Locksmith | Emergency locksmith service | — | 4.5 / 173 | 24 h × 7 | Storefront 643 Main St E Entrance 3 + serves Hamilton and nearby | 30 (residential, commercial, auto) | locksmithhamilton.com | last Jul 12, 2026 | 10 | 7+ yrs; 4 Products (Emergency Locksmith, Rekey, Garage Door Repair, Car Locksmith) |
| About Town Lock & Key | Locksmith | Door supplier · Emergency locksmith service · Lock Store · Locks supplier · Security system installation service | 4.5 / 118 | Mon–Fri 10–4; Sat–Sun closed | Storefront 393 Cannon St E + serves Hamilton and nearby | ~60 | abouttownlockandkey.com | none shown | 42 | 30+ yrs; description names Hamilton, Brantford, Burlington, Oakville |
| Auto Key Pro (Rymal) | Locksmith | Auto parts store · Auto repair shop · Computer repair service · Electronics repair shop · Key duplication service | 4.8 / 661 | Mon–Fri 11–6; Sat–Sun closed | Storefront 1154 Rymal Rd E Unit 6 (**East Mountain**) + serves Hamilton and nearby | 82 | autokeypro.ca | older updates only ("View previous updates") | 99 | 10+ yrs; Facebook + Instagram linked; description |
| Auto Key Pro (Main St E) | Locksmith | — | 4.3 / 84 | **Closed all 7 days** (as set) | Storefront 961 Main St E + "Serves Hamilton" | 52 | autokeypro.ca | — | 9 | Same phone |
| Auto Key Pro Hamilton Van | Locksmith | Emergency locksmith service · Service establishment · Key duplication service | 5.0 / 61 | Mon–Fri 11–7; Sat–Sun closed | Service area only (no address) | 63 | autokeypro.ca | — | 17 | Same phone |
| Mr. Key Pro – Burlington | Locksmith | — | 4.9 / 633 | 24 h × 7 | Storefront 2014 Churchill Ave, Burlington + serves Burlington and nearby | 15 (incl. automotive diagnostics, module programming) | mrkey.pro | none shown | 104 | Description "Greater Toronto, and Niagara" |
| Alpha Locksmith | Locksmith | Emergency locksmith service · Service establishment | 4.9 / 442 | Mon–Fri 9–9; Sat–Sun 12–9 | Service area only (no address); serves Hamilton and nearby | 92 (mostly residential, commercial, safe) | alphalocksmith.ca | frequent job-log posts naming the city (4 days ago, Oct 5, Oct 3 …) | 10 | 10+ yrs; "since 2012" in description |
| *Hamilton Prime Locksmith (extra: LSA advertiser, top 5 in every Maps query)* | Locksmith | — | 4.8 / 90 | 24 h × 7 | Storefront 42 Dodman Cres, Ancaster | not captured | hamiltonprimelocksmith.com | not checked | 173 | Runs Local Services Ads ("11+ years in business") |

Auto Key Pro: all three listings show (289) 799-9585 ✔ (brief confirmed).

---

## 4. Brief claims vs observed

| # | Brief claim (section 2) | Observed | Verdict |
|---|---|---|---|
| 1 | GBP "Keyfoby", category Locksmith | Same; secondary "Key duplication service" also present | ✔ + new detail |
| 2 | 4.9★ / 222 | 4.9 / 222 (216×5, 1×4, 5×1) | ✔ |
| 3 | ~10 new reviews in the last month | 9 in ≤ 4 weeks; 13 including "a month ago" | ✔ |
| 4 | Owner replies | 100 / 222 overall, but **0 of the last 13** (≈ 5 weeks) and 0 / 27 at 4–5 months; last reply ≈ 2 months ago | Partly wrong |
| 5 | Listed "Open 24 hours" | All 7 days, Open 24 hours | ✔ |
| 6 | About tab shows only "Onsite services" (no services list or attributes) | About tab not visible signed out (cannot verify). A **services list does exist** (5 predefined). A **business description exists**, carrying claims and a 2nd phone | Not verifiable / partly wrong |
| 7 | Street address public, Hamilton Mountain | 40 Courtland Ave L9B 1X6, "West Mountain" | ✔ (residential character not checked) |
| 8 | Review themes Kia key fob 22, key programming 18, fob replacement 13, car key replacement 12, key cutting 8, friendly technician 8 | Counts ✔. But "kia key fob" holds only 1 Kia mention | Counts ✔; Kia reading ✘ |
| 9 | Reviewers cite dealer savings, speed, same day, Saturday/after-hours, "came to my house" | 11 dealer · 25 minute-level times · 4 same day · 5 after-hours + 4 weekend · ~21 came to them | ✔ |
| 10 | Maps #5 / #5 / #8 / #6 | #1 / #1 / #1 / #1 (pane and clean profile, ~20:20 EDT, IP Mississauga) | ✘ not reproduced |
| 11 | Ahead: CanDo 5.0/128, Nation 4.5/173, About Town 4.5/118, AllSafe 5.0/13, AKP Main 4.3/84 | All figures match | ✔ |
| 12 | Leaders sit in the lower city; KeyFoby on the Mountain | CanDo, Nation, About Town, AKP Main are lower city; but AKP Rymal (4.8/661, #2–3 in 3 of 4) is East Mountain and Hamilton Prime is Ancaster | Partly wrong |
| 13 | AKP 3 listings on one phone (Rymal 4.8/661, Van 5.0/61) | ✔; also the Main St E listing is set "Closed" every day | ✔ + new detail |
| 14 | Mr. Key Pro 4.9/633; Alpha 4.9/442 | ✔ | ✔ |
| 15 | "car key replacement hamilton": sponsored locksmith unit + sponsored results above organic | LSA unit seen on 1 of 2 loads; no text ads seen | Partly ✔ |
| 16 | KeyFoby organic #2 behind autokeypro.ca | #3 (ecclesautoservice.ca #2) on both loads | ✘ |
| 17 | Related searches (5 listed) | All 5 present | ✔ |
| 18 | Could not verify secondary GBP categories | Key duplication service | Now verified |

---

## 5. GBP gaps vs the leaders

1. **No posts.** CanDo posts about weekly; Alpha posts job logs naming the city; Nation last posted in July. KeyFoby shows none.
2. **Thin services.** 5 predefined, with no descriptions or prices, against 10 to 92 at competitors (CanDo 10 custom, Nation 30, About Town ~60, AKP 52–82, Alpha 92). "Safe lock install, open & repair" is listed, and 6 reviewers tagged it on car-key jobs: confirm or remove it.
3. **No products** (Nation has 4).
4. **Few photos:** 29 vs AKP 99, Mr. Key Pro 104, Hamilton Prime 173, CanDo 43, About Town 42.
5. **Categories:** 2. Several leaders use "Emergency locksmith service" (Nation primary; About Town, AKP Van and Alpha secondary). AKP Rymal adds auto-electronics categories.
6. **Description conflicts with the truth:** an unverified "#1", "Licensed & Insured", "100% satisfaction guarantee" and "15-minute programming"; a second phone, (438) 797-7776; a GTA city list (Mississauga, Brampton, Toronto) that no review supports; emoji formatting.
7. **Owner replies have lapsed:** 0 of the last 13 reviews. A visible 1★ "scam" review carries a long, defensive owner reply.
8. **Links:** the website and appointment links are both the bare homepage, with no UTM and no `/quote`.
9. **Profiles:** only Facebook is linked. An Instagram account exists; per its Google snippet the bio shows the phone as "905-046-76860" (typo).
10. **No Local Services Ads.** Hamilton Prime and Diligent hold the sponsored locksmith slots on "car key replacement hamilton" and "car locksmith hamilton".
11. **Weak on "car locksmith hamilton":** missing from the depersonalized 3-pack and organic #13. Service-area listings (City Key, KeyDash) take the pack.
12. **Address risk:** the street address is public. If it is not customer-facing, this conflicts with service-area rules (Truth Table Q3).
