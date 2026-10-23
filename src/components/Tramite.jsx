import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { DUR, EASE, RISE, STAGGER } from '../lib/motion'
import { useScrollApi } from '../lib/scroll'
import {
  COPIES,
  COUNTRIES,
  DAYS,
  STEPS,
  TERMS,
  clearTramite,
  documentRows,
  documentText,
  emptyTramite,
  loadTramite,
  makeFolio,
  minutes,
  queuePosition,
  saveTramite,
  validate,
} from '../lib/tramite'
import LogoMark from './LogoMark'
import Reveal from './Reveal'

/* ---------- Piezas de formulario ---------- */

function Err({ id, children }) {
  return (
    <AnimatePresence initial={false}>
      {children && (
        <motion.p
          id={id}
          className="field-err"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUR.fast, ease: EASE }}
        >
          {children}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

function Field({ id, label, error, as = 'input', children, ...input }) {
  const Comp = as
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <Comp id={id} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} {...input}>
        {children}
      </Comp>
      <span className="field-line" aria-hidden="true" />
      <Err id={`${id}-err`}>{error}</Err>
    </div>
  )
}

/* ---------- Firma ---------- */

function SignaturePad({ value, name, onChange, error }) {
  const ref = useRef(null)
  const drawing = useRef(false)
  const last = useRef(null)

  const setup = useCallback(() => {
    const c = ref.current
    if (c == null) return null
    const dpr = window.devicePixelRatio || 1
    const w = c.clientWidth
    const h = c.clientHeight
    if (c.width !== Math.round(w * dpr)) {
      c.width = Math.round(w * dpr)
      c.height = Math.round(h * dpr)
    }
    const ctx = c.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 2.2
    ctx.strokeStyle = getComputedStyle(c).color
    ctx.fillStyle = getComputedStyle(c).color
    return { ctx, w, h }
  }, [])

  useEffect(() => {
    const s = setup()
    if (s == null || !value) return
    const img = new Image()
    img.onload = () => s.ctx.drawImage(img, 0, 0, s.w, s.h)
    img.src = value
  }, [])

  const point = (e) => {
    const r = ref.current.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const down = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drawing.current = true
    last.current = point(e)
    const s = setup()
    s.ctx.beginPath()
    s.ctx.arc(last.current.x, last.current.y, 1.1, 0, Math.PI * 2)
    s.ctx.fill()
  }
  const move = (e) => {
    if (!drawing.current) return
    const ctx = ref.current.getContext('2d')
    const p = point(e)
    const m = { x: (last.current.x + p.x) / 2, y: (last.current.y + p.y) / 2 }
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.quadraticCurveTo(last.current.x, last.current.y, m.x, m.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    last.current = p
  }
  const up = () => {
    if (!drawing.current) return
    drawing.current = false
    onChange(ref.current.toDataURL('image/png'))
  }

  const clear = () => {
    const s = setup()
    s.ctx.clearRect(0, 0, s.w, s.h)
    onChange(null)
  }

  const typed = () => {
    const s = setup()
    s.ctx.clearRect(0, 0, s.w, s.h)
    const size = Math.min(44, s.w / Math.max(6, name.length * 0.62))
    s.ctx.font = `italic 300 ${size}px "Space Grotesk", Arial, sans-serif`
    s.ctx.textBaseline = 'middle'
    s.ctx.fillText(name.trim() || 'Firma', 20, s.h / 2)
    onChange(ref.current.toDataURL('image/png'))
  }

  return (
    <div className={`sign ${error ? 'has-error' : ''}`}>
      <div className="sign-head">
        <span className="label">Firma</span>
        <div className="sign-actions">
          <button type="button" className="link link-quiet" onClick={typed}>
            Firmar con mi nombre
          </button>
          <button type="button" className="link link-quiet" onClick={clear}>
            Borrar
          </button>
        </div>
      </div>
      <canvas
        ref={ref}
        className="sign-pad"
        aria-label="Área de firma. Dibuja con el mouse o el dedo, o usa Firmar con mi nombre."
        role="img"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      />
      <Err id="sign-err">{error}</Err>
    </div>
  )
}

/* ---------- Rutina en 24 horas ---------- */

function DayBar({ entry, exit }) {
  const a = entry ? minutes(entry) / 1440 : 0
  const b = exit ? minutes(exit) / 1440 : 0
  const ok = b > a
  return (
    <div className="daybar" aria-hidden="true">
      <div className="daybar-track">
        <motion.span
          className="daybar-fill"
          initial={false}
          animate={{ left: `${a * 100}%`, width: `${ok ? (b - a) * 100 : 0}%` }}
          transition={{ duration: DUR.base, ease: EASE }}
        />
        {[0, 6, 12, 18, 24].map((h) => (
          <span key={h} className="daybar-tick" style={{ left: `${(h / 24) * 100}%` }} />
        ))}
      </div>
      <div className="daybar-scale label">
        <span>00</span>
        <span>06</span>
        <span>12</span>
        <span>18</span>
        <span>24</span>
      </div>
    </div>
  )
}

/* ---------- Copias ---------- */

function Copies({ stamps, onStamp }) {
  const reduce = useReducedMotion()
  return (
    <div className="copies">
      {Array.from({ length: COPIES }, (_, i) => {
        const done = i < stamps
        const next = i === stamps
        return (
          <button
            key={i}
            type="button"
            className={`copy ${done ? 'is-stamped' : ''} ${next ? 'is-next' : ''}`}
            disabled={!next}
            onClick={onStamp}
            aria-label={done ? `Copia ${i + 1}, sellada` : `Sellar copia ${i + 1}`}
          >
            <span className="copy-lines" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span className="label">{String(i + 1).padStart(2, '0')}</span>
            <AnimatePresence>
              {done && (
                <motion.span
                  className="copy-stamp"
                  aria-hidden="true"
                  initial={reduce ? false : { scale: 2.4, opacity: 0, rotate: -30 }}
                  animate={{ scale: 1, opacity: 1, rotate: -12 }}
                  transition={{ duration: DUR.fast, ease: [0.5, 0, 0.2, 1.4] }}
                >
                  <LogoMark className="copy-stamp-mark" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )
      })}
    </div>
  )
}

/* ---------- Constancia ---------- */

function Constancia({ t, onReset }) {
  const reduce = useReducedMotion()
  const rows = documentRows(t)
  const total = rows.reduce((n, [, v]) => n + v.length, 0)
  const seenKey = `chronos-typed-${t.folio}`
  const [typed, setTyped] = useState(() => {
    try {
      return reduce || sessionStorage.getItem(seenKey) ? total : 0
    } catch {
      return total
    }
  })
  const [now, setNow] = useState(Date.now())
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typed >= total) {
      try {
        sessionStorage.setItem(seenKey, '1')
      } catch {}
      return
    }
    const id = requestAnimationFrame(() => setTyped((c) => Math.min(total, c + 3)))
    return () => cancelAnimationFrame(id)
  }, [typed, total, seenKey])

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const pos = queuePosition(t, now)
  const finished = typed >= total

  const download = () => {
    const blob = new Blob([documentText(t)], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `constancia-${t.folio}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(t.folio)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {}
  }

  let offset = 0
  return (
    <div className="constancia-wrap">
      <p className="t-h3" role="status">
        Quedaste en la fila. Esta página no envió tus datos a ningún servidor.
      </p>

      <div className="queue">
        <span className="label">Lugar en la fila</span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={pos}
            className="queue-n"
            initial={reduce ? false : { y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
            transition={{ duration: DUR.base, ease: EASE }}
          >
            {pos?.toLocaleString('es-MX')}
          </motion.span>
        </AnimatePresence>
        <span className="label">{pos === 1 ? 'Es tu turno. Lleva las diez copias.' : 'La fila avanza sola.'}</span>
      </div>

      <article className="constancia" aria-label={`Constancia ${t.folio}`}>
        <header className="constancia-head">
          <span className="wordmark">
            <LogoMark className="wordmark-mark" />
            <span className="wordmark-text">CHRONOS</span>
          </span>
          <span className="label">Constancia de registro de rama</span>
        </header>
        <dl className="constancia-rows">
          {rows.map(([k, v]) => {
            const start = offset
            offset += v.length
            const shown = Math.max(0, Math.min(v.length, typed - start))
            const active = typed >= start && typed < start + v.length
            if (typed < start) return null
            return (
              <div key={k} className="constancia-row">
                <dt className="label">{k}</dt>
                <dd>
                  {v.slice(0, shown)}
                  {active && <span className="caret" aria-hidden="true" />}
                </dd>
              </div>
            )
          })}
        </dl>
        <AnimatePresence>
          {finished && (
            <motion.div
              className="constancia-foot"
              initial={reduce ? false : { opacity: 0, y: RISE }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DUR.slow, ease: EASE }}
            >
              <ol className="constancia-terms">
                {TERMS.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ol>
              <div className="constancia-sign">
                {t.data.signature && <img src={t.data.signature} alt="Firma del titular" />}
                <span className="label">Firma del titular</span>
              </div>
              <motion.span
                className="constancia-seal"
                aria-hidden="true"
                initial={reduce ? false : { scale: 2.6, opacity: 0, rotate: -40 }}
                animate={{ scale: 1, opacity: 1, rotate: -14 }}
                transition={{ duration: DUR.base, ease: [0.5, 0, 0.2, 1.4], delay: 0.4 }}
              >
                <LogoMark className="constancia-seal-mark" />
                <span>Sellado</span>
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </article>

      <div className="constancia-actions">
        <button type="button" className="btn btn-primary" onClick={download} disabled={!finished}>
          <span>Descargar constancia</span>
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => window.print()} disabled={!finished}>
          <span>Imprimir</span>
        </button>
        <button type="button" className="link" onClick={copy}>
          {copied ? 'Folio copiado' : 'Copiar folio'}
        </button>
        <button type="button" className="link link-quiet" onClick={onReset}>
          Empezar otro trámite
        </button>
      </div>
    </div>
  )
}

/* ---------- Trámite ---------- */

export default function Tramite() {
  const reduce = useReducedMotion()
  const { scrollTo } = useScrollApi()
  const [t, setT] = useState(loadTramite)
  const [errors, setErrors] = useState({})
  const [dir, setDir] = useState(1)
  const headRef = useRef(null)
  const sectionRef = useRef(null)
  const firstRender = useRef(true)

  useEffect(() => saveTramite(t), [t])

  // Un error desaparece en cuanto el dato se corrige, sin esperar al siguiente envío.
  useEffect(() => {
    setErrors((prev) => {
      const keys = Object.keys(prev)
      if (keys.length === 0) return prev
      const now = validate(t.step, t.data)
      const kept = keys.filter((k) => now[k])
      if (kept.length === keys.length && kept.every((k) => now[k] === prev[k])) return prev
      return Object.fromEntries(kept.map((k) => [k, now[k]]))
    })
  }, [t.data, t.step])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headRef.current?.focus({ preventScroll: true })
    const r = sectionRef.current?.getBoundingClientRect()
    if (r && r.top < 0) scrollTo(sectionRef.current, { offset: -64, duration: 0.9 })
  }, [t.step, scrollTo])

  const d = t.data
  const set = (patch) => setT((s) => ({ ...s, data: { ...s.data, ...patch } }))

  const go = (step) => {
    setDir(step > t.step ? 1 : -1)
    setErrors({})
    setT((s) => ({ ...s, step }))
  }

  const next = (e) => {
    e?.preventDefault()
    const errs = validate(t.step, d)
    setErrors(errs)
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => {
        const first = document.querySelector('#tramite [aria-invalid="true"], #tramite .has-error input, #tramite .has-error button, #tramite .sign.has-error canvas')
        first?.focus()
      })
      return
    }
    go(t.step + 1)
  }

  const stamp = () => setT((s) => ({ ...s, stamps: Math.min(COPIES, s.stamps + 1) }))

  const deliver = () => {
    setDir(1)
    setT((s) => ({
      ...s,
      step: 4,
      folio: makeFolio(s.data),
      createdAt: Date.now(),
      queueStart: 3000 + Math.floor(Math.random() * 6000),
    }))
  }

  const reset = () => {
    clearTramite()
    setErrors({})
    setDir(-1)
    setT(emptyTramite())
  }

  const toggleDay = (day) => set({ days: d.days.includes(day) ? d.days.filter((x) => x !== day) : [...d.days, day] })

  const variants = {
    enter: (k) => ({ opacity: 0, x: k * 24 }),
    center: { opacity: 1, x: 0 },
    exit: (k) => ({ opacity: 0, x: k * -24 }),
  }

  const title = [
    'Quién eres.',
    'Tu rutina.',
    'Las condiciones.',
    'Diez copias.',
    'Tu constancia.',
  ][t.step]

  const hint = [
    'El registro empieza por tu nombre.',
    'Tu lugar en la línea principal sigue esta rutina.',
    'Léelas. Después firma.',
    'Cada una lleva tu sello. En orden.',
    'Se escribe con tus datos. Se queda en tu navegador.',
  ][t.step]

  return (
    <section id="tramite" ref={sectionRef} className="section signup" aria-labelledby="tramite-title">
      <div className="wrap split tramite-grid">
        <div className="tramite-side">
          <Reveal as="h2" id="tramite-title" className="t-h2">
            Pedir el trámite.
          </Reveal>
          <Reveal as="p" className="t-lead" index={1}>
            El registro empieza por tu nombre. Las diez copias vienen después.
          </Reveal>

          <Reveal as="ol" className="stepper" index={2} aria-label="Pasos del trámite">
            {STEPS.map((s, i) => {
              const state = i < t.step ? 'done' : i === t.step ? 'current' : 'todo'
              const canGo = i < t.step && t.step < 4
              return (
                <li key={s} className={`stepper-item is-${state}`}>
                  <button type="button" disabled={!canGo} onClick={() => go(i)} aria-current={state === 'current' ? 'step' : undefined}>
                    <span className="stepper-name">{s}</span>
                  </button>
                </li>
              )
            })}
          </Reveal>
        </div>

        <Reveal className="tramite-card" index={1}>
          <div className="tramite-progress" aria-hidden="true">
            <motion.span initial={false} animate={{ scaleX: (t.step + 1) / STEPS.length }} transition={{ duration: DUR.slow, ease: EASE }} />
          </div>
          <div className="tramite-head">
            <span className="label">
              Paso {t.step + 1} de {STEPS.length}
            </span>
            {t.folio && <span className="label label-gold">Folio {t.folio}</span>}
          </div>

          <div className="tramite-body">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={t.step}
                custom={dir}
                variants={reduce ? undefined : variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: DUR.base, ease: EASE }}
              >
                <h3 ref={headRef} tabIndex={-1} className="t-h3 tramite-title">
                  {title}
                </h3>
                <p className="tramite-hint">{hint}</p>

                {t.step === 0 && (
                  <form noValidate onSubmit={next}>
                    <Field id="f-name" label="Nombre completo" autoComplete="name" value={d.name} onChange={(e) => set({ name: e.target.value })} error={errors.name} />
                    <Field
                      id="f-mail"
                      label="Correo electrónico"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={d.email}
                      onChange={(e) => set({ email: e.target.value })}
                      error={errors.email}
                    />
                    <div className="field-pair">
                      <Field id="f-birth" label="Fecha de nacimiento" type="date" value={d.birth} onChange={(e) => set({ birth: e.target.value })} error={errors.birth} />
                      <Field id="f-country" as="select" label="País de registro" value={d.country} onChange={(e) => set({ country: e.target.value })} error={errors.country}>
                        <option value="">Elige uno</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <StepNav onBack={null} label="Siguiente" />
                  </form>
                )}

                {t.step === 1 && (
                  <form noValidate onSubmit={next}>
                    <div className="field-pair">
                      <Field id="f-entry" label="Hora de entrada" type="time" value={d.entry} onChange={(e) => set({ entry: e.target.value })} error={errors.entry} />
                      <Field id="f-exit" label="Hora de salida" type="time" value={d.exit} onChange={(e) => set({ exit: e.target.value })} error={errors.exit} />
                    </div>
                    <DayBar entry={d.entry} exit={d.exit} />
                    <fieldset className={`days ${errors.days ? 'has-error' : ''}`} aria-describedby={errors.days ? 'days-err' : undefined}>
                      <legend>Días de rutina</legend>
                      <div className="days-row">
                        {DAYS.map((day, i) => (
                          <motion.button
                            key={day}
                            type="button"
                            className="chip"
                            aria-pressed={d.days.includes(day)}
                            onClick={() => toggleDay(day)}
                            whileTap={reduce ? undefined : { scale: 0.92 }}
                            initial={reduce ? false : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: DUR.base, ease: EASE, delay: i * STAGGER * 0.5 }}
                          >
                            {day}
                          </motion.button>
                        ))}
                      </div>
                      <Err id="days-err">{errors.days}</Err>
                    </fieldset>
                    <Field id="f-job" label="Ocupación" autoComplete="organization-title" value={d.job} onChange={(e) => set({ job: e.target.value })} error={errors.job} />
                    <StepNav onBack={() => go(0)} label="Siguiente" />
                  </form>
                )}

                {t.step === 2 && (
                  <form noValidate onSubmit={next}>
                    <fieldset className={`accept ${errors.accept ? 'has-error' : ''}`}>
                      <legend className="sr-only">Condiciones</legend>
                      {TERMS.map((term, i) => (
                        <label key={term} className="check">
                          <input
                            type="checkbox"
                            checked={d.accept[i]}
                            onChange={(e) => set({ accept: d.accept.map((a, j) => (j === i ? e.target.checked : a)) })}
                            aria-invalid={errors.accept && !d.accept[i] ? true : undefined}
                          />
                          <span className="check-box" aria-hidden="true">
                            <svg viewBox="0 0 16 16">
                              <motion.path
                                d="M3 8.5l3.2 3L13 4.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                initial={false}
                                animate={{ pathLength: d.accept[i] ? 1 : 0 }}
                                transition={{ duration: DUR.fast, ease: EASE }}
                              />
                            </svg>
                          </span>
                          <span>{term}</span>
                        </label>
                      ))}
                      <Err id="accept-err">{errors.accept}</Err>
                    </fieldset>
                    <SignaturePad value={d.signature} name={d.name} onChange={(signature) => set({ signature })} error={errors.signature} />
                    <StepNav onBack={() => go(1)} label="Firmar y seguir" />
                  </form>
                )}

                {t.step === 3 && (
                  <div>
                    <Copies stamps={t.stamps} onStamp={stamp} />
                    <div className="copies-count">
                      <span className="label">
                        {String(t.stamps).padStart(2, '0')} / {COPIES} selladas
                      </span>
                      <div className="copies-bar">
                        <motion.span initial={false} animate={{ scaleX: t.stamps / COPIES }} transition={{ duration: DUR.base, ease: EASE }} />
                      </div>
                    </div>
                    <div className="step-nav">
                      <button type="button" className="link link-quiet" onClick={() => go(2)}>
                        Atrás
                      </button>
                      {t.stamps < COPIES ? (
                        <button type="button" className="btn btn-ghost" onClick={stamp}>
                          <span>Sellar la siguiente</span>
                        </button>
                      ) : (
                        <button type="button" className="btn btn-primary" onClick={deliver}>
                          <span>Entregar las diez copias</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {t.step === 4 && t.folio && <Constancia t={t} onReset={reset} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function StepNav({ onBack, label }) {
  return (
    <div className="step-nav">
      {onBack ? (
        <button type="button" className="link link-quiet" onClick={onBack}>
          Atrás
        </button>
      ) : (
        <span />
      )}
      <button type="submit" className="btn btn-primary">
        <span>{label}</span>
      </button>
    </div>
  )
}
