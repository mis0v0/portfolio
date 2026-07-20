import { Reveal } from '../components/Reveal'

export function Contact() {
  return (
    <section id="contact" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-11 font-mono text-xs uppercase tracking-widest text-accent-3">// contact</Reveal>
        <Reveal delay={0.08}>
          <div className="font-heading text-4xl font-bold uppercase leading-none text-fg md:text-6xl">
            Let's build
            <br />
            something <span className="text-accent">secure</span>.
          </div>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="mailto:you@example.com" className="hud-panel chamfer px-6 py-3 font-mono text-xs uppercase tracking-wider text-accent">
              you@example.com
            </a>
            <a href="#" className="hud-panel chamfer px-6 py-3 font-mono text-xs uppercase tracking-wider text-fg">
              Download CV
            </a>
          </div>
          <div className="mt-11 flex flex-wrap gap-8">
            <a
              href="https://github.com/misosos"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-wider text-fg/60 hover:text-accent"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/미소-김-44aaa2413/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-wider text-fg/60 hover:text-accent"
            >
              LinkedIn
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
