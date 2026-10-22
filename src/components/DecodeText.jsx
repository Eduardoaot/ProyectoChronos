import { useEffect, useRef, useState } from 'react'
import { GLYPHS, prefersReducedMotion } from '../lib/motion'

const PER_CHAR = 38
const MAX = 950

function randomGlyph() {
  return GLYPHS[(Math.random() * GLYPHS.length) | 0]
}

// Cada letra ocupa su ancho final desde el primer frame: el glifo se dibuja encima,
// así el título no salta ni cambia de línea mientras se asienta.
export default function DecodeText({ text, as: Tag = 'span', className, delay = 0, trigger = 'view', active = true, ...rest }) {
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(text.length)
  const [, setTick] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (el == null || prefersReducedMotion()) return
    const r = el.getBoundingClientRect()
    if (trigger === 'view' && r.top < window.innerHeight && r.bottom > 0) return
    if (!active) {
      setRevealed(0)
      return
    }

    const duration = Math.min(MAX, text.length * PER_CHAR)
    let raf = 0
    let start = 0
    let done = false
    setRevealed(0)

    const tick = (t) => {
      if (!start) start = t + delay
      const p = Math.max(0, Math.min(1, (t - start) / duration))
      setRevealed(Math.floor(p * text.length))
      setTick((n) => n + 1)
      if (p >= 1) {
        done = true
        return
      }
      raf = requestAnimationFrame(tick)
    }

    if (trigger === 'mount') {
      raf = requestAnimationFrame(tick)
      return () => {
        cancelAnimationFrame(raf)
        if (!done) setRevealed(text.length)
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          raf = requestAnimationFrame(tick)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      if (!done) setRevealed(text.length)
    }
  }, [text, delay, trigger, active])

  const words = text.split(' ')
  let index = 0

  return (
    <Tag ref={ref} className={className} {...rest}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="decode">
        {words.map((word, w) => {
          const chars = word.split('').map((c) => {
            const i = index++
            const hidden = i >= revealed
            return (
              <span key={i} className={hidden ? 'ch is-hidden' : 'ch'} data-g={hidden ? randomGlyph() : undefined}>
                {c}
              </span>
            )
          })
          index++
          return (
            <span key={w} className="word">
              {chars}
              {w < words.length - 1 ? ' ' : ''}
            </span>
          )
        })}
      </span>
    </Tag>
  )
}
