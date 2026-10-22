import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { useAnchor } from '../lib/scroll'
import { DUR, EASE, STAGGER } from '../lib/motion'
import { Wordmark } from './LogoMark'

const LINKS = [
  ['Gestos', '#gestos'],
  ['Rama', '#rama'],
  ['Precio', '#precio'],
  ['Trámite', '#tramite'],
]

export default function Nav({ theme, onToggleTheme }) {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const onAnchor = useAnchor()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  const themeLabel = theme === 'dark' ? 'Claro' : 'Oscuro'

  useEffect(() => {
    const hero = document.getElementById('top')
    if (hero == null) return
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting), { rootMargin: '-72px 0px 0px 0px' })
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth >= 760 && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const follow = (e) => {
    setOpen(false)
    onAnchor(e)
  }

  return (
    <>
      <a className="skip" href="#contenido" onClick={onAnchor}>
        Saltar al contenido
      </a>
      <header className={`nav ${solid || open ? 'is-solid' : ''}`}>
        <div className="nav-inner">
          <a href="#top" className="nav-brand" onClick={follow} aria-label="CHRONOS, inicio">
            <Wordmark />
          </a>
          <nav aria-label="Principal" className="nav-links">
            {LINKS.map(([label, href]) => (
              <a key={href} href={href} className="link link-quiet" onClick={follow}>
                {label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <a href="#tramite" className="nav-btn nav-cta" onClick={follow}>
              Trámite
            </a>
            <button type="button" className="nav-btn nav-theme" onClick={onToggleTheme}>
              {themeLabel}
            </button>
            <button type="button" className="nav-btn nav-menu" aria-expanded={open} aria-controls="menu-movil" onClick={() => setOpen((o) => !o)}>
              {open ? 'Cerrar' : 'Menú'}
            </button>
          </div>
        </div>
        <motion.div className="nav-progress" style={{ scaleX: progress }} aria-hidden="true" />
        <AnimatePresence>
          {open && (
            <motion.div
              id="menu-movil"
              className="nav-panel"
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              animate={{ clipPath: 'inset(0 0 0% 0)' }}
              exit={{ clipPath: 'inset(0 0 100% 0)' }}
              transition={{ duration: DUR.base, ease: EASE }}
            >
              <nav aria-label="Menú">
                {LINKS.map(([label, href], i) => (
                  <motion.a
                    key={href}
                    href={href}
                    onClick={follow}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DUR.base, ease: EASE, delay: 0.1 + i * STAGGER }}
                  >
                    <span className="label label-index">0{i + 1}</span>
                    <span className="t-h3">{label}</span>
                  </motion.a>
                ))}
              </nav>
              <motion.button
                type="button"
                className="nav-btn nav-panel-theme"
                onClick={onToggleTheme}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: DUR.base, ease: EASE, delay: 0.1 + LINKS.length * STAGGER }}
              >
                {themeLabel}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
