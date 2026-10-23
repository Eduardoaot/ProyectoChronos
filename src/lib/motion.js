// Un solo sistema de movimiento. Espejo de --ease y --d-* en styles.css.
export const EASE = [0.22, 1, 0.36, 1]
export const DUR = { fast: 0.3, base: 0.6, slow: 1 }
export const STAGGER = 0.08
export const RISE = 16

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
