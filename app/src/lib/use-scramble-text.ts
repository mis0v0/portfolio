import { useEffect, useState } from 'react'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%_/\\'

export function useScrambleText(text: string, reducedMotion: boolean, duration = 700): string {
  const [display, setDisplay] = useState(reducedMotion ? text : '')

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text)
      return
    }
    let raf = 0
    const start = performance.now()
    const len = text.length

    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1)
      const revealCount = Math.floor(p * len)
      let out = ''
      for (let i = 0; i < len; i++) {
        out +=
          i < revealCount || text[i] === ' '
            ? text[i]
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      }
      setDisplay(out)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, reducedMotion, duration])

  return display
}
