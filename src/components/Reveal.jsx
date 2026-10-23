import { motion, useReducedMotion } from 'framer-motion'
import { DUR, EASE, RISE, STAGGER } from '../lib/motion'

// Única entrada para todo lo que no es título: sube RISE px y aparece, una vez.
// Solo opacidad y transform: nada que obligue a repintar mientras se hace scroll.
export default function Reveal({ as = 'div', index = 0, children, className, ...rest }) {
  const reduce = useReducedMotion()
  const Comp = motion[as]
  if (reduce) return <Comp className={className} {...rest}>{children}</Comp>
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: RISE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: DUR.base, ease: EASE, delay: index * STAGGER }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

export function enterProps(reduce, index = 0) {
  if (reduce) return {}
  return {
    initial: { opacity: 0, y: RISE },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DUR.slow, ease: EASE, delay: 0.15 + index * STAGGER * 1.5 },
  }
}
