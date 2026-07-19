import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { About } from './About'
import * as motionPrefs from '../lib/motion-prefs'

// About renders <Reveal>, which calls useMotionPrefs() (see CustomCursor.test.tsx
// for the established mock pattern) — otherwise render() throws.
beforeEach(() => {
  vi.spyOn(motionPrefs, 'useMotionPrefs').mockReturnValue({ reducedMotion: false, finePointer: true })
})
afterEach(() => vi.restoreAllMocks())

describe('About', () => {
  it('renders the three stat blocks', () => {
    render(<About />)
    expect(screen.getByText('12+')).toBeInTheDocument()
    expect(screen.getByText('CTFs played')).toBeInTheDocument()
    expect(screen.getByText("'26")).toBeInTheDocument()
  })
})
