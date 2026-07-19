import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMotionPrefs } from './motion-prefs'

function mockMatchMedia(matches: Record<string, boolean>) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: matches[query] ?? false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useMotionPrefs', () => {
  it('reports reducedMotion true and finePointer false when those queries match', () => {
    mockMatchMedia({
      '(prefers-reduced-motion: reduce)': true,
      '(hover: hover) and (pointer: fine)': false,
    })
    const { result } = renderHook(() => useMotionPrefs())
    expect(result.current).toEqual({ reducedMotion: true, finePointer: false })
  })

  it('reports reducedMotion false and finePointer true for the opposite case', () => {
    mockMatchMedia({
      '(prefers-reduced-motion: reduce)': false,
      '(hover: hover) and (pointer: fine)': true,
    })
    const { result } = renderHook(() => useMotionPrefs())
    expect(result.current).toEqual({ reducedMotion: false, finePointer: true })
  })
})
