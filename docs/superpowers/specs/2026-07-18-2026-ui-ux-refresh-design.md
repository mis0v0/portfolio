# 2026 UI/UX Refresh — Design Spec

## Context

`portfolio.html` is a single-file dark cyber-security portfolio (violet `#8A6EFF` / lime `#C9F24E` accents, Chakra Petch + IBM Plex fonts, a Three.js network background in the hero, and a base64-embedded mascot image). Structure: nav, hero, about, focus areas, work, contact, footer. Content is still placeholder (`Your Name`, `Project Title One`, `you@example.com`, etc.) and stays that way — this pass is design/UX only, no content changes.

## Goal

Layer 2026 UI/UX trends onto the existing dark hacker aesthetic without changing its identity or introducing new external dependencies (only the CDN libs already present: Three.js, Motion). Balanced intensity: CSS-first effects with light vanilla JS, no perf-heavy additions.

## Scope

### 1. Navigation & global chrome
- **Floating island nav**: on scroll past the hero, the full-width nav bar condenses into a centered glass "pill" capsule (rounded, blurred, bordered) that stays fixed near the top. At the top of the page it can render closer to the current full-width bar, or already as a pill — implementer's call, but the condensed state must trigger by ~1 viewport height of scroll.
- **Scroll progress bar**: a 1–2px lime progress line along the bottom edge of the nav pill, width tied to `scrollY / (document height - viewport height)`.
- **Scrollspy**: the nav link matching the section currently in view gets the lime active-color treatment (reuse existing hover color, don't invent a new one).
- **Custom cursor**: a small dot + a larger lagging ring (CSS transform, requestAnimationFrame or direct pointermove, no library). Enlarges / changes opacity over links, buttons, and cards. Disabled entirely on touch devices (`(hover:none)` media query / pointer check) and under `prefers-reduced-motion` (falls back to native cursor).
- **Grain overlay**: a fixed, full-viewport `<canvas>` or repeating-background noise texture at very low opacity (~4–6%), subtly animated (looped noise frames or CSS steps animation), sitting above the existing grid atmosphere layer but below content. `pointer-events:none`. Disabled/static under `prefers-reduced-motion`.

### 2. Hero
- **Kinetic headline**: on page load, the `<h1>` name text does a brief decode/scramble-in (random glyphs resolving to final characters over ~600–900ms), fitting the hacker theme. Runs once on load, not on every scroll-into-view. Under `prefers-reduced-motion`, render final text immediately with no animation.
- **Scroll-linked parallax**: as the user scrolls past the hero, `.hero-copy` fades and scales down slightly (e.g. opacity 1→0, scale 1→0.96) at a different rate than the Three.js canvas behind it, for depth separation. Pure CSS/JS scroll listener (or native scroll-timeline where supported, with a JS fallback) — no new library.
- **Magnetic CTA buttons**: `.btn` elements in the hero shift a few px toward the cursor within a small radius on pointermove, springing back on pointerleave. Desktop/pointer-fine only.

### 3. About / Focus / Work — bento grid & glass
- **Focus Areas → asymmetric bento grid**: replace the uniform 2×2 `.focus-grid` with a bento layout where one card (e.g. `01 — Offensive Security`) spans larger than the other three. Responsive: collapses to single column on mobile same as today.
- **Glass card surface**: `.fcard`, `.work` items, and `.stat` blocks get a translucent blurred background (reuse the nav's `backdrop-filter` approach) with a subtle 1px gradient/glow border, consistent with existing `--panel`/`--line` tokens — no new color tokens unless needed for the glass tint.
- **Cursor-tracking spotlight**: on `.fcard` and `.work` hover, a radial-gradient highlight (violet/lime blend) follows the pointer position within the card bounds (CSS custom properties `--x`/`--y` updated on pointermove, consumed by a `background: radial-gradient(...)`).
- **Work section → tilt card grid**: convert `.work-list` from stacked rows into a responsive card grid; each card gets a subtle perspective tilt on hover (rotateX/rotateY based on cursor offset from center, clamped to a small range e.g. ±6deg). Falls back to flat hover (existing style) on touch/reduced-motion.
- **About stats**: `.stat` blocks adopt the same glass treatment for visual consistency with the new focus/work cards.

### 4. Accessibility & performance safeguards
- All new motion (cursor, typing, parallax, grain, tilt, magnetic buttons) respects `prefers-reduced-motion: reduce` — static/instant fallback, extending the existing pattern already used for `.dot`, `.m-char`, etc.
- Touch/coarse-pointer devices: custom cursor, tilt, and magnetic buttons are disabled via `(hover:hover) and (pointer:fine)` gating; native touch interaction is preserved everywhere.
- Grain and spotlight effects are `pointer-events:none` where purely decorative, and avoid layout thrashing (`transform`/`opacity`-only animation, scoped `will-change`).
- All new interactive elements inherit the existing `:focus-visible` lime outline rule — no keyboard-accessibility regressions.
- No new external dependencies — implementation stays within the current Three.js + Motion + vanilla JS/CSS footprint.

## Out of scope
- Real content (name, bio, project details, links, CV) — placeholders stay as-is.
- Any departure from the dark violet/lime cyber-security visual identity.
- New color palette, new fonts, or new build tooling.
