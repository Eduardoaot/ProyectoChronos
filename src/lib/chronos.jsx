import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useScrollApi } from './scroll'

const ChronosCtx = createContext(null)
const WINDOW_MS = 700
const MAX_USES = 10

export function statusText(gesture, uses) {
  if (uses === 0) return 'Hoy ya no hay usos. Mañana reinician.'
  switch (gesture) {
    case 'pause':
      return 'Pausa. Tu rama está quieta.'
    case 'back':
      return 'Diez segundos atrás. Tú los recuerdas.'
    case 'forward':
      return 'Diez segundos adelante. Tu cuerpo no se movió.'
    default:
      return `Listo. Te quedan ${uses} usos hoy.`
  }
}

export function ChronosProvider({ children }) {
  const { scrollTo, lock } = useScrollApi()
  const [uses, setUses] = useState(MAX_USES)
  const [gesture, setGesture] = useState('idle')
  const [paused, setPaused] = useState(false)
  const [pips, setPips] = useState(0)
  const [fx, setFx] = useState(null)

  const count = useRef(0)
  const fired = useRef(false)
  const timer = useRef(0)
  const usesRef = useRef(uses)
  const pausedRef = useRef(paused)
  usesRef.current = uses
  pausedRef.current = paused

  // El reloj marca la hora real. La pausa solo lo congela mientras dura.
  const frozenAt = useRef(null)

  const branchNow = useCallback(() => {
    if (frozenAt.current != null) return frozenAt.current
    return Date.now()
  }, [])

  const setPause = useCallback(
    (on) => {
      frozenAt.current = on ? Date.now() : null
      setPaused(on)
      lock(on)
    },
    [lock],
  )

  const run = useCallback(
    (n) => {
      const wasPaused = pausedRef.current
      if (wasPaused) setPause(false)
      if (n === 1 && wasPaused) {
        setGesture('idle')
        return
      }
      if (usesRef.current <= 0) return
      setUses((u) => u - 1)
      if (n === 1) {
        setGesture('pause')
        setPause(true)
        return
      }
      const kind = n === 2 ? 'back' : 'forward'
      setGesture(kind)
      const id = Date.now()
      setFx({ kind, id })
      setTimeout(() => setFx((f) => (f?.id === id ? null : f)), 2200)
      const target = kind === 'back' ? document.body : document.getElementById('pie')
      requestAnimationFrame(() => scrollTo(target))
    },
    [scrollTo, setPause],
  )

  const press = useCallback(() => {
    if (usesRef.current <= 0 && !pausedRef.current) return
    if (fired.current) {
      clearTimeout(timer.current)
      timer.current = setTimeout(reset, WINDOW_MS)
      return
    }
    count.current += 1
    setPips(count.current)
    clearTimeout(timer.current)
    if (count.current >= 3) {
      fired.current = true
      run(3)
      timer.current = setTimeout(reset, WINDOW_MS)
      return
    }
    timer.current = setTimeout(() => {
      run(count.current)
      reset()
    }, WINDOW_MS)

    function reset() {
      count.current = 0
      fired.current = false
      setPips(0)
    }
  }, [run])

  useEffect(() => {
    if (!paused) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setPause(false)
        setGesture('idle')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [paused, setPause])

  useEffect(() => () => clearTimeout(timer.current), [])

  const value = useMemo(
    () => ({ uses, max: MAX_USES, gesture, paused, pips, fx, press, branchNow, status: statusText(gesture, uses) }),
    [uses, gesture, paused, pips, fx, press, branchNow],
  )
  return <ChronosCtx.Provider value={value}>{children}</ChronosCtx.Provider>
}

export function useChronos() {
  return useContext(ChronosCtx)
}
