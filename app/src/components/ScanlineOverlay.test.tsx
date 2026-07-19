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
