import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const TEXT = 'La línea principal no se mueve. Diez usos al día. El undécimo no entra. Si dejas de pagar, la rama se cierra.'

function Word({ progress, range, children }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const y = useTransform(progress, range, [6, 0])
  return (
    <span className="manifesto-word">
      <motion.span style={{ opacity, y }}>{children}</motion.span>{' '}
    </span>
  )
}

// Las palabras se encienden al ritmo del scroll, en los dos sentidos.
export default function Manifesto() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] })
  const words = TEXT.split(' ')

  return (
    <section className="section manifesto" aria-label="Condiciones del aparato">
      <div className="wrap">
        <p ref={ref} className="manifesto-text">
          {reduce
            ? TEXT
            : words.map((w, i) => (
                <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                  {w}
                </Word>
              ))}
        </p>
      </div>
    </section>
  )
}
