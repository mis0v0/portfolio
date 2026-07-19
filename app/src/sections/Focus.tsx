import { useRef, useState } from 'react'
import { useMotionPrefs } from '../lib/motion-prefs'
import { spotlightPosition } from '../lib/spotlight'
import { Reveal } from '../components/Reveal'

const CARDS = [
  {
    code: 'OFF-SEC',
    title: 'Offensive Security',
    desc: 'Web & binary exploitation, CTF challenges, and thinking like an attacker.',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    code: 'NET',
    title: 'Network Security',
    desc: 'Protocol analysis, traffic inspection, and understanding how data moves.',
    span: 'md:col-span-2',
  },
  { code: 'REV', title: 'Reverse Engineering', desc: 'Pulling apart binaries to understand behavior.', span: '' },
  { code: 'CRYPTO', title: 'Applied Cryptography', desc: 'How ciphers are used and misused in the real world.', span: '' },
]

function FocusCard({ card }: { card: (typeof CARDS)[number] }) {
  const { finePointer } = useMotionPrefs()
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ sx: '50%', sy: '50%' })

  return (
    <div
      ref={ref}
      className="hud-panel chamfer relative h-full overflow-hidden p-8"
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
      <div className="font-mono text-xs tracking-widest text-accent-3">{card.code}</div>
      <h3 className="mt-4 font-heading text-xl font-bold uppercase text-fg">{card.title}</h3>
      <p className="mt-3 text-sm text-fg/60">{card.desc}</p>
    </div>
  )
}

export function Focus() {
  return (
    <section id="focus" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-11 font-mono text-xs uppercase tracking-widest text-accent-3">// focus areas</Reveal>
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-4 md:auto-rows-[190px]">
          {CARDS.map((card, i) => (
            <Reveal key={card.code} delay={i * 0.08} className={card.span}>
              <FocusCard card={card} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
