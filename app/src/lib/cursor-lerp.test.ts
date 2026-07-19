import { describe, it, expect } from 'vitest'
import { lerp } from './cursor-lerp'

describe('lerp', () => {
  it('moves partway from current toward target by the given factor', () => {
    expect(lerp(0, 100, 0.5)).toBe(50)
  })
  it('returns current unchanged when factor is 0', () => {
    expect(lerp(10, 100, 0)).toBe(10)
  })
})
