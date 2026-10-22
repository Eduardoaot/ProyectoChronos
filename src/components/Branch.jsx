import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useChronos } from '../lib/chronos'
import { DUR, EASE, STAGGER } from '../lib/motion'
import DecodeText from './DecodeText'
import Reveal from './Reveal'

const STEPS = [
  ['El trámite.', 'Ciento cuarenta gobiernos firmaron el registro. Pide tiempo, y diez copias. La fila es parte del producto.'],
  ['La rama.', 'Al terminar, el reloj abre tu copia. Nadie más la mueve.'],
  ['El reporte.', 'Tu lugar en la línea principal sigue la rutina. Cuando vuelves, lees qué hizo.'],
]

function useBranchClock() {
  const { branchNow } = useChronos()
  const [t, setT] = useState(() => branchNow())
  useEffect(() => {
    const id = setInterval(() => setT(branchNow()), 500)
    return () => clearInterval(id)
  }, [branchNow])
  const d = new Date(t)
  return [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':')
}

function Terminal() {
  const { uses, max, paused } = useChronos()
  const clock = useBranchClock()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion()
  const rows = [
    ['LÍNEA PRINCIPAL', 'intacta'],
    ['RAMA', 'abierta'],
    ['HUELLA', 'enlazada'],
    ['USOS HOY', `${String(uses).padStart(2, '0')} / ${max}`],
  ]
  return (
    <div className="spot terminal" ref={ref}>
      <div className="terminal-bar" aria-hidden="true">
        <span className={`terminal-live ${paused ? 'is-paused' : ''} ${uses === 0 ? 'is-hot' : ''}`} />
        <span className="label">Estado de tu rama</span>
        <span className="label terminal-clock">{clock}</span>
      </div>
      <pre className="terminal-body">
        {rows.map(([k, v], i) => (
          <motion.span
            key={k}
            className="terminal-row"
            initial={reduce ? false : { opacity: 0 }}
            animate={inView || reduce ? { opacity: 1 } : undefined}
            transition={{ duration: DUR.base, ease: EASE, delay: 0.2 + i * STAGGER * 2 }}
          >
            {k.padEnd(19, ' ')}
            <span className={i === 3 ? 'terminal-v is-live' : 'terminal-v'}>{v}</span>
            {'\n'}
          </motion.span>
        ))}
      </pre>
    </div>
  )
}

function BranchLines() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end 0.4'] })
  const draw = useTransform(scrollYProgress, [0.05, 0.85], [0, 1])
  return (
    <div ref={ref} className="branch-lines" aria-hidden="true">
      <svg viewBox="0 0 1200 160" preserveAspectRatio="none">
        <line x1="0" y1="110" x2="1200" y2="110" className="branch-main" />
        <motion.path d="M260 110 C 420 110, 470 34, 640 34 L 1200 34" className="branch-own" style={reduce ? undefined : { pathLength: draw }} />
      </svg>
      <span className="branch-node" />
    </div>
  )
}

export default function Branch() {
  return (
    <section id="rama" className="section ink branch" aria-labelledby="rama-title">
      <BranchLines />
      <div className="wrap">
        <DecodeText as="h2" id="rama-title" className="t-h2" text="La línea sigue." />
        <div className="split branch-grid">
          <Reveal>
            <Terminal />
          </Reveal>
          <ol className="rows rows-flush">
            {STEPS.map(([title, body], i) => (
              <Reveal as="li" key={title} index={i} className="row">
                <span className="label label-index">0{i + 1}</span>
                <div>
                  <h3 className="t-h3">{title}</h3>
                  <p className="row-body">{body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
