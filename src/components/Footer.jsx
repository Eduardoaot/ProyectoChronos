import { motion, useReducedMotion } from 'framer-motion'
import { DUR, EASE, STAGGER } from '../lib/motion'
import LogoMark from './LogoMark'

const WORD = 'CHRONOS'

export default function Footer() {
  const reduce = useReducedMotion()
  return (
    <footer id="pie" className="footer ink">
      <div className="wrap footer-top">
        <div className="footer-brand">
          <LogoMark className="footer-mark" />
          <div>
            <p className="wordmark-text">CHRONOS</p>
            <p className="footer-line">El tiempo, en pausa.</p>
          </div>
        </div>
        <div className="footer-meta">
          <p className="label label-strong">chronos.one</p>
          <p className="label">Tempus sellado. No abrir.</p>
        </div>
      </div>
      <motion.div
        className="footer-giant"
        aria-hidden="true"
        initial={reduce ? false : 'hidden'}
        whileInView="shown"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: STAGGER * 0.75 }}
      >
        {WORD.split('').map((c, i) => (
          <motion.span
            key={i}
            variants={{ hidden: { y: '105%' }, shown: { y: '0%', transition: { duration: DUR.slow * 1.2, ease: EASE } } }}
          >
            {c}
          </motion.span>
        ))}
      </motion.div>
    </footer>
  )
}
