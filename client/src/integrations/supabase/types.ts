export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      biblioteca_musicas: {
        Row: {
          cantor: string | null
          created_at: string
          duracao: string | null
          id: string
          link_download: string | null
          link_youtube: string | null
          nome: string
          observacoes: string | null
          partitura: string | null
          secao_liturgica: string | null
          thumbnail: string | null
          youtube_video_id: string | null
        }
        Insert: {
          cantor?: string | null
          created_at?: string
          duracao?: string | null
          id?: string
          link_download?: string | null
          link_youtube?: string | null
          nome: string
          observacoes?: string | null
          partitura?: string | null
          secao_liturgica?: string | null
          thumbnail?: string | null
          youtube_video_id?: string | null
        }
        Update: {
          cantor?: string | null
          created_at?: string
          duracao?: string | null
          id?: string
          link_download?: string | null
          link_youtube?: string | null
          nome?: string
          observacoes?: string | null
          partitura?: string | null
          secao_liturgica?: string | null
          thumbnail?: string | null
          youtube_video_id?: string | null
        }
        Relationships: []
      }
      missa_musicos: {
        Row: {
          created_at: string
          id: string
          missa_id: string
          musico_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          missa_id: string
          musico_id: string
        }
        Update: {
          created_at?: string
          id?: string
          missa_id?: string
          musico_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "missa_musicos_missa_id_fkey"
            columns: ["missa_id"]
            isOneToOne: false
            referencedRelation: "missas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missa_musicos_musico_id_fkey"
            columns: ["musico_id"]
            isOneToOne: false
            referencedRelation: "musicos"
            referencedColumns: ["id"]
          },
        ]
      }
      missas: {
        Row: {
          created_at: string
          data: string
          horario: string
          id: string
          observacoes: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data: string
          horario: string
          id?: string
          observacoes?: string | null
          tipo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: string
          horario?: string
          id?: string
          observacoes?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      musicas: {
        Row: {
          cantor: string | null
          created_at: string
          id: string
          link_download: string | null
          link_youtube: string | null
          missa_id: string
          nome: string
          observacoes: string | null
          partitura: string | null
          secao_liturgica: string
          updated_at: string
        }
        Insert: {
          cantor?: string | null
          created_at?: string
          id?: string
          link_download?: string | null
          link_youtube?: string | null
          missa_id: string
          nome: string
          observacoes?: string | null
          partitura?: string | null
          secao_liturgica: string
          updated_at?: string
        }
        Update: {
          cantor?: string | null
          created_at?: string
          id?: string
          link_download?: string | null
          link_youtube?: string | null
          missa_id?: string
          nome?: string
          observacoes?: string | null
          partitura?: string | null
          secao_liturgica?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "musicas_missa_id_fkey"
            columns: ["missa_id"]
            isOneToOne: false
            referencedRelation: "missas"
            referencedColumns: ["id"]
          },
        ]
      }
      musico_anotacoes: {
        Row: {
          created_at: string
          id: string
          musico_id: string
          texto: string
        }
        Insert: {
          created_at?: string
          id?: string
          musico_id: string
          texto: string
        }
        Update: {
          created_at?: string
          id?: string
          musico_id?: string
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "musico_anotacoes_musico_id_fkey"
            columns: ["musico_id"]
            isOneToOne: false
            referencedRelation: "musicos"
            referencedColumns: ["id"]
          },
        ]
      }
      musico_sugestoes: {
        Row: {
          created_at: string
          id: string
          musico_id: string
          status: string
          texto: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          musico_id: string
          status?: string
          texto: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          musico_id?: string
          status?: string
          texto?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "musico_sugestoes_musico_id_fkey"
            columns: ["musico_id"]
            isOneToOne: false
            referencedRelation: "musicos"
            referencedColumns: ["id"]
          },
        ]
      }
      musicos: {
        Row: {
          created_at: string
          disponivel: boolean
          email: string | null
          foto: string | null
          funcao: string
          id: string
          nome: string
          observacoes_permanentes: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          disponivel?: boolean
          email?: string | null
          foto?: string | null
          funcao: string
          id?: string
          nome: string
          observacoes_permanentes?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          disponivel?: boolean
          email?: string | null
          foto?: string | null
          funcao?: string
          id?: string
          nome?: string
          observacoes_permanentes?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
