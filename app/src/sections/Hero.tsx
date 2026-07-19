import { useEffect, useRef, useState } from 'react'
import mascot from '../assets/mascot.png'
import { NetworkBackground } from './NetworkBackground'
import { useMotionPrefs } from '../lib/motion-prefs'
import { useScrambleText } from '../lib/use-scramble-text'
import { heroParallaxProgress, heroParallaxStyle, magneticOffset } from '../lib/hero-motion'

function MagneticLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  const { reducedMotion, finePointer } = useMotionPrefs()
  const ref = useRef<HTMLAnchorElement>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  if (reducedMotion || !finePointer) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      onPointerEnter={() => {
        rectRef.current = ref.current?.getBoundingClientRect() ?? null
      }}
      onPointerMove={(e) => {
        if (!rectRef.current) rectRef.current = ref.current?.getBoundingClientRect() ?? null
        const rect = rectRef.current
        if (!rect) return
        setOffset(magneticOffset(e.clientX, e.clientY, rect.left + rect.width / 2, rect.top + rect.height / 2))
      }}
      onPointerLeave={() => {
        setOffset({ x: 0, y: 0 })
        rectRef.current = null
      }}
    >
      {children}
    </a>
  )
}

export function Hero() {
  const { reducedMotion } = useMotionPrefs()
  const name = useScrambleText('Name', reducedMotion)
  const heroRef = useRef<HTMLElement>(null)
  const [style, setStyle] = useState({ opacity: 1, scale: 1 })

  useEffect(() => {
    if (reducedMotion) return
    function onScroll() {
      const h = heroRef.current?.offsetHeight ?? 0
      setStyle(heroParallaxStyle(heroParallaxProgress(window.scrollY, h)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [reducedMotion])

  return (
    <header id="hero" ref={heroRef} className="relative flex min-h-svh items-center overflow-hidden">
      <NetworkBackground />
      <div
        className="relative z-[3] mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-[1fr_1.1fr]"
        style={{ opacity: style.opacity, transform: `scale(${style.scale})` }}
      >
        <div>
          <div className="mb-6 font-mono text-xs uppercase tracking-widest text-accent-3">
            Security Engineer · CS Senior
          </div>
          <h1 className="font-heading text-5xl font-black uppercase leading-[0.94] text-fg md:text-7xl">
            Your
            <br />
            <span className="text-accent">{name}</span>
          </h1>
          <p className="mt-6 max-w-md font-mono text-sm text-fg/80">
            I break systems to learn how to defend them. Currently a CS senior turning curiosity about{' '}
            <span className="text-accent">how things fail</span> into a career in security.
          </p>
          <div className="mt-8 flex gap-4">
            <MagneticLink href="#work" className="hud-panel chamfer px-6 py-3 font-mono text-xs uppercase tracking-wider text-accent">
              View work
            </MagneticLink>
            <MagneticLink href="#contact" className="hud-panel chamfer px-6 py-3 font-mono text-xs uppercase tracking-wider text-fg">
              Get in touch
            </MagneticLink>
          </div>
        </div>
        <div className="order-first justify-self-center md:order-none md:justify-self-end">
          <div className="hud-frame">
            <img
              src={mascot}
              alt="Security mascot holding a laptop"
              className="w-full max-w-[280px] md:max-w-[380px]"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
