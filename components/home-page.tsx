'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Headphones,
  Camera,
  MapPin,
  Menu,
  Package,
  Search,
  Smartphone,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'
import { ProductCard } from '@/components/catalog/product-card'
import { generalWhatsAppUrl } from '@/lib/products'
import type { Product } from '@/lib/supabase/database.types'

const reviews = [
  { quote: 'Excelente atención y asesoramiento. Me ayudaron a elegir justo lo que necesitaba.', name: 'Sofía Martínez' },
  { quote: 'Los mejores precios y siempre tienen todo. La atención es de diez.', name: 'Lucas Fernández' },
  { quote: 'Compré mi Play y unos auriculares, todo perfecto y rapidísimo.', name: 'Valentina Ruiz' },
]

const MAPS_URL =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ||
  'https://www.google.com/maps/search/Av.+Fuerza+Aérea+Argentina+1700,+Córdoba'
const MAPS_EMBED =
  'https://www.google.com/maps?q=Av.+Fuerza+Aérea+Argentina+1700,+Local+101,+Córdoba,+Argentina&z=16&output=embed'

function Logo() {
  return (
    <a href="#inicio" className="logo" aria-label="DinoTech, inicio">
      <span>Dino</span>
      <b>Tech</b>
      <i>•</i>
    </a>
  )
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function openWhatsApp(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function HomePage({ featuredProducts }: { featuredProducts: Product[] }) {
  const [menu, setMenu] = useState(false)
  const [query, setQuery] = useState('')
  const [review, setReview] = useState(0)
  const filtered = useMemo(
    () => featuredProducts.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [featuredProducts, query],
  )
  const openNow = (() => {
    const hour = Number(
      new Intl.DateTimeFormat('es-AR', {
        hour: 'numeric',
        hour12: false,
        timeZone: 'America/Argentina/Cordoba',
      }).format(new Date()),
    )
    return hour >= 10 && hour < 22
  })()

  return (
    <main id="inicio" className="site-shell">
      <div className="topline">
        <span>
          <Zap size={14} /> Envíos y retiros en Córdoba
        </span>
        <span className="top-status">
          <i /> Atención todos los días de 10 a 22 h
        </span>
      </div>
      <header className="header">
        <Logo />
        <nav className={menu ? 'nav open' : 'nav'}>
          <a href="/catalogo" onClick={() => setMenu(false)}>
            Catálogo
          </a>
          <a href="/catalogo/celulares" onClick={() => setMenu(false)}>
            Celulares
          </a>
          <a href="/catalogo/consolas" onClick={() => setMenu(false)}>
            Consolas
          </a>
          <a href="/catalogo/accesorios" onClick={() => setMenu(false)}>
            Accesorios
          </a>
          <a href="#nosotros" onClick={() => setMenu(false)}>
            Nosotros
          </a>
          <a href="#ubicacion" onClick={() => setMenu(false)}>
            Encontranos
          </a>
          <a href="/servicio-tecnico" onClick={() => setMenu(false)}>
            Servicio técnico
          </a>
        </nav>
        <button className="icon-btn menu-btn" onClick={() => setMenu(!menu)} aria-label="Abrir menú">
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <section className="hero">
        <div className="contour contour-one" />
        <div className="contour contour-two" />
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={14} /> Tecnología que te mueve
          </div>
          <h1>
            <span>TECNOLOGÍA</span>
            <strong>DEL FUTURO</strong>
          </h1>
          <p>
            Todo lo que buscás para conectar, jugar y crear. <b>Asesoramiento real</b>, buenos precios y la mejor
            atención en Córdoba.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="/catalogo">
              Ver catálogo <ArrowRight size={18} />
            </a>
            <a className="btn-ghost" href="/servicio-tecnico">
              Servicio técnico <ArrowRight size={16} />
            </a>
          </div>
          <div className="hero-proof">
            <div className="avatars">
              <span>LM</span>
              <span>SF</span>
              <span>VR</span>
            </div>
            <div>
              <div className="stars">★★★★★</div>
              <small>+500 clientes felices</small>
            </div>
          </div>
        </div>
        <div className="hero-art">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="tech-card card-back">
            NUEVA
            <br />
            <b>ENERGÍA</b>
          </div>
          <div className="tech-card card-front">
            <div className="card-brand">
              DinoTech <span>•</span>
            </div>
            <div className="floating-chip">01</div>
            <div className="card-lines" />
            <div className="card-footer">
              INNOVACIÓN
              <br />
              <b>EN TUS MANOS</b>
            </div>
          </div>
          <div className="hero-label">
            <span>01</span>
            <div>
              <b>EL FUTURO</b>
              <br />
              está más cerca
            </div>
          </div>
        </div>
      </section>
      <section className="category-section" id="categorias">
        <div className="section-head">
          <div>
            <p className="kicker">EXPLORÁ POR CATEGORÍA</p>
            <h2>
              Encontrá tu próximo <em>upgrade.</em>
            </h2>
          </div>
          <a className="text-link" href="/catalogo">
            Ver todas <ArrowRight size={16} />
          </a>
        </div>
        <div className="category-grid">
          <a href="/catalogo/celulares" className="category-card mint">
            <div className="cat-icon">
              <Smartphone />
            </div>
            <div>
              <h3>Celulares</h3>
              <p>Gama alta · Fundas · Cargadores</p>
            </div>
          </a>
          <a href="/catalogo/consolas" className="category-card violet">
            <div className="cat-icon">
              <Gamepad2 />
            </div>
            <div>
              <h3>Consolas</h3>
              <p>PlayStation · Nintendo · Controles</p>
            </div>
          </a>
          <a href="/catalogo/accesorios" className="category-card mint">
            <div className="cat-icon">
              <Headphones />
            </div>
            <div>
              <h3>Accesorios</h3>
              <p>Auriculares · Mouse · Cables</p>
            </div>
          </a>
          <a href="/catalogo" className="category-card violet">
            <div className="cat-icon">
              <Package />
            </div>
            <div>
              <h3>Catálogo completo</h3>
              <p>Todos los productos publicados</p>
            </div>
          </a>
        </div>
      </section>
      <div className="stripe-divider" />
      <section className="catalog-section" id="catalogo">
        <div className="section-head">
          <div>
            <p className="kicker">SELECCIÓN DINOTECH</p>
            <h2>
              Lo más buscado <em>ahora.</em>
            </h2>
          </div>
          <div className="catalog-tools">
            <div className="search">
              <Search size={17} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar producto"
                aria-label="Buscar producto"
              />
            </div>
            <a className="text-link desktop-only" href="/catalogo">
              Ver catálogo completo <ArrowRight size={16} />
            </a>
          </div>
        </div>
        {filtered.length === 0 ? (
          <p className="catalog-empty">
            {featuredProducts.length === 0
              ? 'Todavía no hay productos destacados.'
              : 'No hay productos destacados con esa búsqueda.'}
          </p>
        ) : (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      <section className="review-section">
        <div className="review-intro">
          <p className="kicker">LO DICEN ELLOS</p>
          <h2>
            Historias que
            <br />
            <em>conectan.</em>
          </h2>
          <div className="review-controls">
            <button
              onClick={() => setReview((review + reviews.length - 1) % reviews.length)}
              aria-label="Reseña anterior"
            >
              <ChevronLeft />
            </button>
            <span>
              0{review + 1} <i>/ 0{reviews.length}</i>
            </span>
            <button onClick={() => setReview((review + 1) % reviews.length)} aria-label="Siguiente reseña">
              <ChevronRight />
            </button>
          </div>
          <a className="maps-link" href="https://www.google.com/maps/search/DinoTech+Córdoba" target="_blank" rel="noreferrer">
            Ver más en Google Maps ↗
          </a>
        </div>
        <div className="review-card">
          <span className="quote">“</span>
          <div className="review-stars">★★★★★</div>
          <blockquote>{reviews[review].quote}</blockquote>
          <div className="review-person">
            <span>{reviews[review].name.split(' ').map((x) => x[0]).join('')}</span>
            <div>
              <b>{reviews[review].name}</b>
              <small>Cliente DinoTech</small>
            </div>
          </div>
        </div>
      </section>
      <section className="about-section" id="nosotros">
        <div className="about-art">
          <div className="about-number">
            08<span>/24</span>
          </div>
          <div className="about-circle">
            <Package />
          </div>
        </div>
        <div className="about-copy">
          <p className="kicker">SOMOS DINOTECH</p>
          <h2>
            Más que tecnología.
            <br />
            <em>Tu próximo descubrimiento.</em>
          </h2>
          <p>
            Somos un local cordobés con una misión simple: acercarte tecnología útil, divertida y de calidad, con el
            asesoramiento de alguien que realmente sabe.
          </p>
          <div className="stats">
            <div>
              <strong>01</strong>
              <span>
                Asesoramiento
                <br />
                personalizado
              </span>
            </div>
            <div>
              <strong>02</strong>
              <span>
                Productos
                <br />
                seleccionados
              </span>
            </div>
            <div>
              <strong>03</strong>
              <span>
                Atención
                <br />
                todos los días
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="location-section" id="ubicacion">
        <div className="map-placeholder">
          <iframe
            title="Ubicación DinoTech en Google Maps"
            src={MAPS_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <div className="location-copy">
          <p className="kicker">VENÍ A CONOCERNOS</p>
          <h2>
            Estamos
            <br />
            <em>en Córdoba.</em>
          </h2>
          <p>
            Av. Fuerza Aérea Argentina 1700
            <br />
            Local 101, X5000 Córdoba
          </p>
          <div className="open-status">
            <i className={openNow ? 'is-open' : ''} />
            {openNow ? 'Abierto ahora' : 'Cerrado ahora'} <span>· Todos los días de 10 a 22 h</span>
          </div>
          <div className="location-actions">
            <a className="btn-primary" href={MAPS_URL} target="_blank" rel="noreferrer">
              Cómo llegar <MapPin size={16} />
            </a>
            <a className="btn-outline" href="https://www.instagram.com/dinotech_ar/" target="_blank" rel="noreferrer">
              <Camera size={16} /> Instagram
            </a>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div>
          <Logo />
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
          <span>¿Tenés una consulta?</span>
          <button onClick={() => openWhatsApp(generalWhatsAppUrl())}>
            Escribinos por WhatsApp <ArrowRight size={15} />
          </button>
        </div>
        <div className="footer-bottom">
          <span>© 2024 DinoTech. Córdoba, Argentina.</span>
          <span>Hecho para descubrir.</span>
        </div>
      </footer>
      <button
        className="floating-wa"
        onClick={() => openWhatsApp(generalWhatsAppUrl())}
        aria-label="Consultar por WhatsApp"
      >
        <span className="floating-wa-icon">
          <WhatsAppIcon size={16} />
        </span>
        <b>¿Hablamos?</b>
      </button>
    </main>
  )
}
