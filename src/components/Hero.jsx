import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { DUR, EASE } from '../lib/motion'
import { useAnchor } from '../lib/scroll'
import { useChronos } from '../lib/chronos'
import GlyphField from './GlyphField'
import DecodeText from './DecodeText'
import LogoMark from './LogoMark'
import { enterProps } from './Reveal'

function pad(n) {
  return String(n).padStart(2, '0')
}

function BranchClock() {
  const { branchNow } = useChronos()
  const [t, setT] = useState(() => branchNow())
  useEffect(() => {
    const id = setInterval(() => setT(branchNow()), 250)
    return () => clearInterval(id)
  }, [branchNow])
  const d = new Date(t)
  return (
    <span className="label hero-time" aria-hidden="true">
      {pad(d.getHours())}:{pad(d.getMinutes())}:{pad(d.getSeconds())}
    </span>
  )
}

export default function Hero({ ready = true }) {
  const ref = useRef(null)
  const markRef = useRef(null)
  const reduce = useReducedMotion()
  const onAnchor = useAnchor()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // El cursor separa los arcos: más cerca del centro, más abierta la rama.
  const open = useMotionValue(0)
  const openS = useSpring(open, { stiffness: 90, damping: 20 })
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rX = useSpring(tiltX, { stiffness: 80, damping: 18 })
  const rY = useSpring(tiltY, { stiffness: 80, damping: 18 })

  const scrollTop = useTransform(scrollYProgress, [0, 1], [0, -320])
  const scrollBot = useTransform(scrollYProgress, [0, 1], [0, 320])
  const topY = useTransform([scrollTop, openS], ([s, o]) => s - o)
  const botY = useTransform([scrollBot, openS], ([s, o]) => s + o)
  const axis = useTransform(scrollYProgress, [0, 0.8], [1, 0.15])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const lift = useTransform(scrollYProgress, [0, 1], [0, -90])

  const onMove = (e) => {
    const el = ref.current
    if (el == null || e.pointerType === 'touch') return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--lx', `${e.clientX - r.left}px`)
    el.style.setProperty('--ly', `${e.clientY - r.top}px`)
    el.classList.add('is-lit')
    if (reduce) return
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    tiltY.set(px * 14)
    tiltX.set(-py * 10)
    const m = markRef.current?.getBoundingClientRect()
    if (m) {
      const d = Math.hypot((e.clientX - (m.left + m.width / 2)) / m.width, (e.clientY - (m.top + m.height / 2)) / m.height)
      open.set(Math.max(0, 1 - d * 1.1) * 220)
    }
  }
  const onLeave = () => {
    ref.current?.classList.remove('is-lit')
    tiltX.set(0)
    tiltY.set(0)
    open.set(0)
  }

  return (
    <section id="top" className="hero" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
      <GlyphField />
      <motion.div className="hero-axis" aria-hidden="true" style={reduce ? undefined : { scaleX: axis }}>
        <motion.span
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: ready ? 1 : 0 }}
          transition={{ duration: DUR.slow * 1.4, ease: EASE, delay: 0.2 }}
        />
      </motion.div>

      <div className="hero-inner">
        <motion.div className="hero-copy" style={reduce ? undefined : { y: lift, opacity: fade }}>
          <motion.p className="wordmark-text hero-wordmark" {...enterProps(reduce, 0, ready)}>
            CHRONOS
          </motion.p>
          <DecodeText as="h1" className="t-display" text="El tiempo, en pausa." trigger="mount" delay={250} active={ready} />
          <motion.p className="t-lead hero-lead" {...enterProps(reduce, 2, ready)}>
            Un reloj de bolsillo abre una rama de la realidad que solo es tuya. La línea principal no se mueve.
          </motion.p>
          <motion.div {...enterProps(reduce, 3, ready)}>
            <a href="#gestos" className="btn btn-primary" onClick={onAnchor} data-magnetic>
              <span>Ver los tres gestos</span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 2v11M3 8.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          ref={markRef}
          className="hero-mark"
          style={reduce ? undefined : { rotateX: rX, rotateY: rY, transformPerspective: 900 }}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: DUR.slow, ease: EASE, delay: 0.1 }}
        >
          <LogoMark
            title="CHRONOS"
            draw={!reduce}
            ready={ready}
            topStyle={reduce ? undefined : { y: topY }}
            bottomStyle={reduce ? undefined : { y: botY }}
          />
          <span className="hero-mark-now" aria-hidden="true" />
        </motion.div>
      </div>

      <motion.div className="hero-foot" {...enterProps(reduce, 4, ready)}>
        <BranchClock />
        <span className="hero-cue" aria-hidden="true">
          <span />
        </span>
      </motion.div>
    </section>
  )
}
