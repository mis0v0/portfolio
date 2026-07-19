# React + Tailwind Cyberpunk HUD Rewrite — Design Spec

## Context

`portfolio.html` (currently at the repo root) is a single-file dark cyber-security portfolio built earlier in this project: inline CSS, vanilla JS, Three.js hero network background, a base64-embedded mascot PNG, and a 2026 UI/UX refresh pass (floating pill nav, custom cursor, film grain, kinetic headline, parallax, magnetic buttons, bento grid, glass cards, cursor spotlight, tilt cards). Content is still placeholder (`Your Name`, `Project Title One`, `you@example.com`, etc.).

This spec covers a full rewrite of that site into a maintainable React + Tailwind project, with a new visual direction (Cyberpunk HUD) generated via the locally-installed `ui-ux-pro-max` skill's design-system search, while preserving the site's structure and the user's custom mascot image.

Two new local Claude skills were installed and inspected (read their scripts, confirmed no network calls/telemetry/exec of remote code) ahead of this work:
- `ui-ux-pro-max` — offline design-guideline search DB (styles, colors, typography, motion, UX checklists), Python stdlib only, no network access.
- `ui-styling` — Tailwind + shadcn/ui reference and scripts (`shadcn_add.py`, `tailwind_config_gen.py`).

## Goal

Replace the single-file static site with a Vite + React + TypeScript + Tailwind + shadcn/ui project, re-implementing every existing section and interaction (ported to React/Framer Motion) under a new Cyberpunk HUD visual identity, while keeping `portfolio.html` untouched as a backup and keeping content as placeholder text.

## Out of Scope

- Real content (name, bio, project details, links, email, CV).
- Deployment/hosting configuration (Vercel, Netlify, GitHub Pages, CI) — this spec only covers local dev + build.
- Removing or modifying `portfolio.html`, `Gemini_Generated_Image_*.png`, or any file outside the new `app/` folder.
- Any redesign of information architecture — section order and purpose (Hero → About → Focus → Work → Contact) stay the same.

## Tech Stack

- **Build tool:** Vite (React + TypeScript template)
- **Styling:** Tailwind CSS (latest v4, `@tailwindcss/vite` plugin — no separate PostCSS config needed)
- **Components:** shadcn/ui (Radix primitives) — used only where it saves real work (`Button`, `Badge`); everything else is plain Tailwind-styled JSX, no over-adoption of the component library for a small single-page site
- **Animation:** `motion` (the current package name for Framer Motion) — replaces all prior vanilla-JS animation code (scroll reveal, custom cursor, parallax, magnetic buttons, tilt, scramble text)
- **Fonts:** Google Fonts — Orbitron (700/900, headings) + JetBrains Mono (400/500, body/labels/mono), loaded via `@import` in the Tailwind entry CSS, matching the `ui-ux-pro-max` "Cyberpunk Mobile (Orbitron + JetBrains Mono)" typography pairing
- **Package manager:** npm (matches the `ui-styling` skill's documented commands)

## Project Structure

New project lives entirely under `app/` at the repo root:

```
app/
  package.json
  vite.config.ts
  tsconfig.json
  index.html
  src/
    main.tsx
    App.tsx
    index.css                 # Tailwind entry + @theme tokens + font imports
    lib/
      motion-prefs.ts         # shared reducedMotion/finePointer hooks (replaces Task 1's closure vars)
    components/
      ui/                     # shadcn/ui-generated primitives (button, badge)
      CustomCursor.tsx
      ScanlineOverlay.tsx
      Nav.tsx
    sections/
      Hero.tsx
      About.tsx
      Focus.tsx
      Work.tsx
      Contact.tsx
    assets/
      mascot.png               # extracted from the base64 data URI in portfolio.html
```

`portfolio.html` and `Gemini_Generated_Image_g0lo48g0lo48g0lo.png` stay at the repo root, untouched, as a backup of the previous version.

## Design Tokens (Cyberpunk HUD)

Defined as Tailwind `@theme` CSS variables in `src/index.css`:

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#0A0A0F` | page background (void) |
| `--color-card` | `#12121A` | card/panel surfaces |
| `--color-fg` | `#E0E0E0` | primary text |
| `--color-muted` | `#1C1C2E` | muted surfaces / secondary backgrounds |
| `--color-border` | `#2A2A3A` | borders/dividers |
| `--color-accent` | `#00FF88` | primary neon (CTAs, active states, glow) |
| `--color-accent-2` | `#FF00FF` | magenta accent (secondary highlights, glitch) |
| `--color-accent-3` | `#00D4FF` | cyan accent (links, data/labels) |
| `--color-destructive` | `#FF3366` | error/destructive (unused today, defined for completeness) |
| `--font-heading` | `Orbitron` | H1/H2/H3, uppercase, wide letter-spacing |
| `--font-mono` | `JetBrains Mono` | body text, labels, nav, tags |

Shape language: **no rounded corners** — chamfered (45°) corners via `clip-path: polygon(...)` on cards/buttons/panels, plus thin corner-bracket accents (`::before`/`::after` or small absolutely-positioned spans) on focus/work cards, echoing HUD framing. Panels use a translucent `--color-card` background with `backdrop-filter: blur(...)` (holographic-panel look), consistent with the glass treatment from the previous pass.

## Section-by-Section Component Plan

**Nav** (`Nav.tsx`): Same floating-pill-on-scroll behavior as before (condenses after ~60% viewport height scroll), scroll progress bar, scrollspy — reimplemented with a `useScroll`/`useMotionValueEvent` pair from `motion` instead of a raw scroll listener. Chamfered pill shape instead of `border-radius:999px`.

**CustomCursor** (`CustomCursor.tsx`): Same dot + lagging ring concept, positioned via `motion` spring values instead of manual rAF lerp. Same gating: rendered only when `!reducedMotion && finePointer` (a shared hook in `lib/motion-prefs.ts`), same fix from before (seed position on first pointer move, no corner-flash).

**ScanlineOverlay** (`ScanlineOverlay.tsx`): Replaces the film-grain overlay. A fixed, full-viewport, `pointer-events-none` layer with a repeating horizontal-line background (CSS `repeating-linear-gradient`) at very low opacity, plus an optional subtle CRT-flicker opacity oscillation gated by `!reducedMotion`.

**Hero** (`Hero.tsx`): Same layout as before — copy on one side, mascot image on the other (`assets/mascot.png`, extracted from the current base64 data URI, not regenerated). Kinetic scramble-decode headline (ported to a `useScrambleText` hook), scroll-linked parallax fade/scale on the copy block (`motion`'s `useScroll` + `useTransform`), magnetic CTA buttons (pointer-tracked spring transform, using the pointerenter-cached-rect fix from before to avoid the feedback-loop bug). Background network animation: **kept as the existing Three.js canvas**, wrapped in a small React component that mounts/unmounts the existing r128 Three.js scene-setup logic — not rewritten from scratch, since it works and isn't part of this spec's redesign target.

**About** (`About.tsx`): Same two-column layout (copy + stats). Stat blocks become chamfered HUD panels.

**Focus** (`Focus.tsx`): Same bento-grid concept (one large card + three smaller), rebuilt with Tailwind grid utilities and `grid-column`/`grid-row` spans via arbitrary values. Cards get chamfered corners, corner brackets, and the cursor-tracking spotlight (`motion` value tracking pointer position within each card, driving a radial-gradient CSS variable) — same interaction as before, new visual skin.

**Work** (`Work.tsx`): Same card-grid concept (responsive `auto-fit` grid) with 3D tilt-on-hover, reimplemented with `motion`'s `useMotionValue`/`useTransform` for `rotateX`/`rotateY` instead of manual inline-style math. Same reduced-motion/touch gating.

**Contact** (`Contact.tsx`): Same layout — big heading, email + CV buttons, social links list. Purely static markup, no new interaction.

## Migration Notes

- The mascot PNG is extracted once from the base64 data URI in `portfolio.html` and saved as a real file (`app/src/assets/mascot.png`) — not re-embedded as base64 in the new codebase, since Vite's asset pipeline handles real image files natively (hashing, optimization).
- The existing Three.js hero network script is ported with minimal changes into a `useEffect`-based React component (mount: build scene/renderer; unmount: dispose renderer and cancel the animation frame) — the particle/edge/packet generation logic itself is not rewritten.
- No accessibility/perf requirements regress from the previous pass: every animation effect must still be gated by `prefers-reduced-motion` and, where relevant, `(hover:hover) and (pointer:fine)`, mirroring the previous project's `reducedMotion`/`finePointer` flags — now as a shared `useMotionPrefs()` hook in `lib/motion-prefs.ts` instead of closure variables.
- No new content is written; all text stays as placeholder equivalents to what's in `portfolio.html` today (translated into the new component structure, not reworded).
