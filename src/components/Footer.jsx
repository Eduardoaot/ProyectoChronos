import LogoMark from './LogoMark'

export default function Footer() {
  return (
    <footer id="pie" className="footer ink">
      <div className="wrap footer-top">
        <div className="footer-brand">
          <LogoMark className="footer-mark" />
          <div>
            <p className="wordmark-text">CHRONOS</p>
            <p className="footer-line">El tiempo, en pausa.</p>
          </div>
        </div>
        <div className="footer-meta">
          <p>chronos.one</p>
          <p>Tempus sellado. No abrir.</p>
        </div>
      </div>
    </footer>
  )
}
