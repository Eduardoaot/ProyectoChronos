import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DUR, EASE } from '../lib/motion'
import { useScrollApi } from '../lib/scroll'
import LogoMark from './LogoMark'

const KEY = 'chronos-intro'

export function shouldPlayIntro() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (location.hash) return false
  try {
    return sessionStorage.getItem(KEY) == null
  } catch {
    return true
  }
}

// Diez segundos comprimidos: el contador baja a cero y la pantalla se abre
// como los dos arcos del logo.
export default function Intro({ onDone }) {
  const { lock } = useScrollApi()
  const [count, setCount] = useState(10)
  const [open, setOpen] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const t0 = setTimeout(() => lock(true), 0)
    const start = performance.now()
    let raf
    const tick = (t) => {
      const left = Math.max(0, 10 - Math.floor(((t - start) / 1500) * 10))
      setCount(left)
      if (left > 0) raf = requestAnimationFrame(tick)
      else setTimeout(() => setOpen(true), 200)
    }
    raf = requestAnimationFrame(tick)
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {}
    return () => {
      clearTimeout(t0)
      cancelAnimationFrame(raf)
    }
  }, [lock])

  useEffect(() => {
    if (!open) return
    onDone()
    const t = setTimeout(() => {
      lock(false)
      setGone(true)
    }, DUR.slow * 1000 + 100)
    return () => clearTimeout(t)
  }, [open, onDone, lock])

  if (gone) return null

  const half = (top) => ({
    initial: false,
    animate: open ? { y: top ? '-100%' : '100%' } : { y: 0 },
    transition: { duration: DUR.slow, ease: EASE },
  })

  return (
    <div className="intro" aria-hidden="true">
      <motion.div className="intro-half intro-top" {...half(true)} />
      <motion.div className="intro-half intro-bottom" {...half(false)} />
      <AnimatePresence>
        {!open && (
          <motion.div className="intro-core" exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: DUR.fast, ease: EASE }}>
            <LogoMark className="intro-mark" draw />
            <span className="label intro-count">00:00:{String(count).padStart(2, '0')}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.span
        className="intro-line"
        initial={{ scaleX: 0 }}
        animate={open ? { scaleX: 1, opacity: 0 } : { scaleX: count < 10 ? (10 - count) / 10 : 0 }}
        transition={{ duration: open ? DUR.slow : 0.15, ease: EASE }}
      />
    </div>
  )
}
