import type { Product, ProductCategory, ProductSpec } from '@/lib/supabase/database.types'
import { CATEGORY_LABELS, WA } from '@/lib/constants'

export function money(n: number) {
  return '$ ' + Number(n).toLocaleString('es-AR')
}

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function isProductCategory(value: string): value is ProductCategory {
  return value === 'celulares' || value === 'consolas' || value === 'accesorios'
}

export function categoryLabel(category: ProductCategory) {
  return CATEGORY_LABELS[category]
}

export function parseSpecs(input: unknown): ProductSpec[] {
  if (!Array.isArray(input)) return []
  return input
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const label = 'label' in item ? String(item.label || '').trim() : ''
      const value = 'value' in item ? String(item.value || '').trim() : ''
      if (!label || !value) return null
      return { label, value }
    })
    .filter((item): item is ProductSpec => Boolean(item))
}

export function normalizeProduct(row: Product): Product {
  return {
    ...row,
    price: Number(row.price),
    old_price: row.old_price == null ? null : Number(row.old_price),
    specs: parseSpecs(row.specs),
  }
}

export function productWhatsAppUrl(product: Pick<Product, 'name' | 'price'>) {
  const text = `Hola DinoTech! Quiero consultar por: ${product.name} – ${money(product.price)}. ¿Está disponible?`
  return `https://wa.me/${WA}?text=${encodeURIComponent(text)}`
}

export function generalWhatsAppUrl(message = 'Hola DinoTech! Quiero hacer una consulta sobre sus productos.') {
  return `https://wa.me/${WA}?text=${encodeURIComponent(message)}`
}
