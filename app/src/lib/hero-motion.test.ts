import { describe, it, expect } from 'vitest'
import { heroParallaxProgress, heroParallaxStyle, magneticOffset } from './hero-motion'

describe('heroParallaxProgress', () => {
  it('is 0 at the top', () => {
    expect(heroParallaxProgress(0, 800)).toBe(0)
  })
  it('is clamped to 1 past the hero height', () => {
    expect(heroParallaxProgress(2000, 800)).toBe(1)
  })
  it('returns 0 when heroHeight is 0 (guards divide-by-zero)', () => {
    expect(heroParallaxProgress(100, 0)).toBe(0)
  })
})

describe('heroParallaxStyle', () => {
  it('is fully opaque and unscaled at progress 0', () => {
    expect(heroParallaxStyle(0)).toEqual({ opacity: 1, scale: 1 })
  })
  it('fades and shrinks slightly at progress 1', () => {
    expect(heroParallaxStyle(1)).toEqual({ opacity: 0, scale: 0.96 })
  })
})

describe('magneticOffset', () => {
  it('is zero when the pointer is exactly at the center', () => {
    expect(magneticOffset(50, 50, 50, 50)).toEqual({ x: 0, y: 0 })
  })
  it('scales the offset by the strength factor', () => {
    expect(magneticOffset(150, 50, 50, 50, 0.5)).toEqual({ x: 50, y: 0 })
  })
})
