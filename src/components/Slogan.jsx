import { useMemo, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { seeded } from '../lib/motion'
import LogoMark from './LogoMark'

const LINES = ['El tiempo,', 'en pausa.']
const ASSEMBLE = [0.04, 0.36]

function Letter({ progress, from, children }) {
  const x = useTransform(progress, ASSEMBLE, [from.x, 0])
  const y = useTransform(progress, ASSEMBLE, [from.y, 0])
  const rotate = useTransform(progress, ASSEMBLE, [from.r, 0])
  const opacity = useTransform(progress, [ASSEMBLE[0], ASSEMBLE[0] + 0.12], [0, 1])
  const blur = useTransform(progress, ASSEMBLE, [10, 0])
  const filter = useTransform(blur, (b) => `blur(${b}px)`)
  return (
    <motion.span className="slogan-ch" style={{ x, y, rotate, opacity, filter }}>
      {children}
    </motion.span>
  )
}

// El slogan se arma con el scroll y después se queda quieto mientras sigues bajando:
// la página literalmente pausa el tiempo durante un tramo.
export default function Slogan() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const scatter = useMemo(() => {
    const rnd = seeded(10)
    return LINES.map((line) =>
      line.split('').map(() => ({ x: (rnd() - 0.5) * 900, y: (rnd() - 0.5) * 600, r: (rnd() - 0.5) * 140 })),
    )
  }, [])

  const topArc = useTransform(p, ASSEMBLE, [-260, 0])
  const botArc = useTransform(p, ASSEMBLE, [260, 0])
  const arcsOpacity = useTransform(p, [0, 0.3, 0.8, 1], [0, 0.2, 0.2, 0])
  const dial = useTransform(p, [0, 0.36, 0.72, 1], [-240, 0, 0, 120])
  const still = useTransform(p, [0.36, 0.44, 0.7, 0.78], [0, 1, 1, 0])
  const rule = useTransform(p, [0.38, 0.6], [0, 1])
  const exitScale = useTransform(p, [0.74, 1], [1, 0.86])
  const exitOpacity = useTransform(p, [0.8, 1], [1, 0])
  const ticker = useTransform(p, [0, 0.36], [10, 0])
  const tickerText = useTransform(ticker, (v) => `00:00:${String(Math.max(0, Math.round(v))).padStart(2, '0')}`)

  if (reduce) {
    return (
      <section className="slogan slogan-static" aria-label="Slogan">
        <p className="slogan-text">
          <span>El tiempo,</span>
          <span>en pausa.</span>
        </p>
      </section>
    )
  }

  return (
    <section ref={ref} className="slogan" aria-label="Slogan">
      <div className="slogan-sticky">
        <motion.svg className="slogan-dial" viewBox="0 0 200 200" aria-hidden="true" style={{ rotate: dial }}>
          {Array.from({ length: 60 }, (_, i) => {
            const a = ((i * 6 - 90) * Math.PI) / 180
            const r1 = i % 5 === 0 ? 88 : 93
            return <line key={i} x1={100 + r1 * Math.cos(a)} y1={100 + r1 * Math.sin(a)} x2={100 + 98 * Math.cos(a)} y2={100 + 98 * Math.sin(a)} />
          })}
        </motion.svg>

        <motion.div className="slogan-arcs" aria-hidden="true" style={{ opacity: arcsOpacity }}>
          <LogoMark topStyle={{ y: topArc }} bottomStyle={{ y: botArc }} />
        </motion.div>

        <motion.div className="slogan-block" style={{ scale: exitScale, opacity: exitOpacity }}>
          <motion.span className="label slogan-clock" aria-hidden="true">
            {tickerText}
          </motion.span>
          <p className="slogan-text">
            <span className="sr-only">El tiempo, en pausa.</span>
            {LINES.map((line, li) => (
              <span key={line} className="slogan-line" aria-hidden="true">
                {line.split('').map((c, ci) =>
                  c === ' ' ? (
                    <span key={ci}> </span>
                  ) : (
                    <Letter key={ci} progress={p} from={scatter[li][ci]}>
                      {c}
                    </Letter>
                  ),
                )}
              </span>
            ))}
          </p>
          <motion.span className="slogan-rule" aria-hidden="true" style={{ scaleX: rule }} />
          <motion.div className="slogan-still" aria-hidden="true" style={{ opacity: still }}>
            <span className="slogan-pause" />
            <span className="label">Pausa</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
