'use client'

import { useMemo, useState } from 'react'
import { ProductCard } from '@/components/catalog/product-card'
import { ProductFilters } from '@/components/catalog/product-filters'
import { emptyProductFilters, filterProducts, uniqueBrands } from '@/lib/product-filters'
import type { Product, ProductCategory } from '@/lib/supabase/database.types'

export function CatalogBrowser({
  products,
  initialCategory = 'all',
}: {
  products: Product[]
  initialCategory?: 'all' | ProductCategory
}) {
  const [filters, setFilters] = useState({ ...emptyProductFilters, category: initialCategory })
  const brands = useMemo(() => uniqueBrands(products), [products])
  const filtered = useMemo(() => filterProducts(products, filters), [products, filters])

  return (
    <>
      <ProductFilters filters={filters} brands={brands} onChange={setFilters} hideCategory={initialCategory !== 'all'} />
      {filtered.length === 0 ? (
        <p className="catalog-empty">No hay productos con esos filtros.</p>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}
