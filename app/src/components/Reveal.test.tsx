import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Reveal } from './Reveal'
import * as motionPrefs from '../lib/motion-prefs'

afterEach(() => vi.restoreAllMocks())

describe('Reveal', () => {
  it('renders its children', () => {
    vi.spyOn(motionPrefs, 'useMotionPrefs').mockReturnValue({ reducedMotion: false, finePointer: true })
    render(
      <Reveal>
        <p>Hello</p>
      </Reveal>
    )
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders a plain, unanimated wrapper when reducedMotion is true', () => {
    vi.spyOn(motionPrefs, 'useMotionPrefs').mockReturnValue({ reducedMotion: true, finePointer: true })
    const { container } = render(
      <Reveal className="test-class">
        <p>Hello</p>
      </Reveal>
    )
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('test-class')
    expect(container.querySelector('[style]')).not.toBeInTheDocument()
  })
})
