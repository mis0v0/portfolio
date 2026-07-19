import { describe, it, expect } from 'vitest'
import { tiltRotation } from './tilt'

describe('tiltRotation', () => {
  it('is zero at the exact center of the rect', () => {
    const rect = { left: 0, top: 0, width: 100, height: 100 } as DOMRect
    expect(tiltRotation(50, 50, rect)).toEqual({ rotateX: 0, rotateY: 0 })
  })
  it('tilts toward the pointer, clamped to maxDeg', () => {
    const rect = { left: 0, top: 0, width: 100, height: 100 } as DOMRect
    const { rotateX, rotateY } = tiltRotation(100, 0, rect, 6)
    expect(rotateY).toBe(6)
    expect(rotateX).toBe(6)
  })
})
