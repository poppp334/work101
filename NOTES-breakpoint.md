# Paperfold / กระดาษพับ — Online Bookstore POC

## Status
**Built and verified** on the production build. Dev server runs on `http://localhost:5173`.

## Locked decisions
| Topic | Decision |
|---|---|
| Stack | Vite 8 + React 19 + TS + Tailwind v4, no backend |
| Concept | Thai indie bookshop selling translated international titles + manga |
| Brand | กระดาษพับ / Paperfold |
| Language | Thai UI; Thai title first, original title secondary |
| Type | Taviraj (display) + IBM Plex Sans Thai Looped (body), bundled via @fontsource |
| Palette | paper `#f3efe4`, ink `#1e1d1a`, olive `#4f5b44`, brick `#a5402c` |
| Pages | Home, Category, Book detail, Search, 404, Cart drawer |
| Cart | localStorage, qty, subtotal, no payment |
| Catalog | 36 real international books, 6 categories x 6 |
| Covers | 35 cached in `public/covers`, typographic house jacket fallback |
| Motion | CSS page-enter, hover lift, drawer slide; respects reduced motion |

## Verified
- `npm run build` (tsc --noEmit + vite build) passed
- 17/17 Playwright checks against `vite preview` (4173)
  filters, sort, search by category, cart add, Escape close, persistence, 404, skip link, zero console errors
- No em-dash characters in source or UI copy

## Known gaps
- No checkout, auth, or payment (out of scope)
- Prices, publishers, blurbs and staff notes are demo copy
- Only one book (Naruto vol. 1) uses the house jacket; the rest have real covers
- Local dev only, not deployed

## Commands
`npm run dev` · `npm run build` · `npm run preview` · `npm run catalog` · `npm run covers`
