export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      car_images: {
        Row: {
          car_id: string
          created_at: string
          id: string
          is_cover: boolean
          position: number
          storage_path: string | null
          url: string
        }
        Insert: {
          car_id: string
          created_at?: string
          id?: string
          is_cover?: boolean
          position?: number
          storage_path?: string | null
          url: string
        }
        Update: {
          car_id?: string
          created_at?: string
          id?: string
          is_cover?: boolean
          position?: number
          storage_path?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "car_images_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      cars: {
        Row: {
          body_type: string | null
          brand: string
          brochure_url: string | null
          color: string | null
          condition: string
          created_at: string
          description: string | null
          displacement_cc: number | null
          doors: number | null
          featured: boolean
          fuel: string
          has_documents: boolean | null
          has_inspection: boolean | null
          id: string
          inspection_notes: string | null
          location: string | null
          matching_numbers: boolean | null
          mileage_km: number
          model: string
          power_hp: number | null
          previous_owners: number | null
          price_eur: number
          registration_date: string | null
          seats: number | null
          status: string
          transmission: string
          updated_at: string
          version: string | null
          vin: string | null
          year: number
        }
        Insert: {
          body_type?: string | null
          brand: string
          brochure_url?: string | null
          color?: string | null
          condition?: string
          created_at?: string
          description?: string | null
          displacement_cc?: number | null
          doors?: number | null
          featured?: boolean
          fuel: string
          has_documents?: boolean | null
          has_inspection?: boolean | null
          id?: string
          inspection_notes?: string | null
          location?: string | null
          matching_numbers?: boolean | null
          mileage_km?: number
          model: string
          power_hp?: number | null
          previous_owners?: number | null
          price_eur: number
          registration_date?: string | null
          seats?: number | null
          status?: string
          transmission: string
          updated_at?: string
          version?: string | null
          vin?: string | null
          year: number
        }
        Update: {
          body_type?: string | null
          brand?: string
          brochure_url?: string | null
          color?: string | null
          condition?: string
          created_at?: string
          description?: string | null
          displacement_cc?: number | null
          doors?: number | null
          featured?: boolean
          fuel?: string
          has_documents?: boolean | null
          has_inspection?: boolean | null
          id?: string
          inspection_notes?: string | null
          location?: string | null
          matching_numbers?: boolean | null
          mileage_km?: number
          model?: string
          power_hp?: number | null
          previous_owners?: number | null
          price_eur?: number
          registration_date?: string | null
          seats?: number | null
          status?: string
          transmission?: string
          updated_at?: string
          version?: string | null
          vin?: string | null
          year?: number
        }
        Relationships: []
      }
      listing_requests: {
        Row: {
          admin_notes: string | null
          asking_price_eur: number | null
          brand: string
          brochure_file_url: string | null
          brochure_notes: string | null
          city: string | null
          color: string | null
          condition: string
          created_at: string
          description: string | null
          displacement_cc: number | null
          email: string
          fuel: string
          full_name: string
          has_brochure: boolean | null
          has_documents: boolean | null
          has_inspection: boolean | null
          id: string
          image_urls: string[] | null
          mileage_km: number
          model: string
          phone: string
          power_hp: number | null
          previous_owners: number | null
          status: string
          transmission: string
          version: string | null
          year: number
        }
        Insert: {
          admin_notes?: string | null
          asking_price_eur?: number | null
          brand: string
          brochure_file_url?: string | null
          brochure_notes?: string | null
          city?: string | null
          color?: string | null
          condition: string
          created_at?: string
          description?: string | null
          displacement_cc?: number | null
          email: string
          fuel: string
          full_name: string
          has_brochure?: boolean | null
          has_documents?: boolean | null
          has_inspection?: boolean | null
          id?: string
          image_urls?: string[] | null
          mileage_km: number
          model: string
          phone: string
          power_hp?: number | null
          previous_owners?: number | null
          status?: string
          transmission: string
          version?: string | null
          year: number
        }
        Update: {
          admin_notes?: string | null
          asking_price_eur?: number | null
          brand?: string
          brochure_file_url?: string | null
          brochure_notes?: string | null
          city?: string | null
          color?: string | null
          condition?: string
          created_at?: string
          description?: string | null
          displacement_cc?: number | null
          email?: string
          fuel?: string
          full_name?: string
          has_brochure?: boolean | null
          has_documents?: boolean | null
          has_inspection?: boolean | null
          id?: string
          image_urls?: string[] | null
          mileage_km?: number
          model?: string
          phone?: string
          power_hp?: number | null
          previous_owners?: number | null
          status?: string
          transmission?: string
          version?: string | null
          year?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
