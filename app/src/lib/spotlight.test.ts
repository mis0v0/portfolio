import { describe, it, expect } from 'vitest'
import { spotlightPosition } from './spotlight'

describe('spotlightPosition', () => {
  it('returns 50%/50% for the center of the rect', () => {
    const rect = { left: 0, top: 0, width: 100, height: 100 } as DOMRect
    expect(spotlightPosition(50, 50, rect)).toEqual({ sx: '50%', sy: '50%' })
  })
  it('returns 0%/0% for the top-left corner', () => {
    const rect = { left: 10, top: 10, width: 100, height: 100 } as DOMRect
    expect(spotlightPosition(10, 10, rect)).toEqual({ sx: '0%', sy: '0%' })
  })
})
