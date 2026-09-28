# Impact Windows & Doors — Southwest Florida

Bilingual (EN/ES) Next.js 16 site built on the "Midnight gallery" style reference.

## Where to edit

| What | File |
|---|---|
| Business facts (name, phone, license, address, hours, cities, socials, form endpoint) | `src/content/site.ts` |
| English copy | `src/content/dictionaries/en.ts` |
| Spanish copy (typed against English — a missing key fails the build) | `src/content/dictionaries/es.ts` |
| Design tokens (colors, type, radii, spacing) | `src/app/globals.css` |
| Routes / URL slugs | `src/lib/i18n.ts` |

Every placeholder is marked `TODO` — search for it before launch.

## Brand assets

Original logo files live in `brand-source/`. Regenerate every web size
(nav mark + wordmark, stacked lockups, favicon, apple icon, Open Graph image) with:

```bash
node scripts/brand-assets.mjs
```

## Photography & hero video

Generated with Higgsfield (GPT Image 2.5 stills, Seedance 2.5 video) following
`docs/creative-brief.md`. Originals live in `creative-source/` (git-ignored, ~70 MB;
also stored in the Higgsfield project "Elite W&D Installers — Website").

```bash
node scripts/optimize-creatives.mjs   # originals -> public/images/*.jpg
node scripts/check-hero-video.mjs     # verifies the hero loop plays and hands off
```

## Interactive elements

| Element | Where | Component |
|---|---|---|
| Scroll reveal | All pages (`data-reveal`) | `src/components/interactive/RevealObserver.tsx` |
| Glass simulator | Impact Windows → Glass | `src/components/interactive/GlassSimulator.tsx` |
| Project planner → pre-filled estimate form | Home | `src/components/interactive/ProjectPlanner.tsx` |
| "Do we serve your area?" checker | Service Areas | `src/components/interactive/AreaChecker.tsx` |
| Sticky Call / Estimate bar | Phones, all pages | `src/components/layout/MobileActionBar.tsx` |

All motion is disabled for `prefers-reduced-motion`.

## End-to-end tests (Playwright)

Uses the locally installed Chrome — no browser download.

```bash
npm run build
npm run test:e2e
```

50 checks across desktop and phone: routing and language, every page in both
languages (status, console errors, broken images, horizontal scroll), mobile
menu, action bar, reveal, hero video/still, glass simulator, planner → form
pre-fill, area checker, and form validation.

Review snapshots of the interactive states (server on :3000):

```bash
$env:VISUAL=1; npx playwright test --project=desktop   # -> test-results/screens/
```

## Visual QA

Headless screenshots with the local Chrome (dev server must be running):

```bash
node scripts/shoot.mjs http://localhost:3000/en qa 1280 800 0 footer
```

## Structure

- `src/proxy.ts` — redirects `/` to `/en` or `/es` from the browser language.
- `src/app/[lang]/` — pages: home, impact-windows, impact-doors, service-areas, about, contact.
- `src/components/sections/` — reusable blocks (stage hero, metric tiles, comparison panel, FAQ…).
- `src/components/visuals/` — SVG product renders (stand-ins until real photography).
- SEO: per-page metadata with hreflang, `sitemap.xml`, `robots.txt`, LocalBusiness JSON-LD.

## Commands

```bash
npm run dev     # http://localhost:3000
npm run build   # production build (also type-checks)
npm run lint
```

## Estimate form

Set `formEndpoint` in `src/content/site.ts` to a Formspree / Web3Forms URL.
Until then the form validates and asks the visitor to call.
