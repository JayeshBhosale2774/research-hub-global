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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          record_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_number: string
          created_at: string
          id: string
          is_valid: boolean
          issued_at: string
          paper_id: string
          pdf_path: string | null
          qr_code_data: string
        }
        Insert: {
          certificate_number: string
          created_at?: string
          id?: string
          is_valid?: boolean
          issued_at?: string
          paper_id: string
          pdf_path?: string | null
          qr_code_data: string
        }
        Update: {
          certificate_number?: string
          created_at?: string
          id?: string
          is_valid?: boolean
          issued_at?: string
          paper_id?: string
          pdf_path?: string | null
          qr_code_data?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: true
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
        ]
      }
      conferences: {
        Row: {
          created_at: string
          description: string | null
          domains: Database["public"]["Enums"]["paper_domain"][] | null
          end_date: string
          id: string
          is_active: boolean | null
          registration_fee: number | null
          start_date: string
          submission_deadline: string
          title: string
          updated_at: string
          venue: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          domains?: Database["public"]["Enums"]["paper_domain"][] | null
          end_date: string
          id?: string
          is_active?: boolean | null
          registration_fee?: number | null
          start_date: string
          submission_deadline: string
          title: string
          updated_at?: string
          venue: string
        }
        Update: {
          created_at?: string
          description?: string | null
          domains?: Database["public"]["Enums"]["paper_domain"][] | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          registration_fee?: number | null
          start_date?: string
          submission_deadline?: string
          title?: string
          updated_at?: string
          venue?: string
        }
        Relationships: []
      }
      papers: {
        Row: {
          abstract: string
          admin_notes: string | null
          approved_at: string | null
          author_id: string
          authors: Json
          created_at: string
          domain: Database["public"]["Enums"]["paper_domain"]
          file_path: string | null
          id: string
          keywords: string[] | null
          plagiarism_score: number | null
          publication_type: Database["public"]["Enums"]["publication_type"]
          published_at: string | null
          reviewed_at: string | null
          revision_deadline: string | null
          status: Database["public"]["Enums"]["paper_status"]
          submitted_at: string
          title: string
          updated_at: string
        }
        Insert: {
          abstract: string
          admin_notes?: string | null
          approved_at?: string | null
          author_id: string
          authors?: Json
          created_at?: string
          domain: Database["public"]["Enums"]["paper_domain"]
          file_path?: string | null
          id?: string
          keywords?: string[] | null
          plagiarism_score?: number | null
          publication_type?: Database["public"]["Enums"]["publication_type"]
          published_at?: string | null
          reviewed_at?: string | null
          revision_deadline?: string | null
          status?: Database["public"]["Enums"]["paper_status"]
          submitted_at?: string
          title: string
          updated_at?: string
        }
        Update: {
          abstract?: string
          admin_notes?: string | null
          approved_at?: string | null
          author_id?: string
          authors?: Json
          created_at?: string
          domain?: Database["public"]["Enums"]["paper_domain"]
          file_path?: string | null
          id?: string
          keywords?: string[] | null
          plagiarism_score?: number | null
          publication_type?: Database["public"]["Enums"]["publication_type"]
          published_at?: string | null
          reviewed_at?: string | null
          revision_deadline?: string | null
          status?: Database["public"]["Enums"]["paper_status"]
          submitted_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          author_id: string
          base_amount: number
          created_at: string
          extra_author_fee: number | null
          hardcopy_fee: number | null
          id: string
          paid_at: string | null
          paper_id: string
          payment_proof_path: string | null
          shipping_address: string | null
          status: string
          total_amount: number
          transaction_id: string | null
          verified_at: string | null
          wants_hardcopy: boolean | null
        }
        Insert: {
          author_id: string
          base_amount?: number
          created_at?: string
          extra_author_fee?: number | null
          hardcopy_fee?: number | null
          id?: string
          paid_at?: string | null
          paper_id: string
          payment_proof_path?: string | null
          shipping_address?: string | null
          status?: string
          total_amount: number
          transaction_id?: string | null
          verified_at?: string | null
          wants_hardcopy?: boolean | null
        }
        Update: {
          author_id?: string
          base_amount?: number
          created_at?: string
          extra_author_fee?: number | null
          hardcopy_fee?: number | null
          id?: string
          paid_at?: string | null
          paper_id?: string
          payment_proof_path?: string | null
          shipping_address?: string | null
          status?: string
          total_amount?: number
          transaction_id?: string | null
          verified_at?: string | null
          wants_hardcopy?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          institution: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          institution?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          institution?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      standards: {
        Row: {
          category: string
          created_at: string
          description: string | null
          document_path: string | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          document_path?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          document_path?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string
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
      generate_certificate_number: { Args: never; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "author"
      paper_domain:
        | "ECE"
        | "CSE"
        | "IT"
        | "Mechanical"
        | "Civil"
        | "Electrical"
        | "Aerospace"
      paper_status:
        | "submitted"
        | "under_review"
        | "revision_requested"
        | "approved"
        | "rejected"
        | "published"
      publication_type: "journal" | "magazine" | "research_paper"
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
      app_role: ["admin", "author"],
      paper_domain: [
        "ECE",
        "CSE",
        "IT",
        "Mechanical",
        "Civil",
        "Electrical",
        "Aerospace",
      ],
      paper_status: [
        "submitted",
        "under_review",
        "revision_requested",
        "approved",
        "rejected",
        "published",
      ],
      publication_type: ["journal", "magazine", "research_paper"],
    },
  },
} as const
