import { useMotionPrefs } from '../lib/motion-prefs'

export function ScanlineOverlay() {
  const { reducedMotion } = useMotionPrefs()
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[1] opacity-[0.06] ${reducedMotion ? '' : 'animate-scanline'}`}
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 3px)',
      }}
      aria-hidden="true"
    />
  )
}
