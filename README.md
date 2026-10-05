# Vishwajeet Kumar Nishad — Portfolio

Personal portfolio of **Vishwajeet Kumar Nishad**, full-stack developer. Warm-minimal editorial design: charcoal canvas, a single amber accent, Geist typography, hairline structure, and case-study–driven project presentation.

## Stack

- **React 19** + **Vite 8**
- **Tailwind CSS 4** (CSS-first tokens in `src/index.css`)
- **Framer Motion** for reveal animations
- **Geist / Geist Mono** typefaces
- Dark/light theme with `localStorage` persistence (`src/hooks/useTheme.js`)

## Sections

Hero (name, marquee, 4-stat row) · About · Experience · Projects (case studies with browser-frame figures) · Skills · Contact (inline mailto form, live clock)

## Development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## Project structure

```
src/
  sections/    Hero, About, Experience, Projects, Skills, Contact
  components/  Nav, Footer, shared UI
  hooks/       useTheme
  utils/       constants.js  ← edit SITE / PROJECTS / ABOUT data here
public/        favicon + project artwork (SVG)
```

All content (name, stats, projects, links) lives in [src/utils/constants.js](src/utils/constants.js).

## Deployment

Deployed on **Vercel**. Pushes to `main` trigger production deployments via the Vercel Git integration.

---

© 2026 Vishwajeet Kumar Nishad
