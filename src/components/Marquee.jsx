import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'framer-motion'
import LogoMark from './LogoMark'

const PHRASES = ['El tiempo, en pausa.', 'Diez usos al día.', 'La línea principal no se mueve.', 'Chronos One.']

function Track() {
  return (
    <div className="marquee-track">
      {PHRASES.map((p, i) => (
        <span key={p} className={i % 2 ? 'marquee-item is-outline' : 'marquee-item'}>
          {p}
          <LogoMark className="marquee-mark" />
        </span>
      ))}
    </div>
  )
}

// La banda avanza sola y acelera, frena o invierte con la velocidad del scroll.
export default function Marquee({ base = -2.2 }) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const dir = useRef(1)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, [-2000, 0, 2000], [-4, 0, 4], { clamp: false })
  const skew = useTransform(smooth, [-3000, 3000], [8, -8])
  const pos = useTransform(x, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    const f = factor.get()
    if (f < 0) dir.current = -1
    else if (f > 0) dir.current = 1
    let move = dir.current * base * (delta / 1000)
    move += dir.current * move * Math.abs(f)
    x.set(x.get() + move)
  })

  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee-inner" style={{ x: pos, skewX: reduce ? 0 : skew }}>
        <Track />
        <Track />
      </motion.div>
    </div>
  )
}
