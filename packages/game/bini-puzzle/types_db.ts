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
      artists: {
        Row: {
          created_at: string | null
          id: number
          image_url: string | null
          name: string
          order_num: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_url?: string | null
          name: string
          order_num: number
        }
        Update: {
          created_at?: string | null
          id?: number
          image_url?: string | null
          name?: string
          order_num?: number
        }
        Relationships: []
      }
      difficulties: {
        Row: {
          created_at: string | null
          id: number
          name: string
          order_num: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          order_num: number
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          order_num?: number
        }
        Relationships: []
      }
      member_unlock_conditions: {
        Row: {
          artist_id: number | null
          created_at: string | null
          difficulty_id: number | null
          id: number
          member_id: number | null
          required_member_id: number | null
        }
        Insert: {
          artist_id?: number | null
          created_at?: string | null
          difficulty_id?: number | null
          id?: number
          member_id?: number | null
          required_member_id?: number | null
        }
        Update: {
          artist_id?: number | null
          created_at?: string | null
          difficulty_id?: number | null
          id?: number
          member_id?: number | null
          required_member_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "member_unlock_conditions_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_unlock_conditions_difficulty_id_fkey"
            columns: ["difficulty_id"]
            isOneToOne: false
            referencedRelation: "difficulties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_unlock_conditions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_unlock_conditions_required_member_id_fkey"
            columns: ["required_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          artist_id: number | null
          created_at: string | null
          id: number
          image_url: string | null
          name: string
          order_num: number
        }
        Insert: {
          artist_id?: number | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          name: string
          order_num: number
        }
        Update: {
          artist_id?: number | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          name?: string
          order_num?: number
        }
        Relationships: [
          {
            foreignKeyName: "members_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          artist_id: number | null
          clear_time: string | null
          created_at: string | null
          difficulty_id: number | null
          id: number
          is_cleared: boolean | null
          member_id: number | null
          score: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          artist_id?: number | null
          clear_time?: string | null
          created_at?: string | null
          difficulty_id?: number | null
          id?: number
          is_cleared?: boolean | null
          member_id?: number | null
          score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          artist_id?: number | null
          clear_time?: string | null
          created_at?: string | null
          difficulty_id?: number | null
          id?: number
          is_cleared?: boolean | null
          member_id?: number | null
          score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_difficulty_id_fkey"
            columns: ["difficulty_id"]
            isOneToOne: false
            referencedRelation: "difficulties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clear_member: {
        Args: {
          p_user_id: string
          p_difficulty_id: number
          p_artist_id: number
          p_member_id: number
          p_score?: number
        }
        Returns: boolean
      }
      get_unlocked_members: {
        Args: {
          p_user_id: string
          p_difficulty_id: number
          p_artist_id: number
        }
        Returns: {
          member_id: number
          name: string
          order_num: number
          image_url: string
          is_cleared: boolean
        }[]
      }
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
