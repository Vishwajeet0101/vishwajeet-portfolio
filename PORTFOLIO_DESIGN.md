# Portfolio — Design System & Build Plan

**Owner:** Vishwajeet Kumar Nishad · Full-Stack Developer
**Stack:** React 19 · Vite · Tailwind CSS 4 · Framer Motion · lucide-react
**Last reviewed:** September 29, 2026

---

## 1. Design Principles

1. **Content is the hero.** Every visual decision serves the projects and the writing. No decoration that doesn't carry information.
2. **Minimal means disciplined, not empty.** One accent color, two typefaces, hairline rules, generous whitespace. Restraint is the aesthetic.
3. **Typography does the heavy lifting.** Scale, weight and spacing carry hierarchy — not boxes, shadows or color fills.
4. **Everything ships.** Every claim on the page is backed by something a reviewer can click: a live URL, a repo, or a resume.
5. **Respect the reader.** Semantic HTML, keyboard access, reduced-motion support, honest empty states.

---

## 2. Design System

### 2.1 Color — one accent, near-monochrome

Single source of truth: `src/index.css` `@theme` + `html.light` / `html.dark` CSS variables. All components consume variables (`var(--text-primary)`, `var(--line)`…), never hard-coded hexes.

| Token | Dark (default) | Light | Usage |
|---|---|---|---|
| `--page-bg` | `oklch(0.145 0.006 60)` | `oklch(0.985 0.004 85)` | Page background |
| `--surface-1` | `oklch(0.185 0.006 60)` | `oklch(0.965 0.005 85)` | Panels, hover wipes |
| `--surface-2` | `oklch(0.225 0.007 60)` | `oklch(0.935 0.006 85)` | Image placeholders |
| `--text-primary` | `oklch(0.96 0.004 85)` | `oklch(0.19 0.012 60)` | Headings, body copy |
| `--text-muted` | `oklch(0.66 0.008 70)` | `oklch(0.505 0.012 60)` | Captions, meta |
| `--line` | 13% white | 14% ink | Hairline rules, borders |
| `--line-strong` | 28% white | 30% ink | Buttons, ghost numerals |
| `--color-accent` | `oklch(0.77 0.14 62)` | `oklch(0.55 0.16 48)` | **Sparingly** — see below |

**Accent budget:** the amber may appear only as — active nav underline · status dot ("open to work") · section index numerals · suffix glyphs on stats (`+`) · focus rings · scroll-progress bar · hover arrows/numerals. Never for headings, never for large fills, never more than one accent moment per viewport.

**Selection & focus:** inverted selection (`::selection` = ink on paper) and a 2px accent outline offset 3px. Grain overlay at 3.5–4.5% opacity ties the monochrome portrait to the page.

### 2.2 Typography — Geist + Geist Mono

Two families, both self-consistent: **Geist** (display + body) and **Geist Mono** (labels, meta, buttons). Loaded from Google Fonts with `preconnect`; tabular numerals everywhere numbers animate.

| Style | Spec |
|---|---|
| Display XL (hero name) | Geist 600 · `clamp(2.75rem, 10vw, 6.5rem)` · leading 0.92 · tracking −0.035em |
| Display L (section titles) | Geist 600 · `2rem → 5rem` · leading 1.08 |
| Display M (card titles) | Geist 600 · `1.75rem → 4xl` |
| Body L (intro paragraphs) | 15–20px · leading 1.65 · muted color |
| Body S (descriptions, bullets) | 15px · leading relaxed |
| Label (`.label`) | Geist Mono 500 · 11px · 0.18em tracking · uppercase — the page's connective tissue |
| Mono meta (`.mono`) | Geist Mono · 12–13px · tabular-nums |

**Rules:** headings are ink-only (no accent on type); sentences case for headings, uppercase mono for labels; line-length ≤ ~65ch for paragraphs; numerals always `tabular-nums`.

### 2.3 Layout — editorial 12-column grid

- Max width **`max-w-6xl` (72rem)**, gutters `px-4 sm:px-6`.
- Section header pattern: 3-col left margin holds the numbered mono label (`01 —— ABOUT`), 9-col right column holds the display title + intro. Reused by every section via `SectionHeading`.
- Content rows use the same 3/9 split (meta left, story right) so the whole page reads as one system.
- Sections separated by **hairline rules** (`.rule`), never by background blocks; vertical rhythm `py-24 sm:py-32`.
- Mobile: single column, same order, rules stay. The grid collapse is already handled by `lg:grid-cols-12` patterns.

### 2.4 Components

| Component | Spec |
|---|---|
| **Buttons** (`.btn`, `.btn-solid`) | Square corners, hairline border, mono 11px uppercase. Hover = fill wipes up from the bottom (400–450ms). Solid variant inverts ink/paper. |
| **Links** (`.link`) | Muted ink; 1px underline draws in from the left on hover. |
| **Index rows** (`.row`) | Full-width rows (projects, email CTA); background wipes in from the left + 8px padding shift on hover. |
| **Panels** (`.panel`) | Surface-1 fill, hairline border, square corners. No shadows anywhere — depth comes from the offset hairline frame and grain. |
| **Section heading** | Numbered label left column, title right — the page's signature pattern. |
| **Marquee** | Tech ticker, 38s loop, edge fade mask, pauses on hover, `sr-only` text fallback. |
| **Stat block** | Huge Geist numerals + accent suffix, hairline rule above, mono label under. |
| **Meta row** | Mono label (20ch) + mono value — used for Based/Local/Building under the portrait. |

### 2.5 Motion

- Language: reveal + wipe. Every animation is opacity/transform only; durations 0.5–0.9s; ease `cubic-bezier(0.22, 1, 0.36, 1)`.
- Entrance choreography: nav drops in → hero words rise word-by-word through overflow masks (75ms stagger) → meta fades up → sections fade-up once at −60/−80px viewport margins.
- Continuous: tech marquee, "open to work" ping, scroll-progress hairline.
- Hover: button fill wipe, row wipe, image scale ≤1.035, arrow nudge ≤2px.
- **Reduced motion:** `MotionConfig reducedMotion="user"` + a global CSS kill-switch; parallax and marquee disable. Non-negotiable.

### 2.6 Imagery

- Portrait and project shots render grayscale via `--photo-filter` so any source photo belongs to the page.
- Portrait: 4:5 crop, bottom-anchored with slight overscale to crop dead space, offset hairline frame behind, corner ticks in accent.
- Project figures: 16:9, hairline border, slow zoom on card hover.
- **Art direction:** project art must be a product screenshot with the UI legible — the current `/project-faculty.svg` is a traced photo of a plaza, which reads as stock filler and must be replaced (see §4.3).

---

## 3. Site Map & Information Architecture

```
/ (single page, scroll-driven)
├── Navbar        — VK mark · numbered links · theme toggle · menu (mobile)
├── Hero          — status · name · value prop · CTAs · portrait · meta · tech marquee
├── 01 About      — summary · count-up stats · at-a-glance facts · education
├── 02 Experience — role rows: period/type | role, company, highlights
├── 03 Projects   — 2 featured case studies + "Also built" index rows
├── 04 Skills     — grouped dl rows: Languages / Backend / Frontend / Databases / Tools
├── 05 Contact    — giant email row · copy-email · GitHub · local time
└── Footer        — copyright · colophon · back-to-top
```

**Content strategy:** the page sells one thing — "engineer who ships real software for real users." Every section reinforces it: stats count real deliverables, experience bullets name live systems, project descriptions name real organisations, contact promises a reply within a day. Recruiters are the primary persona: status line answers availability, CTAs surface projects + resume in the first viewport, contact needs zero clicks to find.

---

## 4. Build Plan & Roadmap

### Phase 0 — Current state (already implemented ✅)

- Design tokens (§2.1), Geist type system, editorial grid, section-heading pattern, button/link/row system, marquee, grain, themes, reduced-motion, active-section nav, count-up stats, copy-email, SEO/OG meta, favicon, sitemap-ready single page.

### Phase 1 — Content credibility (do first, ~1 working day)

1. **Resolve the Speedo CRM CTA conflict.** The card renders both "Live site" and "Private repo · demo on request." A live URL contradicts a private repo claim for recruiters. Decision:
   - Public code → set `github` and drop the private note, or
   - Private code → keep `github: null`, and let `FeaturedLinks` render the private note only.
   *(Code fix: make the note conditional on `!project.github`, not a static sibling.)*
2. **Write a proper resume.pdf** — currently a placeholder file that Vite serves regardless of size. Verify it opens and matches the page's facts.
3. **Add the LinkedIn URL** (`SITE.linkedin` is wired and hidden while empty) and match handle/site copy.

### Phase 2 — Visual fixes (half a day)

1. **Replace both project images** with real product screenshots (Faculty Portal login/dashboard; CRM caller screen). Grayscale filter will unify them. Keep 16:9, compress < 200KB.
2. **Delete dead assets:** `src/assets/image.png` (unreferenced).
3. **Hero polish:** the reveal-mask words can clip ascenders at some zoom levels — verify at 125–150% zoom; widen `.reveal-mask` padding if needed.

### Phase 3 — Craft upgrades (1–2 days, optional but recommended)

- **Project detail:** make each featured card link the whole figure to its live/repo URL with a subtle overlay arrow, so the image itself is a CTA.
- **Case-study depth:** add 2–3 lines of "problem → approach → outcome" structure to featured descriptions, with one metric per project (e.g., "126/126 tests", "daily active sales team").
- **Skills section:** replace the plain word list with a two-column layout where each skill can link to the project that proves it (deep-links to `#projects`).
- **A11y pass:** run axe/Lighthouse; add `aria-current="true"` to the active nav item; ensure the marquee `sr-only` text isn't duplicated by the visible list.
- **SEO:** add `sitemap.xml` + `robots.txt`, and an `og:image` (1200×630) rendered from the portrait + name in the site's own type style.

### Phase 4 — Distribution (when content is final)

- Deploy on Vercel (zero-config for this Vite app). Custom domain.
- `vite build` + preview check; Lighthouse ≥ 95 across the board.
- Point GitHub profile bio + resume header at the domain; add the URL to LinkedIn.

### 4.3 Explicit non-goals

- No splash/loading screens, no cursor followers, no 3D, no auto-playing media, no more than one accent color, no serif/display font of the week, no pages beyond `/` (a case-study sub-page only if a project genuinely needs it).

---

## 5. Acceptance Checklist

- [ ] One accent color; every accent use is in the §2.1 budget.
- [ ] Both themes pass contrast (muted text ≥ 4.5:1 on page background).
- [ ] No box shadows; elevation = hairlines, surfaces, grain.
- [ ] `prefers-reduced-motion` disables parallax, marquee, count-up and wipes.
- [ ] Keyboard-only run: every CTA reachable, visible focus ring, logical order.
- [ ] Lighthouse: Performance ≥ 95, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- [ ] Every project row resolves to something real (live site, repo, or "demo on request" — exactly one of which is true).
- [ ] Mobile 390px and desktop 1440px both reviewed; no horizontal scroll.
- [ ] All content in `src/utils/constants.js` — no personal data hard-coded in components.
