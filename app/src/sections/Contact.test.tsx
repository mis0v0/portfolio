import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Contact } from './Contact'
import * as motionPrefs from '../lib/motion-prefs'

// Contact renders <Reveal>, which calls useMotionPrefs() — otherwise render() throws.
beforeEach(() => {
  vi.spyOn(motionPrefs, 'useMotionPrefs').mockReturnValue({ reducedMotion: false, finePointer: true })
})
afterEach(() => vi.restoreAllMocks())

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
