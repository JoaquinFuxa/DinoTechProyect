'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import type { Product, ProductCategory, ProductSpec } from '@/lib/supabase/database.types'
import { categoryLabel, money, normalizeProduct, slugify } from '@/lib/products'

type FormState = {
  id?: string
  name: string
  slug: string
  category: ProductCategory
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
    short_description: product.short_description || '',
    description: product.description || '',
    price: String(product.price),
    old_price: product.old_price == null ? '' : String(product.old_price),
    image_url: product.image_url || '',
    tag: product.tag || '',
    stock: String(product.stock),
    is_active: product.is_active,
    featured: product.featured,
    specsText: specsToText(product.specs),
  }
}

export default function AdminCatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.category.includes(q) ||
        product.slug.includes(q),
    )
  }, [products, query])

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

  function openCreate() {
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(product: Product) {
    setForm(toForm(product))
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

    const payload = {
      name: form.name.trim(),
      slug,
      category: form.category,
      short_description: form.short_description.trim() || null,
      description: form.description.trim() || null,
      price,
      old_price: oldPrice != null && !Number.isNaN(oldPrice) ? oldPrice : null,
      image_url: form.image_url.trim() || null,
      tag: form.tag.trim() || null,
      stock: Number.isNaN(stock) ? 0 : stock,
      is_active: form.is_active,
      featured: form.featured,
      specs: textToSpecs(form.specsText),
    }

    try {
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
      await loadProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el producto.')
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
        <input
          className="service-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, categoría o slug"
        />
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
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <small>/{product.slug}</small>
                  </td>
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
              <label>
                Imagen URL
                <input
                  className="service-input"
                  value={form.image_url}
                  onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://..."
                />
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
