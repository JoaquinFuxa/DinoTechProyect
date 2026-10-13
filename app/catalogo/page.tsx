import { ChevronRight } from 'lucide-react'
import { SiteFooter, SiteHeader } from '@/components/site-chrome'
import { CatalogBrowser } from '@/components/catalog/catalog-browser'
import { CATEGORIES } from '@/lib/constants'
import { normalizeProduct } from '@/lib/products'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/supabase/database.types'

async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map((row) => normalizeProduct(row as Product))
}

export default async function CatalogPage() {
  const products = await getProducts()

  return (
    <main className="site-shell catalog-page">
      <SiteHeader />
      <div className="catalog-wrap">
        <div className="breadcrumb">
          <a href="/">Home</a>
          <ChevronRight size={13} />
          Catálogo
        </div>
        <section className="catalog-hero">
          <p className="kicker">CATÁLOGO DINOTECH</p>
          <h1>
            Tecnología <em>seleccionada.</em>
          </h1>
          <p>Explorá celulares, consolas y accesorios con specs claras y consulta directa por WhatsApp.</p>
        </section>
        <div className="catalog-tabs">
          <a href="/catalogo" className="catalog-tab active">
            Todos
          </a>
          {CATEGORIES.map((category) => (
            <a key={category.id} href={`/catalogo/${category.id}`} className="catalog-tab">
              {category.label}
            </a>
          ))}
        </div>
        <div className="category-grid catalog-category-grid">
          {CATEGORIES.map((category) => (
            <a key={category.id} href={`/catalogo/${category.id}`} className="category-card mint">
              <div>
                <h3>{category.label}</h3>
                <p>{category.description}</p>
              </div>
              <span className="cat-count">
                {products.filter((item) => item.category === category.id).length}
              </span>
            </a>
          ))}
        </div>
        <section className="catalog-section catalog-list">
          <div className="section-head">
            <div>
              <p className="kicker">TODOS LOS PRODUCTOS</p>
              <h2>
                Elegí y <em>consultá.</em>
              </h2>
            </div>
          </div>
          {products.length === 0 ? (
            <p className="catalog-empty">Todavía no hay productos publicados.</p>
          ) : (
            <CatalogBrowser products={products} />
          )}
        </section>
      </div>
      <SiteFooter />
    </main>
  )
}
