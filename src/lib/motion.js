import { cubicBezier } from 'framer-motion'

// Un solo sistema de movimiento. Espejo de --ease y --d-* en styles.css.
export const EASE = [0.22, 1, 0.36, 1]
export const easeFn = cubicBezier(...EASE)
export const DUR = { fast: 0.3, base: 0.6, slow: 1 }
export const STAGGER = 0.08
export const RISE = 24

export const GLYPHS = '01|-.:'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function seeded(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
