import { ArrowRight, Gamepad2, Headphones, Smartphone } from 'lucide-react'
import type { Product, ProductCategory } from '@/lib/supabase/database.types'
import { categoryLabel, money, productImageUrl } from '@/lib/products'

const icons: Record<ProductCategory, typeof Smartphone> = {
  celulares: Smartphone,
  consolas: Gamepad2,
  accesorios: Headphones,
}

export function ProductCard({ product }: { product: Product }) {
  const Icon = icons[product.category]
  const image = productImageUrl(product)

  return (
    <a href={`/producto/${product.slug}`} className="product-card catalog-product-card">
      <div className="product-top">
        {product.tag ? (
          <span className={`badge ${product.tag === 'Oferta' ? 'offer' : product.tag === 'Nuevo' ? 'new' : ''}`}>
            {product.tag}
          </span>
        ) : (
          <span />
        )}
      </div>
      <div className={`product-visual visual-${product.category}`}>
        <div className="visual-grid" />
        {image ? (
          <img src={image} alt={product.name} className="product-image" />
        ) : (
          <Icon className="visual-icon" />
        )}
      </div>
      <div className="product-info">
        <p>
          {categoryLabel(product.category)}
          {product.brand ? ` · ${product.brand}` : ''}
        </p>
        <h3>{product.name}</h3>
        {product.short_description ? <small className="product-short">{product.short_description}</small> : null}
        <div className="price-row">
          <strong>{money(product.price)}</strong>
          {product.old_price ? <del>{money(product.old_price)}</del> : null}
        </div>
        <span className="product-btn">
          Ver detalle <ArrowRight size={15} />
        </span>
      </div>
    </a>
  )
}
