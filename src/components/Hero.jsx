import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DUR, EASE } from '../lib/motion'
import { useAnchor } from '../lib/scroll'
import { enterProps } from './Reveal'

// La foto está tomada con una sola luz. El puntero hace de segunda lámpara:
// donde pasa, el metal y la esfera ganan un poco de brillo; el negro sigue negro.
export default function Hero() {
  const ref = useRef(null)
  const frame = useRef(0)
  const reduce = useReducedMotion()
  const onAnchor = useAnchor()

  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const el = ref.current
    const { clientX, clientY } = e
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--lx', `${clientX - r.left}px`)
      el.style.setProperty('--ly', `${clientY - r.top}px`)
      el.classList.add('is-lit')
    })
  }
  const onLeave = () => {
    cancelAnimationFrame(frame.current)
    ref.current?.classList.remove('is-lit')
  }

  return (
    <section id="top" className="hero ink" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.picture
        className="hero-photo"
        initial={reduce ? false : { opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DUR.slow * 1.6, ease: EASE }}
      >
        <source media="(max-width: 799px)" srcSet="/img/reloj-movil.webp" type="image/webp" />
        <source srcSet="/img/reloj-1280.webp 1280w, /img/reloj-2200.webp 2200w" sizes="100vw" type="image/webp" />
        <img src="/img/reloj-1600.jpg" alt="Chronos One abierto, colgado de su cordón, con la tapa hacia abajo." width="3672" height="2066" fetchpriority="high" />
      </motion.picture>
      <span className="hero-lamp" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-copy">
          <motion.h1 className="t-display" {...enterProps(reduce, 1)}>
            El tiempo, en pausa.
          </motion.h1>
          <motion.p className="t-lead hero-lead" {...enterProps(reduce, 2)}>
            Un reloj de bolsillo abre una rama de la realidad que solo es tuya. La línea principal no se mueve.
          </motion.p>
          <motion.div {...enterProps(reduce, 3)}>
            <a href="#gestos" className="btn btn-primary" onClick={onAnchor}>
              Ver los tres gestos
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
