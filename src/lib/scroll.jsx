import { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { easeFn, prefersReducedMotion } from './motion'

const ScrollCtx = createContext(null)

export function ScrollProvider({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ duration: 1.1, easing: easeFn })
    lenisRef.current = lenis
    let id
    const raf = (time) => {
      lenis.raf(time)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollTo = useCallback((target, opts = {}) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (el == null) return
    const lenis = lenisRef.current
    const offset = opts.offset ?? 0
    if (lenis) {
      lenis.scrollTo(el, { offset, duration: opts.duration ?? 1.4, easing: opts.easing ?? easeFn, force: true, onComplete: opts.onComplete })
    } else {
      const top = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY + offset
      window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
      opts.onComplete?.()
    }
  }, [])

  const lock = useCallback((locked) => {
    const lenis = lenisRef.current
    if (locked) lenis?.stop()
    else lenis?.start()
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
      scrollTo(el, { offset: href === '#top' ? 0 : -64, easing: easeFn })
      const focusTarget = href === '#top' ? document.getElementById('top') : el
      focusTarget?.setAttribute('tabindex', '-1')
      focusTarget?.focus({ preventScroll: true })
    },
    [scrollTo],
  )
}
