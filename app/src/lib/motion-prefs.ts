import { useEffect, useState } from 'react'

export interface MotionPrefs {
  reducedMotion: boolean
  finePointer: boolean
}

function readPrefs(): MotionPrefs {
  return {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    finePointer: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  }
}

export function useMotionPrefs(): MotionPrefs {
  const [prefs, setPrefs] = useState<MotionPrefs>(readPrefs)

  useEffect(() => {
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setPrefs(readPrefs())
    reducedQuery.addEventListener('change', update)
    pointerQuery.addEventListener('change', update)
    return () => {
      reducedQuery.removeEventListener('change', update)
      pointerQuery.removeEventListener('change', update)
    }
  }, [])

  return prefs
}
