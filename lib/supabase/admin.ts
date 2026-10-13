import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'
import { getSupabasePublicEnv } from '@/lib/supabase/env'

const PRODUCT_IMAGES_BUCKET = 'productos'

export function createAdminClient() {
  const { url } = getSupabasePublicEnv()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('Falta SUPABASE_SERVICE_ROLE_KEY para gestionar Storage.')
  }
  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function ensureProductImagesBucket() {
  const supabase = createAdminClient()
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  if (listError) throw listError

  const exists = buckets?.some((bucket) => bucket.id === PRODUCT_IMAGES_BUCKET)
  if (exists) return

  const { error: createError } = await supabase.storage.createBucket(PRODUCT_IMAGES_BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png', 'image/gif', 'image/avif'],
  })
  if (createError && !/already exists|duplicate/i.test(createError.message)) {
    throw createError
  }
}
