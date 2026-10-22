import { motion } from 'framer-motion'
import { DUR, EASE } from '../lib/motion'

const TOP = 'M189.5 82A776.5 791.5 0 0 0 1742.5 82'
const BOTTOM = 'M189.5 1850A776.5 791.5 0 0 1 1742.5 1850'

export default function LogoMark({ className, title, topStyle, bottomStyle, draw = false, ready = true, stroke = 'currentColor' }) {
  const drawProps = draw
    ? { initial: { pathLength: 0 }, animate: { pathLength: ready ? 1 : 0 }, transition: { duration: DUR.slow * 1.4, ease: EASE, delay: 0.1 } }
    : {}
  return (
    <svg
      className={className}
      viewBox="116 82 1700 1768"
      fill="none"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      overflow="visible"
    >
      <motion.path d={TOP} stroke={stroke} strokeWidth="147" style={topStyle} {...drawProps} />
      <motion.path d={BOTTOM} stroke={stroke} strokeWidth="147" style={bottomStyle} {...drawProps} />
    </svg>
  )
}

export function Wordmark() {
  return (
    <span className="wordmark">
      <LogoMark className="wordmark-mark" />
      <span className="wordmark-text">CHRONOS</span>
    </span>
  )
}
