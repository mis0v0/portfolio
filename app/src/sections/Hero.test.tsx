import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('./NetworkBackground', () => ({ NetworkBackground: () => null }))

import { Hero } from './Hero'
import * as motionPrefs from '../lib/motion-prefs'

// Hero (via useScrambleText and the MagneticLink CTAs) now calls useMotionPrefs,
// which reads window.matchMedia. jsdom in this project does not implement
// matchMedia, so it must be mocked here the same way every other component
// that consumes useMotionPrefs mocks it (see CustomCursor.test.tsx,
// ScanlineOverlay.test.tsx) — otherwise render() throws.
beforeEach(() => {
  vi.spyOn(motionPrefs, 'useMotionPrefs').mockReturnValue({ reducedMotion: false, finePointer: true })
})

afterEach(() => {
  vi.restoreAllMocks()
})

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
