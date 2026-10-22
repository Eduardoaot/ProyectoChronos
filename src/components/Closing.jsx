import { useAnchor } from '../lib/scroll'
import Reveal from './Reveal'

export default function Closing() {
  const onAnchor = useAnchor()
  return (
    <section className="section closing" aria-labelledby="cierre-title">
      <h2 id="cierre-title" className="sr-only">
        Siguiente paso.
      </h2>
      <div className="wrap">
        <div className="closing-grid">
          <Reveal className="spot closing-cell closing-main">
            <p className="t-h3">Si ya lo quieres, entra a la fila.</p>
            <a href="#tramite" className="btn btn-primary" onClick={onAnchor} data-magnetic>
              <span>Empezar el trámite</span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2 8h11M8.5 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </a>
          </Reveal>
          <Reveal className="spot closing-cell" index={1}>
            <p className="t-h3">Si aún lo miras, lee el límite.</p>
            <div className="closing-doc">
              <a href="/el-limite.pdf" className="link" target="_blank" rel="noopener" data-magnetic>
                Leer el límite
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M5 3h8v8M13 3 3 13" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </a>
              <span className="label">PDF. Tres páginas.</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
