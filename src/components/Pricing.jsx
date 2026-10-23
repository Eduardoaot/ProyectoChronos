import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { DUR, EASE, STAGGER } from '../lib/motion'
import Reveal from './Reveal'

const TERMS = [
  'Diez usos al día, cada día.',
  'El Tempus dura cinco años. Después hace falta otro Chronos One. No hay otro modelo.',
  'Si dejas de pagar, la rama se cierra y regresas a la línea principal. Los días de la rama no vuelven contigo.',
]

export default function Pricing() {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  return (
    <section id="precio" className="section" aria-labelledby="precio-title">
      <div className="wrap split pricing-grid">
        <div>
          <Reveal as="h2" id="precio-title" className="t-h2">
            Treinta dólares.
          </Reveal>
          <Reveal as="p" className="price" index={1}>
            <span className="price-n" aria-hidden="true">
              30
            </span>
            <span className="sr-only">30 dólares al mes</span>
            <span className="price-u" aria-hidden="true">
              dólares al mes
            </span>
          </Reveal>
        </div>
        <div className="pricing-right">
          <Reveal as="p" className="t-lead">
            La membresía mantiene la rama abierta.
          </Reveal>
          <Reveal index={1}>
            <button type="button" className="btn btn-ghost" aria-expanded={open} aria-controls="condiciones" onClick={() => setOpen((o) => !o)}>
              {open ? 'Ocultar condiciones' : 'Ver qué incluye'}
            </button>
          </Reveal>
          <div id="condiciones">
            <AnimatePresence initial={false}>
              {open && (
                <motion.ul
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
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: DUR.base, ease: EASE, delay: 0.1 + i * STAGGER }}
                    >
                      {term}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
