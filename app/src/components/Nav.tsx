import { useEffect, useState } from 'react'
import { isPillActive, computeScrollProgress, computeActiveSection } from '../lib/nav-logic'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#focus', label: 'Focus' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  const [pill, setPill] = useState(false)
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState('')

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setPill(isPillActive(y, window.innerHeight))
      setProgress(
        computeScrollProgress(y, document.documentElement.scrollHeight, document.documentElement.clientHeight)
      )
      const rects = LINKS.map((l) => {
        const el = document.querySelector(l.href)
        const rect = el?.getBoundingClientRect()
        return { id: l.href.slice(1), top: rect?.top ?? Infinity, bottom: rect?.bottom ?? Infinity }
      })
      setActive(computeActiveSection(rects))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex flex-col items-center px-6 py-4 motion-reduce:transition-none">
      <div
        className={
          pill
            ? 'hud-panel chamfer flex w-full max-w-xl items-center justify-between px-6 py-3 transition-all motion-reduce:transition-none'
            : 'flex w-full items-center justify-between transition-all motion-reduce:transition-none'
        }
      >
        <span className="font-mono text-xs text-fg">@yourhandle_sec</span>
        <div className="flex gap-6">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`font-mono text-xs uppercase tracking-wider ${
                active === l.href.slice(1) ? 'text-accent' : 'text-fg/60'
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
      {pill && (
        <div className="mt-1.5 h-0.5 w-full max-w-xl overflow-hidden bg-border">
          <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
        </div>
      )}
    </nav>
  )
}
