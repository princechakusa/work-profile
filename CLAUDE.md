# Project: Work Profile (Prince Chakusa's portfolio + CV)

Read this first. It is the handoff from the previous agent session.

## Goal
The best-possible interactive portfolio for Prince Chakusa, an operations leader (Dubai short-term rentals) who also builds software. It must impress on sight: a real 3D, animated, non-generic site. Later: a CV page with PDF export.

## Hard rules from the user (do not break)
- **Do NOT copy anything from the old portfolio** (design, fonts, palette, wording layout). They want original ideas from us. They called the first attempt "generic / AI-looking": no Playfair/Inter, no dots, no template look.
- **Projects are PaMarket and FixHub only** (Prince added FixHub back on 2026-09-30). GuestCare and GGS Platform are removed on purpose. Never add them back.
- **Film direction from Prince:** the opening film is a pop-up in the middle of the site that can be closed, never full screen. It has a voice. The check-in conversation with the guest plays on its own first; the explanation and numbers come after, never mixed. Buildings must look like real buildings, not abstract blocks. Scene changes must not flicker (crossfade, no fade to black). The character must be recognisably Prince (see `web/public/prince.jpg`: charcoal suit, white shirt, navy tie, high-top hair, goatee). Keep the pace brisk and the cursor snappy.
- **Voice:** he asked for Black American English; he rejected the South African and British TTS voices. TTS catalogues do not label voices by ethnicity, and he chose **`en-US-SteffanNeural`** (current) and he can audition the seven US male voices at http://localhost:3000/voices.html. Best outcome is his own recording (see `web/scripts/voice.py`).
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

Status: works in Chrome at 1036px and 1600px wide, typechecks clean, no console errors, no horizontal overflow. Not yet done: mobile (the pop-up film is tiny in portrait), other browsers, CV page with PDF export, MP4 export of the films, deployment. Nobody has listened to the generated voice yet for pronunciation (DTCM, SOPs, SLAs, AML-CFT, Homevy, Chakusa, PaMarket).

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
- **Current role (2026-09-30): Guest Relations Executive Supervisor at The Authors Holiday Homes** (he typed "theauthors holiday homes"; spelling unconfirmed). His only specifics: he "added value to the company when it comes to the system and the management". He told Claude to fill in what a supervisor does, so the film's responsibilities (supervising the team, escalations, coaching) are generic and carry no numbers. Still needed: start date, team size, real results.
- Dates (Prince, 2026-09-30): Luxury Homevy Jan 2026 to Mar 2026; The Authors Holiday Homes Apr 2026 to now (name confirmed). He left Homevy after the company lost bookings in February for worldwide and internal reasons; the site words it as "The company scaled back after a market-wide drop in bookings, and I moved on to my current role." The film does not mention it.
- Hero line is now "From the front desk to leading the team, I have run 350+ holiday homes in Dubai, and I build the software that keeps them running."
- Stonetree title is **Customer Care Agent** (not Customer Agent), promoted to Team Leader.
- The "how I use it" line for each qualification in the Education film and section is Claude's draft.
- Canva: no Canva connector is available in this environment (only Claude Docs and Descript). Prince wants the CV made in Canva next; he has to add the Canva connector in claude.ai Settings > Connectors first.
- The "what I learned" lines in the film are drafts written by Claude; Prince has not confirmed them.
- The Anna Wilcox LinkedIn recommendation (from `assets/recommendation.jpg`) is quoted in the Why hire me section; confirm he is happy for it to be shown.
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
- Shared: `SiteNav` (mobile menu under 900px), `SiteFooter`, `Backdrop` (animated SVG dusk skyline behind inner pages), `Page.module.css`. All copy lives in `src/lib/content.ts`; lines marked DRAFT there were written for Prince and need his confirmation.
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
