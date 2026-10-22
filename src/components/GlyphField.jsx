import { useEffect, useState } from 'react'
import { GLYPHS, seeded } from '../lib/motion'

function build(cols, rows) {
  const rnd = seeded(1979)
  const lines = []
  for (let r = 0; r < rows; r++) {
    let line = ''
    for (let c = 0; c < cols; c++) line += rnd() < 0.085 ? GLYPHS[(rnd() * GLYPHS.length) | 0] : ' '
    lines.push(line)
  }
  return lines
}

function Lines({ lines, br, bc }) {
  return (
    <pre>
      {lines.map((line, i) =>
        i === br ? (
          <span key={i}>
            {line.slice(0, bc)}
            <span className="glyph-blink">:</span>
            {line.slice(bc + 1)}
            {'\n'}
          </span>
        ) : (
          <span key={i}>
            {line}
            {'\n'}
          </span>
        ),
      )}
    </pre>
  )
}

// Campo quieto. Una segunda copia en dorado solo se ve dentro de la lente del cursor.
export default function GlyphField() {
  const [grid, setGrid] = useState(null)

  useEffect(() => {
    let t
    const measure = () => {
      const cols = Math.ceil(window.innerWidth / 11.2) + 2
      const rows = Math.ceil(window.innerHeight / 22) + 2
      setGrid({ lines: build(cols, rows), br: Math.floor(rows * 0.3), bc: Math.floor(cols * 0.78) })
    }
    measure()
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(measure, 200)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="glyphs" aria-hidden="true">
      {grid && (
        <>
          <Lines {...grid} />
          <div className="glyphs-lit">
            <Lines {...grid} />
          </div>
        </>
      )}
    </div>
  )
}
