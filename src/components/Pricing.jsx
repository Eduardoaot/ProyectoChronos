import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { DUR, EASE, STAGGER, prefersReducedMotion } from '../lib/motion'
import DecodeText from './DecodeText'
import Reveal from './Reveal'

const TERMS = [
  'Diez usos al día, cada día.',
  'El Tempus dura cinco años. Después hace falta otro Chronos One. No hay otro modelo.',
  'Si dejas de pagar, la rama se cierra y regresas a la línea principal. Los días de la rama no vuelven contigo.',
]

function Price() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [n, setN] = useState(() => (prefersReducedMotion() ? 30 : 0))

  useEffect(() => {
    if (!inView) return
    const r = ref.current.getBoundingClientRect()
    if (reduce || (r.top < window.innerHeight * 0.5 && performance.now() < 1500)) {
      setN(30)
      return
    }
    const c = animate(0, 30, { duration: DUR.slow * 1.4, ease: EASE, onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, reduce])

  return (
    <p className="price" ref={ref}>
      <span className="price-n" aria-hidden="true">
        {String(n).padStart(2, '0')}
      </span>
      <span className="sr-only">30 dólares al mes</span>
      <span className="price-u" aria-hidden="true">
        dólares al mes
      </span>
    </p>
  )
}

function Calculator() {
  const [months, setMonths] = useState(12)
  const reduce = useReducedMotion()
  const total = months * 30
  const years = Math.floor(months / 12)
  const rest = months % 12
  const span = [years ? `${years} ${years === 1 ? 'año' : 'años'}` : '', rest ? `${rest} ${rest === 1 ? 'mes' : 'meses'}` : '']
    .filter(Boolean)
    .join(' y ')
  const end = months >= 60

  return (
    <div className="calc spot">
      <div className="calc-head">
        <label htmlFor="calc-range" className="t-h3">
          Tu rama, mes a mes.
        </label>
        <output htmlFor="calc-range" className="calc-total" aria-live="polite">
          <motion.span key={total} initial={reduce ? false : { y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: DUR.fast, ease: EASE }}>
            {total.toLocaleString('es-MX')}
          </motion.span>
          <span className="label">dólares</span>
        </output>
      </div>
      <div className="slider" style={{ '--p': `${((months - 1) / 59) * 100}%` }}>
        <div className="slider-track" aria-hidden="true">
          <span className="slider-fill" />
          {[12, 24, 36, 48].map((m) => (
            <span key={m} className={`slider-tick ${months >= m ? 'is-past' : ''}`} style={{ left: `${((m - 1) / 59) * 100}%` }} />
          ))}
        </div>
        <span className="slider-thumb" aria-hidden="true">
          <span className="slider-bubble label">
            {months} {months === 1 ? 'mes' : 'meses'}
          </span>
        </span>
        <input
          id="calc-range"
          type="range"
          min="1"
          max="60"
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          aria-valuetext={`${span}, ${total} dólares`}
          data-cursor="drag"
        />
      </div>
      <div className="slider-scale label" aria-hidden="true">
        {['1 mes', '1 año', '2', '3', '4', '5 años'].map((l, i) => (
          <span key={l} style={{ left: `${i === 0 ? 0 : ((i * 12 - 1) / 59) * 100}%` }}>
            {l}
          </span>
        ))}
      </div>
      <div className="calc-tempus" aria-hidden="true">
        <span className="label">Tempus</span>
        <span className="calc-bar">
          <span style={{ transform: `scaleX(${1 - months / 60})` }} />
        </span>
        <span className="label">{Math.round((1 - months / 60) * 100)}%</span>
      </div>
      <p className="calc-note">
        {end ? 'El Tempus llega a su fin. Hace falta otro Chronos One.' : `${span} de rama abierta.`}
      </p>
    </div>
  )
}

export default function Pricing() {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  return (
    <section id="precio" className="section" aria-labelledby="precio-title">
      <div className="wrap split pricing-grid">
        <div>
          <DecodeText as="h2" id="precio-title" className="t-h2" text="Treinta dólares." />
          <Price />
        </div>
        <div className="pricing-right">
          <Reveal as="p" className="t-lead">
            La membresía mantiene la rama abierta.
          </Reveal>
          <Reveal index={1}>
            <button type="button" className="btn btn-ghost" data-magnetic aria-expanded={open} aria-controls="condiciones" onClick={() => setOpen((o) => !o)}>
              <span>{open ? 'Ocultar condiciones' : 'Ver qué incluye'}</span>
              <motion.svg
                viewBox="0 0 16 16"
                aria-hidden="true"
                initial={false}
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ duration: DUR.base, ease: EASE }}
              >
                <path d="M8 2v12M2 8h12" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </motion.svg>
            </button>
          </Reveal>
          <div id="condiciones">
            <AnimatePresence initial={false}>
              {open && (
                <motion.ol
                  className="rows terms"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: DUR.base, ease: EASE }}
                >
                  {TERMS.map((term, i) => (
                    <motion.li
                      key={term}
                      className="row"
                      initial={reduce ? false : { opacity: 0, y: 12, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: DUR.base, ease: EASE, delay: 0.1 + i * STAGGER }}
                    >
                      <span className="label label-index">0{i + 1}</span>
                      <span>{term}</span>
                    </motion.li>
                  ))}
                </motion.ol>
              )}
            </AnimatePresence>
          </div>
          <Reveal index={2}>
            <Calculator />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
