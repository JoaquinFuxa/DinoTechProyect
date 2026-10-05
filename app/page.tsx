'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Clock3, Gamepad2, Headphones, Camera, MapPin, Menu, Monitor, Mouse, Package, Search, Smartphone, Sparkles, Star, Tag, X, Zap } from 'lucide-react'

const WA = '5493518193051'
const categories = [
  { name: 'Celulares', icon: Smartphone, count: 24, color: 'mint', sub: 'Gama alta · Fundas · Cargadores' },
  { name: 'PlayStation', icon: Gamepad2, count: 18, color: 'violet', sub: 'Consolas · Juegos · Controles' },
  { name: 'Accesorios de PC', icon: Monitor, count: 31, color: 'mint', sub: 'Teclados · Webcams · Cables' },
  { name: 'Mouse', icon: Mouse, count: 16, color: 'violet', sub: 'Gamer · Inalámbricos · Oficina' },
  { name: 'Parlantes', icon: Headphones, count: 12, color: 'mint', sub: 'Bluetooth · Gamer · Sonido' },
  { name: 'Smartwatch', icon: Clock3, count: 9, color: 'violet', sub: 'Smartwatch · Bandas' },
  { name: 'Proyectores', icon: Monitor, count: 8, color: 'mint', sub: 'Hogar · Portátiles' },
  { name: 'Lápiz 3D', icon: Sparkles, count: 7, color: 'violet', sub: 'Lápices · Filamentos' },
]
const products = [
  { name: 'iPhone 15 Pro Max', category: 'Celulares', price: 1849999, old: 1999999, tag: 'Oferta', image: 'phone', featured: true },
  { name: 'PlayStation 5 Slim', category: 'PlayStation', price: 1099999, tag: 'Destacado', image: 'console', featured: true },
  { name: 'Auriculares HyperX Cloud III', category: 'Accesorios de PC', price: 189999, tag: 'Nuevo', image: 'headset', featured: true },
  { name: 'Mouse Logitech G305', category: 'Mouse', price: 79999, old: 89999, tag: 'Oferta', image: 'mouse', featured: true },
]
const reviews = [
  { quote: 'Excelente atención y asesoramiento. Me ayudaron a elegir justo lo que necesitaba.', name: 'Sofía Martínez' },
  { quote: 'Los mejores precios y siempre tienen todo. La atención es de diez.', name: 'Lucas Fernández' },
  { quote: 'Compré mi Play y unos auriculares, todo perfecto y rapidísimo.', name: 'Valentina Ruiz' },
]
const money = (n: number) => '$ ' + n.toLocaleString('es-AR')
const whatsapp = (product?: typeof products[number]) => {
  const text = product ? `Hola DinoTech! Quiero consultar por: ${product.name} – ${money(product.price)}. ¿Está disponible?` : 'Hola DinoTech! Quiero hacer una consulta sobre sus productos.'
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
}

function Logo() { return <a href="#inicio" className="logo" aria-label="DinoTech, inicio"><span>Dino</span><b>Tech</b><i>•</i></a> }
function ProductVisual({ kind }: { kind: string }) { return <div className={`product-visual visual-${kind}`}><div className="visual-grid" />{kind === 'phone' && <div className="phone-shape"><div /></div>}{kind === 'console' && <div className="console-shape"><div /></div>}{kind === 'headset' && <Headphones className="visual-icon" />}{kind === 'mouse' && <Mouse className="visual-icon" />}</div> }

export default function Page() {
  const [menu, setMenu] = useState(false)
  const [query, setQuery] = useState('')
  const [review, setReview] = useState(0)
  const filtered = useMemo(() => products.filter(p => p.name.toLowerCase().includes(query.toLowerCase())), [query])
  const openNow = (() => { const hour = Number(new Intl.DateTimeFormat('es-AR', { hour: 'numeric', hour12: false, timeZone: 'America/Argentina/Cordoba' }).format(new Date())); return hour >= 10 && hour < 22 })()
  return <main id="inicio" className="site-shell">
    <div className="topline"><span><Zap size={14} /> Envíos y retiros en Córdoba</span><span className="top-status"><i /> Atención todos los días de 10 a 22 h</span></div>
    <header className="header"><Logo /><nav className={menu ? 'nav open' : 'nav'}><a href="#catalogo" onClick={() => setMenu(false)}>Catálogo</a><a href="#categorias" onClick={() => setMenu(false)}>Categorías</a><a href="#nosotros" onClick={() => setMenu(false)}>Nosotros</a><a href="#ubicacion" onClick={() => setMenu(false)}>Encontranos</a></nav><button className="icon-btn menu-btn" onClick={() => setMenu(!menu)} aria-label="Abrir menú">{menu ? <X /> : <Menu />}</button><a className="header-cta" href="/servicio-tecnico">Servicio técnico <ArrowRight size={16} /></a></header>
    <section className="hero"><div className="contour contour-one" /><div className="contour contour-two" /><div className="hero-copy"><div className="eyebrow"><Sparkles size={14} /> Tecnología que te mueve</div><h1><span>TECNOLOGÍA</span><strong>DEL FUTURO</strong></h1><p>Todo lo que buscás para conectar, jugar y crear. <b>Asesoramiento real</b>, buenos precios y la mejor atención en Córdoba.</p><div className="hero-actions"><a className="btn-primary" href="#catalogo">Ver catálogo <ArrowRight size={18} /></a><button className="btn-ghost" onClick={() => whatsapp()}>WhatsApp <span>↗</span></button></div><div className="hero-proof"><div className="avatars"><span>LM</span><span>SF</span><span>VR</span></div><div><div className="stars">★★★★★</div><small>+500 clientes felices</small></div></div></div><div className="hero-art"><div className="orb orb-a" /><div className="orb orb-b" /><div className="tech-card card-back">NUEVA<br /><b>ENERGÍA</b></div><div className="tech-card card-front"><div className="card-brand">DinoTech <span>•</span></div><div className="floating-chip">01</div><div className="card-lines" /><div className="card-footer">INNOVACIÓN<br /><b>EN TUS MANOS</b></div></div><div className="hero-label"><span>01</span><div><b>EL FUTURO</b><br />está más cerca</div></div></div></section>
    <section className="category-section" id="categorias"><div className="section-head"><div><p className="kicker">EXPLORÁ POR CATEGORÍA</p><h2>Encontrá tu próximo <em>upgrade.</em></h2></div><a className="text-link" href="#catalogo">Ver todas <ArrowRight size={16} /></a></div><div className="category-grid">{categories.map(({ name, icon: Icon, count, color, sub }) => <a href="#catalogo" className={`category-card ${color}`} key={name}><div className="cat-icon"><Icon /></div><div><h3>{name}</h3><p>{sub}</p></div><span className="cat-count">{count}</span></a>)}</div></section>
    <div className="stripe-divider" />
    <section className="catalog-section" id="catalogo"><div className="section-head"><div><p className="kicker">SELECCIÓN DINOTECH</p><h2>Lo más buscado <em>ahora.</em></h2></div><div className="catalog-tools"><div className="search"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar producto" aria-label="Buscar producto" /></div><a className="text-link desktop-only" href="#catalogo">Ver catálogo completo <ArrowRight size={16} /></a></div></div><div className="product-grid">{filtered.map(p => <article className="product-card" key={p.name}><div className="product-top"><span className={`badge ${p.tag === 'Oferta' ? 'offer' : p.tag === 'Nuevo' ? 'new' : ''}`}>{p.tag}</span><button className="heart" aria-label={`Guardar ${p.name}`}>♡</button></div><ProductVisual kind={p.image} /><div className="product-info"><p>{p.category}</p><h3>{p.name}</h3><div className="price-row"><strong>{money(p.price)}</strong>{p.old && <del>{money(p.old)}</del>}</div><button className="product-btn" onClick={() => whatsapp(p)}>Consultar <ArrowRight size={15} /></button></div></article>)}</div></section>
    <section className="review-section"><div className="review-intro"><p className="kicker">LO DICEN ELLOS</p><h2>Historias que<br /><em>conectan.</em></h2><div className="review-controls"><button onClick={() => setReview((review + reviews.length - 1) % reviews.length)} aria-label="Reseña anterior"><ChevronLeft /></button><span>0{review + 1} <i>/ 0{reviews.length}</i></span><button onClick={() => setReview((review + 1) % reviews.length)} aria-label="Siguiente reseña"><ChevronRight /></button></div><a className="maps-link" href="https://www.google.com/maps/search/DinoTech+Córdoba" target="_blank" rel="noreferrer">Ver más en Google Maps ↗</a></div><div className="review-card"><span className="quote">“</span><div className="review-stars">★★★★★</div><blockquote>{reviews[review].quote}</blockquote><div className="review-person"><span>{reviews[review].name.split(' ').map(x => x[0]).join('')}</span><div><b>{reviews[review].name}</b><small>Cliente DinoTech</small></div></div></div></section>
    <section className="about-section" id="nosotros"><div className="about-art"><div className="about-number">08<span>/24</span></div><div className="about-circle"><Package /></div></div><div className="about-copy"><p className="kicker">SOMOS DINOTECH</p><h2>Más que tecnología.<br /><em>Tu próximo descubrimiento.</em></h2><p>Somos un local cordobés con una misión simple: acercarte tecnología útil, divertida y de calidad, con el asesoramiento de alguien que realmente sabe.</p><div className="stats"><div><strong>01</strong><span>Asesoramiento<br />personalizado</span></div><div><strong>02</strong><span>Productos<br />seleccionados</span></div><div><strong>03</strong><span>Atención<br />todos los días</span></div></div></div></section>
    <section className="location-section" id="ubicacion"><div className="map-placeholder"><div className="map-grid" /><div className="map-pin"><MapPin /></div><span className="map-label">DINOTECH</span></div><div className="location-copy"><p className="kicker">VENÍ A CONOCERNOS</p><h2>Estamos<br /><em>en Córdoba.</em></h2><p>Av. Fuerza Aérea Argentina 1700<br />Local 101, X5000 Córdoba</p><div className="open-status"><i className={openNow ? 'is-open' : ''} />{openNow ? 'Abierto ahora' : 'Cerrado ahora'} <span>· Todos los días de 10 a 22 h</span></div><div className="location-actions"><a className="btn-primary" href="https://www.google.com/maps/search/Av.+Fuerza+Aérea+Argentina+1700,+Córdoba" target="_blank" rel="noreferrer">Cómo llegar <MapPin size={16} /></a><a className="btn-outline" href="https://www.instagram.com/dinotech_ar/" target="_blank" rel="noreferrer"><Camera size={16} /> Instagram</a></div></div></section>
    <footer className="footer"><div><Logo /><p>La tecnología del futuro,<br />más cerca de vos.</p></div><div className="footer-links"><a href="#catalogo">Catálogo</a><a href="#categorias">Categorías</a><a href="#nosotros">Nosotros</a><a href="#ubicacion">Ubicación</a></div><div className="footer-contact"><span>¿Tenés una consulta?</span><button onClick={() => whatsapp()}>Escribinos por WhatsApp <ArrowRight size={15} /></button></div><div className="footer-bottom"><span>© 2024 DinoTech. Córdoba, Argentina.</span><span>Hecho para descubrir.</span></div></footer>
    <button className="floating-wa" onClick={() => whatsapp()} aria-label="Consultar por WhatsApp"><span>◔</span><b>¿Hablamos?</b></button>
  </main>
}
