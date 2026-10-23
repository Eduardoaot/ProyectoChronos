import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useChronos } from '../lib/chronos'
import { DUR, EASE } from '../lib/motion'
import Reveal from './Reveal'
import Watch from './Watch'

const LEGEND = [
  ['Un clic', 'Pausa. La página se queda quieta.', 'pause'],
  ['Dos clics', 'Atrás. Vuelves al principio.', 'back'],
  ['Tres clics', 'Adelante. Saltas al final.', 'forward'],
]

export default function WatchSection() {
  const { status, uses, max, pips, gesture } = useChronos()
  const reduce = useReducedMotion()

  return (
    <section id="reloj" className={`section ink watch-section ${uses === 0 ? 'is-hot' : ''}`} aria-labelledby="reloj-title">
      <div className="watch-grid wrap">
        <div className="watch-col">
          <Watch />
        </div>

        <div className="watch-panel">
          <Reveal as="h2" id="reloj-title" className="t-h2">
            Presiona la corona.
          </Reveal>

          <div className="pips" aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <span key={n} className="pip">
                <motion.span className="pip-fill" initial={false} animate={{ scaleX: pips >= n ? 1 : 0 }} transition={{ duration: DUR.fast, ease: EASE }} />
              </span>
            ))}
          </div>

          <div className="status t-h3" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={status}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: DUR.fast, ease: EASE }}
              >
                {status}
              </motion.p>
            </AnimatePresence>
          </div>

          <ul className="rows legend">
            {LEGEND.map(([title, body, key]) => (
              <li key={key} className={`row ${gesture === key ? 'is-active' : ''}`}>
                <span className="legend-t">{title}</span>
                <span className="legend-b">{body}</span>
              </li>
            ))}
          </ul>

          <div className="meter" aria-hidden="true">
            <div className="meter-bars">
              {Array.from({ length: max }, (_, i) => (
                <span key={i} className={i < uses ? 'is-on' : ''} />
              ))}
            </div>
            <span className="meter-text">
              {uses} de {max} usos hoy
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
