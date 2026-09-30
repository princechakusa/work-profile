# Project: Work Profile (Prince Chakusa's portfolio + CV)

Read this first. It is the handoff from the previous agent session.

## Goal
The best-possible interactive portfolio for Prince Chakusa, an operations leader (Dubai short-term rentals) who also builds software. It must impress on sight: a real 3D, animated, non-generic site. Later: a CV page with PDF export.

## Hard rules from the user (do not break)
- **Do NOT copy anything from the old portfolio** (design, fonts, palette, wording layout). They want original ideas from us. They called the first attempt "generic / AI-looking": no Playfair/Inter, no dots, no template look.
- **Only PaMarket is a project.** GuestCare, FixHub and GGS Platform are removed on purpose. Never add them back.
- Do not invent facts or metrics. Ask for real numbers. Mark in-progress qualifications as in progress.
- Prince asked to see work live: a visible Chrome window driven by Playwright (`channel="chrome"`, headed) on http://localhost:3000.

## Stack (current, in `web/`)
Next.js (App Router) + TypeScript, React Three Fiber / Three.js, drei, postprocessing (Bloom), GSAP + ScrollTrigger, Lenis smooth scroll. CSS Modules. No Tailwind.

Run: `cd web && npm run dev` then open http://localhost:3000.
Typecheck: `npx tsc --noEmit` (eslint is slow; run it separately).

## Concept
Prince's 350+ managed units are rendered as 350 instanced towers (25 x 14 grid) in a 3D Dubai-style skyline. The camera flies through the city as you scroll. Palette: ink #07080b, sand #ece7db, signal orange #ff5a1f, steel #7d8794. Fonts (next/font): Big Shoulders (display), Familjen Grotesk (body), Martian Mono (labels).

## What exists
- `web/src/components/CityScene.tsx` - the 3D scene: tiered towers + Burj-style needle spires, procedural lit-window shader (onBeforeCompile), orange rooftop beacons with bloom, intro rise wave, mouse parallax + scroll-driven camera (`Rig`), hover lock-on, click shockwave (`PulseListener`, `lib/pulseState.ts`).
- `web/src/components/Cursor.tsx` (+ module css) - surveyor reticle cursor: SCAN with live coords, `UNIT nnn / 350` lock-on over towers, `OPEN` over links. Towers talk to it via a `cursor:unit` window event.
- `web/src/components/Home.tsx` - home page overlay: nav, hero name, lede, proof numbers (350+, 5 yrs, -40%), contact section. `lib/scrollState.ts` shares scroll progress with the camera.
- `web/src/components/SmoothScroll.tsx` - Lenis wired to GSAP ticker.
- `archive/` - old static HTML and the Python/Reflex attempt. Reference only; do not reuse the design.

Status: home page prototype works in Chrome, typechecks clean, no console errors. Not yet done: loader/intro sequence, mobile testing, other browsers, real content pages, deployment.

## Planned next (agreed direction, not yet built)
1. **Opening intro (~5s)** before the name: black screen, "Some people run properties." / "Some people build software." / "I do both." then the city rises and the name lands. First page should introduce how great he is, not just state facts.
2. **Scroll-driven experience story** (chronological, the city grows as his career does):
   - Guest Relations Officer, Daniels Holiday Homes (Jan 2023 - Oct 2024): one lobby, windows light per check-in; +25% review scores, -40% front desk workload, +20% satisfaction (CSAT/NPS), -20% onboarding time.
   - Team Leader - Property Operations, Stonetree (Nov 2024 - Dec 2025): 400+ units, team of 12 (concierge, maintenance, housekeeping) shown as orbiting markers; DTCM compliance, SOPs, vendor SLAs, reporting.
   - Guest Experience Lead, Luxury Homevy (Jan 2026 - present): 40 properties, team of 5, Hostaway/WhatsApp, SLA/SOP tracking, 200+ reviews analysed shown as sentiment colouring.
   - Education as "foundations": Associate of Science in Computer Science (completed 2026); Bachelor of Business Administration (IN PROGRESS); AML-CFT certificate (IN PROGRESS). Show unfinished ones as towers under construction with cranes and progress.
3. CV page with PDF export (Playwright), Projects (PaMarket only), skills, contact.

## Open questions waiting on Prince
- Stonetree: 400+ or 350+ units (roadmap file says use one consistent figure; old copy said both).
- Real results for the team of 12 and for Homevy (SLA/response/review numbers).
- BBA university + expected finish; AML-CFT provider + % progress.
- Keep CompTIA A+ and Business Management Diploma, or drop?
- Python skill level, if a skills section is shown.

## Real facts and links
- Email chakusaprince@gmail.com, LinkedIn https://linkedin.com/in/princechakusa, GitHub https://github.com/princechakusa, based in Dubai, from Zimbabwe, open to UAE / GCC / Remote.
- PaMarket: website https://pamarketzw.com, App Store https://apps.apple.com/app/id6794616959, Google Play https://play.google.com/store/apps/details?id=com.pamarket.app, repo https://github.com/princechakusa/PaMarket. (Ownership inferred from the description; not confirmed on the site's About page. Ask Prince if unsure.)
- Repo: https://github.com/princechakusa/work-profile (private). Old site repo: princechakusa.github.io (untouched).

## Known caveats
- `reflex init` once wiped `assets/`; images restored from git. The root `assets/` folder holds old screenshots/photo, currently unused by the Next app (`web/public` is the place for new assets).
- Some old screenshots (GuestCare) were empty "Loading" states; irrelevant now.
- Screenshots: use Chrome with `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist` when headless so WebGL renders.
