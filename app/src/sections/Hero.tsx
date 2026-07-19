import mascot from '../assets/mascot.png'
import { NetworkBackground } from './NetworkBackground'

export function Hero() {
  return (
    <header id="hero" className="relative flex min-h-svh items-center overflow-hidden">
      <NetworkBackground />
      <div className="relative z-[3] mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1.25fr_0.75fr]">
        <div>
          <div className="mb-6 font-mono text-xs uppercase tracking-widest text-accent-3">
            Security Engineer · CS Senior
          </div>
          <h1 className="font-heading text-5xl font-black uppercase leading-[0.94] text-fg md:text-7xl">
            Your
            <br />
            <span className="text-accent">Name</span>
          </h1>
          <p className="mt-6 max-w-md font-mono text-sm text-fg/80">
            I break systems to learn how to defend them. Currently a CS senior turning curiosity about{' '}
            <span className="text-accent">how things fail</span> into a career in security.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="#work" className="hud-panel chamfer px-6 py-3 font-mono text-xs uppercase tracking-wider text-accent">
              View work
            </a>
            <a href="#contact" className="hud-panel chamfer px-6 py-3 font-mono text-xs uppercase tracking-wider text-fg">
              Get in touch
            </a>
          </div>
        </div>
        <div className="justify-self-center">
          <img src={mascot} alt="Security mascot holding a laptop" className="w-full max-w-[220px]" />
        </div>
      </div>
    </header>
  )
}
