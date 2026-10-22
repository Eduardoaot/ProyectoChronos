import { useCallback, useEffect, useState } from 'react'
import { useTheme } from './lib/theme'
import { ScrollProvider } from './lib/scroll'
import { ChronosProvider, useChronos } from './lib/chronos'
import Intro, { shouldPlayIntro } from './components/Intro'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Marquee from './components/Marquee'
import Gestures from './components/Gestures'
import WatchSection from './components/WatchSection'
import Slogan from './components/Slogan'
import Branch from './components/Branch'
import Manifesto from './components/Manifesto'
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
  const [intro] = useState(shouldPlayIntro)
  const [ready, setReady] = useState(!intro)
  const onIntroDone = useCallback(() => setReady(true), [])

  useEffect(() => {
    const id = location.hash && document.querySelector(location.hash)
    if (id) requestAnimationFrame(() => id.scrollIntoView())
  }, [])

  return (
    <ScrollProvider>
      <ChronosProvider>
        <PausedClass />
        {intro && <Intro onDone={onIntroDone} />}
        <Nav theme={theme} onToggleTheme={toggle} />
        <main>
          <Hero ready={ready} />
          <About />
          <Marquee />
          <Gestures />
          <WatchSection />
          <Slogan />
          <Branch />
          <Manifesto />
          <Pricing />
          <Closing />
          <Tramite />
        </main>
        <Footer />
        <TimeFx />
        <Cursor />
      </ChronosProvider>
    </ScrollProvider>
  )
}
