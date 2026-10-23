import { createContext, useCallback, useContext } from 'react'
import { prefersReducedMotion } from './motion'

const ScrollCtx = createContext(null)

// Scroll nativo: la rueda y el dedo mueven la página sin inercia añadida.
// Solo los saltos (anclas y gestos del reloj) se animan.
export function ScrollProvider({ children }) {
  const scrollTo = useCallback((target, opts = {}) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (el == null) return
    const offset = opts.offset ?? 0
    const top = el === document.body ? 0 : el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    opts.onComplete?.()
  }, [])

  const lock = useCallback((locked) => {
    document.documentElement.classList.toggle('scroll-locked', locked)
  }, [])

  return <ScrollCtx.Provider value={{ scrollTo, lock }}>{children}</ScrollCtx.Provider>
}

export function useScrollApi() {
  return useContext(ScrollCtx)
}

export function useAnchor() {
  const { scrollTo } = useScrollApi()
  return useCallback(
    (e) => {
      const href = e.currentTarget.getAttribute('href')
      if (href == null || !href.startsWith('#')) return
      const el = href === '#top' ? document.body : document.querySelector(href)
      if (el == null) return
      e.preventDefault()
      history.replaceState(null, '', href)
      scrollTo(el, { offset: href === '#top' ? 0 : -64 })
      const focusTarget = href === '#top' ? document.getElementById('top') : el
      focusTarget?.setAttribute('tabindex', '-1')
      focusTarget?.focus({ preventScroll: true })
    },
    [scrollTo],
  )
}
