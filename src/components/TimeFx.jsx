import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, animate, motion, useReducedMotion } from 'framer-motion'
import { useChronos } from '../lib/chronos'
import { DUR, EASE } from '../lib/motion'

const JUMP = 2.1

const TICKS = Array.from({ length: 60 }, (_, i) => {
  const a = ((i * 6 - 90) * Math.PI) / 180
  const major = i % 5 === 0
  const r1 = major ? 86 : 92
  return { i, major, x1: 100 + r1 * Math.cos(a), y1: 100 + r1 * Math.sin(a), x2: 100 + 98 * Math.cos(a), y2: 100 + 98 * Math.sin(a) }
})

function Counter({ back }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const c = animate(0, 10, { duration: 1.3, ease: EASE, delay: 0.15, onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [])
  const digits = String(n).padStart(2, '0')
  return (
    <div className="fx-counter">
      <span className="fx-sign">{back ? '-' : '+'}</span>
      {digits.split('').map((d, i) => (
        <span key={i} className="fx-digit">
          <motion.span
            key={d}
            initial={{ y: back ? '-70%' : '70%', opacity: 0, filter: 'blur(6px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.18, ease: EASE }}
          >
            {d}
          </motion.span>
        </span>
      ))}
      <span className="fx-unit">s</span>
    </div>
  )
}

// El salto se ve como un rebobinado: el dial gira, la página se desenfoca,
// las estelas corren en el sentido del tiempo y el contador cuenta los diez segundos.
function Jump({ kind }) {
  const back = kind === 'back'
  const dir = back ? -1 : 1
  const streaks = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        i,
        top: 6 + Math.random() * 88,
        w: 8 + Math.random() * 26,
        d: 0.45 + Math.random() * 0.5,
        delay: Math.random() * 0.9,
        gold: i % 3 === 0,
      })),
    [],
  )

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('is-warping')
    const t = setTimeout(() => root.classList.remove('is-warping'), JUMP * 1000 - 500)
    return () => {
      clearTimeout(t)
      root.classList.remove('is-warping')
    }
  }, [])

  return (
    <motion.div
      className={`fx-jump ${back ? 'is-back' : 'is-forward'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: JUMP, times: [0, 0.1, 0.78, 1], ease: 'linear' }}
    >
      <div className="fx-veil" />

      <div className="fx-streaks">
        {streaks.map((s) => (
          <motion.span
            key={s.i}
            className={s.gold ? 'is-gold' : ''}
            style={{ top: `${s.top}%`, width: `${s.w}vw` }}
            initial={{ x: back ? '110vw' : '-40vw' }}
            animate={{ x: back ? '-40vw' : '110vw' }}
            transition={{ duration: s.d, delay: s.delay, ease: 'linear', repeat: 1 }}
          />
        ))}
      </div>

      <motion.svg
        className="fx-dial"
        viewBox="0 0 200 200"
        initial={{ scale: 0.7, opacity: 0, rotate: 0 }}
        animate={{ scale: [0.7, 1, 1.12], opacity: [0, 1, 0], rotate: dir * 420 }}
        transition={{ duration: JUMP, ease: EASE, times: [0, 0.35, 1] }}
      >
        {TICKS.map((t) => (
          <line key={t.i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} className={t.major ? 'is-major' : ''} />
        ))}
        <motion.path
          d={back ? 'M100 2 A98 98 0 0 0 15.1 51' : 'M100 2 A98 98 0 0 1 184.9 51'}
          className="fx-sweep"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
        />
      </motion.svg>

      <motion.div
        className="fx-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: DUR.base, ease: EASE }}
      >
        <Counter back={back} />
        <span className="label fx-caption">{back ? 'Diez segundos atrás' : 'Diez segundos adelante'}</span>
      </motion.div>

      <motion.div
        className="fx-rule"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }}
        transition={{ duration: JUMP * 0.8, ease: EASE, times: [0, 0.5, 1] }}
        style={{ originX: back ? 1 : 0 }}
      />
    </motion.div>
  )
}

export default function TimeFx() {
  const { fx, paused, uses } = useChronos()
  const reduce = useReducedMotion()

  return (
    <div className="fx" aria-hidden="true">
      <AnimatePresence>{!reduce && fx && <Jump key={fx.id} kind={fx.kind} />}</AnimatePresence>
      <AnimatePresence>
        {paused && (
          <motion.div
            className="fx-pause"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : DUR.base, ease: EASE }}
          >
            <span className="fx-corner tl" />
            <span className="fx-corner tr" />
            <span className="fx-corner bl" />
            <span className="fx-corner br" />
            <div className="fx-chip fx-pause-tag">
              <span className="fx-pause-icon" />
              <span className="label">Pausa</span>
              <span className="fx-pause-sep" />
              <span className="label">{String(uses).padStart(2, '0')} / 10</span>
            </div>
            <p className="fx-chip fx-pause-hint">Un clic en la corona para seguir. Escape también.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
