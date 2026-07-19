import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { generateNetwork } from '../lib/network-geometry'

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width:640px)').matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.11)

    const camera = new THREE.PerspectiveCamera(58, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 6.2)

    const group = new THREE.Group()
    scene.add(group)

    function makeDot(hex: string) {
      const c = document.createElement('canvas')
      c.width = c.height = 64
      const g = c.getContext('2d')!
      const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
      grd.addColorStop(0, hex)
      grd.addColorStop(0.35, hex)
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = grd
      g.beginPath()
      g.arc(32, 32, 32, 0, Math.PI * 2)
      g.fill()
      const t = new THREE.Texture(c)
      t.needsUpdate = true
      return t
    }
    const nodeTex = makeDot('#e0e0e0')
    const accentTex = makeDot('#00ff88')

    const N = isMobile ? 52 : 92
    const R = 2.35
    const { points: pts, edges } = generateNetwork(N, R)

    const npos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      npos[i * 3] = pts[i].x
      npos[i * 3 + 1] = pts[i].y
      npos[i * 3 + 2] = pts[i].z
    }
    const ng = new THREE.BufferGeometry()
    ng.setAttribute('position', new THREE.BufferAttribute(npos, 3))
    group.add(
      new THREE.Points(
        ng,
        new THREE.PointsMaterial({
          size: 0.13,
          map: nodeTex,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0.95,
          sizeAttenuation: true,
        })
      )
    )

    const epos = new Float32Array(edges.length * 2 * 3)
    edges.forEach(([a, b], i) => {
      const A = pts[a]
      const B = pts[b]
      epos[i * 6] = A.x
      epos[i * 6 + 1] = A.y
      epos[i * 6 + 2] = A.z
      epos[i * 6 + 3] = B.x
      epos[i * 6 + 4] = B.y
      epos[i * 6 + 5] = B.z
    })
    const eg = new THREE.BufferGeometry()
    eg.setAttribute('position', new THREE.BufferAttribute(epos, 3))
    group.add(
      new THREE.LineSegments(
        eg,
        new THREE.LineBasicMaterial({
          color: 0x00d4ff,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      )
    )

    const PK = reduce ? 0 : isMobile ? 7 : 12
    const packets = Array.from({ length: PK }, () => ({
      e: Math.floor(Math.random() * edges.length),
      t: Math.random(),
      s: 0.004 + Math.random() * 0.01,
    }))
    const ppos = new Float32Array(Math.max(PK, 1) * 3)
    const pg = new THREE.BufferGeometry()
    pg.setAttribute('position', new THREE.BufferAttribute(ppos, 3))
    const packetPts = new THREE.Points(
      pg,
      new THREE.PointsMaterial({
        size: 0.22,
        map: accentTex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.95,
        sizeAttenuation: true,
      })
    )
    if (PK > 0) group.add(packetPts)

    function updatePackets() {
      packets.forEach((pk, p) => {
        pk.t += pk.s
        if (pk.t >= 1) {
          pk.t = 0
          pk.e = Math.floor(Math.random() * edges.length)
          pk.s = 0.004 + Math.random() * 0.01
        }
        const e = edges[pk.e]
        const A = pts[e[0]]
        const B = pts[e[1]]
        ppos[p * 3] = A.x + (B.x - A.x) * pk.t
        ppos[p * 3 + 1] = A.y + (B.y - A.y) * pk.t
        ppos[p * 3 + 2] = A.z + (B.z - A.z) * pk.t
      })
      pg.attributes.position.needsUpdate = true
    }

    function resize() {
      const w = canvas!.clientWidth
      const h = canvas!.clientHeight
      if (canvas!.width !== w || canvas!.height !== h) {
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
    }
    window.addEventListener('resize', resize)

    let raf = 0
    function frame(t: number) {
      resize()
      if (!reduce) {
        group.rotation.y += 0.0016
        group.rotation.x = -0.15 + Math.sin(t * 0.0002) * 0.05
        updatePackets()
      }
      renderer.render(scene, camera)
      raf = requestAnimationFrame(frame)
    }
    resize()
    if (reduce) {
      updatePackets()
      renderer.render(scene, camera)
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      ng.dispose()
      eg.dispose()
      pg.dispose()
      nodeTex.dispose()
      accentTex.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-[1]" />
}
