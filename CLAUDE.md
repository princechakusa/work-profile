# Project: Work Profile (Prince Chakusa's portfolio + CV)

Read this first. It is the handoff from the previous agent session.

## Goal
The best-possible interactive portfolio for Prince Chakusa, an operations leader (Dubai short-term rentals) who also builds software. It must impress on sight: a real 3D, animated, non-generic site. Later: a CV page with PDF export.

## Hard rules from the user (do not break)
- **Do NOT copy anything from the old portfolio** (design, fonts, palette, wording layout). They want original ideas from us. They called the first attempt "generic / AI-looking": no Playfair/Inter, no dots, no template look.
- **Projects are PaMarket and FixHub only** (Prince added FixHub back on 2026-09-30). GuestCare and GGS Platform are removed on purpose. Never add them back.
- **Film direction from Prince:** the opening film is a pop-up in the middle of the site that can be closed, never full screen. It has a voice. The check-in conversation with the guest plays on its own first; the explanation and numbers come after, never mixed. Buildings must look like real buildings, not abstract blocks. Scene changes must not flicker (crossfade, no fade to black). The character must be recognisably Prince (see `web/public/prince.jpg`: charcoal suit, white shirt, navy tie, high-top hair, goatee). Keep the pace brisk and the cursor snappy.
- **Voice:** he asked for Black American English; he rejected the South African and British TTS voices. TTS catalogues do not label voices by ethnicity, and he chose **`en-US-SteffanNeural`** (current) and he can audition the seven US male voices with `web/scripts/voices.html` (moved out of `public/` so it is not published; copy it back to `public/` temporarily to use it). Best outcome is his own recording (see `web/scripts/voice.py`).
- **What the voice says:** never the words he speaks to a guest. Those stay as silent speech bubbles. For every role the voice covers his responsibility, what he achieved, and what he learned.
- **English:** full, correct sentences everywhere (film captions and site copy). He called the clipped fragments "broken English".
- **The city must look real, like a dusk skyline photo** (he sent a Hong Kong harbour photo): `CityLife.tsx` adds the dusk sky and clouds, harbour and far shore with hills, streetlights, moving car lights, bird flocks, an airliner and a helicopter; towers have fine lit windows, per-building light colours and landmark light strips. It must be **360 degrees**: drag anywhere on the main page to turn the city (it also turns slowly on its own), and the film circles it.
- **The Stonetree city must be real 3D and interactive**, not 2D drawings: `web/src/film/City3D.tsx` reuses the site's `Skyline` (350 towers) inside the film, driven by the film frame, with mouse look-around and hover to pick out a unit.
- He approves one page at a time: get the opening film right before moving to the next page.
- Do not invent facts or metrics. Ask for real numbers. Mark in-progress qualifications as in progress.
- Prince asked to see work live: a visible Chrome window driven by Playwright (`channel="chrome"`, headed) on http://localhost:3000.

## Stack (current, in `web/`)
Next.js (App Router) + TypeScript, React Three Fiber / Three.js, drei, postprocessing (Bloom), GSAP + ScrollTrigger, Lenis smooth scroll, Remotion + @remotion/player (the films). CSS Modules. No Tailwind.

Run: `cd web && npm run dev` then open http://localhost:3000.
Typecheck: `npx tsc --noEmit` (eslint is slow; run it separately).

## Concept
Prince's 350+ managed units are rendered as 350 instanced towers (25 x 14 grid) in a 3D Dubai-style skyline. The camera flies through the city as you scroll. Palette: ink #07080b, sand #ece7db, signal orange #ff5a1f, steel #7d8794. Fonts (next/font): Big Shoulders (display), Familjen Grotesk (body), Martian Mono (labels).

## What exists
- `web/src/components/CityScene.tsx` - the 3D scene: tiered towers + Burj-style needle spires, procedural lit-window shader (onBeforeCompile), orange rooftop beacons with bloom, intro rise wave, mouse parallax + scroll-driven camera (`Rig`), hover lock-on, click shockwave (`PulseListener`, `lib/pulseState.ts`).
- `web/src/components/Cursor.tsx` (+ module css) - surveyor reticle cursor: SCAN with live coords, `UNIT nnn / 350` lock-on over towers, `OPEN` over links. Towers talk to it via a `cursor:unit` window event.
- `web/src/components/Home.tsx` - home page overlay: nav, hero name, lede, proof numbers (350+, 5 yrs, -40%), contact section. `lib/scrollState.ts` shares scroll progress with the camera.
- `web/src/components/SmoothScroll.tsx` - Lenis wired to GSAP ticker.
- `web/src/film/` - the narrated films (the opening film runs about 2:20), built as Remotion compositions and played in-page by `@remotion/player`:
  - `kit.tsx` - shared pieces: `Person` (rigged SVG figure; `PRINCE` preset), `Building`, `Crane`, `Stage`, `Header`, `Bubble`, `Stat`, `Chips`, `Scenes` (crossfading scene list), `timeline()` + `Narration` (audio + captions).
  - `IntroFilm.tsx` (hello, Daniels, Stonetree, Homevy, The Authors, why hire me, outro), `ProjectsFilm.tsx` (PaMarket, FixHub), `EducationFilm.tsx` (3 finished buildings, 2 under construction with cranes).
  - `voice.json` - generated line lengths and caption text. **Scene timing is derived from it**: each scene calls `timeline([...ids])` and hangs its action off the cue frames. Never hardcode frame numbers against the voice.
- `web/scripts/voice.py` - generates `public/voice/*.mp3` (edge-tts) and `voice.json`. Re-run after changing any line. `--measure` refreshes lengths from existing MP3s, which is how Prince's own recordings would drop in.
- `web/src/components/Film.tsx` - Player wrapper (play button first, because browsers block sound before a click; pauses off screen; preloads the voice clips). `Intro.tsx` - the pop-up: photo greeting, Play / No thanks / Close / Esc, end card with "Open my work" and Replay.
- Home page sections now: hero, proof, Work (3 roles + "Watch the film again"), Projects (film + PaMarket and FixHub cards), Education (film + 5 entries), Why hire me (3 reasons + email CTA), contact.
- `archive/` - old static HTML and the Python/Reflex attempt. Reference only; do not reuse the design.

Status: works in Chrome at 1036px and 1600px wide, typechecks clean, no console errors, no horizontal overflow. Not yet done: mobile (the pop-up film is tiny in portrait), other browsers, CV page with PDF export, deployment to the custom domain. Nobody has listened to the generated voice yet for pronunciation (DTCM, SOPs, SLAs, AML-CFT, Homevy, Chakusa, PaMarket).

Dev notes: a dev server is often already running on port 3000 (Next refuses a second one in the same folder). Git fails for the `Prince 1` Windows account with "dubious ownership" until `git config --global --add safe.directory 'C:/Projects/Work Profile'` is run. For checks, run Playwright headless (swiftshader flags below); Prince clicks around in headed test windows.

## Role facts (used by the films and the Work section)
The earlier "scroll-driven story" plan was replaced by the narrated films above.
   - Guest Relations Officer, Daniels Holiday Homes (Jan 2023 - Oct 2024): one lobby, windows light per check-in; +25% review scores, -40% front desk workload, +20% satisfaction (CSAT/NPS), -20% onboarding time.
   - Team Leader - Property Operations, Stonetree (Nov 2024 - Dec 2025): 350+ units, team of 12 (concierge, maintenance, housekeeping) shown as orbiting markers; DTCM compliance, SOPs, vendor SLAs, reporting.
   - Guest Experience Lead, Luxury Homevy (Jan 2026 - present): 40 properties, team of 5, Hostaway/WhatsApp, SLA/SOP tracking, 200+ reviews analysed shown as sentiment colouring.
   - Education as "foundations": Associate of Science in Computer Science (completed 2026); Bachelor of Business Administration (IN PROGRESS); AML-CFT certificate (IN PROGRESS); Business Management Diploma and CompTIA A+ (both held). Show unfinished ones as towers under construction with cranes and progress.
Next: CV page with PDF export (Playwright), skills.

## Open questions waiting on Prince
- Stonetree is **350+ units** (Prince, 2026-09-30). Settled. He joined Stonetree as a **Customer Agent** and was promoted to Team Leader of Property Operations; the promotion date is unknown.
- **Current role: Guest Relations Supervisor at The Authors Holiday Homes, Abu Dhabi (since May 2026).** Prince, 2026-10-01: never write "Guest Relations Executive Supervisor". The title lives in `web/src/lib/profile.ts` (`PROFILE.currentRole`); everything else reads it from there.
- Dates (Prince, 2026-09-30): Luxury Homevy Jan 2026 to May 2026; The Authors Holiday Homes May 2026 to now (corrected 2026-10-01 to match LinkedIn) (name confirmed). He left Homevy after the company lost bookings in February for worldwide and internal reasons; the site words it as "The company scaled back after a market-wide drop in bookings, and I moved on to my current role." The film does not mention it.
- Hero line is now "From the front desk to leading the team, I have run 350+ holiday homes in Dubai, and I build the software that keeps them running."
- Stonetree title is **Customer Care Agent** (not Customer Agent), promoted to Team Leader.
- Canva: no Canva connector is available in this environment (only Claude Docs and Descript). Prince wants the CV made in Canva next; he has to add the Canva connector in claude.ai Settings > Connectors first.
- Confirmed by Prince (2026-10-01): all former DRAFT lines (what I learned, how I use each qualification, Home about lines) and showing the Anna Wilcox recommendation.
- The hero proof says "5 yrs" in the UAE short-term rental market, but the roles listed only go back to Jan 2023. Ask what the earlier experience was, or change the number.
- FixHub: the old site claimed it was deployed on 350+ units with a 40% faster maintenance response. Unconfirmed, so not used. Ask.
- Years for the Business Management Diploma and CompTIA A+ (shown as "Completed", no year).
- Real results for the team of 12 and for Homevy (SLA/response/review numbers).
- BBA university + expected finish; AML-CFT provider + % progress.
- Python skill level, if a skills section is shown.

## Site structure (2026-09-30, Prince's direction: each page presents only itself)
- `/` Home: 3D city hero, About me, What drives me, Strengths, links to the other pages. The narrated opening film pops up once per visit (sessionStorage) and can be replayed with "Watch my story". No work, project or education detail on Home.
- `/work`: career stats, the work story film, and every role with **What I did / Value I added / What I learned**.
- `/education`: the foundations film (3D towers, `film/Foundations3D.tsx`) and each qualification with **Where I use it** (roles) and **How it helped me level up**.
- `/projects`: PaMarket first (film, real screenshots in `public/pamarket/`, why / what / who it helps, links). FixHub is a small card below and is **not** in the film.
- `/why-me`: four reasons, the Anna Wilcox recommendation with a View on LinkedIn link, skills and tools, email CTA.
- `/contact`: email, LinkedIn, GitHub, location.
- Shared: `SiteNav` (mobile menu under 900px), `SiteFooter`, `Backdrop` (animated SVG dusk skyline behind inner pages), `Page.module.css`. All copy lives in `src/lib/content.ts` (all confirmed by Prince).
- PaMarket website screenshots were captured from https://pamarketzw.com with Playwright (cookie banner dismissed with "Reject Optional"). Features described come from the live site.
- Checks: headless swiftshader Chrome stalls on the Projects page; use headed Chrome (`channel="chrome"`, `headless=False`), which is also what Prince wants.

## Real facts and links
- Email chakusaprince@gmail.com, LinkedIn https://linkedin.com/in/princechakusa (recommendations: /details/recommendations/), GitHub https://github.com/princechakusa, **based in Abu Dhabi** (moved from Dubai, 2026-09-30), from Zimbabwe, open to UAE / GCC / Remote.
- PaMarket: website https://pamarketzw.com, App Store https://apps.apple.com/app/id6794616959, Google Play https://play.google.com/store/apps/details?id=com.pamarket.app, repo https://github.com/princechakusa/PaMarket. (Ownership inferred from the description; not confirmed on the site's About page. Ask Prince if unsure.)
- Repo: https://github.com/princechakusa/work-profile (private). Old site repo: princechakusa.github.io (untouched).

## Known caveats
- `reflex init` once wiped `assets/`; images restored from git. The root `assets/` folder holds old screenshots/photo, currently unused by the Next app (`web/public` is the place for new assets).
- Some old screenshots (GuestCare) were empty "Loading" states; irrelevant now.
- Screenshots: use Chrome with `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist` when headless so WebGL renders.

## CV (2026-09-30)
- Source of truth: `web/cv/cv.html` (Prince: at most 2 pages; currently 1 page, Open Sans, no em or en dashes; own structure with headline, summary, results strip, outcome-led roles, sidebar). Do not reuse his old resume's sections or wording.
- **On deployment:** add the live portfolio URL to the CV contact line (Prince asked for it), re-render the PDF, and commit. Render it to `web/public/Prince-Chakusa-CV.pdf` with Playwright (`page.pdf(format="A4", print_background=True, prefer_css_page_size=True)`); check both pages have zero overflow first.
- `web/public/Prince-Chakusa-CV.pdf` is what the site's "Download PDF" button (`CvActions.tsx`) serves. `web/scripts/build_cv_pdf.py` writes an older text-only CV to the same path, so do not run it unless it is updated to render `cv.html`.
- Canva copy: design "PrinceChakusa_Resume_2026_v4.pdf" in Prince's Canva (imported from the PDF). Canva's PDF import swaps Open Sans for a fallback font and drops a few spaces (company lines, phone number); those lines need fixing by hand in Canva. Earlier import attempts (v1 to v3, Prince-Chakusa-CV.pdf, Prince-Chakusa-Resume.pdf, and the half-built "PRINCE CHAKUSA" design) can be deleted once Prince confirms.
- Canva access is through a normal Chrome started with `--remote-debugging-port=9333 --user-data-dir=%TEMP%\canva-chrome` (Google blocks sign-in in Playwright-launched Chrome); connect with `connect_over_cdp`.

## Launch setup (2026-09-30)
- Set `NEXT_PUBLIC_SITE_URL` (for example `https://princechakusa.com`) at deploy time; it feeds link previews (`app/opengraph-image.tsx`), `sitemap.xml` and `robots.txt` (`lib/site.ts`, defaults to https://princechakusa.com). Prince bought princechakusa.com on 2026-10-01 (Cloudflare Registrar; DNS in Cloudflare).
- Set `NEXT_PUBLIC_CF_BEACON_TOKEN` to turn on Cloudflare Web Analytics (free, cookie-free); unset means no analytics script. If hosted on Cloudflare Pages, analytics can also be switched on in the dashboard without the token.
- WhatsApp: `CONTACT.whatsapp` (+971 58 977 2645, from Prince's resume), floating button on every page (`WhatsAppButton.tsx`), plus Contact page and footer links.
- Role bullets on /work are written in professional resume style (action verbs, no "I"), per Prince. Labels are Responsibilities / Achievements / Key learning.
- The film player loads lazily (`next/dynamic` in `Intro.tsx`), so the greeting shows in about 1 s instead of 5 to 9 s.

## Films as MP4 and GitHub Pages (2026-10-01)
- Prince: never screen-record the films. Render them from code: `cd web && npm run films` (Remotion CLI, `remotion/index.tsx`, `remotion.config.ts`) writes `docs/media/prince-chakusa-film.mp4`, `projects-film.mp4` and `education-film.mp4`. The entry loads the site fonts with `@remotion/google-fonts`; `remotion.config.ts` maps `@` to `src` and sets `NEXT_PUBLIC_BASE_PATH=/public` so `asset()` paths resolve in the render. The "hover a building" hint is hidden while rendering.
- Deploy: `.github/workflows/deploy.yml` builds the static export with `NEXT_PUBLIC_SITE_URL=https://princechakusa.com` (no base path) and publishes to GitHub Pages with the custom domain (`web/public/CNAME`). Keep every public file path going through `asset()` from `lib/site.ts` so a base path still works if ever needed. Pages source must be "GitHub Actions" (the old branch build ran Jekyll and failed on `archive/`).


## SEO, AEO and identity (2026-10-01)
- **One identity source:** `web/src/lib/profile.ts` (name, current role, employer, location, summary, short description, professional areas, contact, availability). `lib/content.ts` builds `CONTACT` and the current role from it. Change the title or summary there, then regenerate the narration line `a1` and re-render the PDF CV (`web/cv/cv.html` is a separate hand-written file and must be edited by hand to match).
- **Metadata:** every route calls `pageMeta()` from `lib/seo.ts` for a unique title, description, absolute canonical URL, Open Graph and Twitter cards. Canonical URLs are built from `SITE_URL` directly (not via metadataBase) because the site lives under `/work-profile`. Home canonical keeps the trailing slash (GitHub Pages 301s the bare sub-path); other routes have none (GitHub Pages 404s `/work/`).
- **Structured data:** `Person` + `WebSite` on every page (layout), `ProfilePage` on the home page (`app/page.tsx`), `SoftwareApplication` for PaMarket on /projects. All reference the Person by `@id` `${SITE_URL}/#person`. Only verified facts: alumniOf and credentials come from the resume (University of the People, Lyceum College, CompTIA A+ Core 1). AML-CFT is never a credential or a role; it is "in progress" professional development.
- **Link preview image:** `app/og.png/route.tsx` builds `/og.png` (the old extension-less `opengraph-image` was served by GitHub Pages as `application/octet-stream`).
- **Home page answers:** the "Prince Chakusa in brief" section (summary + `ANSWERS` in content.ts) is the AEO block. Keep answers factual and in sync with the role data.
- **Live domain:** https://princechakusa.com (Cloudflare DNS: apex A/AAAA records to GitHub Pages, `www` CNAME to princechakusa.github.io, DNS only / grey cloud). The old https://princechakusa.github.io/work-profile redirects there. Google Search Console property https://princechakusa.com/ is verified with the HTML file `web/public/google2a4e6e8e32c2d30b.html` (do not delete it) and `sitemap.xml` is submitted (7 pages). HTTPS is enforced on GitHub Pages (Let's Encrypt). Cloudflare Web Analytics site princechakusa.com uses the JS snippet (DNS-only, so no automatic setup); its token is in `deploy.yml`. The repo's website field and description point at princechakusa.com.
- Cloudflare dashboard automation: the dashboard's API blocks scripted fetches (WAF 403), and Playwright `connect_over_cdp` hangs on that Chrome; drive the UI with raw CDP (Input.dispatchMouseEvent / insertText) instead.
- **Stale public copy outside this repo:** the old portfolio at https://princechakusa.github.io/ (repo princechakusa.github.io) still shows "Operations Leader and PropTech Builder", Dubai and GuestCare. It competes with this site for "Prince Chakusa" searches. Not changed without Prince's go-ahead.
- Checks: `validate.py`-style audit of `web/out` (titles, canonicals, JSON-LD, headings, sitemap). Build from PowerShell: Git Bash rewrites `NEXT_PUBLIC_BASE_PATH=/work-profile` into a Windows path.
- **Email (2026-10-01):** public address is hello@princechakusa.com (Cloudflare Email Routing, forwards to chakusaprince@gmail.com; MX/SPF/DKIM records added by Cloudflare). Receive-only: replies go out from Gmail. Set in `lib/profile.ts`, the CV and both READMEs.
- **GitHub profile README:** draft in `github-profile/README.md`. Creating the public repo `princechakusa/princechakusa` is blocked for Claude by the auto-mode classifier; Prince creates it himself (github.com/new, name `princechakusa`, Public, paste the README).
- **Dates confirmed by Prince (2026-10-01, LinkedIn is right):** The Authors (Guest Relations Supervisor) May 2026 to now; Luxury Homevy Jan 2026 to May 2026; Stonetree Customer Care Agent Nov 2024, promoted to Team Leader May 2025, left Dec 2025. CompTIA A+ is certified (Prince confirmed). LinkedIn direction: blend operations + software with the move into AML and financial crime compliance.
- **LinkedIn (2026-10-02, done by Claude at Prince's request):** repositioned as hospitality/property operations leader developing into AML/CFT and KYC (never claims AML experience). Headline, About, contact website (princechakusa.com, address Abu Dhabi), Featured link to princechakusa.com, experience rewrites (The Authors, Homevy, Stonetree Team Leader, Daniels with +25%/-40%/-20%), Licenses (CompTIA A+ Core 1 (220-1201), issuer CompTIA), Courses (AML/CFT, in progress), skills (AML, KYC Verification, Due Diligence, Regulatory Compliance linked to the AML/CFT course), top skills, education cleanup, Open to Work titles (Guest Relations Manager, Operations Manager, Guest Experience Manager, KYC Analyst, Anti-Money Laundering Analyst; Dubai and Abu Dhabi). LinkedIn's Stonetree first title is "Customer Care Specialist" (site says Customer Care Agent) and it credits the CSAT/NPS +20% to that role (site credits Daniels): unresolved, ask Prince. The Stonetree media item is a Udemy "CompTIA A+ Core 1 Full Course & Practice Exam" certificate; Prince says he is certified, confirm it is CompTIA's own exam. Daniels ends Nov 2024 (LinkedIn).
- LinkedIn automation: Playwright connect_over_cdp hangs on the 9333 Chrome; drive it with raw CDP (`$TEMP/cdo.mjs` pattern: Runtime.evaluate + Input.dispatchMouseEvent/insertText; contenteditable text typed line by line with Enter). Profile edit URLs: /in/princechakusa/edit/intro/, /edit/forms/summary/new/, /edit/forms/contact-info/new/, /edit/forms/position/<id>/, /details/education/edit/forms/<id>/, /edit/forms/certification/new/, /edit/forms/course/new/, /details/skills/edit/forms/new/, /opportunities/job-opportunities/edit/.


## Home page for recruiters (2026-10-02)
- Order: hero (name, then the role line "Guest Relations Supervisor · Hospitality & Property Operations · UAE" and current employer), Career (all four roles with dates and the strongest result, links to /work and /cv), About (with What drives me folded in), Strengths, Quick answers (the AEO Q&A, folded into expandable answers; still in the HTML), Explore, closing CTA.
- The opening film no longer opens by itself. A small "Watch my 2-minute story" card appears bottom-right after 4.5 s, once per visit; clicking it opens the film already playing (`Intro autoplay`). "Watch my story" in the hero does the same.
- Pending from Prince: how the +25% review scores and 15% cost reduction were measured (period, method), and FixHub screenshots or a demo.
