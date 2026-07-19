import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Work } from './Work'
import * as motionPrefs from '../lib/motion-prefs'

// Work (via WorkCard) calls useMotionPrefs, which reads window.matchMedia.
// jsdom in this project does not implement matchMedia, so it must be mocked
// here the same way every other component that consumes useMotionPrefs mocks
// it (see CustomCursor.test.tsx, Hero.test.tsx,
// Focus.test.tsx) — otherwise render() throws.
beforeEach(() => {
  vi.spyOn(motionPrefs, 'useMotionPrefs').mockReturnValue({ reducedMotion: false, finePointer: true })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Work', () => {
  it('renders all three work items as links', () => {
    render(<Work />)
    expect(screen.getByRole('link', { name: /Project Title One/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /CTF Writeup Series/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Capstone \/ Thesis Project/i })).toBeInTheDocument()
  })
})
