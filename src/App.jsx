import { useEffect } from 'react'
import { useTheme } from './lib/theme'
import { ScrollProvider } from './lib/scroll'
import { ChronosProvider, useChronos } from './lib/chronos'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Gestures from './components/Gestures'
import WatchSection from './components/WatchSection'
import Branch from './components/Branch'
import Pricing from './components/Pricing'
import Closing from './components/Closing'
import Tramite from './components/Tramite'
import Footer from './components/Footer'
import TimeFx from './components/TimeFx'

function PausedClass() {
  const { paused } = useChronos()
  useEffect(() => {
    document.documentElement.classList.toggle('is-paused', paused)
  }, [paused])
  return null
}

export default function App() {
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const id = location.hash && document.querySelector(location.hash)
    if (id) requestAnimationFrame(() => id.scrollIntoView())
  }, [])

  return (
    <ScrollProvider>
      <ChronosProvider>
        <PausedClass />
        <Nav theme={theme} onToggleTheme={toggle} />
        <main>
          <Hero />
          <About />
          <Gestures />
          <WatchSection />
          <Branch />
          <Pricing />
          <Closing />
          <Tramite />
        </main>
        <Footer />
        <TimeFx />
      </ChronosProvider>
    </ScrollProvider>
  )
}
