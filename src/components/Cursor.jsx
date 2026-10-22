import { useEffect, useRef, useState } from 'react'
import { useChronos } from '../lib/chronos'
import { prefersReducedMotion } from '../lib/motion'

const INTERACTIVE = '[data-cursor], a, button, input, textarea, select, label, canvas'

function readKind(el) {
  if (el == null) return { kind: 'default', label: '' }
  if (el.dataset.cursor) return { kind: el.dataset.cursor, label: el.dataset.cursorLabel ?? '' }
  if (el.matches('input:not([type=checkbox]):not([type=range]), textarea')) return { kind: 'text', label: '' }
  if (el.matches('canvas')) return { kind: 'draw', label: '' }
  if (el.matches(':disabled, [aria-disabled=true]')) return { kind: 'default', label: '' }
  return { kind: 'link', label: '' }
}

// Cursor propio en punteros finos. También mueve los elementos [data-magnetic]
// y alimenta el foco de luz de las piezas .spot.
export default function Cursor() {
  const { paused } = useChronos()
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion(),
  )
  const [state, setState] = useState({ kind: 'default', label: '' })
  const [visible, setVisible] = useState(false)
  const [down, setDown] = useState(false)
  const ringRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    const onSpot = (e) => {
      const spot = e.target.closest?.('.spot')
      if (spot == null) return
      const r = spot.getBoundingClientRect()
      spot.style.setProperty('--mx', `${e.clientX - r.left}px`)
      spot.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    window.addEventListener('pointermove', onSpot, { passive: true })
    return () => window.removeEventListener('pointermove', onSpot)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('has-cursor')

    let x = -100
    let y = -100
    let rx = x
    let ry = y
    let raf = 0
    let current = 'default|'
    let magnet = null

    const release = () => {
      if (magnet) magnet.style.transform = ''
      magnet = null
    }

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      setVisible(true)
      const el = e.target.closest?.(INTERACTIVE)
      const next = readKind(el)
      const key = `${next.kind}|${next.label}`
      if (key !== current) {
        current = key
        setState(next)
      }
      const m = e.target.closest?.('[data-magnetic]')
      if (m !== magnet) release()
      if (m) {
        magnet = m
        const r = m.getBoundingClientRect()
        const dx = (x - (r.left + r.width / 2)) * 0.28
        const dy = (y - (r.top + r.height / 2)) * 0.36
        m.style.transform = `translate(${dx}px, ${dy}px)`
      }
    }

    const tick = () => {
      rx += (x - rx) * 0.2
      ry += (y - ry) * 0.2
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    // Al hacer scroll el elemento bajo el cursor cambia sin que el mouse se mueva.
    const onScroll = () => {
      if (x < 0) return
      const el = document.elementFromPoint(x, y)
      if (el == null) return
      onMove({ clientX: x, clientY: y, target: el })
    }

    const onDown = () => setDown(true)
    const onUp = () => setDown(false)
    const onLeave = () => {
      setVisible(false)
      release()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      root.classList.remove('has-cursor')
      release()
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      className={`cursor ${visible ? 'is-visible' : ''} ${down ? 'is-down' : ''} ${paused ? 'is-paused' : ''}`}
      data-kind={state.kind}
      aria-hidden="true"
    >
      <div ref={ringRef} className="cursor-ring-pos">
        <div className="cursor-ring">
          <span className="cursor-label">{state.label}</span>
        </div>
      </div>
      <div ref={dotRef} className="cursor-dot-pos">
        <div className="cursor-dot" />
      </div>
    </div>
  )
}
