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
