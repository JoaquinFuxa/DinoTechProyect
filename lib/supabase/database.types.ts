export type ServiceRequestStatus = 'nuevo' | 'en_proceso' | 'cerrado'

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
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
