'use client'

import { Search } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import type { ProductFilterState } from '@/lib/product-filters'

type ProductFiltersProps = {
  filters: ProductFilterState
  brands: string[]
  variant?: 'catalog' | 'admin'
  onChange: (next: ProductFilterState) => void
  hideCategory?: boolean
}

export function ProductFilters({
  filters,
  brands,
  variant = 'catalog',
  onChange,
  hideCategory = false,
}: ProductFiltersProps) {
  function patch(partial: Partial<ProductFilterState>) {
    onChange({ ...filters, ...partial })
  }

  return (
    <div className={`product-filters ${variant}`}>
      <div className="product-filters-search">
        <Search size={16} />
        <input
          value={filters.query}
          onChange={(e) => patch({ query: e.target.value })}
          placeholder="Buscar por nombre o marca"
          aria-label="Buscar productos"
        />
      </div>
      {hideCategory ? null : (
        <select
          className="product-filter-control"
          value={filters.category}
          onChange={(e) => patch({ category: e.target.value as ProductFilterState['category'] })}
          aria-label="Filtrar por categoría"
        >
          <option value="all">Todas las categorías</option>
          {CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      )}
      <select
        className="product-filter-control"
        value={filters.brand}
        onChange={(e) => patch({ brand: e.target.value })}
        aria-label="Filtrar por marca"
      >
        <option value="">Todas las marcas</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
      <input
        className="product-filter-control"
        type="number"
        min="0"
        value={filters.minPrice}
        onChange={(e) => patch({ minPrice: e.target.value })}
        placeholder="Precio mín."
        aria-label="Precio mínimo"
      />
      <input
        className="product-filter-control"
        type="number"
        min="0"
        value={filters.maxPrice}
        onChange={(e) => patch({ maxPrice: e.target.value })}
        placeholder="Precio máx."
        aria-label="Precio máximo"
      />
    </div>
  )
}
