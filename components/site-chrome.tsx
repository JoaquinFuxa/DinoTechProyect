import { ArrowLeft, ArrowRight } from 'lucide-react'
import { WA } from '@/lib/constants'

export function SiteHeader({
  ctaHref = '/servicio-tecnico',
  ctaLabel = 'Servicio técnico',
}: {
  ctaHref?: string
  ctaLabel?: string
}) {
  return (
    <header className="header service-header">
      <a href="/" className="logo" aria-label="DinoTech, inicio">
        <span>Dino</span>
        <b>Tech</b>
        <i>•</i>
      </a>
      <nav className="nav service-nav">
        <a href="/catalogo">Catálogo</a>
        <a href="/catalogo/celulares">Celulares</a>
        <a href="/catalogo/consolas">Consolas</a>
        <a href="/catalogo/accesorios">Accesorios</a>
      </nav>
      <a className="header-cta" href={ctaHref}>
        {ctaLabel} {ctaHref === '/' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
      </a>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="footer service-footer">
      <div>
        <a href="/" className="logo">
          <span>Dino</span>
          <b>Tech</b>
          <i>•</i>
        </a>
        <p>
          La tecnología del futuro,
          <br />
          más cerca de vos.
        </p>
      </div>
      <div className="footer-links">
        <a href="/catalogo">Catálogo</a>
        <a href="/catalogo/celulares">Celulares</a>
        <a href="/catalogo/consolas">Consolas</a>
        <a href="/catalogo/accesorios">Accesorios</a>
      </div>
      <div className="footer-contact">
        <span>¿Preferís escribirnos directamente?</span>
        <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer">
          Escribinos por WhatsApp <ArrowRight size={15} />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© 2024 DinoTech. Córdoba, Argentina.</span>
        <span>Hecho para descubrir.</span>
      </div>
    </footer>
  )
}
