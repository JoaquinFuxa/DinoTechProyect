import type { Product, ProductCategory } from '@/lib/supabase/database.types'

export type ProductFilterState = {
  query: string
  category: 'all' | ProductCategory
  brand: string
  minPrice: string
  maxPrice: string
}

export const emptyProductFilters: ProductFilterState = {
  query: '',
  category: 'all',
  brand: '',
  minPrice: '',
  maxPrice: '',
}

export function uniqueBrands(products: Product[]) {
  return Array.from(
    new Set(
      products
        .map((product) => product.brand?.trim())
        .filter((brand): brand is string => Boolean(brand)),
    ),
  ).sort((a, b) => a.localeCompare(b, 'es'))
}

export function filterProducts(products: Product[], filters: ProductFilterState) {
  const query = filters.query.trim().toLowerCase()
  const min = filters.minPrice.trim() ? Number(filters.minPrice) : null
  const max = filters.maxPrice.trim() ? Number(filters.maxPrice) : null

  return products.filter((product) => {
    if (filters.category !== 'all' && product.category !== filters.category) return false
    if (filters.brand && (product.brand || '') !== filters.brand) return false
    if (min != null && !Number.isNaN(min) && product.price < min) return false
    if (max != null && !Number.isNaN(max) && product.price > max) return false
    if (!query) return true
    return (
      product.name.toLowerCase().includes(query) ||
      (product.brand || '').toLowerCase().includes(query) ||
      (product.short_description || '').toLowerCase().includes(query) ||
      product.slug.toLowerCase().includes(query)
    )
  })
}
