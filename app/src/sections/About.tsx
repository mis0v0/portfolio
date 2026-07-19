const STATS = [
  { n: '12+', l: 'CTFs played' },
  { n: '3', l: 'Tools shipped' },
  { n: "'26", l: 'Graduating' },
]

export function About() {
  return (
    <section id="about" className="border-t border-border px-6 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
        <h2 className="font-heading text-3xl font-bold uppercase text-fg">
          Defense starts with
          <br />
          understanding the attack.
        </h2>
        <div>
          <p className="text-fg/70">
            I'm a fourth-year computer science student aiming to work in security. My interest sits where{' '}
            <b className="text-fg">systems break</b>: memory bugs, weak protocols, misconfigurations, and the human
            assumptions behind them.
          </p>
          <div className="mt-8 flex gap-6">
            {STATS.map((s) => (
              <div key={s.l} className="hud-panel chamfer px-5 py-4">
                <div className="font-heading text-3xl font-bold text-accent">{s.n}</div>
                <div className="mt-1 font-mono text-[0.66rem] uppercase tracking-wider text-fg/60">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
