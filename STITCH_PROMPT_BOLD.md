# Stitch Prompt — Variant B: "Swiss Brutalist" (bold)

Same locked palette (charcoal #1c1a18 / off-white #efe9e2 / amber #e8a24b, Geist + Geist Mono) as Variant A, but the layout language flips from *calm editorial* to *oversized typographic brutalism*: stroke-only display type, grid collisions, a sticky side rail, hover-invert experience bands, and a full-amber contact inversion. Your real data is baked in for a 1:1 port.

Difference at a glance:
| | Variant A (STITCH_PROMPT.md) | Variant B (this file) |
|---|---|---|
| Type scale | Large, restrained | Extreme — name at ~14vw, stroke-only outline words |
| Grid | Centered, tidy columns | 12-col with deliberate collisions, frames breaking the grid edge |
| Navigation | Top center links | Top index nav "01/02/03" + sticky vertical left rail |
| Amber usage | Accents only | Accents + full-bleed amber marquee strip + inverted amber contact section |
| Projects | Centered case studies | Asymmetric alternating spreads with giant ghost numerals |
| Experience | Vertical timeline | Full-width hairline bands that invert to amber on hover |

---

## Master prompt (copy everything below)

```
Design a bold, editorial-brutalist single-page portfolio for Vishwajeet Kumar Nishad, a full-stack developer. Keep a strict warm-minimal palette: charcoal #1c1a18 background, warm off-white #efe9e2 text, exactly one accent — warm amber #e8a24b. Fonts: Geist for display and body (bold, extremely tight tracking, oversized), Geist Mono for labels, numbers, dates and tags. Grid: a strict 12-column system with deliberate collisions — type may overlap image edges, frames may break the grid boundary; whitespace is huge and intentional. Hairline 1px borders at 8% white opacity, plus ONE solid amber rule marking each section start. No illustrations, no gradients except one soft amber glow behind the portrait, no photography except the portrait itself.

Sections, top to bottom:

1. STICKY LEFT RAIL (desktop only) — a thin vertical strip down the left edge with rotated mono text "VISHWAJEET — PORTFOLIO 2026" and six tiny progress dots; the active section's dot is amber, the rest hairline.

2. HERO (full viewport) — top bar: mono logotype "VN © 2026" left; index navigation "01 WORK / 02 ABOUT / 03 CONTACT" right, mono. Center: the name set at ~14vw across three stacked lines mixing filled off-white and stroke-only outlined letters: "VISHWA / JEET KU / MAR N." A small rounded portrait inset overlaps the headline's right edge, with a soft amber glow behind it. Under the headline, a mono availability line with a pulsing amber dot: "● AVAILABLE FOR WORK — INDIA". Bottom of the hero: a full-bleed amber marquee strip with charcoal mono text repeating: REACT · NODE.JS · MONGODB · EXPRESS · TAILWIND CSS · GIT · REST APIS.

3. WORK — section header "01 — WORK" where "01" is stroke-only outline type at ~10vw. Two asymmetric project spreads: the first pushes left with its browser-frame screenshot breaking off the right edge of the grid; the second mirrors to the right. Each spread: a giant ghost numeral (01 / 02), mono eyebrow "CASE STUDY · CAMPUS PLATFORM", project title, amber mono metric callout "126/126 FACULTY ONBOARDED", a two-line description, mono tech chips, and a mac-style browser frame (three dots + fake URL) containing an abstract product UI screenshot. Ghost link "OPEN CASE STUDY →". Second project: "CRM DASHBOARD" with metric "170+ RECORDS MANAGED".

4. ABOUT / NUMBERS — split band: left column a bold 6vw lede statement; right column a hairline table of four stats in oversized mono — 05 PROJECTS · 200+ TESTS WRITTEN · 02 LIVE DEPLOYMENTS · 02 INTERNSHIPS — with the figures in amber.

5. EXPERIENCE — not a timeline: full-width hairline bands, one row per role, each reading "2024 — PRESENT / ROLE / COMPANY" in large mono. Design both the rest state (charcoal) and the hover state: the band inverts to solid amber with charcoal text. Show a small mono caption "HOVER STATE SHOWN" on the inverted row.

6. CONTACT — the inversion moment: a full-bleed amber section with charcoal text. Huge headline "LET'S BUILD SOMETHING THAT SHIPS.", a giant mailto link, then the minimal form (Name, Email, Message) as charcoal underline fields directly on amber, with a solid charcoal "SEND MESSAGE" button.

7. FOOTER — back to charcoal: oversized stroke-only "VN", mono links GITHUB / LINKEDIN / X, a small live local-time clock, and "© 2026 — BUILT WITH REACT & VITE".

Mobile screen: single column; hide the left rail; the name scales to fit the width across three lines; portrait goes full-width below the headline; stats collapse to a 2×2 hairline grid; the amber contact section keeps its inversion.

Vibe check: Swiss grid discipline × brutalist type scale × warm minimalism. Everything stays charcoal / off-white / amber. When in doubt: less decoration, bigger type.
```

---

## Iterating in Stitch

- If it drifts colorful or busy: *"Reduce to charcoal, off-white and amber only. Remove all decoration except hairlines, the amber marquee strip and the amber contact section. Make the headline bigger."*
- If outline type renders too heavy: *"Make the stroke-only outlined letters thinner — 1px stroke, not filled."*
- If the hero feels cramped: *"Give the 14vw headline more vertical space; the portrait inset should be smaller and overlap only the edge of the last line."*
- Generate desktop first, then: *"Now the mobile version of the same page, single column, same tokens, left rail hidden."*

## After you get a design you like

Hand it back and I'll port it into the existing React + Tailwind codebase — keeping every real data point (stats, projects, metrics, form) and the existing dark/light theme system.
