export const PRODUCT_IMAGES_BUCKET = 'productos'

const PUBLIC_MARKER = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`

export function storagePathFromPublicUrl(url: string | null | undefined) {
  if (!url) return null
  const index = url.indexOf(PUBLIC_MARKER)
  if (index === -1) return null
  return decodeURIComponent(url.slice(index + PUBLIC_MARKER.length).split('?')[0])
}

export async function compressImageToWebp(file: File, maxSize = 1400, quality = 0.82) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo comprimir la imagen.')
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error('No se pudo convertir a WebP.'))), 'image/webp', quality)
  })

  return new File([blob], `${crypto.randomUUID()}.webp`, { type: 'image/webp' })
}

export async function uploadProductImage(file: File) {
  const webp = await compressImageToWebp(file)
  const body = new FormData()
  body.set('file', webp)
  const response = await fetch('/api/admin/product-image', { method: 'POST', body })
  const payload = (await response.json().catch(() => null)) as { url?: string; error?: string } | null
  if (!response.ok || !payload?.url) {
    throw new Error(payload?.error || 'No se pudo subir la imagen.')
  }
  return payload.url
}

export async function deleteProductImages(urls: Array<string | null | undefined>) {
  const existing = urls.filter((url): url is string => Boolean(url))
  if (existing.length === 0) return
  const response = await fetch('/api/admin/product-image', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls: existing }),
  })
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(payload?.error || 'No se pudieron borrar las imágenes.')
  }
}
