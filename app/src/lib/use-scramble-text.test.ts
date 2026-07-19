import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useScrambleText } from './use-scramble-text'

describe('useScrambleText', () => {
  it('returns the final text immediately when reducedMotion is true', () => {
    const { result } = renderHook(() => useScrambleText('Name', true))
    expect(result.current).toBe('Name')
  })

  it('resolves to the final text after the animation duration when reducedMotion is false', async () => {
    const { result } = renderHook(() => useScrambleText('Name', false, 10))
    await new Promise((resolve) => setTimeout(resolve, 60))
    expect(result.current).toBe('Name')
  })
})
