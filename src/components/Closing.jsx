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
          <Reveal className="closing-cell closing-main">
            <p className="t-h3">Si ya lo quieres, entra a la fila.</p>
            <a href="#tramite" className="btn btn-primary" onClick={onAnchor}>
              Empezar el trámite
            </a>
          </Reveal>
          <Reveal className="closing-cell" index={1}>
            <p className="t-h3">Si aún lo miras, lee el límite.</p>
            <div className="closing-doc">
              <a href="/el-limite.pdf" className="link" target="_blank" rel="noopener">
                Leer el límite
              </a>
              <span className="closing-meta">PDF de tres páginas.</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
