import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient, ensureProductImagesBucket } from '@/lib/supabase/admin'
import { PRODUCT_IMAGES_BUCKET, storagePathFromPublicUrl } from '@/lib/storage-products'

export async function POST(request: Request) {
  const auth = await createClient()
  const { data } = await auth.auth.getClaims()
  if (!data?.claims) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const form = await request.formData()
  const file = form.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'No se recibió ninguna imagen.' }, { status: 400 })
  }

  try {
    await ensureProductImagesBucket()
    const supabase = createAdminClient()
    const path = `${crypto.randomUUID()}.webp`
    const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(path, file, {
      contentType: file.type || 'image/webp',
      cacheControl: '3600',
      upsert: false,
    })
    if (error) throw error
    const { data: publicData } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path)
    return NextResponse.json({ url: publicData.publicUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'No se pudo subir la imagen.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const auth = await createClient()
  const { data } = await auth.auth.getClaims()
  if (!data?.claims) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as { urls?: string[] } | null
  const paths = (body?.urls || []).map(storagePathFromPublicUrl).filter((path): path is string => Boolean(path))
  if (paths.length === 0) return NextResponse.json({ ok: true })

  try {
    await ensureProductImagesBucket()
    const supabase = createAdminClient()
    const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove(paths)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'No se pudieron borrar las imágenes.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
