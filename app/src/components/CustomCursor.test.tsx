import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { act } from 'react'
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

  it('renders the dot and ring when motion is allowed and pointer has moved', async () => {
    vi.spyOn(motionPrefs, 'useMotionPrefs').mockReturnValue({ reducedMotion: false, finePointer: true })
    const { container } = render(<CustomCursor />)
    await act(async () => {
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 100, clientY: 100 }))
    })
    await waitFor(() => {
      expect(container.querySelectorAll('div')).toHaveLength(2)
    })
  })

  it('renders nothing before the first pointer move, even when motion is allowed', () => {
    vi.spyOn(motionPrefs, 'useMotionPrefs').mockReturnValue({ reducedMotion: false, finePointer: true })
    const { container } = render(<CustomCursor />)
    expect(container).toBeEmptyDOMElement()
  })
})
