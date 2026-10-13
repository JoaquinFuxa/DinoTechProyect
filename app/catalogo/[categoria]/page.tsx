import { ChevronRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { SiteFooter, SiteHeader } from '@/components/site-chrome'
import { ProductCard } from '@/components/catalog/product-card'
import { CATEGORIES } from '@/lib/constants'
import { categoryLabel, isProductCategory, normalizeProduct } from '@/lib/products'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'
import type { Product, ProductCategory } from '@/lib/supabase/database.types'

async function getProducts(category: ProductCategory): Promise<Product[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map((row) => normalizeProduct(row as Product))
}

export default async function CategoryCatalogPage({
  params,
}: {
  params: Promise<{ categoria: string }>
}) {
  const { categoria } = await params
  if (!isProductCategory(categoria)) notFound()

  const products = await getProducts(categoria)
  const meta = CATEGORIES.find((item) => item.id === categoria)

  return (
    <main className="site-shell catalog-page">
      <SiteHeader />
      <div className="catalog-wrap">
        <div className="breadcrumb">
          <a href="/">Home</a>
          <ChevronRight size={13} />
          <a href="/catalogo">Catálogo</a>
          <ChevronRight size={13} />
          {categoryLabel(categoria)}
        </div>
        <section className="catalog-hero">
          <p className="kicker">CATEGORÍA</p>
          <h1>
            {categoryLabel(categoria)} <em>DinoTech.</em>
          </h1>
          <p>{meta?.description}</p>
        </section>
        <div className="catalog-tabs">
          <a href="/catalogo" className="catalog-tab">
            Todos
          </a>
          {CATEGORIES.map((category) => (
            <a
              key={category.id}
              href={`/catalogo/${category.id}`}
              className={`catalog-tab ${category.id === categoria ? 'active' : ''}`}
            >
              {category.label}
            </a>
          ))}
        </div>
        <section className="catalog-section catalog-list">
          {products.length === 0 ? (
            <p className="catalog-empty">No hay productos en esta categoría por ahora.</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
      <SiteFooter />
    </main>
  )
}
