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
