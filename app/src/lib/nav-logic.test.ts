import { describe, it, expect } from 'vitest'
import { isPillActive, computeScrollProgress, computeActiveSection, isScrolledToBottom } from './nav-logic'

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
  it('returns an empty string for a short final section the page cannot scroll past', () => {
    // The last section on a page is often shorter than a full extra viewport
    // of scroll room below it — its top can never cross the threshold line,
    // even once the browser has scrolled as far as it possibly can.
    expect(computeActiveSection([{ id: 'contact', top: 400, bottom: 900 }])).toBe('')
  })
})

describe('isScrolledToBottom', () => {
  it('is false when there is still room to scroll', () => {
    expect(isScrolledToBottom(0, 800, 2000)).toBe(false)
  })
  it('is true once the viewport bottom reaches the document bottom', () => {
    expect(isScrolledToBottom(1200, 800, 2000)).toBe(true)
  })
  it('tolerates a small epsilon for sub-pixel scroll rounding', () => {
    expect(isScrolledToBottom(1199, 800, 2000)).toBe(true)
  })
})
