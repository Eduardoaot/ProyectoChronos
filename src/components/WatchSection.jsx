import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useChronos } from '../lib/chronos'
import { DUR, EASE } from '../lib/motion'
import DecodeText from './DecodeText'
import Reveal from './Reveal'
import Watch from './Watch'

const LEGEND = [
  ['1', 'Un clic', 'Pausa. La página se queda quieta.', 'pause'],
  ['2', 'Dos clics', 'Atrás. Vuelves al principio.', 'back'],
  ['3', 'Tres clics', 'Adelante. Saltas al final.', 'forward'],
]

const NAMES = { pause: 'Pausa', back: 'Atrás', forward: 'Adelante' }
const DELTA = { pause: '0 s', back: '-10 s', forward: '+10 s' }

function clock(t) {
  const d = new Date(t)
  return [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':')
}

export default function WatchSection() {
  const { status, uses, max, pips, mark, gesture, paused, log } = useChronos()
  const reduce = useReducedMotion()

  return (
    <section id="reloj" className={`section ink watch-section ${uses === 0 ? 'is-hot' : ''}`} aria-labelledby="reloj-title">
      <div className="watch-grid wrap">
        <div className="watch-col">
          <Watch />
        </div>

        <div className="watch-panel">
          <DecodeText as="h2" id="reloj-title" className="t-h2" text="Presiona la corona." />

          <div className="pips" aria-hidden="true">
            <span className="label">Clics</span>
            {[1, 2, 3].map((n) => (
              <span key={n} className={`pip ${pips >= n ? 'is-on' : ''}`}>
                <motion.span className="pip-fill" initial={false} animate={{ scaleX: pips >= n ? 1 : 0 }} transition={{ duration: DUR.fast, ease: EASE }} />
                <span className="label">{n}</span>
              </span>
            ))}
          </div>

          <div className="status t-h3" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={status}
                initial={reduce ? false : { opacity: 0, y: 12, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reduce ? undefined : { opacity: 0, y: -12, filter: 'blur(6px)' }}
                transition={{ duration: DUR.fast, ease: EASE }}
              >
                {status}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="timeline" aria-hidden="true">
            <span className="timeline-rail" />
            <motion.span
              className={`timeline-mark ${paused ? 'is-paused' : ''}`}
              initial={false}
              animate={{ left: `${mark}%` }}
              transition={reduce ? { duration: 0 } : { duration: DUR.base, ease: EASE }}
            />
            <span className="label timeline-label timeline-label-l">-10 s</span>
            <span className="label timeline-label timeline-label-r">+10 s</span>
          </div>

          <ul className="rows legend">
            {LEGEND.map(([n, title, body, key], i) => (
              <Reveal as="li" key={n} index={i} className={`row ${gesture === key ? 'is-active' : ''}`}>
                <span className="label label-index">{n}</span>
                <span className="legend-text">
                  <span className="legend-t">{title}</span>
                  <span className="legend-b">{body}</span>
                </span>
              </Reveal>
            ))}
          </ul>

          <div className="meter" aria-hidden="true">
            <div className="meter-bars">
              {Array.from({ length: max }, (_, i) => (
                <span key={i} className={i < uses ? 'is-on' : ''} />
              ))}
            </div>
            <span className="label">
              Usos hoy {String(uses).padStart(2, '0')} / {max}
            </span>
          </div>

          <div className="log">
            <p className="label">Registro de la rama</p>
            <ol>
              <AnimatePresence initial={false}>
                {log.map((e) => (
                  <motion.li
                    key={e.id}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, x: -16, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DUR.base, ease: EASE }}
                  >
                    <span className="label">{clock(e.at)}</span>
                    <span>{NAMES[e.kind]}</span>
                    <span className="label label-gold">{DELTA[e.kind]}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
              {log.length === 0 && <li className="log-empty">Sin gestos todavía.</li>}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
