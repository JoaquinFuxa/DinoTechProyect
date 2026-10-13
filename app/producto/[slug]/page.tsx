import { ArrowRight, ChevronRight, Gamepad2, Headphones, Smartphone } from 'lucide-react'
import { notFound } from 'next/navigation'
import { SiteFooter, SiteHeader } from '@/components/site-chrome'
import { categoryLabel, money, normalizeProduct, productWhatsAppUrl } from '@/lib/products'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'
import type { Product, ProductCategory } from '@/lib/supabase/database.types'

const icons: Record<ProductCategory, typeof Smartphone> = {
  celulares: Smartphone,
  consolas: Gamepad2,
  accesorios: Headphones,
}

async function getProduct(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !data) return null
  return normalizeProduct(data as Product)
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const Icon = icons[product.category]
  const whatsappUrl = productWhatsAppUrl(product)

  return (
    <main className="site-shell catalog-page product-detail-page">
      <SiteHeader />
      <div className="catalog-wrap">
        <div className="breadcrumb">
          <a href="/">Home</a>
          <ChevronRight size={13} />
          <a href="/catalogo">Catálogo</a>
          <ChevronRight size={13} />
          <a href={`/catalogo/${product.category}`}>{categoryLabel(product.category)}</a>
          <ChevronRight size={13} />
          {product.name}
        </div>

        <section className="product-detail">
          <div className="product-detail-media">
            <div className={`product-visual visual-${product.category} detail-visual`}>
              <div className="visual-grid" />
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="product-image" />
              ) : (
                <Icon className="visual-icon" />
              )}
            </div>
          </div>

          <div className="product-detail-copy">
            <p className="kicker">{categoryLabel(product.category)}</p>
            {product.tag ? (
              <span className={`badge ${product.tag === 'Oferta' ? 'offer' : product.tag === 'Nuevo' ? 'new' : ''}`}>
                {product.tag}
              </span>
            ) : null}
            <h1>{product.name}</h1>
            {product.short_description ? <p className="product-lead">{product.short_description}</p> : null}
            <div className="price-row detail-price">
              <strong>{money(product.price)}</strong>
              {product.old_price ? <del>{money(product.old_price)}</del> : null}
            </div>
            {product.description ? <p className="product-description">{product.description}</p> : null}
            <div className="product-detail-actions">
              <a className="btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
                Consultar por WhatsApp <ArrowRight size={17} />
              </a>
              <a className="btn-outline" href={`/catalogo/${product.category}`}>
                Volver a {categoryLabel(product.category)}
              </a>
            </div>
          </div>
        </section>

        <section className="product-specs">
          <div className="section-head">
            <div>
              <p className="kicker">ESPECIFICACIONES</p>
              <h2>
                Detalle <em>técnico.</em>
              </h2>
            </div>
          </div>
          {product.specs.length === 0 ? (
            <p className="catalog-empty">Este producto todavía no tiene especificaciones cargadas.</p>
          ) : (
            <dl className="specs-grid">
              {product.specs.map((spec) => (
                <div key={`${spec.label}-${spec.value}`} className="spec-item">
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      </div>
      <SiteFooter />
    </main>
  )
}
