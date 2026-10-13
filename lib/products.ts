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

export const BRAND_SPEC_LABEL = 'Marca'

function isBrandSpec(spec: ProductSpec) {
  return spec.label.trim().toLowerCase() === BRAND_SPEC_LABEL.toLowerCase()
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

export function specsWithoutBrand(specs: ProductSpec[]) {
  return specs.filter((spec) => !isBrandSpec(spec))
}

export function withBrandSpec(specs: ProductSpec[], brand: string) {
  const next = specsWithoutBrand(specs)
  const value = brand.trim()
  if (value) next.unshift({ label: BRAND_SPEC_LABEL, value })
  return next
}

export function getProductBrand(product: Pick<Product, 'brand' | 'specs'>) {
  const fromColumn = product.brand?.trim()
  if (fromColumn) return fromColumn
  return product.specs.find(isBrandSpec)?.value.trim() || null
}

export function normalizeProduct(row: Product): Product {
  const specs = parseSpecs(row.specs)
  return {
    ...row,
    specs,
    brand: getProductBrand({ brand: row.brand, specs }),
    price: Number(row.price),
    old_price: row.old_price == null ? null : Number(row.old_price),
  }
}

export function productWhatsAppUrl(product: Pick<Product, 'name' | 'price'>) {
  const text = `Hola DinoTech! Quiero consultar por: ${product.name} – ${money(product.price)}. ¿Está disponible?`
  return `https://wa.me/${WA}?text=${encodeURIComponent(text)}`
}

export function generalWhatsAppUrl(message = 'Hola DinoTech! Quiero hacer una consulta sobre sus productos.') {
  return `https://wa.me/${WA}?text=${encodeURIComponent(message)}`
}

const REPRESENTATIVE_IMAGES: { match: RegExp; src: string }[] = [
  { match: /iphone/i, src: '/productos/iphone-15-pro-max.jpg' },
  { match: /samsung|galaxy|s24/i, src: '/productos/samsung-galaxy-s24-ultra.jpg' },
  { match: /playstation|ps5/i, src: '/productos/playstation-5-slim.jpg' },
  { match: /hyperx|cloud|auricular/i, src: '/productos/hyperx-cloud-iii.jpg' },
  { match: /switch|nintendo/i, src: '/productos/nintendo-switch-oled.jpg' },
  { match: /logitech|g305|mouse/i, src: '/productos/logitech-g305.jpg' },
]

export function productImageUrl(product: { slug?: string; name: string; image_url?: string | null }) {
  if (product.image_url) return product.image_url
  const haystack = `${product.slug || ''} ${product.name}`
  return REPRESENTATIVE_IMAGES.find((item) => item.match.test(haystack))?.src || null
}
