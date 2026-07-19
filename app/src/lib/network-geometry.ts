import * as THREE from 'three'

export interface NetworkGeometry {
  points: THREE.Vector3[]
  edges: [number, number][]
}

export function generateNetwork(
  n: number,
  radius: number,
  maxEdgeDistance = 1.5,
  neighbors = 3
): NetworkGeometry {
  const points: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const th = golden * i
    const jitter = 0.82 + Math.random() * 0.36
    points.push(
      new THREE.Vector3(Math.cos(th) * r * radius * jitter, y * radius * jitter, Math.sin(th) * r * radius * jitter)
    )
  }

  const edges: [number, number][] = []
  const seen = new Set<string>()
  for (let i = 0; i < n; i++) {
    const distances = points
      .map((p, j) => [j, points[i].distanceTo(p)] as [number, number])
      .filter(([j]) => j !== i)
      .sort((a, b) => a[1] - b[1])

    for (let m = 0; m < neighbors; m++) {
      const candidate = distances[m]
      if (!candidate) break
      const [j, dist] = candidate
      if (dist > maxEdgeDistance) continue
      const a = Math.min(i, j)
      const b = Math.max(i, j)
      const key = `${a}_${b}`
      if (seen.has(key)) continue
      seen.add(key)
      edges.push([a, b])
    }
  }

  return { points, edges }
}
