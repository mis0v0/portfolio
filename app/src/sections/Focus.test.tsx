import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Focus } from './Focus'
import * as motionPrefs from '../lib/motion-prefs'

// Focus (via FocusCard) calls useMotionPrefs, which reads window.matchMedia.
// jsdom in this project does not implement matchMedia, so it must be mocked
// here the same way every other component that consumes useMotionPrefs mocks
// it (see CustomCursor.test.tsx, Hero.test.tsx) —
// otherwise render() throws.
afterEach(() => vi.restoreAllMocks())

describe('Focus', () => {
  it('renders all four focus cards', () => {
    vi.spyOn(motionPrefs, 'useMotionPrefs').mockReturnValue({ reducedMotion: false, finePointer: true })
    render(<Focus />)
    expect(screen.getByText('Offensive Security')).toBeInTheDocument()
    expect(screen.getByText('Network Security')).toBeInTheDocument()
    expect(screen.getByText('Reverse Engineering')).toBeInTheDocument()
    expect(screen.getByText('Applied Cryptography')).toBeInTheDocument()
  })
})
