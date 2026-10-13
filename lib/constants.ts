import type { ProductCategory } from '@/lib/supabase/database.types'

export const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5493518193051'

export const CATEGORIES: {
  id: ProductCategory
  label: string
  description: string
}[] = [
  {
    id: 'celulares',
    label: 'Celulares',
    description: 'Smartphones, fundas y gama alta.',
  },
  {
    id: 'consolas',
    label: 'Consolas',
    description: 'PlayStation, Nintendo y más.',
  },
  {
    id: 'accesorios',
    label: 'Accesorios',
    description: 'Auriculares, mouse, cables y extras.',
  },
]

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  celulares: 'Celulares',
  consolas: 'Consolas',
  accesorios: 'Accesorios',
}
