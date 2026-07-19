import { Nav } from './components/Nav'
import { CustomCursor } from './components/CustomCursor'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Focus } from './sections/Focus'
import { Work } from './sections/Work'
import { Contact } from './sections/Contact'

function App() {
  return (
    <>
      <CustomCursor />
      <Nav />
      <Hero />
      <About />
      <Focus />
      <Work />
      <Contact />
      <footer className="flex flex-wrap justify-between gap-4 border-t border-border px-6 py-6">
        <span className="font-mono text-[0.66rem] uppercase tracking-wider text-fg/50">build_0x1a · 2026</span>
        <span className="font-mono text-[0.66rem] uppercase tracking-wider text-fg/50">designed &amp; coded by you</span>
      </footer>
    </>
  )
}

export default App
