import { describe, it, expect } from 'vitest'
import { generateNetwork } from './network-geometry'

describe('generateNetwork', () => {
  it('generates the requested number of points', () => {
    const { points } = generateNetwork(20, 2.35)
    expect(points).toHaveLength(20)
  })

  it('only creates edges between distinct, in-range points', () => {
    const { points, edges } = generateNetwork(20, 2.35)
    expect(edges.length).toBeGreaterThan(0)
    for (const [a, b] of edges) {
      expect(a).not.toBe(b)
      expect(a).toBeGreaterThanOrEqual(0)
      expect(b).toBeLessThan(points.length)
    }
  })

  it('never duplicates the same edge twice', () => {
    const { edges } = generateNetwork(20, 2.35)
    const keys = edges.map(([a, b]) => `${a}_${b}`)
    expect(new Set(keys).size).toBe(keys.length)
  })
})
