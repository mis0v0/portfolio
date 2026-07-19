import { describe, it, expect } from 'vitest'
import { isPillActive, computeScrollProgress, computeActiveSection } from './nav-logic'

describe('isPillActive', () => {
  it('is false at the top of the page', () => {
    expect(isPillActive(0, 800)).toBe(false)
  })
  it('is true past 60% of viewport height', () => {
    expect(isPillActive(500, 800)).toBe(true)
  })
})

describe('computeScrollProgress', () => {
  it('returns 0 when there is nothing to scroll', () => {
    expect(computeScrollProgress(0, 800, 800)).toBe(0)
  })
  it('returns 50 at the halfway point', () => {
    expect(computeScrollProgress(100, 1000, 800)).toBe(50)
  })
})

describe('computeActiveSection', () => {
  it('picks the section whose bounds straddle the threshold', () => {
    const sections = [
      { id: 'about', top: -50, bottom: 300 },
      { id: 'focus', top: 300, bottom: 700 },
    ]
    expect(computeActiveSection(sections)).toBe('about')
  })
  it('returns an empty string when no section straddles the threshold', () => {
    expect(computeActiveSection([{ id: 'about', top: 500, bottom: 900 }])).toBe('')
  })
})
