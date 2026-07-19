import { useRef, useState } from 'react'
import { useMotionPrefs } from '../lib/motion-prefs'
import { spotlightPosition } from '../lib/spotlight'
import { Reveal } from '../components/Reveal'

const ITEMS = [
  { idx: '001', title: 'Project Title One', desc: 'One line on what it does and the security problem it solves.' },
  { idx: '002', title: 'CTF Writeup Series', desc: 'A collection of challenge solutions with clear explanations.' },
  { idx: '003', title: 'Capstone / Thesis Project', desc: 'Your final-year project — what you built and why it matters.' },
]

function WorkCard({ item }: { item: (typeof ITEMS)[number] }) {
  const { finePointer } = useMotionPrefs()
  const ref = useRef<HTMLAnchorElement>(null)
  const [pos, setPos] = useState({ sx: '50%', sy: '50%' })

  return (
    <a
      ref={ref}
      href="#"
      className="hud-panel chamfer relative flex flex-col gap-3.5 overflow-hidden p-7"
      style={
        {
          '--sx': pos.sx,
          '--sy': pos.sy,
          backgroundImage: finePointer
            ? 'radial-gradient(320px circle at var(--sx) var(--sy), rgba(0,255,136,.16), rgba(255,0,255,.08) 40%, transparent 70%)'
            : undefined,
        } as React.CSSProperties
      }
      onPointerMove={(e) => {
        if (!finePointer || !ref.current) return
        setPos(spotlightPosition(e.clientX, e.clientY, ref.current.getBoundingClientRect()))
      }}
    >
      <div className="font-mono text-xs text-accent-3">{item.idx}</div>
      <h3 className="font-heading text-2xl font-bold uppercase text-fg">{item.title}</h3>
      <div className="text-sm text-fg/60">{item.desc}</div>
    </a>
  )
}

export function Work() {
  return (
    <section id="work" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-11 font-mono text-xs uppercase tracking-widest text-accent-3">// selected work</Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {ITEMS.map((item, i) => (
            <Reveal key={item.idx} delay={i * 0.08}>
              <WorkCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
