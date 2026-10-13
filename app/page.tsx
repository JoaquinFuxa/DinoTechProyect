import { HomePage } from '@/components/home-page'
import { normalizeProduct } from '@/lib/products'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/supabase/database.types'

async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map((row) => normalizeProduct(row as Product))
}

export default async function Page() {
  const featuredProducts = await getFeaturedProducts()
  return <HomePage featuredProducts={featuredProducts} />
}
