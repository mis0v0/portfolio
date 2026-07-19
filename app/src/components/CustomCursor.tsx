import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue } from 'motion/react'
import { useMotionPrefs } from '../lib/motion-prefs'
import { lerp } from '../lib/cursor-lerp'

export function CustomCursor() {
  const { reducedMotion, finePointer } = useMotionPrefs()
  const dotX = useMotionValue(0)
  const dotY = useMotionValue(0)
  const ringX = useMotionValue(0)
  const ringY = useMotionValue(0)
  const target = useRef({ x: 0, y: 0 })
  const started = useRef(false)
  const [hasMoved, setHasMoved] = useState(false)

  useEffect(() => {
    if (reducedMotion || !finePointer) return

    function onMove(e: PointerEvent) {
      target.current = { x: e.clientX, y: e.clientY }
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      if (!started.current) {
        started.current = true
        ringX.set(e.clientX)
        ringY.set(e.clientY)
        setHasMoved(true)
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let raf = 0
    function loop() {
      ringX.set(lerp(ringX.get(), target.current.x, 0.18))
      ringY.set(lerp(ringY.get(), target.current.y, 0.18))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [reducedMotion, finePointer, dotX, dotY, ringX, ringY])

  if (reducedMotion || !finePointer || !hasMoved) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        style={{ x: dotX, y: dotY }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[999] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-3"
        style={{ x: ringX, y: ringY }}
      />
    </>
  )
}
