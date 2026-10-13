export type ServiceRequestStatus = 'nuevo' | 'en_proceso' | 'cerrado'

export type ProductCategory = 'celulares' | 'consolas' | 'accesorios'

export type ProductSpec = {
  label: string
  value: string
}

export type Product = {
  id: string
  created_at: string
  updated_at: string
  name: string
  slug: string
  category: ProductCategory
  short_description: string | null
  description: string | null
  price: number
  old_price: number | null
  image_url: string | null
  brand?: string | null
  tag: string | null
  specs: ProductSpec[]
  stock: number
  is_active: boolean
  featured: boolean
}

export type Database = {
  public: {
    Tables: {
      service_requests: {
        Row: {
          id: string
          created_at: string
          name: string
          phone: string | null
          device_type: string
          brand_model: string | null
          description: string
          photos: string[]
          status: ServiceRequestStatus
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          phone?: string | null
          device_type: string
          brand_model?: string | null
          description: string
          photos?: string[]
          status?: ServiceRequestStatus
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          phone?: string | null
          device_type?: string
          brand_model?: string | null
          description?: string
          photos?: string[]
          status?: ServiceRequestStatus
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          slug: string
          category: ProductCategory
          short_description: string | null
          description: string | null
          price: number
          old_price: number | null
          image_url: string | null
          brand?: string | null
          tag: string | null
          specs: ProductSpec[]
          stock: number
          is_active: boolean
          featured: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          slug: string
          category: ProductCategory
          short_description?: string | null
          description?: string | null
          price: number
          old_price?: number | null
          image_url?: string | null
          brand?: string | null
          tag?: string | null
          specs?: ProductSpec[]
          stock?: number
          is_active?: boolean
          featured?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          slug?: string
          category?: ProductCategory
          short_description?: string | null
          description?: string | null
          price?: number
          old_price?: number | null
          image_url?: string | null
          brand?: string | null
          tag?: string | null
          specs?: ProductSpec[]
          stock?: number
          is_active?: boolean
          featured?: boolean
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      apply_products_discount: {
        Args: { product_ids: string[]; percent: number }
        Returns: number
      }
      bulk_update_products: {
        Args: {
          product_ids: string[]
          new_category?: ProductCategory | null
          new_is_active?: boolean | null
        }
        Returns: number
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
