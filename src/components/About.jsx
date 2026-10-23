import Reveal from './Reveal'

const LINES = [
  'Ves el mundo, y el mundo de tu rama te responde.',
  'Lo que deshaces, lo recuerdas.',
  'Funciona sin señal. Bajo tierra, en el mar y en órbita.',
]

export default function About() {
  return (
    <section id="contenido" className="section" aria-labelledby="about-title">
      <div className="wrap split">
        <div>
          <Reveal as="h2" id="about-title" className="t-h2">
            Una rama con tu nombre.
          </Reveal>
          <Reveal as="p" className="t-lead" index={1}>
            Cada persona deja una huella. El reloj se enlaza a la tuya.
          </Reveal>
        </div>
        <ul className="rows">
          {LINES.map((l, i) => (
            <Reveal as="li" key={l} index={i} className="row">
              <span className="t-h3">{l}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
