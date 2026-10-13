'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { ProductFilters } from '@/components/catalog/product-filters'
import { CATEGORIES } from '@/lib/constants'
import { emptyProductFilters, filterProducts, uniqueBrands } from '@/lib/product-filters'
import {
  categoryLabel,
  money,
  normalizeProduct,
  slugify,
  specsWithoutBrand,
  withBrandSpec,
} from '@/lib/products'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { deleteProductImages, uploadProductImage } from '@/lib/storage-products'
import type { Product, ProductCategory, ProductSpec } from '@/lib/supabase/database.types'

type FormState = {
  id?: string
  name: string
  slug: string
  category: ProductCategory
  brand: string
  short_description: string
  description: string
  price: string
  old_price: string
  image_url: string
  tag: string
  stock: string
  is_active: boolean
  featured: boolean
  specsText: string
}

const emptyForm: FormState = {
  name: '',
  slug: '',
  category: 'celulares',
  brand: '',
  short_description: '',
  description: '',
  price: '',
  old_price: '',
  image_url: '',
  tag: '',
  stock: '0',
  is_active: true,
  featured: false,
  specsText: '',
}

function specsToText(specs: ProductSpec[]) {
  return specs.map((spec) => `${spec.label}: ${spec.value}`).join('\n')
}

function textToSpecs(value: string): ProductSpec[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(':')
      return { label: label.trim(), value: rest.join(':').trim() }
    })
    .filter((spec) => spec.label && spec.value)
}

function toForm(product: Product): FormState {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    brand: product.brand || '',
    short_description: product.short_description || '',
    description: product.description || '',
    price: String(product.price),
    old_price: product.old_price == null ? '' : String(product.old_price),
    image_url: product.image_url || '',
    tag: product.tag || '',
    stock: String(product.stock),
    is_active: product.is_active,
    featured: product.featured,
    specsText: specsToText(specsWithoutBrand(product.specs)),
  }
}

export default function AdminCatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [filters, setFilters] = useState(emptyProductFilters)
  const [selected, setSelected] = useState<string[]>([])
  const [discount, setDiscount] = useState('10')
  const [batchCategory, setBatchCategory] = useState<ProductCategory | ''>('')
  const [batchStatus, setBatchStatus] = useState<'' | 'active' | 'hidden'>('')
  const [batchBusy, setBatchBusy] = useState(false)

  const brands = useMemo(() => uniqueBrands(products), [products])
  const filtered = useMemo(() => filterProducts(products, filters), [products, filters])
  const allFilteredSelected = filtered.length > 0 && filtered.every((product) => selected.includes(product.id))
  const selectedProducts = useMemo(
    () => products.filter((product) => selected.includes(product.id)),
    [products, selected],
  )

  async function loadProducts() {
    if (!isSupabaseConfigured()) {
      setError('Supabase no está configurado.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
        setProducts([])
      } else {
        setProducts((data || []).map((row) => normalizeProduct(row as Product)))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el catálogo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  function toggleOne(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  function toggleAll() {
    if (allFilteredSelected) {
      const visible = new Set(filtered.map((product) => product.id))
      setSelected((prev) => prev.filter((id) => !visible.has(id)))
      return
    }
    setSelected((prev) => Array.from(new Set([...prev, ...filtered.map((product) => product.id)])))
  }

  function openCreate() {
    setForm(emptyForm)
    setImageFile(null)
    setOpen(true)
  }

  function openEdit(product: Product) {
    setForm(toForm(product))
    setImageFile(null)
    setOpen(true)
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')

    const price = Number(form.price)
    const oldPrice = form.old_price.trim() ? Number(form.old_price) : null
    const stock = Number(form.stock || 0)
    const slug = (form.slug.trim() || slugify(form.name)).toLowerCase()

    if (!form.name.trim() || !slug || Number.isNaN(price)) {
      setError('Completá nombre y precio válidos.')
      setSaving(false)
      return
    }

    try {
      let imageUrl = form.image_url.trim() || null
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile)
        if (form.image_url && form.image_url !== imageUrl) {
          await deleteProductImages([form.image_url])
        }
      }

      const payload = {
        name: form.name.trim(),
        slug,
        category: form.category,
        short_description: form.short_description.trim() || null,
        description: form.description.trim() || null,
        price,
        old_price: oldPrice != null && !Number.isNaN(oldPrice) ? oldPrice : null,
        image_url: imageUrl,
        tag: form.tag.trim() || null,
        stock: Number.isNaN(stock) ? 0 : stock,
        is_active: form.is_active,
        featured: form.featured,
        specs: withBrandSpec(textToSpecs(form.specsText), form.brand),
      }

      const supabase = createClient()
      const result = form.id
        ? await supabase.from('products').update(payload).eq('id', form.id)
        : await supabase.from('products').insert(payload)

      if (result.error) {
        setError(result.error.message)
        setSaving(false)
        return
      }

      setOpen(false)
      setForm(emptyForm)
      setImageFile(null)
      await loadProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el producto.')
    } finally {
      setSaving(false)
    }
  }

  async function removeProduct(product: Product) {
    if (!window.confirm(`¿Eliminar "${product.name}"?`)) return
    setError('')
    try {
      const supabase = createClient()
      const { error: deleteError } = await supabase.from('products').delete().eq('id', product.id)
      if (deleteError) {
        setError(deleteError.message)
        return
      }
      await deleteProductImages([product.image_url])
      setSelected((prev) => prev.filter((id) => id !== product.id))
      await loadProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el producto.')
    }
  }

  async function bulkDelete() {
    if (selectedProducts.length === 0) return
    if (!window.confirm(`¿Eliminar ${selectedProducts.length} productos y sus imágenes?`)) return
    setBatchBusy(true)
    setError('')
    try {
      const ids = selectedProducts.map((product) => product.id)
      const supabase = createClient()
      const { error: deleteError } = await supabase.from('products').delete().in('id', ids)
      if (deleteError) throw deleteError
      await deleteProductImages(selectedProducts.map((product) => product.image_url))
      setSelected([])
      await loadProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar la selección.')
    } finally {
      setBatchBusy(false)
    }
  }

  async function bulkDiscount() {
    const percent = Number(discount)
    if (!selected.length || Number.isNaN(percent) || percent <= 0 || percent >= 100) {
      setError('Ingresá un porcentaje entre 1 y 99.')
      return
    }
    setBatchBusy(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: rpcError } = await supabase.rpc('apply_products_discount', {
        product_ids: selected,
        percent,
      })
      if (rpcError) throw rpcError
      setSelected([])
      await loadProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo aplicar el descuento.')
    } finally {
      setBatchBusy(false)
    }
  }

  async function bulkUpdateMeta() {
    if (!selected.length || (!batchCategory && !batchStatus)) {
      setError('Elegí una categoría o un estado para aplicar.')
      return
    }
    setBatchBusy(true)
    setError('')
    try {
      const supabase = createClient()
      const { error: rpcError } = await supabase.rpc('bulk_update_products', {
        product_ids: selected,
        new_category: batchCategory || null,
        new_is_active: batchStatus === '' ? null : batchStatus === 'active',
      })
      if (rpcError) throw rpcError
      setSelected([])
      setBatchCategory('')
      setBatchStatus('')
      await loadProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar la selección.')
    } finally {
      setBatchBusy(false)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="kicker">MÓDULO CATÁLOGO</p>
          <h1>Administrar productos</h1>
        </div>
        <button type="button" className="btn-primary" onClick={openCreate}>
          <Plus size={16} /> Nuevo producto
        </button>
      </header>

      <div className="admin-toolbar">
        <ProductFilters filters={filters} brands={brands} variant="admin" onChange={setFilters} />
      </div>

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="catalog-empty">Cargando productos...</p>
      ) : filtered.length === 0 ? (
        <p className="catalog-empty">No hay productos para mostrar.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleAll}
                    aria-label="Seleccionar todos"
                  />
                </th>
                <th>Producto</th>
                <th>Marca</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className={selected.includes(product.id) ? 'is-selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(product.id)}
                      onChange={() => toggleOne(product.id)}
                      aria-label={`Seleccionar ${product.name}`}
                    />
                  </td>
                  <td>
                    <strong>{product.name}</strong>
                    <small>/{product.slug}</small>
                  </td>
                  <td>{product.brand || '—'}</td>
                  <td>{categoryLabel(product.category)}</td>
                  <td>{money(product.price)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`admin-status ${product.is_active ? 'on' : 'off'}`}>
                      {product.is_active ? 'Activo' : 'Oculto'}
                    </span>
                  </td>
                  <td className="admin-actions">
                    <button type="button" onClick={() => openEdit(product)} aria-label="Editar">
                      <Pencil size={15} />
                    </button>
                    <button type="button" onClick={() => void removeProduct(product)} aria-label="Eliminar">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected.length > 0 ? (
        <div className="admin-batch-bar">
          <strong>{selected.length} seleccionados</strong>
          <label>
            %
            <input
              className="service-input"
              type="number"
              min="1"
              max="99"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </label>
          <button type="button" className="btn-primary" disabled={batchBusy} onClick={() => void bulkDiscount()}>
            Aplicar descuento
          </button>
          <select
            className="service-input"
            value={batchCategory}
            onChange={(e) => setBatchCategory(e.target.value as ProductCategory | '')}
          >
            <option value="">Categoría</option>
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          <select
            className="service-input"
            value={batchStatus}
            onChange={(e) => setBatchStatus(e.target.value as '' | 'active' | 'hidden')}
          >
            <option value="">Estado</option>
            <option value="active">Activo</option>
            <option value="hidden">Oculto</option>
          </select>
          <button type="button" className="btn-outline" disabled={batchBusy} onClick={() => void bulkUpdateMeta()}>
            Aplicar cambios
          </button>
          <button type="button" className="btn-danger" disabled={batchBusy} onClick={() => void bulkDelete()}>
            Eliminar
          </button>
          <button type="button" className="btn-ghost" onClick={() => setSelected([])}>
            Limpiar
          </button>
        </div>
      ) : null}

      {open ? (
        <div className="admin-modal-backdrop">
          <form className="admin-modal" onSubmit={onSubmit}>
            <div className="admin-modal-head">
              <h2>{form.id ? 'Editar producto' : 'Nuevo producto'}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>

            <div className="admin-form-grid">
              <label>
                Nombre *
                <input
                  className="service-input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                      slug: prev.id ? prev.slug : slugify(e.target.value),
                    }))
                  }
                  required
                />
              </label>
              <label>
                Slug *
                <input
                  className="service-input"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                  required
                />
              </label>
              <label>
                Categoría *
                <select
                  className="service-input"
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value as ProductCategory }))
                  }
                >
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Marca
                <input
                  className="service-input"
                  value={form.brand}
                  onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
                  placeholder="Apple, Sony, Logitech..."
                />
              </label>
              <label>
                Tag
                <input
                  className="service-input"
                  value={form.tag}
                  onChange={(e) => setForm((prev) => ({ ...prev, tag: e.target.value }))}
                  placeholder="Oferta / Nuevo / Destacado"
                />
              </label>
              <label>
                Precio *
                <input
                  className="service-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                  required
                />
              </label>
              <label>
                Precio anterior
                <input
                  className="service-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.old_price}
                  onChange={(e) => setForm((prev) => ({ ...prev, old_price: e.target.value }))}
                />
              </label>
              <label>
                Stock
                <input
                  className="service-input"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
                />
              </label>
              <label className="span-2">
                Imagen (se comprime a WebP)
                <input
                  className="service-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
                {form.image_url ? (
                  <small className="image-url-hint">URL pública: {form.image_url}</small>
                ) : null}
                {form.image_url ? (
                  <img src={form.image_url} alt="Vista previa" className="admin-image-preview" />
                ) : null}
              </label>
              <label className="span-2">
                Descripción corta
                <input
                  className="service-input"
                  value={form.short_description}
                  onChange={(e) => setForm((prev) => ({ ...prev, short_description: e.target.value }))}
                />
              </label>
              <label className="span-2">
                Descripción
                <textarea
                  className="service-input"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </label>
              <label className="span-2">
                Especificaciones (una por línea: Label: Valor)
                <textarea
                  className="service-input"
                  rows={5}
                  value={form.specsText}
                  onChange={(e) => setForm((prev) => ({ ...prev, specsText: e.target.value }))}
                  placeholder={'Pantalla: 6.7" OLED\nProcesador: A17 Pro'}
                />
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                />
                Activo en catálogo
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                />
                Destacado
              </label>
            </div>

            <div className="admin-modal-actions">
              <button type="button" className="btn-outline" onClick={() => setOpen(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar en Supabase'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}
