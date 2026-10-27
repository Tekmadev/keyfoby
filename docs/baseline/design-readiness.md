# Design readiness baseline

Observed 2026-10-26, method: read-only file inspection (`cat`, `grep`, `sips`, `strings`, Python/PIL for pixel bounds and WCAG contrast); live site captured with headless Chrome 156 via puppeteer-core in light and dark `prefers-color-scheme` (1280 × 800 and 375 × 812); Higgsfield MCP read-only calls (`balance`, `list_workspaces`, `list_projects`, `models_explore` list/get/recommend). No generation, no uploads, no project creation, no repo edits. Working captures: `/private/tmp/claude-501/-Users-shajeed--claude-spares-spare-aPm6R3/b34511f8-926f-4eaa-8065-6552a0097fa6/scratchpad/phase0/design-readiness/` (`live-light-1280-full.png`, `live-dark-1280-full.png`, `live-light-375-fold.png`, `light_nav.png`).

## 0. Headline

| # | Finding | Evidence |
|---|---|---|
| 1 | `ui-ux-pro-max` is installed and functional (v2.5.0). Phase 3 can proceed without a substitute. | `~/.claude/skills/ui-ux-pro-max/SKILL.md` (658 lines); `scripts/` + `data/` symlinks resolve; listed in this session's skills |
| 2 | Two of the three non-logo images on the server are **AI-generated (GPT-4o)**, and one of them is the site's **OG image and JSON-LD `logo`**. It shows a fake KF-branded fob. | C2PA manifest strings `c2pa.created … GPT-4o … OpenAI API` in `public/images/keyfobykeys.png` and `public/images/carkey.webp`; used at `lib/business-data.ts:272`, `app/components/LocalBusinessSchema.tsx:274` |
| 3 | **Zero real photos** of the technician, van, tools, jobs or keys exist in the repo. Hero is a stock-style key handover. Every proof section in Phase 2.4 is blocked on a client shoot (§5). | `public/images/` holds 3 images only (§2.3) |
| 4 | No bespoke palette exists. The logo uses Tailwind v3 defaults (`#3b82f6` / `#0ea5e9` / `#06b6d4`), and the video "brand kit" palette is Tailwind v4 slate/blue/cyan defaults. | `keyfobylogo.svg` gradient stops; oklch → hex check in §2.5 |
| 5 | The video brand kit (also loaded as the `keyfoby-brand` skill) **prescribes the banned patterns**: pill CTAs, gradient headline text, blue→cyan glows, "5-Star / Licensed & Insured / 24/7" badges. | `Remotion/firstvideo/Keyfoby/KEYFOBY_BRAND.md:64-66, 81, 99-100, 120`; identical to `.claude/skills/keyfoby-brand/SKILL.md` (`diff` = same) |
| 6 | The live site renders differently per visitor's OS theme: 529 `dark:` variants with no forced theme. In light mode, the desktop nav links and mobile menu icon are dark-on-dark over the hero, and the footer "Our Services" heading is **1.00:1** (invisible). | headless captures §3.2 |
| 7 | All 11 anti-slop categories that apply are present (emoji icons, gradient text, blue-cyan on dark, glass, 4-up icon cards, centred hero + 2 pills, fake stats, filler, carousel, blobs, template components). | §3.3 |
| 8 | White text on the logo blue `#3b82f6` is 3.68:1 and on cyan `#06b6d4` 2.43:1: the current CTA colour fails WCAG AA for normal text. | contrast calc §3.1 |
| 9 | Higgsfield: Plus plan, 1,000 credits, **0 projects** (no `keyfoby-revamp` yet). `models_explore` does not show per-model credit cost; cost needs `get_cost: true` preflight in Phase 3. | MCP responses §4 |

## 1. ui-ux-pro-max skill

| Item | Value | Evidence |
|---|---|---|
| Primary path | `/Users/shajeed/.claude/skills/ui-ux-pro-max/` | `ls -la` |
| Real source | `/Users/shajeed/src/ui-ux-pro-max-skill/src/ui-ux-pro-max/{data,scripts}` (symlinks) | `readlink -f data scripts` |
| Version | 2.5.0, NextLevelBuilder, MIT, repo `nextlevelbuilder/ui-ux-pro-max-skill`; local HEAD `b7e3af8` (2026-04-03) | `skill.json`; `git log -1` |
| Second copy | `~/.agents/skills/ui-ux-pro-max/SKILL.md` only (identical text, **no scripts/data**: not usable on its own) | `diff -q` = identical; `find` |
| Not present | `keyfoby/.claude/` (no project skills), Remotion `.claude/skills` and `.agents/skills` (Remotion skills + `keyfoby-brand` only) | `ls` |
| Provides (SKILL.md head) | 50+ styles, 161 palettes, 57 font pairings, 161 product types, 99 UX guidelines, 25 chart types, 10+ stacks incl. `nextjs`, `shadcn`, `html-tailwind`; `search.py "<query>" --design-system [-p] [--persist]`, `--domain <style\|color\|typography\|ux\|…>`, `--stack nextjs`; priority table (1 Accessibility … 10 Charts) | `SKILL.md:1-90, 363-419`; `data/stacks/nextjs.csv` exists |
| Data counts | `colors.csv` 162 rows, `typography.csv` 74, `styles.csv` 85 (incl. headers) | `grep -c .` |
| Runtime | Python 3.13.3 available | `python3 --version` |

Phase 3 cautions (not run now):
- `SKILL.md:359` says "Stack: React Native (this project's only tech stack)". Wrong for this repo; pass `--stack nextjs` explicitly.
- `--persist` writes `design-system/MASTER.md` + `design-system/pages/` into the **current directory**. The brief wants `docs/design/DESIGN.md`; run it from scratch and transcribe, or accept a new root folder deliberately.
- Its own checklist already bans emoji icons and requires 4.5:1 contrast, 44 px targets, reduced-motion: it agrees with the brief's anti-slop list.

## 2. Brand assets

### 2.1 Logo files (`public/images/KeyFoby-logo/`)

| File | Format | Pixels | Weight | Padding / notes |
|---|---|---|---|---|
| `keyfobylogo.svg` | SVG, single path | viewBox 2916.96 × 2952.49 | 2,265 B | Mark only (no wordmark). Gradient + hairline `stroke:#000; stroke-width:.25px` (remove in rebuild). Used in nav/footer (`NavBar.tsx:48,68`, `Footer.tsx:16`) |
| `keyfobylogo.ai` | Illustrator 27.8 (PDF-compatible, 1 page) | — | 227,516 B | Created 2025-06-24. Mark only, no type layer found |
| `keyfobylogo-500.png` | PNG RGBA | 500² | 14,004 B | Tight crop (alpha bbox 6,3 → 494,497) |
| `keyfobylogo-1200.png` | PNG RGBA | 1200² | 65,429 B | Tight crop |
| `keyfobylogo-3000.png` | PNG RGBA | 3000² | 265,202 B | Tight crop |
| `keyfobylogo-3K-smaller.png` | PNG RGBA | 3000² | 167,288 B | ~17 % padding each side (bbox 524 → 2476) |
| `keyfobylogo-white-3000.png` | PNG 8-bit colormap | 3000² | 29,281 B | White mark on transparent, ~5 % padding |
| `keyfobylogo.jpg` | JPEG | 3000² | 170,937 B | Mark on white, padded |

Missing for the redesign: horizontal lockup (mark + wordmark) as a file, single-colour dark mark, maskable icon with safe zone, SVG without stroke.

**The mark:** a K/F monogram whose lower leg is a key blade with bitting. Strongest brand cue; candidate for the one signature interaction.

### 2.2 Logo colours (from `keyfobylogo.svg`)

| Stop | Hex | Tailwind v3 name | White text on it | On `#0b1220` |
|---|---|---|---|---|
| 0 (top-left) | `#3b82f6` | blue-500 | 3.68:1 (fail AA body) | 5.09:1 |
| 0.5 | `#0ea5e9` | sky-500 | 2.77:1 (fail) | 6.76:1 |
| 1 (bottom-right) | `#06b6d4` | cyan-500 | 2.43:1 (fail) | 7.35:1 |

Linear gradient, 135° in practice (x1 2599 / y1 2386 → x2 143 / y2 −69). Text-safe derivatives: white on `#0369a1` 5.93:1, on `#2563eb` 5.17:1; dark ink `#0b1220` on `#0ea5e9` 6.76:1; `#0369a1` on white 5.93:1.

### 2.3 Other images (`public/images/`)

| File | Real format | Pixels | Weight | Verdict | Evidence | Where used |
|---|---|---|---|---|---|---|
| `herobannerKF.webp` | **JPEG** (wrong extension; served `image/webp`) | 1920 × 851 | 157,614 B | **Stock-style** photo: suited hand passes a flip key to a seated driver, warm lens flare. Licence unknown (metadata stripped). Reads as dealership handover, not a mobile locksmith | `file`, `sips`; visual inspection | Hero CSS background `Hero.tsx:30`; preloaded `layout.tsx:126-132` |
| `keyfobykeys.png` | PNG | 1024 × 1024 | 1,886,266 B | **AI (GPT-4o)**: invented fob with a KF logo on carbon-fibre, odd key blank, blurred house/car | C2PA manifest strings: `c2pa.created`, `softwareAgent GPT-4o`, `c2pa.converted … OpenAI API` | OG/Twitter image `lib/business-data.ts:272` (declared 1200 × 630 in `layout.tsx:86-87`, actual 1024²); JSON-LD `logo` `LocalBusinessSchema.tsx:274`; Remotion kit plate |
| `carkey.webp` | **PNG** (wrong extension) | 1536 × 1024 | 1,981,245 B | **AI (GPT-4o)**: generic 3-button flip fob on slate | same C2PA strings | Unused (no reference in `app/`, `lib/`); still public at `/images/carkey.webp` (200) |

Brief rule "Never use AI for proof" is already broken by the OG image and schema logo (a fabricated branded product). Both must be replaced in Phase 1 or 2 (logo file for schema; real or clearly decorative OG image).

### 2.4 Favicons and manifest

| Item | Status | Evidence |
|---|---|---|
| `favicon.ico` (16/32/48) | OK. Same file in `app/`, `public/`, `favicons/` | `md5` identical; live 200 `image/x-icon` |
| `favicon-16/32`, `apple-touch-icon` 180², `android-chrome-192/512` | Present. Apple icon is transparent and edge-to-edge (bbox 2,1 → 178,179): iOS fills black and rounds the corners into the mark | PIL alpha bbox; preview on black |
| `site.webmanifest` | **Icons broken**: `src` is `/android-chrome-192x192.png` (root), files live in `/images/KeyFoby-logo/favicons/`. Live root URL returns **200 `text/html` 135 KB** (soft 404) | `cat`; `curl -w` |
| Manifest colours | `theme_color #3b82f6`, `background_color #1e293b`, no `maskable` purpose | file |
| Linked from | `layout.tsx:71-78` (declared twice: `icons.other` + `manifest`) | file |

### 2.5 Brand documents

| Aspect | `keyfoby/BRAND_BRIEF.md` | `Remotion/…/KEYFOBY_BRAND.md` (= `keyfoby-brand` skill) |
|---|---|---|
| Purpose | Business facts for automation/intake | Brand kit + 9:16 ad brief, "pulled from the live site … 2026-09-27" (`:8`) |
| Palette | None | 17 tokens + 3 gradients + glow (`:62-81`, `:162-189`). All are Tailwind v4 defaults: `#020618` slate-950, `#0F172B` slate-900, `#1D293D` slate-800, `#314158` slate-700, `#CAD5E2` slate-300, `#90A1B9` slate-400, `#05DF72` green-400, `#54A2FF`≈blue-400 `#51A2FF`, `#3080FF`≈blue-500 `#2B7FFF`, `#00D2EF`≈cyan-400 `#00D3F2` (oklch → hex from `node_modules/tailwindcss/theme.css:110-224`) |
| Fonts | None | Geist + Geist Mono, 700/600/500 (`:89-93`) |
| Shape | — | Pills for buttons/chips/badges, 24–32 px cards, blue glow, Tabler outline icons (`:97-101`) |
| Voice | "Friendly, calm, professional, efficient … urgency-aware … without overpromising" (`:83-87`) | "Calm, fast, reassuring … short lines … say Hamilton … no hype words" (`:109-114`) |
| Scope | "Custom key fobs for **cars and homes**" (`:12`) | "Mobile **car** locksmith" (`:16`); home locksmithing listed as unconfirmed (`:40`) |
| Hours | Mon–Fri 8–6, Sat 9–4, Sun closed, "24/7 emergency (as advertised)" (`:63-66`) | "24/7 emergency service" (`:17`) |
| Area | 10 towns (`:58-59`) | Same 10, tiered same-day vs mobile (`:34-38`) |
| Trust claims | "messaging emphasizes licensed & insured" (`:80`) | Uses "Licensed & Insured · 5-Star Service · 24/7" in copy bank (`:120`) while saying prices, "15 min", "100+" are unconfirmed (`:40`) |
| Images | — | Uses `herobannerKF.webp` and AI `keyfobykeys.png` as plates (`:102-105`) |

Conflicts to resolve:
1. Scope (cars and homes vs car only); `Footer.tsx:28` also says "cars and homes".
2. Hours: neither doc is authoritative; the site's own footer lists "24/7 Service" under **Coming Soon** (`lib/business-data.ts:114-119` → `Footer.tsx:105-116`) while the hero claims 24/7 (`Hero.tsx:91,191`).
3. The video kit codifies anti-slop patterns as brand rules. After the Phase 3 direction is approved, the `keyfoby-brand` skill needs a superseding web section or a note, or future agents will reintroduce pills, gradient text and glows. (Not edited: outside repo, read-only phase.)
4. Agreements worth keeping: Geist-family heritage is optional; the voice notes (calm, concrete, local, no hype) match the brief.

## 3. Current site design system

### 3.1 Tokens in use

| Dimension | Current | Evidence |
|---|---|---|
| Fonts | Geist + Geist Mono via `next/font/google` (self-hosted at build), `display: swap`, `preload: false`. Live: only `Geist 100 900` loaded | `layout.tsx:2,8-20`; `document.fonts` |
| Declared, unused | `--font-display: "Inter"`; `--color-primary-500` = lime `#C2D932`; `keyfoby-blue/cyan/dark/darker`; `.neon-glow`, `.neon-glow-cyan`; `.focus-visible` **class** (not the pseudo-class, so never applies) | `globals.css:5-13, 70-84`; `grep` 0 uses in `app/` |
| Boilerplate | `--background/--foreground`, Arial fallback from create-next-app | `globals.css:16-39` |
| Wasted hints | `preconnect`/`dns-prefetch` to Google Fonts though `next/font` self-hosts | `layout.tsx:114-123` |
| Colours | Raw Tailwind utilities, no semantic tokens: slate-50…950, blue-400…700, cyan-300…500, green, yellow/orange, purple/pink, emerald, amber | grep; 11 files use cyan gradients |
| Type scale | H1 `text-3xl → xl:text-7xl` (72 px), H2 `text-3xl → lg:text-5xl` (48 px), all bold; body 16 px. Utility counts: `font-semibold` 97, `font-bold` 82, `text-sm` 59, `text-xs` 21 | `Hero.tsx:46`; grep tallies |
| Radius | `rounded-xl` 62, `rounded-lg` 61, `rounded-full` 43, `2xl` 15, `3xl` 6, `[3rem]` 2: no scale | grep tally |
| Shadow | `shadow-lg` 13, `2xl` 6, coloured glows `shadow-blue-500/25` etc. ×12, Aceternity 6-layer custom ×4 | grep tally |
| Motion library | `motion@12.19.1` in `AppPromo.tsx:3` (whileInView fades `:32-37, 128-133`) and `ui/resizable-navbar.tsx:4-9` (scroll springs animate `width` 80 %/90 %, `y`, blur, shadow `:89-113, 156-181`; `AnimatePresence` menu `:208-222`). ~58.6 KiB gz of initial JS | files; `docs/baseline/lighthouse.md:84` |
| CSS motion | `animate-pulse` ×7, `animate-bounce` (`Hero.tsx:201`), `animate-ping` (`AppPromo.tsx:41`), `animate-spin` ×5, `hover:scale/translate` ×23, durations 200–500 ms | grep |
| Reduced motion | CSS-only override (`globals.css:60-68`). No `MotionConfig reducedMotion` / `useReducedMotion` anywhere, so JS animations ignore the setting | grep 0 hits |
| Icons | Tabler (`@tabler/icons-react@3.34.0`) + inline Heroicons paths + emoji | `package.json`; components |
| Template origin | `ui/resizable-navbar.tsx` is Aceternity UI; dead `NavbarLogo` still points to `assets.aceternity.com/logo-dark.png` "Startup" (`:245-258`) | file |
| Dead UI code | `NewsletterSignup.tsx` not imported; `@tailwindcss/typography` not installed so 12 `prose` classes do nothing | grep imports; `ls node_modules/@tailwindcss` |

### 3.2 Theme split and accessibility defects (live)

| Defect | Evidence |
|---|---|
| Section colours depend on OS theme (529 `dark:` variants, Tailwind v4 media strategy). Light mode = white Services/Features/FAQ between dark AppPromo/Reviews/Contact/Footer bands | headless computed `backgroundColor` per section, light vs dark |
| Light mode: desktop nav links `text-slate-700` over the dark hero (near-invisible) | `resizable-navbar.tsx:135`; `light_nav.png` |
| Light mode: mobile menu icon `rgb(0,0,0)` over the dark hero | `resizable-navbar.tsx:234-241`; `live-light-375-fold.png` |
| Light mode: footer "Our Services" heading slate-900 on slate-900 = **1.00:1**; list slate-600 on slate-900 = 2.36:1 | `Footer.tsx:64,67`; computed colours |
| Mobile menu toggle is a bare `<svg onClick>`: not a button, not focusable (`tabIndex -1`), no label, 24 × 24 px | `resizable-navbar.tsx:234-241`; puppeteer |
| Icon-only buttons use `title`, not `aria-label` (only 1 `aria-*label*` in `app/`, and it is `aria-labelledby`) | `NavBar.tsx:135,171`; `Footer.tsx:36,49` |
| Focus: 25 × `focus:outline-none` + `focus:ring` (rings on mouse click too), 0 × `focus-visible:`; no skip link | grep |
| Footer social icons 40 × 40 px; 33 of 54 visible links/buttons at 1280 px are < 44 px in one dimension | `Footer.tsx:35,48`; puppeteer count |
| No sticky call/WhatsApp bar on mobile; header shows logo + menu only. After the hero, the next call link is ~8,580 px down | puppeteer `tel:` positions at 375 px |
| CTA contrast: white on `from-blue-500 to-cyan-400` pill fails AA at the cyan end | `Hero.tsx:100`; §2.2 |
| Messenger button builds `https://m.me/#` because `social.facebook` is `"#"` | `lib/business-data.ts:108`; `NavBar.tsx:123-127` |
| Service-area map box renders empty | contact section in `live-*-1280-full.png` |

### 3.3 Anti-slop violations (brief Phase 3) on the current site

| Banned pattern | Present | Locations (file:line) |
|---|---|---|
| Emoji as icons | Yes | Live: `NavBar.tsx:33` ("📱 App"), `Services.tsx:61-62`, `AppPromo.tsx:65-68, 79, 187, 224, 233`. Legal pages: `privacy-policy/page.tsx` 58 lines (e.g. `:32`, `:331-366`), `terms-of-service/page.tsx` 47 (e.g. `:32`), `warranty/page.tsx` 50 (e.g. `:32`, `:71-105`, `:133-213`). Unused: `NewsletterSignup.tsx:115,227` |
| Gradient-text headlines | Yes (9) | `Hero.tsx:50`, `Features.tsx:93`, `FAQSection.tsx:26`, `ContactForm.tsx:483`, `GoogleReviews.tsx:53`, `AppPromo.tsx:51`, `not-found.tsx:25,28,31` |
| Blue-cyan gradient on dark | Yes (11 files) | CTAs `Hero.tsx:100`, `FAQSection.tsx:85`, `ContactForm.tsx:871`, `AppPromo.tsx:91`; icon tiles `Services.tsx:79`, `Features.tsx:111`; bullets `Services.tsx:100`; AppPromo bg `:9`, badge `:39`, glow `:138`; scrollbar `globals.css:51`; neon glows `globals.css:76-84` |
| Glassmorphism | Yes (16) | `Hero.tsx:122`, `NavBar.tsx:188,223,235`, `resizable-navbar.tsx:91,158`, `GoogleReviews.tsx:71`, `AppPromo.tsx:222,231`, `not-found.tsx:97,119,167`, `privacy-policy/page.tsx:40`, `terms-of-service/page.tsx:40`, `NewsletterSignup.tsx:66,181` |
| Identical icon-card grids | Yes | `Features.tsx:104-125` (4-up gradient-square icon + title + 2 lines, centred); `Hero.tsx:144-194` (3-up trust row); `GoogleReviews.tsx:112-182` (3-up badges); `Services.tsx:119-132` (10 identical city tiles); `warranty/page.tsx:71-105` |
| Centred hero + two pill buttons | Yes | `Hero.tsx:42` (`text-center`), `:100` + `:122` (`rounded-full` pair); confirmed in `docs/baseline/screenshots/home-1280x800-fold.png` |
| Fake / vague stats | Yes | `lib/business-data.ts:99-103` ("100+", "24/7", "100%") → `Features.tsx:130-155`; `GoogleReviews.tsx:47` "5-Star Rated", `:157-158` "100% Satisfaction / Guaranteed", `:179-180` "15-min average"; `Hero.tsx:75,159` "Licensed & Insured", `:172` "5-Star Service"; `AppPromo.tsx:173-179` mock "12 jobs / $2.4K / ↑20 %", `:235` "4.9 Rating" |
| Filler copy | Yes | `Features.tsx:98` "cutting-edge technology … exceptional key services" (exact banned phrase); `Services.tsx:52` "Hamilton's Premier Key Specialists"; `GoogleReviews.tsx:59` "Don't just take our word for it"; `ContactForm.tsx:487` "Ready to get started?"; `AppPromo.tsx:57-59` "AI-powered insights"; `Hero.tsx:54` "We've Got You.." (double stop) |
| Carousels hiding content | Yes | Elfsight reviews widget `GoogleReviews.tsx:97-105`: live DOM contains a slider (3 reviews visible, arrow + dots) plus a "Free Google Reviews Widget" badge |
| Decorative blobs / particles | Yes | `AppPromo.tsx:13,15,18` (pulsing `blur-3xl` orbs), `:22-27` grid pattern, `:138` glow; `GoogleReviews.tsx:67-68`; `not-found.tsx:15-16` |
| Unstyled defaults (template look) | Yes | Geist from create-next-app (`layout.tsx:2`) + boilerplate (`globals.css:16-39`); Aceternity navbar (`resizable-navbar.tsx`) with leftover template logo (`:245-258`); Inter declared (`globals.css:5`) |
| Stock handshake / padlock imagery | Partly | Stock key-handover hero (`herobannerKF.webp`); padlock icon for "Car Key Fobs" (`Services.tsx:33`) |
| Bento grid for its own sake | No | — |

## 4. Higgsfield (read-only)

| Item | Result |
|---|---|
| Account | Plan `plus`, **1,000 credits**; one private workspace (`42aa7271-…`), `is_selected: false` |
| Projects | `list_projects` → 0 items, `has_more: false`. No `keyfoby-revamp` project or folder exists |
| Unlimited gens | `unlim.available: false` |
| Per-model cost | **Not shown** by `models_explore` (list/get/recommend). `generate_video` and `generate_3d` schemas offer `get_cost: true` ("return the cost … without submitting"). Not called here; first Phase 3 step |
| Catalogue size | 57 video models, 47 image models, 17 3D models, plus `remove_background` tool |

Candidates per need (from `models_explore`; parameters as reported):

| Need | Model id | Why it fits | Limits / settings to watch |
|---|---|---|---|
| (a) Seamless 6–10 s loop (same start and end frame) | `kling3_0` | start + end image, 3–15 s | `supports_unlim`; resolution not listed |
| | `kling_o3_flf` | first + optional last frame, 3–15 s | — |
| | `seedance_2_0` | start/end + image refs, 4–15 s, 480p–4K, `mode std/fast` | `generate_audio` defaults **true**: set false |
| | `cinematic_studio_3_0` | start/end, 4–15 s, up to 4K, audio default false | "higher = more credits" |
| | `gemini_omni_flash_1_1` | start/end + refs, 3–10 s, up to 4K | — |
| | `minimax_h3` | keyframes + refs, 4–15 s, 2K | — |
| | `veo3_1_lite` | start + end, "fast, affordable" | durations not listed |
| (a) Scroll-scrub sequence (one controlled camera move, exported to frames) | `kling4_0` (ordered keyframes, 3–30 s, 1080p), `seedance_2_5` (4–30 s), `flux_3_video` (start/end, 5–20 s, up to 4K; audio default true) | multi-keyframe control for an orbit or "approach → unlock" path | then `fps_boost` for smoother scrub, `video_upscale`/`topaz_video`, `depth_anything_video` for parallax depth |
| (b) Background-removed product cut-outs | `remove_background` tool (image or video), `image_background_remover`, `gpt_image_2_5` (`background: transparent`), `seedream_v5_pro` (`remove_bg`), `bytedance_image_upscale` (`remove_bg`, 2K/4K), `recraft_v4_1` `model_type: utility` (clean product shots) | consistent-light generic fobs, or cut-outs of **real** fob photos | brief: no automaker logos in generated imagery |
| (b) Alpha video | `video_background_remover` | cut-out fob loop over page colour | — |
| (c) Abstract light / texture backgrounds | `recraft_v4_1` (`colors` up to 10 hex + `background_color`), `seedream_v4_5` (4K), `cinematic_studio_2_5` (4K), `nano_banana_2` / `nano_banana_pro` (4K), `flux_2` | `recraft` palette lock keeps output on-token | keep under the hero media budget |
| (d) 3D fob turntable | `tripo_h3_1_multiview_to_3d` (2–4 views, PBR), `meshy_v7_image_to_3d` (PBR, `ultra_mode`), `hunyuan3d_v3_image_to_3d`, `sam_3_3d`, `tripo_p2_image_to_3d` | 2–4 real fob photos (shot S11) → GLB | GLB in-page needs a viewer (JS cost vs 170 KB budget); safer to render a short turntable MP4 offline |
| Multi-angle inputs | `3d_jutsu_angles` (image) | new angles from one reference | — |

Not touched: `create_project`, `create_folder`, any upload, `create_website`, `deploy_website`, any `generate_*`.

## 5. Real-photo shot list (client to supply)

Rules: real people, places and jobs only (brief 2.4, Phase 3). Shoot on a recent phone at full resolution (HEIF/ProRAW), video 4K 30 or 60 fps on a tripod. Frame landscape shots with room for a 4:5 crop. Hide plates and VINs; faces only with written consent. Send originals (not WhatsApp-compressed). EXIF/GPS is stripped before commit.

| # | Shot | Framing | Orientation | Use on site |
|---|---|---|---|---|
| S1 | Technician beside the open van side door, holding the programmer | 3/4 body, eye level, ~35–50 mm equiv., van interior visible | 4:5 + 3:2 | `/about` hero, technician bio, GBP |
| S2 | Technician head-and-shoulders, plain or van-interior background | Tight, soft side light | 1:1 | Bio avatar, `/reviews` owner replies, schema `image` |
| S3 | Van exterior on a recognisable Hamilton street (Mountain brow or similar), dusk or overcast | 3/4 front, plate hidden | 16:9 + 9:16 | Home "we come to you" band, `/locations/*`, OG base |
| S4 | Van workbench: key blanks wall, cutting machine, programmers | Wide, level, all lights on | 3:2 | `/services/` index, `/about` |
| S5 | Hands on the key-cutting machine cutting a blade | Macro, shavings visible; plus 6–10 s locked-off clip | 3:2 + video | `/services/car-key-replacement`; real hero-loop candidate |
| S6 | Hands plugging the programmer into the OBD port under the dash, screen lit | Close, low angle | 4:5 | `/services/key-fob-programming`, `/transponder-key-programming`, `/all-keys-lost` |
| S7 | Programmer screen readout ("key added / keys learned"), glare-free | Straight-on, screen fills frame; VIN blurred | 4:3 or 1:1 | "We show you the system readout" process step; proof block |
| S8 | New fob placed in the customer's hand | Hands only, shallow focus | 4:5 | Reviews band, CTA band |
| S9 | Before/after: worn or broken shell vs new shell | Same angle, same light, tripod, neutral surface | 1:1 pair | `/services/key-fob-repair` (renamed, `keyword-map.md` §4) |
| S10 | Flat-lay of real key types (flip, smart/prox, blade + transponder, remote-head) | Top-down, matte dark surface, soft even light | 16:9 + 1:1 | `/car-keys/` index; colour/lighting reference for Higgsfield cut-outs |
| S11 | Per make, fobs actually supported, in the order job data gives (no make presumed; reviews name Honda/Civic most, 6 of 222, `gbp-maps.md` §1) | Seamless grey; front, back, 3/4 (3 frames each) | 1:1 | `/car-keys/<make>`; 2–4 views feed `generate_3d` multiview for the turntable |
| S12 | Lockout tool in use through the door seal (no damage) | Medium, car and tool both readable | 3:2 | `/services/emergency-car-lockout` |
| S13 | Broken-key extractor in a door or ignition cylinder | Macro | 4:5 | FAQ line on `/services/spare-car-key` if offered (no page, `keyword-map.md` §4) |
| S14 | Real driveway job with van and car (permission from the owner) | Wide establishing; house not identifiable | 16:9 | One per confirmed town on `/locations/*` |
| S15 | Fob press → hazard lights flash (the real "unlock" moment) | Locked-off, dusk, 6–8 s clip + still | 16:9 + 9:16 | Signature hero alternative to AI; OG |
| S16 | After-hours job (headlamp, van lights) | Medium | 16:9 | `/services/emergency-car-lockout`, only if 24/7 is confirmed (Truth Table 1) |
| S17 | Licence and insurance certificate, if any | Flat scan, numbers legible | as is | Licence/insurance block, only what Truth Table 2 approves |

## 6. Inputs for Phase 3 and the Truth Table

- Keep: the KF key-blade mark (vector exists). Rebuild: lockup, mono, maskable icon, stroke-free SVG.
- Accent: one logo hue, contrast-checked (e.g. `#0ea5e9` on dark ink 6.76:1; `#0369a1`/`#2563eb` for text on light). Do not extend the 3-stop gradient beyond the mark.
- Fix in any direction: single forced theme (no OS-dependent zebra), `focus-visible` rings, button-based menu toggle, sticky call + WhatsApp bar, 48 px targets, `MotionConfig reducedMotion="user"` or CSS-only motion.
- Budget: motion library ≈ 58.6 KiB gz of the 170 KB target; prefer CSS/WAAPI or a lazy-loaded scrub module.
- Replace before launch: OG image and JSON-LD `logo` (AI fob), stock hero, Elfsight carousel, `m.me/#` Messenger link, broken manifest icons, dead `carkey.webp`.
