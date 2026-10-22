import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useAnimationControls, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useChronos } from '../lib/chronos'
import { DUR, EASE } from '../lib/motion'

const CX = 200
const CY = 290
const TZ = new Date().getTimezoneOffset() * 60000

function polar(r, deg) {
  const a = ((deg - 90) * Math.PI) / 180
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
}

function arcPath(r, from, to) {
  const [x1, y1] = polar(r, from)
  const [x2, y2] = polar(r, to)
  return `M${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}`
}

const TICKS = Array.from({ length: 60 }, (_, i) => {
  const major = i % 5 === 0
  const quarter = i % 15 === 0
  const [x1, y1] = polar(major ? 122 : 131, i * 6)
  const [x2, y2] = polar(139, i * 6)
  return { i, x1, y1, x2, y2, major, quarter }
})

export default function Watch() {
  const { press, pips, uses, paused, fx, branchNow } = useChronos()
  const reduce = useReducedMotion()
  const hourRef = useRef(null)
  const minRef = useRef(null)
  const secRef = useRef(null)
  const sweepRef = useRef(null)
  const digitalRef = useRef(null)
  const jumpRef = useRef(0)
  const shaker = useAnimationControls()

  // Sin usos el aparato se sobrecalienta: metal al rojo, aire que vibra, Tempus que hierve.
  const hot = uses <= 0
  const hotRef = useRef(hot)
  hotRef.current = hot
  const metal = hot ? 'url(#hot)' : 'url(#gold)'

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 80, damping: 18 })
  const sry = useSpring(ry, { stiffness: 80, damping: 18 })

  useEffect(() => {
    let raf
    let shown = branchNow()
    let last = performance.now()
    const tick = (now) => {
      const dt = now - last
      last = now
      const target = branchNow()
      shown += paused ? 0 : dt
      if (jumpRef.current) {
        shown += jumpRef.current
        jumpRef.current = 0
      }
      const diff = target - shown
      shown = reduce || Math.abs(diff) < 2 ? target : shown + diff * 0.075
      const local = shown - TZ
      const jitter = hotRef.current && !reduce ? (Math.random() - 0.5) * 4 : 0
      const s = (local / 1000) % 60
      const m = (local / 60000) % 60
      const h = (local / 3600000) % 12
      secRef.current?.setAttribute('transform', `rotate(${s * 6 + jitter} ${CX} ${CY})`)
      minRef.current?.setAttribute('transform', `rotate(${m * 6} ${CX} ${CY})`)
      hourRef.current?.setAttribute('transform', `rotate(${h * 30} ${CX} ${CY})`)
      if (digitalRef.current) {
        const d = new Date(target)
        const txt = [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':')
        if (digitalRef.current.textContent !== txt) digitalRef.current.textContent = txt
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [branchNow, paused, reduce])

  useEffect(() => {
    if (fx == null || sweepRef.current == null) return
    jumpRef.current = fx.kind === 'back' ? -10000 : 10000
    const local = branchNow() - TZ
    const s = ((local / 1000) % 60) * 6
    const from = fx.kind === 'back' ? s + 60 : s - 60
    sweepRef.current.setAttribute('d', arcPath(150, Math.min(from, s), Math.max(from, s)))
  }, [fx, branchNow])

  const onMove = (e) => {
    if (reduce || e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * 16)
    rx.set(-py * 12)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  const blocked = hot && !paused
  const use = () => {
    if (blocked) {
      if (!reduce) shaker.start({ x: [0, -12, 11, -8, 7, -4, 3, 0], transition: { duration: 0.55, ease: 'easeOut' } })
    }
    else press()
  }

  return (
    <div className={`watch-stage ${hot ? 'is-hot' : ''}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <AnimatePresence>
        {hot && (
          <motion.div
            className="watch-alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.base, ease: EASE }}
          >
            <span className="watch-alert-dot" aria-hidden="true" />
            <span className="label">Sobrecalentado</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`watch-tilt ${reduce ? '' : 'is-floating'} ${blocked ? 'is-dead' : ''}`}
        data-cursor={blocked ? 'default' : 'label'}
        data-cursor-label={paused ? 'Seguir' : 'Presiona'}
        style={{ rotateX: srx, rotateY: sry }}
        onClick={use}
      >
        <motion.div animate={shaker}>
          <span className="watch-halo" aria-hidden="true" />
          {hot && !reduce && (
            <span className="steam" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} style={{ '--i': i }} />
              ))}
            </span>
          )}

          <svg viewBox="0 0 400 480" className="watch" role="img" aria-label={hot ? 'Chronos One, reloj de bolsillo, sobrecalentado' : 'Chronos One, reloj de bolsillo'}>
            <defs>
              <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f1dfb0" />
                <stop offset="0.35" stopColor="#c8a96a" />
                <stop offset="0.65" stopColor="#8e7038" />
                <stop offset="1" stopColor="#d9bf85" />
              </linearGradient>
              <linearGradient id="hot" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffe0a8" />
                <stop offset="0.35" stopColor="#ff7a2f" />
                <stop offset="0.7" stopColor="#b3260e" />
                <stop offset="1" stopColor="#ff9a4d" />
              </linearGradient>
              <radialGradient id="case" cx="0.38" cy="0.3" r="0.85">
                <stop offset="0" stopColor="#2a2a28" />
                <stop offset="0.55" stopColor="#0e0e0d" />
                <stop offset="1" stopColor="#030303" />
              </radialGradient>
              <radialGradient id="dial" cx="0.5" cy="0.42" r="0.7">
                <stop offset="0" stopColor="#121211" />
                <stop offset="1" stopColor="#040404" />
              </radialGradient>
              <radialGradient id="ember" cx="0.5" cy="0.62" r="0.6">
                <stop offset="0" stopColor="#ff5a1f" stopOpacity="0.55" />
                <stop offset="0.6" stopColor="#b3260e" stopOpacity="0.18" />
                <stop offset="1" stopColor="#b3260e" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <clipPath id="tempus-clip">
                <circle cx={CX} cy={CY + 66} r="22" />
              </clipPath>
              <filter id="heat" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.012 0.07" numOctaves="2" seed="4" result="noise">
                  <animate attributeName="baseFrequency" dur="2.4s" values="0.012 0.07;0.016 0.1;0.012 0.07" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G">
                  <animate attributeName="scale" dur="1.6s" values="4;8;4" repeatCount="indefinite" />
                </feDisplacementMap>
              </filter>
            </defs>

            <g filter={hot && !reduce ? 'url(#heat)' : undefined}>
              <ellipse cx={CX} cy="40" rx="25" ry="27" fill="none" stroke={metal} strokeWidth="6" />
              <motion.g
                key={pips}
                initial={reduce || pips === 0 ? false : { y: 5 }}
                animate={{ y: 0 }}
                transition={{ duration: DUR.fast, ease: EASE }}
              >
                <rect x="174" y="70" width="52" height="30" rx="5" fill={metal} />
                {Array.from({ length: 9 }, (_, i) => (
                  <line key={i} x1={180 + i * 5} y1="73" x2={180 + i * 5} y2="97" stroke={hot ? '#6e1a0a' : '#6e5629'} strokeWidth="1" opacity="0.55" />
                ))}
              </motion.g>
              <rect x="186" y="100" width="28" height="28" fill={metal} />
              <rect x="182" y="120" width="36" height="8" fill={hot ? '#8a2410' : '#8e7038'} />

              <circle cx={CX} cy={CY} r="166" fill="url(#case)" />
              <circle cx={CX} cy={CY} r="165" fill="none" stroke={metal} strokeWidth="2.5" />
              <circle cx={CX} cy={CY} r="156" fill="none" stroke={hot ? '#3a120a' : '#1c1c1b'} strokeWidth="12" />
              <circle cx={CX} cy={CY} r="149.5" fill="none" stroke={metal} strokeWidth="0.8" opacity="0.8" />
              <circle cx={CX} cy={CY} r="148" fill="url(#dial)" />
              {hot && <circle className="watch-ember" cx={CX} cy={CY} r="148" fill="url(#ember)" />}

              <path ref={sweepRef} key={fx?.id ?? 'none'} className="watch-sweep" d="" fill="none" stroke="#e6cf98" strokeWidth="3" />

              {TICKS.map((t) => (
                <line
                  key={t.i}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={t.quarter ? (hot ? '#ff7a2f' : '#c8a96a') : '#e9e9e6'}
                  strokeOpacity={t.quarter ? 1 : t.major ? 0.75 : 0.28}
                  strokeWidth={t.quarter ? 3 : t.major ? 2 : 1}
                />
              ))}
              <circle cx={CX} cy={CY} r="108" fill="none" stroke="#e9e9e6" strokeOpacity="0.07" />
              <text ref={digitalRef} className="watch-digital" x={CX} y={CY + 112} textAnchor="middle" />

              <circle cx={CX} cy={CY + 66} r="27" fill="#050505" stroke={metal} strokeWidth="1" />
              <g clipPath="url(#tempus-clip)">
                <path className={`tempus ${hot ? 'is-hot' : ''}`} d="M186 351c4-9 17-12 26-7 8 4 11 13 7 21-3 7-11 10-18 9-9-1-14-4-16-10-1-5-1-9 1-13z" />
                {hot && !reduce && (
                  <g className="bubbles">
                    <circle cx="192" cy="368" r="2.2" />
                    <circle cx="204" cy="372" r="1.6" />
                    <circle cx="212" cy="366" r="2.6" />
                  </g>
                )}
              </g>
              <circle cx={CX} cy={CY + 66} r="22" fill="none" stroke="#000" strokeOpacity="0.6" strokeWidth="2" />

              <g ref={hourRef}>
                <path d={`M${CX - 4} ${CY + 14}L${CX - 2.5} ${CY - 72}L${CX} ${CY - 78}L${CX + 2.5} ${CY - 72}L${CX + 4} ${CY + 14}Z`} fill="#efefec" />
              </g>
              <g ref={minRef}>
                <path d={`M${CX - 2.6} ${CY + 18}L${CX - 1.6} ${CY - 116}L${CX} ${CY - 122}L${CX + 1.6} ${CY - 116}L${CX + 2.6} ${CY + 18}Z`} fill="#efefec" />
              </g>
              <g ref={secRef}>
                <line x1={CX} y1={CY + 30} x2={CX} y2={CY - 134} stroke={hot ? '#ff7a2f' : '#d4b676'} strokeWidth="1.4" />
                <circle cx={CX} cy={CY + 30} r="4.5" fill={hot ? '#ff7a2f' : '#d4b676'} />
              </g>
              <circle cx={CX} cy={CY} r="6.5" fill={metal} />
              <circle cx={CX} cy={CY} r="2" fill="#050505" />
            </g>

            <path d={`M${CX - 128} ${CY - 40}A148 148 0 0 1 ${CX + 92} ${CY - 116}A170 170 0 0 0 ${CX - 128} ${CY - 40}Z`} fill="url(#glass)" />
          </svg>
        </motion.div>

        <button
          type="button"
          className="crown-btn"
          aria-label={blocked ? 'Usar Chronos One. Sin usos hoy.' : 'Usar Chronos One'}
          aria-disabled={blocked || undefined}
          data-cursor={blocked ? 'default' : 'label'}
          data-cursor-label={paused ? 'Seguir' : 'Presiona'}
          onClick={(e) => {
            e.stopPropagation()
            use()
          }}
        />
      </motion.div>
    </div>
  )
}
