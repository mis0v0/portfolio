import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('./sections/NetworkBackground', () => ({ NetworkBackground: () => null }))

import App from './App'
import * as motionPrefs from './lib/motion-prefs'

// App composes every section, several of which (Hero, Focus, Work, CustomCursor,
// CustomCursor) consume useMotionPrefs, which reads window.matchMedia. jsdom in
// this project does not implement matchMedia, so it must be mocked here the same
// way every other component test that consumes useMotionPrefs mocks it (see
// Hero.test.tsx, Focus.test.tsx, Work.test.tsx) — otherwise render() throws.
beforeEach(() => {
  vi.spyOn(motionPrefs, 'useMotionPrefs').mockReturnValue({ reducedMotion: false, finePointer: true })
})

afterEach(() => {
  vi.restoreAllMocks()
})

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
