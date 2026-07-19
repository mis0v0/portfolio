# React + Tailwind Cyberpunk HUD Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-file `portfolio.html` with a maintainable Vite + React + TypeScript + Tailwind + shadcn/ui-pattern project under `app/`, re-implementing every section/interaction under a new Cyberpunk HUD visual identity (Orbitron + JetBrains Mono, void/neon-green/magenta/cyan palette, chamfered corners), while keeping `portfolio.html` untouched as a backup.

**Architecture:** Vite React app in `app/`. Shared interactive logic (scroll math, cursor lerp, scramble text, parallax, magnetic offset, tilt rotation, spotlight position, network geometry) is written as small, pure, framework-free functions in `src/lib/*.ts` and unit-tested with Vitest — components stay thin wrappers that wire those functions to the DOM/`motion`. All new animation is gated by a shared `useMotionPrefs()` hook (`reducedMotion` + `finePointer`), mirroring the accessibility contract from the previous vanilla-JS pass.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), `motion` (Framer Motion's current package), `three` (ported hero background), Vitest + `@testing-library/react` + jsdom for tests, CVA/`clsx`/`tailwind-merge`/`@radix-ui/react-slot` for shadcn/ui-pattern `Button`/`Badge` components (hand-authored from the standard shadcn source rather than via the network-dependent `npx shadcn` CLI, for determinism inside a sandboxed implementer).

## Global Constraints

- New project lives entirely under `app/` at the repo root. Do not modify or delete `portfolio.html` or `Gemini_Generated_Image_g0lo48g0lo48g0lo.png` — they stay as a backup.
- No real content: names, project descriptions, links, email stay as placeholder-equivalent text to what's in `portfolio.html` today, translated into JSX, not reworded or invented.
- Design tokens (exact values, do not vary): bg `#0A0A0F`, card `#12121A`, fg `#E0E0E0`, muted `#1C1C2E`, border `#2A2A3A`, accent `#00FF88`, accent-2 `#FF00FF`, accent-3 `#00D4FF`, destructive `#FF3366`. Heading font Orbitron, body/mono font JetBrains Mono. No rounded corners — chamfered via the `.chamfer` utility class.
- Every new animation/transform effect must be gated by `useMotionPrefs()`'s `reducedMotion` and/or `finePointer`, exactly matching which flag(s) each effect used in the equivalent vanilla-JS pass (documented per task below).
- Prefer small, pure, exported functions for any non-trivial math/logic (scroll thresholds, easing, geometry) in `src/lib/`, unit-tested with Vitest — keep React components as thin wiring around them. This is both a testability requirement and how later tasks are able to unit-test earlier tasks' logic without a real browser.
- Execute tasks in order, 1 → 15 — later tasks import hooks/components/utilities created by earlier tasks.
- Verification for every task: `cd app && npm run build` (TypeScript + bundle must succeed) and `npm test` (Vitest, must pass, zero failures). Full visual/interaction verification in a real browser is out of scope for implementer/reviewer subagents (no browser tool available) and is called out explicitly at the end of the plan as a manual step for the user.

---

### Task 1: Project scaffold (Vite + React + TS + Tailwind + Vitest + motion)

**Files:**
- Create: `app/` (via Vite scaffold — generates `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, etc.)
- Modify: `app/vite.config.ts`
- Create: `app/src/setupTests.ts`
- Create: `app/src/App.test.tsx`

**Interfaces:**
- Produces: a working `npm run build` and `npm test` harness that every later task relies on. `src/setupTests.ts` provides a `requestAnimationFrame`/`cancelAnimationFrame` polyfill (jsdom doesn't implement these) that later animation-hook tests depend on.
- Consumes: nothing (first task).

- [ ] **Step 1: Scaffold the Vite React+TS project**

From the repo root:

```bash
cd /Users/kimmiso/portfolio
npm create vite@latest app -- --template react-ts
cd app
npm install
```

- [ ] **Step 2: Install runtime and dev dependencies**

```bash
cd /Users/kimmiso/portfolio/app
npm install tailwindcss @tailwindcss/vite motion
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Configure Vite for Tailwind + Vitest**

Replace the full contents of `app/vite.config.ts` with:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
})
```

- [ ] **Step 4: Add the test setup file with a requestAnimationFrame polyfill**

Create `app/src/setupTests.ts`:

```ts
import '@testing-library/jest-dom'

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb: FrameRequestCallback) =>
    window.setTimeout(() => cb(performance.now()), 16)
  window.cancelAnimationFrame = (id: number) => window.clearTimeout(id)
}
```

- [ ] **Step 5: Replace the default index.css with a minimal Tailwind entry**

Replace the full contents of `app/src/index.css` with:

```css
@import "tailwindcss";
```

(Design tokens and fonts are added in Task 2 — this step only proves the Tailwind pipeline builds.)

- [ ] **Step 6: Add the "test" script**

In `app/package.json`, add to the `"scripts"` object:

```json
"test": "vitest run"
```

- [ ] **Step 7: Write the first test (proves the harness works)**

Create `app/src/App.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeTruthy()
  })
})
```

- [ ] **Step 8: Run the test, confirm it passes**

```bash
cd /Users/kimmiso/portfolio/app
npm test
```

Expected: 1 test file, 1 test, PASS.

- [ ] **Step 9: Run the build, confirm it succeeds**

```bash
cd /Users/kimmiso/portfolio/app
npm run build
```

Expected: TypeScript compiles with no errors, Vite emits `dist/`.

---

### Task 2: Design tokens, fonts, and HUD utility classes

**Files:**
- Modify: `app/src/index.css`

**Interfaces:**
- Produces: Tailwind utilities generated from the `@theme` tokens (`bg-bg`, `text-fg`, `bg-accent`, `border-border`, `font-heading`, `font-mono`, etc.) and two custom utility classes, `.chamfer` (clip-path corner cut) and `.hud-panel` (translucent blurred panel), used by every later component.
- Consumes: the Tailwind entry from Task 1.

- [ ] **Step 1: Replace `app/src/index.css` with the full token/utility set**

```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Orbitron:wght@700;900&display=swap');

@theme {
  --color-bg: #0A0A0F;
  --color-card: #12121A;
  --color-fg: #E0E0E0;
  --color-muted: #1C1C2E;
  --color-border: #2A2A3A;
  --color-accent: #00FF88;
  --color-accent-2: #FF00FF;
  --color-accent-3: #00D4FF;
  --color-destructive: #FF3366;
  --font-heading: "Orbitron", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}

body {
  background-color: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-mono);
}

@layer utilities {
  .chamfer {
    clip-path: polygon(
      12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px
    );
  }
  .hud-panel {
    background-color: color-mix(in srgb, var(--color-card) 70%, transparent);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid var(--color-border);
  }
}
```

- [ ] **Step 2: Verify the build picks up the tokens**

```bash
cd /Users/kimmiso/portfolio/app
npm run build
grep -ril "chamfer" dist/assets/*.css
grep -ril "hud-panel" dist/assets/*.css
grep -ril "00ff88" dist/assets/*.css
```

Expected: all three greps find a match (Tailwind may lowercase hex values — search case-insensitively as shown with `-i`).

- [ ] **Step 3: Run the test suite to confirm nothing broke**

```bash
cd /Users/kimmiso/portfolio/app
npm test
```

Expected: still 1/1 passing (Task 1's smoke test).

---

### Task 3: `useMotionPrefs` hook

**Files:**
- Create: `app/src/lib/motion-prefs.ts`
- Test: `app/src/lib/motion-prefs.test.ts`

**Interfaces:**
- Produces: `useMotionPrefs(): { reducedMotion: boolean; finePointer: boolean }`, exported from `src/lib/motion-prefs.ts`. Every later interactive component imports this.
- Consumes: nothing beyond React/`window.matchMedia`.

- [ ] **Step 1: Write the failing test**

Create `app/src/lib/motion-prefs.test.ts`:

```ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMotionPrefs } from './motion-prefs'

function mockMatchMedia(matches: Record<string, boolean>) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: matches[query] ?? false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useMotionPrefs', () => {
  it('reports reducedMotion true and finePointer false when those queries match', () => {
    mockMatchMedia({
      '(prefers-reduced-motion: reduce)': true,
      '(hover: hover) and (pointer: fine)': false,
    })
    const { result } = renderHook(() => useMotionPrefs())
    expect(result.current).toEqual({ reducedMotion: true, finePointer: false })
  })

  it('reports reducedMotion false and finePointer true for the opposite case', () => {
    mockMatchMedia({
      '(prefers-reduced-motion: reduce)': false,
      '(hover: hover) and (pointer: fine)': true,
    })
    const { result } = renderHook(() => useMotionPrefs())
    expect(result.current).toEqual({ reducedMotion: false, finePointer: true })
  })
})
```

- [ ] **Step 2: Run it, confirm it fails**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/lib/motion-prefs.test.ts
```

Expected: FAIL — `./motion-prefs` does not exist yet.

- [ ] **Step 3: Implement the hook**

Create `app/src/lib/motion-prefs.ts`:

```ts
import { useEffect, useState } from 'react'

export interface MotionPrefs {
  reducedMotion: boolean
  finePointer: boolean
}

function readPrefs(): MotionPrefs {
  return {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    finePointer: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  }
}

export function useMotionPrefs(): MotionPrefs {
  const [prefs, setPrefs] = useState<MotionPrefs>(readPrefs)

  useEffect(() => {
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setPrefs(readPrefs())
    reducedQuery.addEventListener('change', update)
    pointerQuery.addEventListener('change', update)
    return () => {
      reducedQuery.removeEventListener('change', update)
      pointerQuery.removeEventListener('change', update)
    }
  }, [])

  return prefs
}
```

- [ ] **Step 4: Run it, confirm it passes**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/lib/motion-prefs.test.ts
```

Expected: PASS, 2/2.

- [ ] **Step 5: Run the full suite and build**

```bash
cd /Users/kimmiso/portfolio/app
npm test && npm run build
```

Expected: both succeed.

---

### Task 4: `Button`/`Badge` components (shadcn/ui pattern)

**Files:**
- Create: `app/src/lib/utils.ts`
- Create: `app/src/components/ui/button.tsx`
- Create: `app/src/components/ui/badge.tsx`
- Test: `app/src/components/ui/button.test.tsx`
- Test: `app/src/components/ui/badge.test.tsx`

**Interfaces:**
- Produces: `cn()` helper (`src/lib/utils.ts`), `Button`/`buttonVariants` (`src/components/ui/button.tsx`), `Badge`/`badgeVariants` (`src/components/ui/badge.tsx`). Not consumed by other tasks in this plan (sections use plain `<a>`/`<div>` with Tailwind classes to match the original markup), but established here as the shadcn/ui-pattern primitive layer the spec calls for and for any future component work.
- Consumes: the `.chamfer` utility and color tokens from Task 2.

- [ ] **Step 1: Install shadcn/ui's standard dependencies**

```bash
cd /Users/kimmiso/portfolio/app
npm install class-variance-authority clsx tailwind-merge @radix-ui/react-slot
```

- [ ] **Step 2: Add the `cn` helper**

Create `app/src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 3: Write the failing tests**

Create `app/src/components/ui/button.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders its children as a button', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies the outline variant classes', () => {
    render(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border')
  })
})
```

Create `app/src/components/ui/badge.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './badge'

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>Pentest</Badge>)
    expect(screen.getByText('Pentest')).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Run them, confirm they fail**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/components/ui/button.test.tsx src/components/ui/badge.test.tsx
```

Expected: FAIL — `./button`/`./badge` don't exist yet.

- [ ] **Step 5: Implement Button**

Create `app/src/components/ui/button.tsx`:

```tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'chamfer inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-xs uppercase tracking-wider transition-colors focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-accent text-bg hover:bg-accent/90',
        outline: 'border border-border text-fg hover:border-accent hover:text-accent',
        ghost: 'text-fg hover:text-accent',
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

- [ ] **Step 6: Implement Badge**

Create `app/src/components/ui/badge.tsx`:

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'chamfer inline-flex items-center border border-border px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider text-fg/70',
  {
    variants: {
      variant: {
        default: '',
        accent: 'border-accent text-accent',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />
}

export { Badge, badgeVariants }
```

- [ ] **Step 7: Run the tests, confirm they pass**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/components/ui/button.test.tsx src/components/ui/badge.test.tsx
```

Expected: PASS, 3/3.

- [ ] **Step 8: Run the full suite and build**

```bash
cd /Users/kimmiso/portfolio/app
npm test && npm run build
```

---

### Task 5: `useScrambleText` hook (kinetic decode headline)

**Files:**
- Create: `app/src/lib/use-scramble-text.ts`
- Test: `app/src/lib/use-scramble-text.test.ts`

**Interfaces:**
- Produces: `useScrambleText(text: string, reducedMotion: boolean, duration?: number): string`. Consumed by Task 10 (Hero interactions).
- Consumes: the `requestAnimationFrame` polyfill from Task 1's `setupTests.ts`.

- [ ] **Step 1: Write the failing tests**

Create `app/src/lib/use-scramble-text.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useScrambleText } from './use-scramble-text'

describe('useScrambleText', () => {
  it('returns the final text immediately when reducedMotion is true', () => {
    const { result } = renderHook(() => useScrambleText('Name', true))
    expect(result.current).toBe('Name')
  })

  it('resolves to the final text after the animation duration when reducedMotion is false', async () => {
    const { result } = renderHook(() => useScrambleText('Name', false, 10))
    await new Promise((resolve) => setTimeout(resolve, 60))
    expect(result.current).toBe('Name')
  })
})
```

- [ ] **Step 2: Run it, confirm it fails**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/lib/use-scramble-text.test.ts
```

Expected: FAIL — module doesn't exist yet.

- [ ] **Step 3: Implement the hook**

Create `app/src/lib/use-scramble-text.ts`:

```ts
import { useEffect, useState } from 'react'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%_/\\'

export function useScrambleText(text: string, reducedMotion: boolean, duration = 700): string {
  const [display, setDisplay] = useState(reducedMotion ? text : '')

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text)
      return
    }
    let raf = 0
    const start = performance.now()
    const len = text.length

    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1)
      const revealCount = Math.floor(p * len)
      let out = ''
      for (let i = 0; i < len; i++) {
        out +=
          i < revealCount || text[i] === ' '
            ? text[i]
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      }
      setDisplay(out)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, reducedMotion, duration])

  return display
}
```

- [ ] **Step 4: Run it, confirm it passes**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/lib/use-scramble-text.test.ts
```

Expected: PASS, 2/2.

- [ ] **Step 5: Run the full suite and build**

```bash
cd /Users/kimmiso/portfolio/app
npm test && npm run build
```

---

### Task 6: `Nav` component (floating pill, scroll progress, scrollspy)

**Files:**
- Create: `app/src/lib/nav-logic.ts`
- Test: `app/src/lib/nav-logic.test.ts`
- Create: `app/src/components/Nav.tsx`
- Test: `app/src/components/Nav.test.tsx`

**Interfaces:**
- Produces: pure functions `isPillActive`, `computeScrollProgress`, `computeActiveSection` (`src/lib/nav-logic.ts`), and the `Nav` component (`src/components/Nav.tsx`, default export not used — named export `Nav`). Consumed by Task 15 (App assembly).
- Consumes: nothing new.
- Gating: none of this effect is gated by `reducedMotion`/`finePointer` — matches the original vanilla-JS pass, which left nav pill/progress/scrollspy ungated (only the CSS transition itself respects `prefers-reduced-motion`, applied here via Tailwind's `motion-reduce:` variant in Step 5).

- [ ] **Step 1: Write the failing logic tests**

Create `app/src/lib/nav-logic.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { isPillActive, computeScrollProgress, computeActiveSection } from './nav-logic'

describe('isPillActive', () => {
  it('is false at the top of the page', () => {
    expect(isPillActive(0, 800)).toBe(false)
  })
  it('is true past 60% of viewport height', () => {
    expect(isPillActive(500, 800)).toBe(true)
  })
})

describe('computeScrollProgress', () => {
  it('returns 0 when there is nothing to scroll', () => {
    expect(computeScrollProgress(0, 800, 800)).toBe(0)
  })
  it('returns 50 at the halfway point', () => {
    expect(computeScrollProgress(100, 1000, 800)).toBe(50)
  })
})

describe('computeActiveSection', () => {
  it('picks the section whose bounds straddle the threshold', () => {
    const sections = [
      { id: 'about', top: -200, bottom: 100 },
      { id: 'focus', top: 100, bottom: 500 },
    ]
    expect(computeActiveSection(sections)).toBe('about')
  })
  it('returns an empty string when no section straddles the threshold', () => {
    expect(computeActiveSection([{ id: 'about', top: 500, bottom: 900 }])).toBe('')
  })
})
```

- [ ] **Step 2: Run it, confirm it fails**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/lib/nav-logic.test.ts
```

- [ ] **Step 3: Implement the pure logic**

Create `app/src/lib/nav-logic.ts`:

```ts
export function isPillActive(scrollY: number, viewportHeight: number): boolean {
  return scrollY > viewportHeight * 0.6
}

export function computeScrollProgress(scrollY: number, scrollHeight: number, clientHeight: number): number {
  const max = scrollHeight - clientHeight
  return max > 0 ? (scrollY / max) * 100 : 0
}

export interface SectionRect {
  id: string
  top: number
  bottom: number
}

export function computeActiveSection(sections: SectionRect[], threshold = 120): string {
  let current = ''
  for (const sec of sections) {
    if (sec.top <= threshold && sec.bottom > threshold) current = sec.id
  }
  return current
}
```

- [ ] **Step 4: Run it, confirm it passes**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/lib/nav-logic.test.ts
```

Expected: PASS, 6/6.

- [ ] **Step 5: Write the failing component test**

Create `app/src/components/Nav.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Nav } from './Nav'

describe('Nav', () => {
  it('renders all section links', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about')
    expect(screen.getByRole('link', { name: 'Focus' })).toHaveAttribute('href', '#focus')
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '#work')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
  })
})
```

- [ ] **Step 6: Implement the component**

Create `app/src/components/Nav.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { isPillActive, computeScrollProgress, computeActiveSection } from '../lib/nav-logic'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#focus', label: 'Focus' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  const [pill, setPill] = useState(false)
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState('')

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setPill(isPillActive(y, window.innerHeight))
      setProgress(
        computeScrollProgress(y, document.documentElement.scrollHeight, document.documentElement.clientHeight)
      )
      const rects = LINKS.map((l) => {
        const el = document.querySelector(l.href)
        const rect = el?.getBoundingClientRect()
        return { id: l.href.slice(1), top: rect?.top ?? Infinity, bottom: rect?.bottom ?? Infinity }
      })
      setActive(computeActiveSection(rects))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex flex-col items-center px-6 py-4 motion-reduce:transition-none">
      <div
        className={
          pill
            ? 'hud-panel chamfer flex w-full max-w-xl items-center justify-between px-6 py-3 transition-all motion-reduce:transition-none'
            : 'flex w-full items-center justify-between transition-all motion-reduce:transition-none'
        }
      >
        <span className="font-mono text-xs text-fg">@yourhandle_sec</span>
        <div className="flex gap-6">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`font-mono text-xs uppercase tracking-wider ${
                active === l.href.slice(1) ? 'text-accent' : 'text-fg/60'
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
      {pill && (
        <div className="mt-1.5 h-0.5 w-full max-w-xl overflow-hidden bg-border">
          <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 7: Run it, confirm it passes**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/components/Nav.test.tsx
```

Expected: PASS, 1/1.

- [ ] **Step 8: Run the full suite and build**

```bash
cd /Users/kimmiso/portfolio/app
npm test && npm run build
```

---

### Task 7: `CustomCursor` component

**Files:**
- Create: `app/src/lib/cursor-lerp.ts`
- Test: `app/src/lib/cursor-lerp.test.ts`
- Create: `app/src/components/CustomCursor.tsx`
- Test: `app/src/components/CustomCursor.test.tsx`

**Interfaces:**
- Produces: `lerp(current, target, factor): number` (`src/lib/cursor-lerp.ts`) and the `CustomCursor` component. Consumed by Task 15 (App assembly).
- Consumes: `useMotionPrefs` (Task 3).
- Gating: renders `null` (no DOM, no listeners) when `reducedMotion` is true OR `finePointer` is false — same as the original.

- [ ] **Step 1: Write the failing lerp test**

Create `app/src/lib/cursor-lerp.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { lerp } from './cursor-lerp'

describe('lerp', () => {
  it('moves partway from current toward target by the given factor', () => {
    expect(lerp(0, 100, 0.5)).toBe(50)
  })
  it('returns current unchanged when factor is 0', () => {
    expect(lerp(10, 100, 0)).toBe(10)
  })
})
```

- [ ] **Step 2: Run it, confirm it fails, then implement**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/lib/cursor-lerp.test.ts
```

Create `app/src/lib/cursor-lerp.ts`:

```ts
export function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor
}
```

Run again — expect PASS, 2/2.

- [ ] **Step 3: Write the failing component tests**

Create `app/src/components/CustomCursor.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { CustomCursor } from './CustomCursor'
import * as motionPrefs from '../lib/motion-prefs'

afterEach(() => vi.restoreAllMocks())

describe('CustomCursor', () => {
  it('renders nothing when reducedMotion is true', () => {
    vi.spyOn(motionPrefs, 'useMotionPrefs').mockReturnValue({ reducedMotion: true, finePointer: true })
    const { container } = render(<CustomCursor />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when finePointer is false', () => {
    vi.spyOn(motionPrefs, 'useMotionPrefs').mockReturnValue({ reducedMotion: false, finePointer: false })
    const { container } = render(<CustomCursor />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the dot and ring when motion is allowed', () => {
    vi.spyOn(motionPrefs, 'useMotionPrefs').mockReturnValue({ reducedMotion: false, finePointer: true })
    const { container } = render(<CustomCursor />)
    expect(container.querySelectorAll('div')).toHaveLength(2)
  })
})
```

- [ ] **Step 4: Run it, confirm it fails**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/components/CustomCursor.test.tsx
```

- [ ] **Step 5: Implement the component**

Create `app/src/components/CustomCursor.tsx`:

```tsx
import { useEffect, useRef } from 'react'
import { motion, useMotionValue } from 'motion/react'
import { useMotionPrefs } from '../lib/motion-prefs'
import { lerp } from '../lib/cursor-lerp'

export function CustomCursor() {
  const { reducedMotion, finePointer } = useMotionPrefs()
  const dotX = useMotionValue(0)
  const dotY = useMotionValue(0)
  const ringX = useMotionValue(0)
  const ringY = useMotionValue(0)
  const target = useRef({ x: 0, y: 0 })
  const started = useRef(false)

  useEffect(() => {
    if (reducedMotion || !finePointer) return

    function onMove(e: PointerEvent) {
      target.current = { x: e.clientX, y: e.clientY }
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      if (!started.current) {
        started.current = true
        ringX.set(e.clientX)
        ringY.set(e.clientY)
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let raf = 0
    function loop() {
      ringX.set(lerp(ringX.get(), target.current.x, 0.18))
      ringY.set(lerp(ringY.get(), target.current.y, 0.18))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [reducedMotion, finePointer, dotX, dotY, ringX, ringY])

  if (reducedMotion || !finePointer) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        style={{ x: dotX, y: dotY }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[999] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-3"
        style={{ x: ringX, y: ringY }}
      />
    </>
  )
}
```

- [ ] **Step 6: Run it, confirm it passes**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/components/CustomCursor.test.tsx
```

Expected: PASS, 3/3.

- [ ] **Step 7: Run the full suite and build**

```bash
cd /Users/kimmiso/portfolio/app
npm test && npm run build
```

---

### Task 8: `ScanlineOverlay` component

**Files:**
- Modify: `app/src/index.css`
- Create: `app/src/components/ScanlineOverlay.tsx`
- Test: `app/src/components/ScanlineOverlay.test.tsx`

**Interfaces:**
- Produces: the `ScanlineOverlay` component and an `.animate-scanline` CSS animation utility. Consumed by Task 15 (App assembly).
- Consumes: `useMotionPrefs` (Task 3).
- Gating: the CRT-flicker animation is gated by `reducedMotion` (static, fully-visible overlay when reduced motion is requested — no listeners involved since this is CSS-only).

- [ ] **Step 1: Add the scanline flicker keyframes**

Append to the `@layer utilities { ... }` block in `app/src/index.css` (add these two rules inside the existing block, alongside `.chamfer`/`.hud-panel`):

```css
  @keyframes scanline-flicker {
    0%, 100% { opacity: 0.06; }
    50% { opacity: 0.03; }
  }
  .animate-scanline {
    animation: scanline-flicker 4s ease-in-out infinite;
  }
```

- [ ] **Step 2: Write the failing tests**

Create `app/src/components/ScanlineOverlay.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { ScanlineOverlay } from './ScanlineOverlay'
import * as motionPrefs from '../lib/motion-prefs'

afterEach(() => vi.restoreAllMocks())

describe('ScanlineOverlay', () => {
  it('applies the animate-scanline class when motion is allowed', () => {
    vi.spyOn(motionPrefs, 'useMotionPrefs').mockReturnValue({ reducedMotion: false, finePointer: true })
    const { container } = render(<ScanlineOverlay />)
    expect(container.firstChild).toHaveClass('animate-scanline')
  })

  it('omits the animation class when reducedMotion is true', () => {
    vi.spyOn(motionPrefs, 'useMotionPrefs').mockReturnValue({ reducedMotion: true, finePointer: true })
    const { container } = render(<ScanlineOverlay />)
    expect(container.firstChild).not.toHaveClass('animate-scanline')
  })
})
```

- [ ] **Step 3: Run it, confirm it fails**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/components/ScanlineOverlay.test.tsx
```

- [ ] **Step 4: Implement the component**

Create `app/src/components/ScanlineOverlay.tsx`:

```tsx
import { useMotionPrefs } from '../lib/motion-prefs'

export function ScanlineOverlay() {
  const { reducedMotion } = useMotionPrefs()
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[1] opacity-[0.06] ${reducedMotion ? '' : 'animate-scanline'}`}
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 3px)',
      }}
      aria-hidden="true"
    />
  )
}
```

- [ ] **Step 5: Run it, confirm it passes**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/components/ScanlineOverlay.test.tsx
```

Expected: PASS, 2/2.

- [ ] **Step 6: Run the full suite and build**

```bash
cd /Users/kimmiso/portfolio/app
npm test && npm run build
```

---

### Task 9: `NetworkBackground` (ported Three.js hero background) + Hero layout

**Files:**
- Create: `app/src/lib/network-geometry.ts`
- Test: `app/src/lib/network-geometry.test.ts`
- Create: `app/src/sections/NetworkBackground.tsx`
- Create: `app/src/assets/mascot.png` (extracted, not hand-written)
- Create: `app/src/sections/Hero.tsx`
- Test: `app/src/sections/Hero.test.tsx`

**Interfaces:**
- Produces: `generateNetwork(n, radius, maxEdgeDistance?, neighbors?): { points: THREE.Vector3[]; edges: [number, number][] }`, the `NetworkBackground` component, `app/src/assets/mascot.png`, and the `Hero` component (layout only — scramble headline/parallax/magnetic buttons are added in Task 10). Consumed by Task 10 (extends `Hero.tsx`) and Task 15 (App assembly).
- Consumes: nothing new for the geometry function. `NetworkBackground` is self-contained (no `useMotionPrefs` dependency injected — it reads `prefers-reduced-motion`/`max-width:640px` directly via `matchMedia`, matching the original vanilla script exactly).

- [ ] **Step 1: Install three.js**

```bash
cd /Users/kimmiso/portfolio/app
npm install three
npm install -D @types/three
```

- [ ] **Step 2: Write the failing geometry tests**

Create `app/src/lib/network-geometry.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { generateNetwork } from './network-geometry'

describe('generateNetwork', () => {
  it('generates the requested number of points', () => {
    const { points } = generateNetwork(20, 2.35)
    expect(points).toHaveLength(20)
  })

  it('only creates edges between distinct, in-range points', () => {
    const { points, edges } = generateNetwork(20, 2.35)
    expect(edges.length).toBeGreaterThan(0)
    for (const [a, b] of edges) {
      expect(a).not.toBe(b)
      expect(a).toBeGreaterThanOrEqual(0)
      expect(b).toBeLessThan(points.length)
    }
  })

  it('never duplicates the same edge twice', () => {
    const { edges } = generateNetwork(20, 2.35)
    const keys = edges.map(([a, b]) => `${a}_${b}`)
    expect(new Set(keys).size).toBe(keys.length)
  })
})
```

- [ ] **Step 3: Run it, confirm it fails**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/lib/network-geometry.test.ts
```

- [ ] **Step 4: Implement the pure geometry function**

Create `app/src/lib/network-geometry.ts`:

```ts
import * as THREE from 'three'

export interface NetworkGeometry {
  points: THREE.Vector3[]
  edges: [number, number][]
}

export function generateNetwork(
  n: number,
  radius: number,
  maxEdgeDistance = 1.5,
  neighbors = 3
): NetworkGeometry {
  const points: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const th = golden * i
    const jitter = 0.82 + Math.random() * 0.36
    points.push(
      new THREE.Vector3(Math.cos(th) * r * radius * jitter, y * radius * jitter, Math.sin(th) * r * radius * jitter)
    )
  }

  const edges: [number, number][] = []
  const seen = new Set<string>()
  for (let i = 0; i < n; i++) {
    const distances = points
      .map((p, j) => [j, points[i].distanceTo(p)] as [number, number])
      .filter(([j]) => j !== i)
      .sort((a, b) => a[1] - b[1])

    for (let m = 0; m < neighbors; m++) {
      const candidate = distances[m]
      if (!candidate) break
      const [j, dist] = candidate
      if (dist > maxEdgeDistance) continue
      const a = Math.min(i, j)
      const b = Math.max(i, j)
      const key = `${a}_${b}`
      if (seen.has(key)) continue
      seen.add(key)
      edges.push([a, b])
    }
  }

  return { points, edges }
}
```

- [ ] **Step 5: Run it, confirm it passes**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/lib/network-geometry.test.ts
```

Expected: PASS, 3/3.

- [ ] **Step 6: Implement `NetworkBackground`**

Create `app/src/sections/NetworkBackground.tsx`. This wraps the ported Three.js scene setup in a `useEffect` (mount: build scene; unmount: dispose). Wrapped in try/catch so a missing WebGL context (some headless/CI environments, and jsdom in tests) degrades to "no background" instead of crashing the page:

```tsx
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { generateNetwork } from '../lib/network-geometry'

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width:640px)').matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.11)

    const camera = new THREE.PerspectiveCamera(58, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 6.2)

    const group = new THREE.Group()
    scene.add(group)

    function makeDot(hex: string) {
      const c = document.createElement('canvas')
      c.width = c.height = 64
      const g = c.getContext('2d')!
      const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
      grd.addColorStop(0, hex)
      grd.addColorStop(0.35, hex)
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = grd
      g.beginPath()
      g.arc(32, 32, 32, 0, Math.PI * 2)
      g.fill()
      const t = new THREE.Texture(c)
      t.needsUpdate = true
      return t
    }
    const nodeTex = makeDot('#e0e0e0')
    const accentTex = makeDot('#00ff88')

    const N = isMobile ? 52 : 92
    const R = 2.35
    const { points: pts, edges } = generateNetwork(N, R)

    const npos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      npos[i * 3] = pts[i].x
      npos[i * 3 + 1] = pts[i].y
      npos[i * 3 + 2] = pts[i].z
    }
    const ng = new THREE.BufferGeometry()
    ng.setAttribute('position', new THREE.BufferAttribute(npos, 3))
    group.add(
      new THREE.Points(
        ng,
        new THREE.PointsMaterial({
          size: 0.13,
          map: nodeTex,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0.95,
          sizeAttenuation: true,
        })
      )
    )

    const epos = new Float32Array(edges.length * 2 * 3)
    edges.forEach(([a, b], i) => {
      const A = pts[a]
      const B = pts[b]
      epos[i * 6] = A.x
      epos[i * 6 + 1] = A.y
      epos[i * 6 + 2] = A.z
      epos[i * 6 + 3] = B.x
      epos[i * 6 + 4] = B.y
      epos[i * 6 + 5] = B.z
    })
    const eg = new THREE.BufferGeometry()
    eg.setAttribute('position', new THREE.BufferAttribute(epos, 3))
    group.add(
      new THREE.LineSegments(
        eg,
        new THREE.LineBasicMaterial({
          color: 0x00d4ff,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      )
    )

    const PK = reduce ? 0 : isMobile ? 7 : 12
    const packets = Array.from({ length: PK }, () => ({
      e: Math.floor(Math.random() * edges.length),
      t: Math.random(),
      s: 0.004 + Math.random() * 0.01,
    }))
    const ppos = new Float32Array(Math.max(PK, 1) * 3)
    const pg = new THREE.BufferGeometry()
    pg.setAttribute('position', new THREE.BufferAttribute(ppos, 3))
    const packetPts = new THREE.Points(
      pg,
      new THREE.PointsMaterial({
        size: 0.22,
        map: accentTex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.95,
        sizeAttenuation: true,
      })
    )
    if (PK > 0) group.add(packetPts)

    function updatePackets() {
      packets.forEach((pk, p) => {
        pk.t += pk.s
        if (pk.t >= 1) {
          pk.t = 0
          pk.e = Math.floor(Math.random() * edges.length)
          pk.s = 0.004 + Math.random() * 0.01
        }
        const e = edges[pk.e]
        const A = pts[e[0]]
        const B = pts[e[1]]
        ppos[p * 3] = A.x + (B.x - A.x) * pk.t
        ppos[p * 3 + 1] = A.y + (B.y - A.y) * pk.t
        ppos[p * 3 + 2] = A.z + (B.z - A.z) * pk.t
      })
      pg.attributes.position.needsUpdate = true
    }

    function resize() {
      const w = canvas!.clientWidth
      const h = canvas!.clientHeight
      if (canvas!.width !== w || canvas!.height !== h) {
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
    }
    window.addEventListener('resize', resize)

    let raf = 0
    function frame(t: number) {
      resize()
      if (!reduce) {
        group.rotation.y += 0.0016
        group.rotation.x = -0.15 + Math.sin(t * 0.0002) * 0.05
        updatePackets()
      }
      renderer.render(scene, camera)
      raf = requestAnimationFrame(frame)
    }
    resize()
    if (reduce) {
      updatePackets()
      renderer.render(scene, camera)
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      ng.dispose()
      eg.dispose()
      pg.dispose()
      nodeTex.dispose()
      accentTex.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-[1]" />
}
```

- [ ] **Step 7: Extract the mascot image from `portfolio.html`**

```bash
mkdir -p /Users/kimmiso/portfolio/app/src/assets
grep -o 'base64,[A-Za-z0-9+/=]*' /Users/kimmiso/portfolio/portfolio.html | sed 's/base64,//' | base64 -d > /Users/kimmiso/portfolio/app/src/assets/mascot.png
file /Users/kimmiso/portfolio/app/src/assets/mascot.png
```

Expected: `file` reports a valid PNG image (e.g. "PNG image data, ...").

- [ ] **Step 8: Write the failing Hero tests**

Create `app/src/sections/Hero.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('./NetworkBackground', () => ({ NetworkBackground: () => null }))

import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the CTA links to work and contact', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /view work/i })).toHaveAttribute('href', '#work')
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute('href', '#contact')
  })

  it('renders the mascot image', () => {
    render(<Hero />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
```

- [ ] **Step 9: Run it, confirm it fails**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/sections/Hero.test.tsx
```

- [ ] **Step 10: Implement the Hero layout**

Create `app/src/sections/Hero.tsx`:

```tsx
import mascot from '../assets/mascot.png'
import { NetworkBackground } from './NetworkBackground'

export function Hero() {
  return (
    <header id="hero" className="relative flex min-h-svh items-center overflow-hidden">
      <NetworkBackground />
      <div className="relative z-[3] mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1.25fr_0.75fr]">
        <div>
          <div className="mb-6 font-mono text-xs uppercase tracking-widest text-accent-3">
            Security Engineer · CS Senior
          </div>
          <h1 className="font-heading text-5xl font-black uppercase leading-[0.94] text-fg md:text-7xl">
            Your
            <br />
            <span className="text-accent">Name</span>
          </h1>
          <p className="mt-6 max-w-md font-mono text-sm text-fg/80">
            I break systems to learn how to defend them. Currently a CS senior turning curiosity about{' '}
            <span className="text-accent">how things fail</span> into a career in security.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="#work" className="hud-panel chamfer px-6 py-3 font-mono text-xs uppercase tracking-wider text-accent">
              View work
            </a>
            <a href="#contact" className="hud-panel chamfer px-6 py-3 font-mono text-xs uppercase tracking-wider text-fg">
              Get in touch
            </a>
          </div>
        </div>
        <div className="justify-self-center">
          <img src={mascot} alt="" className="w-full max-w-[220px]" />
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 11: Run it, confirm it passes**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/sections/Hero.test.tsx
```

Expected: PASS, 2/2.

- [ ] **Step 12: Run the full suite and build**

```bash
cd /Users/kimmiso/portfolio/app
npm test && npm run build
```

---

### Task 10: Hero interactions — scramble headline, parallax, magnetic buttons

**Files:**
- Create: `app/src/lib/hero-motion.ts`
- Test: `app/src/lib/hero-motion.test.ts`
- Modify: `app/src/sections/Hero.tsx`
- Modify: `app/src/sections/Hero.test.tsx`

**Interfaces:**
- Produces: `heroParallaxProgress`, `heroParallaxStyle`, `magneticOffset` (`src/lib/hero-motion.ts`). Extends `Hero` (from Task 9) with the scramble headline, scroll parallax, and magnetic buttons.
- Consumes: `useMotionPrefs` (Task 3), `useScrambleText` (Task 5), the `Hero` component (Task 9).
- Gating: scramble headline — `reducedMotion` only. Parallax — `reducedMotion` only. Magnetic buttons — `!reducedMotion && finePointer` (matches the original vanilla-JS pass exactly).

- [ ] **Step 1: Write the failing pure-function tests**

Create `app/src/lib/hero-motion.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { heroParallaxProgress, heroParallaxStyle, magneticOffset } from './hero-motion'

describe('heroParallaxProgress', () => {
  it('is 0 at the top', () => {
    expect(heroParallaxProgress(0, 800)).toBe(0)
  })
  it('is clamped to 1 past the hero height', () => {
    expect(heroParallaxProgress(2000, 800)).toBe(1)
  })
  it('returns 0 when heroHeight is 0 (guards divide-by-zero)', () => {
    expect(heroParallaxProgress(100, 0)).toBe(0)
  })
})

describe('heroParallaxStyle', () => {
  it('is fully opaque and unscaled at progress 0', () => {
    expect(heroParallaxStyle(0)).toEqual({ opacity: 1, scale: 1 })
  })
  it('fades and shrinks slightly at progress 1', () => {
    expect(heroParallaxStyle(1)).toEqual({ opacity: 0, scale: 0.96 })
  })
})

describe('magneticOffset', () => {
  it('is zero when the pointer is exactly at the center', () => {
    expect(magneticOffset(50, 50, 50, 50)).toEqual({ x: 0, y: 0 })
  })
  it('scales the offset by the strength factor', () => {
    expect(magneticOffset(150, 50, 50, 50, 0.5)).toEqual({ x: 50, y: 0 })
  })
})
```

- [ ] **Step 2: Run it, confirm it fails**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/lib/hero-motion.test.ts
```

- [ ] **Step 3: Implement the pure functions**

Create `app/src/lib/hero-motion.ts`:

```ts
export function heroParallaxProgress(scrollY: number, heroHeight: number): number {
  if (heroHeight <= 0) return 0
  return Math.min(Math.max(scrollY / heroHeight, 0), 1)
}

export function heroParallaxStyle(progress: number): { opacity: number; scale: number } {
  return { opacity: 1 - progress, scale: 1 - progress * 0.04 }
}

export function magneticOffset(
  pointerX: number,
  pointerY: number,
  centerX: number,
  centerY: number,
  strength = 0.35
): { x: number; y: number } {
  return { x: (pointerX - centerX) * strength, y: (pointerY - centerY) * strength }
}
```

- [ ] **Step 4: Run it, confirm it passes**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/lib/hero-motion.test.ts
```

Expected: PASS, 7/7.

- [ ] **Step 5: Update the Hero component test for the new behavior**

Replace the full contents of `app/src/sections/Hero.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { vi } from 'vitest'
vi.mock('./NetworkBackground', () => ({ NetworkBackground: () => null }))

import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the CTA links to work and contact', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /view work/i })).toHaveAttribute('href', '#work')
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute('href', '#contact')
  })

  it('renders the mascot image', () => {
    render(<Hero />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('renders the headline text (scrambled or resolved) inside the h1', () => {
    render(<Hero />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toContain('Your')
  })
})
```

(The third test only checks the static "Your" line, not the scrambled "Name" span, since its exact characters vary mid-animation — the scramble hook's own correctness is already covered by Task 5's tests.)

- [ ] **Step 6: Run it, confirm the new test passes and the others still do (no implementation change yet needed for this step — it should already pass against Task 9's Hero)**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/sections/Hero.test.tsx
```

Expected: PASS, 3/3.

- [ ] **Step 7: Add scramble headline, parallax, and magnetic buttons to Hero**

Replace the full contents of `app/src/sections/Hero.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react'
import mascot from '../assets/mascot.png'
import { NetworkBackground } from './NetworkBackground'
import { useMotionPrefs } from '../lib/motion-prefs'
import { useScrambleText } from '../lib/use-scramble-text'
import { heroParallaxProgress, heroParallaxStyle, magneticOffset } from '../lib/hero-motion'

function MagneticLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  const { reducedMotion, finePointer } = useMotionPrefs()
  const ref = useRef<HTMLAnchorElement>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  if (reducedMotion || !finePointer) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      onPointerEnter={() => {
        rectRef.current = ref.current?.getBoundingClientRect() ?? null
      }}
      onPointerMove={(e) => {
        if (!rectRef.current) rectRef.current = ref.current?.getBoundingClientRect() ?? null
        const rect = rectRef.current
        if (!rect) return
        setOffset(magneticOffset(e.clientX, e.clientY, rect.left + rect.width / 2, rect.top + rect.height / 2))
      }}
      onPointerLeave={() => {
        setOffset({ x: 0, y: 0 })
        rectRef.current = null
      }}
    >
      {children}
    </a>
  )
}

export function Hero() {
  const { reducedMotion } = useMotionPrefs()
  const name = useScrambleText('Name', reducedMotion)
  const heroRef = useRef<HTMLElement>(null)
  const [style, setStyle] = useState({ opacity: 1, scale: 1 })

  useEffect(() => {
    if (reducedMotion) return
    function onScroll() {
      const h = heroRef.current?.offsetHeight ?? 0
      setStyle(heroParallaxStyle(heroParallaxProgress(window.scrollY, h)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [reducedMotion])

  return (
    <header id="hero" ref={heroRef} className="relative flex min-h-svh items-center overflow-hidden">
      <NetworkBackground />
      <div
        className="relative z-[3] mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1.25fr_0.75fr]"
        style={{ opacity: style.opacity, transform: `scale(${style.scale})` }}
      >
        <div>
          <div className="mb-6 font-mono text-xs uppercase tracking-widest text-accent-3">
            Security Engineer · CS Senior
          </div>
          <h1 className="font-heading text-5xl font-black uppercase leading-[0.94] text-fg md:text-7xl">
            Your
            <br />
            <span className="text-accent">{name}</span>
          </h1>
          <p className="mt-6 max-w-md font-mono text-sm text-fg/80">
            I break systems to learn how to defend them. Currently a CS senior turning curiosity about{' '}
            <span className="text-accent">how things fail</span> into a career in security.
          </p>
          <div className="mt-8 flex gap-4">
            <MagneticLink href="#work" className="hud-panel chamfer px-6 py-3 font-mono text-xs uppercase tracking-wider text-accent">
              View work
            </MagneticLink>
            <MagneticLink href="#contact" className="hud-panel chamfer px-6 py-3 font-mono text-xs uppercase tracking-wider text-fg">
              Get in touch
            </MagneticLink>
          </div>
        </div>
        <div className="justify-self-center">
          <img src={mascot} alt="" className="w-full max-w-[220px]" />
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 8: Run the Hero tests, confirm they still pass**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/sections/Hero.test.tsx
```

Expected: PASS, 3/3.

- [ ] **Step 9: Run the full suite and build**

```bash
cd /Users/kimmiso/portfolio/app
npm test && npm run build
```

---

### Task 11: `About` section

**Files:**
- Create: `app/src/sections/About.tsx`
- Test: `app/src/sections/About.test.tsx`

**Interfaces:**
- Produces: the `About` component. Consumed by Task 15 (App assembly).
- Consumes: the `.hud-panel`/`.chamfer` utilities (Task 2).
- Gating: none — purely static markup, no motion.

- [ ] **Step 1: Write the failing test**

Create `app/src/sections/About.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { About } from './About'

describe('About', () => {
  it('renders the three stat blocks', () => {
    render(<About />)
    expect(screen.getByText('12+')).toBeInTheDocument()
    expect(screen.getByText('CTFs played')).toBeInTheDocument()
    expect(screen.getByText("'26")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it, confirm it fails**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/sections/About.test.tsx
```

- [ ] **Step 3: Implement the component**

Create `app/src/sections/About.tsx`:

```tsx
const STATS = [
  { n: '12+', l: 'CTFs played' },
  { n: '3', l: 'Tools shipped' },
  { n: "'26", l: 'Graduating' },
]

export function About() {
  return (
    <section id="about" className="border-t border-border px-6 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
        <h2 className="font-heading text-3xl font-bold uppercase text-fg">
          Defense starts with
          <br />
          understanding the attack.
        </h2>
        <div>
          <p className="text-fg/70">
            I'm a fourth-year computer science student aiming to work in security. My interest sits where{' '}
            <b className="text-fg">systems break</b>: memory bugs, weak protocols, misconfigurations, and the human
            assumptions behind them.
          </p>
          <div className="mt-8 flex gap-6">
            {STATS.map((s) => (
              <div key={s.l} className="hud-panel chamfer px-5 py-4">
                <div className="font-heading text-3xl font-bold text-accent">{s.n}</div>
                <div className="mt-1 font-mono text-[0.66rem] uppercase tracking-wider text-fg/60">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run it, confirm it passes**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/sections/About.test.tsx
```

Expected: PASS, 1/1.

- [ ] **Step 5: Run the full suite and build**

```bash
cd /Users/kimmiso/portfolio/app
npm test && npm run build
```

---

### Task 12: `Focus` section — bento grid, chamfered cards, cursor spotlight

**Files:**
- Create: `app/src/lib/spotlight.ts`
- Test: `app/src/lib/spotlight.test.ts`
- Create: `app/src/sections/Focus.tsx`
- Test: `app/src/sections/Focus.test.tsx`

**Interfaces:**
- Produces: `spotlightPosition(pointerX, pointerY, rect): { sx: string; sy: string }` (`src/lib/spotlight.ts`) and the `Focus` component. Consumed by Task 15 (App assembly); the spotlight function is reused by Task 13 (Work).
- Consumes: `useMotionPrefs` (Task 3, `finePointer` only — matches the original, which did not gate the spotlight on `reducedMotion`).
- Gating: spotlight tracking — `finePointer` only.

- [ ] **Step 1: Write the failing tests**

Create `app/src/lib/spotlight.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { spotlightPosition } from './spotlight'

describe('spotlightPosition', () => {
  it('returns 50%/50% for the center of the rect', () => {
    const rect = { left: 0, top: 0, width: 100, height: 100 } as DOMRect
    expect(spotlightPosition(50, 50, rect)).toEqual({ sx: '50%', sy: '50%' })
  })
  it('returns 0%/0% for the top-left corner', () => {
    const rect = { left: 10, top: 10, width: 100, height: 100 } as DOMRect
    expect(spotlightPosition(10, 10, rect)).toEqual({ sx: '0%', sy: '0%' })
  })
})
```

- [ ] **Step 2: Run it, confirm it fails, then implement**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/lib/spotlight.test.ts
```

Create `app/src/lib/spotlight.ts`:

```ts
export function spotlightPosition(
  pointerX: number,
  pointerY: number,
  rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>
): { sx: string; sy: string } {
  const sx = ((pointerX - rect.left) / rect.width) * 100
  const sy = ((pointerY - rect.top) / rect.height) * 100
  return { sx: `${sx}%`, sy: `${sy}%` }
}
```

Run again — expect PASS, 2/2.

- [ ] **Step 3: Write the failing Focus test**

Create `app/src/sections/Focus.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Focus } from './Focus'

describe('Focus', () => {
  it('renders all four focus cards', () => {
    render(<Focus />)
    expect(screen.getByText('Offensive Security')).toBeInTheDocument()
    expect(screen.getByText('Network Security')).toBeInTheDocument()
    expect(screen.getByText('Reverse Engineering')).toBeInTheDocument()
    expect(screen.getByText('Applied Cryptography')).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Run it, confirm it fails**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/sections/Focus.test.tsx
```

- [ ] **Step 5: Implement the component**

Create `app/src/sections/Focus.tsx`:

```tsx
import { useRef, useState } from 'react'
import { useMotionPrefs } from '../lib/motion-prefs'
import { spotlightPosition } from '../lib/spotlight'

const CARDS = [
  { id: '01', title: 'Offensive Security', desc: 'Web & binary exploitation, CTF challenges, and thinking like an attacker.', span: 'md:col-span-2 md:row-span-2' },
  { id: '02', title: 'Network Security', desc: 'Protocol analysis, traffic inspection, and understanding how data moves.', span: 'md:col-span-2' },
  { id: '03', title: 'Reverse Engineering', desc: 'Pulling apart binaries to understand behavior.', span: '' },
  { id: '04', title: 'Applied Cryptography', desc: 'How ciphers are used and misused in the real world.', span: '' },
]

function FocusCard({ card }: { card: (typeof CARDS)[number] }) {
  const { finePointer } = useMotionPrefs()
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ sx: '50%', sy: '50%' })

  return (
    <div
      ref={ref}
      className={`hud-panel chamfer relative overflow-hidden p-8 ${card.span}`}
      style={
        {
          '--sx': pos.sx,
          '--sy': pos.sy,
          backgroundImage: finePointer
            ? 'radial-gradient(320px circle at var(--sx) var(--sy), rgba(0,255,136,.16), rgba(255,0,255,.08) 40%, transparent 70%)'
            : undefined,
        } as React.CSSProperties
      }
      onPointerMove={(e) => {
        if (!finePointer || !ref.current) return
        setPos(spotlightPosition(e.clientX, e.clientY, ref.current.getBoundingClientRect()))
      }}
    >
      <div className="font-mono text-xs text-accent-3">{card.id}</div>
      <h3 className="mt-4 font-heading text-xl font-bold uppercase text-fg">{card.title}</h3>
      <p className="mt-3 text-sm text-fg/60">{card.desc}</p>
    </div>
  )
}

export function Focus() {
  return (
    <section id="focus" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-11 font-mono text-xs uppercase tracking-widest text-accent-3">// focus areas</div>
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-4 md:auto-rows-[190px]">
          {CARDS.map((card) => (
            <FocusCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Run it, confirm it passes**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/sections/Focus.test.tsx
```

Expected: PASS, 1/1.

- [ ] **Step 7: Run the full suite and build**

```bash
cd /Users/kimmiso/portfolio/app
npm test && npm run build
```

---

### Task 13: `Work` section — responsive card grid with 3D tilt

**Files:**
- Create: `app/src/lib/tilt.ts`
- Test: `app/src/lib/tilt.test.ts`
- Create: `app/src/sections/Work.tsx`
- Test: `app/src/sections/Work.test.tsx`

**Interfaces:**
- Produces: `tiltRotation(pointerX, pointerY, rect, maxDeg?): { rotateX: number; rotateY: number }` (`src/lib/tilt.ts`) and the `Work` component. Consumed by Task 15 (App assembly).
- Consumes: `useMotionPrefs` (Task 3, both `reducedMotion` and `finePointer`), `spotlightPosition` (Task 12, reused for the same card-spotlight treatment as Focus).
- Gating: tilt — `!reducedMotion && finePointer`. Spotlight — `finePointer` only (same rule as Task 12).

- [ ] **Step 1: Write the failing tilt tests**

Create `app/src/lib/tilt.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { tiltRotation } from './tilt'

describe('tiltRotation', () => {
  it('is zero at the exact center of the rect', () => {
    const rect = { left: 0, top: 0, width: 100, height: 100 } as DOMRect
    expect(tiltRotation(50, 50, rect)).toEqual({ rotateX: 0, rotateY: 0 })
  })
  it('tilts toward the pointer, clamped to maxDeg', () => {
    const rect = { left: 0, top: 0, width: 100, height: 100 } as DOMRect
    const { rotateX, rotateY } = tiltRotation(100, 0, rect, 6)
    expect(rotateY).toBe(6)
    expect(rotateX).toBe(6)
  })
})
```

- [ ] **Step 2: Run it, confirm it fails, then implement**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/lib/tilt.test.ts
```

Create `app/src/lib/tilt.ts`:

```ts
export function tiltRotation(
  pointerX: number,
  pointerY: number,
  rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>,
  maxDeg = 6
): { rotateX: number; rotateY: number } {
  const px = (pointerX - rect.left) / rect.width - 0.5
  const py = (pointerY - rect.top) / rect.height - 0.5
  return { rotateX: -py * maxDeg * 2, rotateY: px * maxDeg * 2 }
}
```

Run again — expect PASS, 2/2. (At `px = 0.5, py = -0.5`: `rotateY = 0.5 * 6 * 2 = 6`, `rotateX = 0.5 * 6 * 2 = 6`, matching the test's clamped-looking values by construction — `maxDeg` is the value reached at the rect's edge, not a post-hoc clamp.)

- [ ] **Step 3: Write the failing Work test**

Create `app/src/sections/Work.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Work } from './Work'

describe('Work', () => {
  it('renders all three work items as links', () => {
    render(<Work />)
    expect(screen.getByRole('link', { name: /Project Title One/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /CTF Writeup Series/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Capstone \/ Thesis Project/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Run it, confirm it fails**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/sections/Work.test.tsx
```

- [ ] **Step 5: Implement the component**

Create `app/src/sections/Work.tsx`:

```tsx
import { useRef, useState } from 'react'
import { useMotionPrefs } from '../lib/motion-prefs'
import { spotlightPosition } from '../lib/spotlight'
import { tiltRotation } from '../lib/tilt'

const ITEMS = [
  { idx: '001', title: 'Project Title One', desc: 'One line on what it does and the security problem it solves.' },
  { idx: '002', title: 'CTF Writeup Series', desc: 'A collection of challenge solutions with clear explanations.' },
  { idx: '003', title: 'Capstone / Thesis Project', desc: 'Your final-year project — what you built and why it matters.' },
]

function WorkCard({ item }: { item: (typeof ITEMS)[number] }) {
  const { reducedMotion, finePointer } = useMotionPrefs()
  const ref = useRef<HTMLAnchorElement>(null)
  const [pos, setPos] = useState({ sx: '50%', sy: '50%' })
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })

  return (
    <a
      ref={ref}
      href="#"
      className="hud-panel chamfer relative flex flex-col gap-3.5 overflow-hidden p-7"
      style={
        {
          '--sx': pos.sx,
          '--sy': pos.sy,
          backgroundImage: finePointer
            ? 'radial-gradient(320px circle at var(--sx) var(--sy), rgba(0,255,136,.16), rgba(255,0,255,.08) 40%, transparent 70%)'
            : undefined,
          transform:
            !reducedMotion && finePointer
              ? `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
              : undefined,
        } as React.CSSProperties
      }
      onPointerMove={(e) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        if (finePointer) setPos(spotlightPosition(e.clientX, e.clientY, rect))
        if (!reducedMotion && finePointer) setTilt(tiltRotation(e.clientX, e.clientY, rect))
      }}
      onPointerLeave={() => setTilt({ rotateX: 0, rotateY: 0 })}
    >
      <div className="font-mono text-xs text-accent-3">{item.idx}</div>
      <h3 className="font-heading text-2xl font-bold uppercase text-fg">{item.title}</h3>
      <div className="text-sm text-fg/60">{item.desc}</div>
    </a>
  )
}

export function Work() {
  return (
    <section id="work" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-11 font-mono text-xs uppercase tracking-widest text-accent-3">// selected work</div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {ITEMS.map((item) => (
            <WorkCard key={item.idx} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Run it, confirm it passes**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/sections/Work.test.tsx
```

Expected: PASS, 1/1.

- [ ] **Step 7: Run the full suite and build**

```bash
cd /Users/kimmiso/portfolio/app
npm test && npm run build
```

---

### Task 14: `Contact` section

**Files:**
- Create: `app/src/sections/Contact.tsx`
- Test: `app/src/sections/Contact.test.tsx`

**Interfaces:**
- Produces: the `Contact` component. Consumed by Task 15 (App assembly).
- Consumes: nothing new.
- Gating: none — purely static markup.

- [ ] **Step 1: Write the failing test**

Create `app/src/sections/Contact.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Contact } from './Contact'

describe('Contact', () => {
  it('renders the email and CV links', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: 'you@example.com' })).toHaveAttribute('href', 'mailto:you@example.com')
    expect(screen.getByRole('link', { name: 'Download CV' })).toBeInTheDocument()
  })

  it('renders the social links', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it, confirm it fails**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/sections/Contact.test.tsx
```

- [ ] **Step 3: Implement the component**

Create `app/src/sections/Contact.tsx`:

```tsx
export function Contact() {
  return (
    <section id="contact" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-11 font-mono text-xs uppercase tracking-widest text-accent-3">// contact</div>
        <div className="font-heading text-4xl font-bold uppercase leading-none text-fg md:text-6xl">
          Let's build
          <br />
          something <span className="text-accent">secure</span>.
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="mailto:you@example.com" className="hud-panel chamfer px-6 py-3 font-mono text-xs uppercase tracking-wider text-accent">
            you@example.com
          </a>
          <a href="#" className="hud-panel chamfer px-6 py-3 font-mono text-xs uppercase tracking-wider text-fg">
            Download CV
          </a>
        </div>
        <div className="mt-11 flex flex-wrap gap-8">
          <a href="#" className="font-mono text-xs uppercase tracking-wider text-fg/60 hover:text-accent">
            GitHub
          </a>
          <a href="#" className="font-mono text-xs uppercase tracking-wider text-fg/60 hover:text-accent">
            LinkedIn
          </a>
          <a href="#" className="font-mono text-xs uppercase tracking-wider text-fg/60 hover:text-accent">
            Blog
          </a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run it, confirm it passes**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/sections/Contact.test.tsx
```

Expected: PASS, 2/2.

- [ ] **Step 5: Run the full suite and build**

```bash
cd /Users/kimmiso/portfolio/app
npm test && npm run build
```

---

### Task 15: App assembly

**Files:**
- Modify: `app/src/App.tsx`
- Modify: `app/src/App.test.tsx`

**Interfaces:**
- Consumes: `Nav` (Task 6), `CustomCursor` (Task 7), `ScanlineOverlay` (Task 8), `Hero` (Tasks 9–10), `About` (Task 11), `Focus` (Task 12), `Work` (Task 13), `Contact` (Task 14).
- Produces: nothing further (last task).

- [ ] **Step 1: Update the App test for the full page**

Replace the full contents of `app/src/App.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('./sections/NetworkBackground', () => ({ NetworkBackground: () => null }))

import App from './App'

describe('App', () => {
  it('renders every section', () => {
    render(<App />)
    expect(document.getElementById('hero')).toBeInTheDocument()
    expect(document.getElementById('about')).toBeInTheDocument()
    expect(document.getElementById('focus')).toBeInTheDocument()
    expect(document.getElementById('work')).toBeInTheDocument()
    expect(document.getElementById('contact')).toBeInTheDocument()
  })

  it('renders the nav links', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it, confirm it fails**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/App.test.tsx
```

Expected: FAIL — `App` doesn't render these sections yet.

- [ ] **Step 3: Assemble the app**

Replace the full contents of `app/src/App.tsx`:

```tsx
import { Nav } from './components/Nav'
import { CustomCursor } from './components/CustomCursor'
import { ScanlineOverlay } from './components/ScanlineOverlay'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Focus } from './sections/Focus'
import { Work } from './sections/Work'
import { Contact } from './sections/Contact'

function App() {
  return (
    <>
      <ScanlineOverlay />
      <CustomCursor />
      <Nav />
      <Hero />
      <About />
      <Focus />
      <Work />
      <Contact />
      <footer className="flex flex-wrap justify-between gap-4 border-t border-border px-6 py-6">
        <span className="font-mono text-[0.66rem] uppercase tracking-wider text-fg/50">build_0x1a · 2026</span>
        <span className="font-mono text-[0.66rem] uppercase tracking-wider text-fg/50">designed &amp; coded by you</span>
      </footer>
    </>
  )
}

export default App
```

- [ ] **Step 4: Run it, confirm it passes**

```bash
cd /Users/kimmiso/portfolio/app
npx vitest run src/App.test.tsx
```

Expected: PASS, 2/2.

- [ ] **Step 5: Run the full test suite and build**

```bash
cd /Users/kimmiso/portfolio/app
npm test
npm run build
```

Expected: every test file passes, build succeeds with no TypeScript errors.

- [ ] **Step 6: Start the dev server for a final smoke check**

```bash
cd /Users/kimmiso/portfolio/app
npm run dev -- --port 5173 &
sleep 2
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173
```

Expected: `200`.

---

## Final manual browser pass (not automatable by implementer/reviewer subagents)

No browser tool is available to implementer or reviewer subagents in this environment — every task above is verified via `npm test` (Vitest/jsdom) and `npm run build` (TypeScript + bundling), which catch logic bugs, type errors, and rendering crashes, but not visual/interaction correctness. Before considering this done, the user should run `cd app && npm run dev`, open the printed local URL, and check:

- Nav condenses into a chamfered HUD pill after scrolling ~60% of the viewport height, with a green progress line and scrollspy highlighting.
- Custom cursor (dot + ring) tracks the pointer with no corner-flash on load; disappears on touch devices / with `prefers-reduced-motion` enabled.
- Scanline overlay is faintly visible and stops animating under `prefers-reduced-motion`.
- Hero headline scrambles into "Your/Name" on load, mascot image renders, hero copy fades/scales slightly on scroll, CTA buttons pull toward the cursor.
- Focus section renders as a bento grid with a spotlight glow tracking the cursor on each card.
- Work section renders as a responsive card grid with 3D tilt tracking the cursor, spotlight glow, and correct layout at 375px/768px/1024px/1440px widths.
- Everything above degrades correctly with `prefers-reduced-motion: reduce` emulated and on a touch-device emulation in DevTools.
