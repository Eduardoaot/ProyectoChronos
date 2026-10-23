import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { DUR, EASE, STAGGER } from '../lib/motion'
import { useAnchor } from '../lib/scroll'
import Reveal from './Reveal'

// Los iconos se dibujan una vez, al entrar, con la misma curva que el resto.
function useOnce() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion()
  return { ref, on: inView || reduce, reduce }
}

function t(i = 0, d = DUR.slow) {
  return { duration: d, ease: EASE, delay: 0.25 + i * STAGGER }
}

function IconPause() {
  const { ref, on, reduce } = useOnce()
  return (
    <svg ref={ref} viewBox="0 0 120 120" className="g-icon" aria-hidden="true">
      <circle cx="60" cy="60" r="52" className="g-icon-ring" />
      {[44, 68].map((x, i) => (
        <motion.rect
          key={x}
          x={x}
          y="40"
          width="8"
          height="40"
          className="g-icon-fill"
          style={{ originY: '80px' }}
          initial={reduce ? false : { scaleY: 0 }}
          animate={on ? { scaleY: 1 } : undefined}
          transition={t(i)}
        />
      ))}
      <circle cx="60" cy="8" r="3.5" className="g-icon-gold" />
    </svg>
  )
}

function IconTurn({ dir }) {
  const { ref, on, reduce } = useOnce()
  return (
    <svg ref={ref} viewBox="0 0 120 120" className="g-icon" aria-hidden="true">
      <circle cx="60" cy="60" r="52" className="g-icon-ring" />
      <motion.path
        d={dir < 0 ? 'M60 8 A52 52 0 0 0 15 34' : 'M60 8 A52 52 0 0 1 105 34'}
        className="g-icon-arc"
        initial={reduce ? false : { pathLength: 0 }}
        animate={on ? { pathLength: 1 } : undefined}
        transition={t(1)}
      />
      <motion.g
        style={{ originX: '60px', originY: '60px' }}
        initial={reduce ? { rotate: dir * 60 } : { rotate: 0 }}
        animate={on ? { rotate: dir * 60 } : undefined}
        transition={t(1)}
      >
        <line x1="60" y1="60" x2="60" y2="18" className="g-icon-hand" />
      </motion.g>
      <circle cx="60" cy="60" r="4" className="g-icon-gold" />
    </svg>
  )
}

function IconTen() {
  const { ref, on, reduce } = useOnce()
  return (
    <div ref={ref} className="g-ten" aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => (
        <motion.span
          key={i}
          initial={reduce ? false : { scaleY: 0 }}
          animate={on ? { scaleY: 1 } : undefined}
          transition={{ duration: DUR.base, ease: EASE, delay: 0.25 + i * 0.05 }}
        />
      ))}
      <motion.span
        className="g-ten-out"
        initial={reduce ? false : { opacity: 0 }}
        animate={on ? { opacity: 1 } : undefined}
        transition={{ duration: DUR.base, ease: EASE, delay: 0.25 + 10 * 0.05 }}
      />
    </div>
  )
}

export default function Gestures() {
  const onAnchor = useAnchor()
  return (
    <section id="gestos" className="section" aria-labelledby="gestos-title">
      <div className="wrap">
        <header className="section-head">
          <Reveal as="h2" id="gestos-title" className="t-h2">
            Tres gestos.
          </Reveal>
          <Reveal as="p" className="t-lead" index={1}>
            El mismo botón. Cambia cuántas veces lo presionas.
          </Reveal>
        </header>

        <div className="bento">
          <Reveal className="cell cell-1">
            <IconPause />
            <h3 className="t-h3">Un clic.</h3>
            <p>Tu rama se queda quieta. Tú te mueves.</p>
          </Reveal>
          <Reveal className="cell cell-2" index={1}>
            <IconTurn dir={-1} />
            <h3 className="t-h3">Dos clics.</h3>
            <p>Diez segundos atrás. Vuelves al punto donde estabas. Esos segundos se deshacen. Tú los recuerdas.</p>
          </Reveal>
          <Reveal className="cell cell-3 cell-feature" index={0}>
            <IconTurn dir={1} />
            <h3 className="t-h3">Tres clics.</h3>
            <p>Diez segundos adelante. Tu conciencia espera. Tu cuerpo se queda donde está. Sigues siendo materia. El mundo no se aparta.</p>
            <a href="#reloj" className="link link-gold" onClick={onAnchor}>
              Presiona la corona
            </a>
          </Reveal>
          <Reveal className="cell cell-4" id="limite" index={1}>
            <IconTen />
            <h3 className="t-h3">Diez al día.</h3>
            <p>Diez usos. El undécimo no entra. Es el límite del aparato.</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
