# Stitch Prompt — Professional Portfolio UI

Paste the block below into Stitch (stitch.withgoogle.com) as the first message. It encodes the exact requirements we settled on: professional, warm-minimal, one accent color, typographic, case-study driven — with your real content so the port back into the codebase is 1:1.

---

## Master prompt (copy everything below)

```
Design a professional single-page personal portfolio website for Vishwajeet Kumar Nishad, a full-stack developer. Style: warm-minimal editorial — dark charcoal background #1c1a18, warm off-white text #efe9e2, and exactly ONE accent: warm amber #e8a24b used sparingly (highlights, metrics, links, a soft glow behind device frames). Typography: Geist (or closest grotesque sans) for headlines and body — semibold, tight tracking; Geist Mono for all labels, eyebrows, metrics, dates and tags. Layout language: generous whitespace, 1px hairline borders at ~8% white opacity, subtle film-grain texture, rounded-xl cards, no stock illustrations, no heavy gradients — calm, precise, typographic.

Sections, top to bottom:

1. NAV — sticky, hairline bottom border: mono logotype "VN © 2026" left; center links WORK · ABOUT · EXPERIENCE · CONTACT; amber-outline pill button "GET IN TOUCH" right.

2. HERO — small mono eyebrow row: "BASED IN INDIA — AVAILABLE FOR WORK — FULL-STACK DEVELOPER". Oversized two-line headline "Vishwajeet Kumar Nishad" with a staggered reveal effect. Right column: portrait photo in a rounded hairline frame, noticeably smaller than the headline block, top-aligned. Below the headline: a single-row marquee of mono chips: React, Node.js, MongoDB, Express, Tailwind CSS, Git, REST APIs. Bottom hairline-bordered row with 4 mono stats: 05 PROJECTS / 200+ TESTS WRITTEN / 02 LIVE DEPLOYMENTS / 02 INTERNSHIPS.

3. ABOUT — two columns: mono label "ABOUT" left; right side a large lede sentence, a smaller supporting paragraph, and a ghost button "DOWNLOAD RESUMÉ".

4. EXPERIENCE — vertical hairline timeline: mono dates on the left (e.g. "2024 — PRESENT"), role, company and a one-line impact statement on the right. Amber dot markers.

5. PROJECTS — two large case studies stacked with big vertical rhythm. Each opens with a mono eyebrow like "CASE STUDY // 01 · CAMPUS PLATFORM", then a large title, an amber mono metric callout ("126/126 faculty onboarded" / "170+ records managed"), a two-line description, a row of mono tech chips, and a browser-frame figure: mac-style bar with three dots and a fake URL, soft amber glow behind it, containing an abstract product UI screenshot. Ghost button "VIEW CASE STUDY →".

6. SKILLS — 4 hairline cards in a row (FRONTEND / BACKEND / DATABASE / TOOLS), each holding a tight grid of mono chips.

7. CONTACT — large headline "Let's build something that ships.", an inline minimal form (Name, Email, Message) with hairline underline inputs only — no filled boxes — and a mono "SEND MESSAGE" button. Below: social row GitHub / LinkedIn / X and a small mono live local-time clock.

Footer: single hairline top border, mono "© 2026 Vishwajeet Kumar Nishad — Built with React & Vite".

Mobile screen: same tokens, single column; hero portrait moves below the headline; the 4 stats become a 2×2 hairline grid; nav collapses to logotype + GET IN TOUCH.
```

---

## Tips for iterating in Stitch

- Generate desktop first, then follow up in the same chat with: *"Now design the mobile version of the same page, single column, same tokens."*
- If a result drifts colorful or busy, reply: *"Reduce to charcoal + off-white + amber only. Remove gradients and illustrations. More whitespace, larger headline."*
- Keep the browser-frame figures and mono eyebrows — those are the signature elements; ask to *"keep the case-study browser frames but make the screenshots abstract UI, not photos."*

## After you get a design you like

Hand it back to me and I'll port it into the existing React + Tailwind codebase the same way as the first Stitch design, keeping all real data (stats, projects, metrics, form).
