import { motion, useReducedMotion } from 'framer-motion'
import { DUR, EASE, RISE, STAGGER } from '../lib/motion'

// Única entrada para todo lo que no es título: sube RISE px, se enfoca, una vez.
export default function Reveal({ as = 'div', index = 0, children, className, ...rest }) {
  const reduce = useReducedMotion()
  const Comp = motion[as]
  if (reduce) return <Comp className={className} {...rest}>{children}</Comp>
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: RISE, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: DUR.slow, ease: EASE, delay: index * STAGGER }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

export function enterProps(reduce, index = 0, ready = true) {
  if (reduce) return {}
  const hidden = { opacity: 0, y: RISE, filter: 'blur(6px)' }
  return {
    initial: hidden,
    animate: ready ? { opacity: 1, y: 0, filter: 'blur(0px)' } : hidden,
    transition: { duration: DUR.slow, ease: EASE, delay: 0.1 + index * STAGGER * 1.5 },
  }
}
