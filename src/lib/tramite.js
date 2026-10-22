// Lógica del trámite: validación, huella, folio, documento y persistencia local.
// Nada sale del navegador.

const KEY = 'chronos-tramite'

export const COUNTRIES = [
  'Argentina',
  'Chile',
  'Colombia',
  'España',
  'Estados Unidos',
  'México',
  'Perú',
  'Uruguay',
  'Otro país firmante',
]

export const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export const TERMS = [
  'Diez usos al día, cada día.',
  'El Tempus dura cinco años. Después hace falta otro Chronos One. No hay otro modelo.',
  'Si dejas de pagar, la rama se cierra y regresas a la línea principal. Los días de la rama no vuelven contigo.',
]

export const STEPS = ['Identidad', 'Rutina', 'Condiciones', 'Copias', 'Constancia']

export const COPIES = 10

export function emptyTramite() {
  return {
    step: 0,
    data: {
      name: '',
      email: '',
      birth: '',
      country: '',
      entry: '09:00',
      exit: '18:00',
      days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
      job: '',
      accept: [false, false, false],
      signature: null,
    },
    stamps: 0,
    folio: null,
    createdAt: null,
    queueStart: null,
  }
}

export function loadTramite() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw == null) return emptyTramite()
    const parsed = JSON.parse(raw)
    const base = emptyTramite()
    return { ...base, ...parsed, data: { ...base.data, ...parsed.data } }
  } catch {
    return emptyTramite()
  }
}

export function saveTramite(t) {
  try {
    localStorage.setItem(KEY, JSON.stringify(t))
  } catch {}
}

export function clearTramite() {
  try {
    localStorage.removeItem(KEY)
  } catch {}
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function age(birth) {
  const b = new Date(`${birth}T00:00:00`)
  if (Number.isNaN(b.getTime())) return -1
  const now = new Date()
  let a = now.getFullYear() - b.getFullYear()
  const m = now.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) a--
  return a
}

export function minutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function validate(step, d) {
  const e = {}
  if (step === 0) {
    if (d.name.trim().length < 3) e.name = 'Escribe tu nombre completo.'
    if (!EMAIL.test(d.email.trim())) e.email = 'Revisa el correo. Necesita una arroba y un dominio.'
    const a = age(d.birth)
    if (!d.birth || a < 0 || a > 120) e.birth = 'Escribe una fecha válida.'
    else if (a < 18) e.birth = 'El registro pide mayoría de edad.'
    if (!d.country) e.country = 'Elige el país de registro.'
  }
  if (step === 1) {
    if (!d.entry || !d.exit) e.entry = 'Escribe las dos horas.'
    else if (minutes(d.exit) <= minutes(d.entry)) e.exit = 'La salida va después de la entrada.'
    if (d.days.length === 0) e.days = 'Marca al menos un día.'
    if (d.job.trim().length < 2) e.job = 'Escribe tu ocupación.'
  }
  if (step === 2) {
    if (d.accept.some((a) => !a)) e.accept = 'Acepta las tres condiciones.'
    if (!d.signature) e.signature = 'Falta tu firma.'
  }
  return e
}

function fnv(str, seed) {
  let h = seed >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h
}

export function fingerprint(d) {
  const src = `${d.name.trim().toLowerCase()}|${d.email.trim().toLowerCase()}|${d.birth}`
  const hex = (fnv(src, 2166136261).toString(16) + fnv(src, 374761393).toString(16)).toUpperCase().padStart(16, '0').slice(0, 16)
  return hex.match(/.{4}/g).join('-')
}

export function makeFolio(d) {
  const n = fnv(`${d.email}|${Date.now()}`, 2166136261) % 1000000
  return `CH-${new Date().getFullYear()}-${String(n).padStart(6, '0')}`
}

export function queuePosition(t, now = Date.now()) {
  if (t.queueStart == null || t.createdAt == null) return null
  return Math.max(1, t.queueStart - Math.floor((now - t.createdAt) / 4000))
}

function fmtDate(iso) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function fmtStamp(ms) {
  const d = new Date(ms)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`
}

export function routineText(d) {
  const ordered = DAYS.filter((x) => d.days.includes(x))
  const isRun = ordered.length > 2 && DAYS.indexOf(ordered.at(-1)) - DAYS.indexOf(ordered[0]) === ordered.length - 1
  const days = isRun ? `${ordered[0]} a ${ordered.at(-1)}` : ordered.join(', ')
  return `${days}, ${d.entry} a ${d.exit}`
}

// Las filas del documento. La UI las escribe en vivo y el .txt las usa igual.
export function documentRows(t) {
  const d = t.data
  return [
    ['Folio', t.folio],
    ['Fecha', fmtStamp(t.createdAt)],
    ['Titular', d.name.trim()],
    ['Correo', d.email.trim()],
    ['Nacimiento', fmtDate(d.birth)],
    ['País', d.country],
    ['Huella', fingerprint(d)],
    ['Rutina', routineText(d)],
    ['Ocupación', d.job.trim()],
    ['Dispositivo', 'Chronos One'],
    ['Usos diarios', '10'],
    ['Membresía', '30 dólares al mes'],
    ['Copias', `${COPIES} / ${COPIES} selladas`],
  ]
}

export function documentText(t) {
  const rows = documentRows(t)
    .map(([k, v]) => `${k.padEnd(16, ' ')}${v}`)
    .join('\n')
  const terms = TERMS.map((x, i) => `${String(i + 1).padStart(2, '0')}  ${x}`).join('\n')
  return [
    'CHRONOS',
    'Constancia de registro de rama',
    '',
    rows,
    '',
    'Condiciones aceptadas',
    terms,
    '',
    'Firma registrada en el navegador del titular.',
    'Esta página no envió tus datos a ningún servidor.',
    '',
    'Tempus sellado. No abrir.',
  ].join('\n')
}
