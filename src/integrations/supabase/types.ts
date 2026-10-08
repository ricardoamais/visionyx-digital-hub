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
      suporte_chamados: {
        Row: {
          assunto: string
          categoria: Database["public"]["Enums"]["chamado_categoria"]
          cliente_id: string
          closed_at: string | null
          created_at: string
          descricao: string | null
          filial_id: string
          id: string
          numero: number
          prioridade: Database["public"]["Enums"]["chamado_prioridade"]
          status: Database["public"]["Enums"]["chamado_status"]
          tecnico_id: string | null
          updated_at: string
          usuario_id: string | null
        }
        Insert: {
          assunto: string
          categoria?: Database["public"]["Enums"]["chamado_categoria"]
          cliente_id: string
          closed_at?: string | null
          created_at?: string
          descricao?: string | null
          filial_id: string
          id?: string
          numero?: number
          prioridade?: Database["public"]["Enums"]["chamado_prioridade"]
          status?: Database["public"]["Enums"]["chamado_status"]
          tecnico_id?: string | null
          updated_at?: string
          usuario_id?: string | null
        }
        Update: {
          assunto?: string
          categoria?: Database["public"]["Enums"]["chamado_categoria"]
          cliente_id?: string
          closed_at?: string | null
          created_at?: string
          descricao?: string | null
          filial_id?: string
          id?: string
          numero?: number
          prioridade?: Database["public"]["Enums"]["chamado_prioridade"]
          status?: Database["public"]["Enums"]["chamado_status"]
          tecnico_id?: string | null
          updated_at?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suporte_chamados_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "suporte_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suporte_chamados_filial_id_cliente_id_fkey"
            columns: ["filial_id", "cliente_id"]
            isOneToOne: false
            referencedRelation: "suporte_filiais"
            referencedColumns: ["id", "cliente_id"]
          },
          {
            foreignKeyName: "suporte_chamados_tecnico_id_fkey"
            columns: ["tecnico_id"]
            isOneToOne: false
            referencedRelation: "suporte_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suporte_chamados_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "suporte_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      suporte_clientes: {
        Row: {
          cnpj: string | null
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nome: string
          status: string
          telefone: string | null
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          status?: string
          telefone?: string | null
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          status?: string
          telefone?: string | null
        }
        Relationships: []
      }
      suporte_filiais: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string | null
          cliente_id: string
          cnpj: string | null
          codigo: string
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          numero: string | null
          responsavel: string | null
          status: string
          telefone: string | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cliente_id: string
          cnpj?: string | null
          codigo: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          numero?: string | null
          responsavel?: string | null
          status?: string
          telefone?: string | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          cliente_id?: string
          cnpj?: string | null
          codigo?: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          numero?: string | null
          responsavel?: string | null
          status?: string
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suporte_filiais_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "suporte_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      suporte_tecnico_clientes: {
        Row: {
          cliente_id: string
          tecnico_id: string
        }
        Insert: {
          cliente_id: string
          tecnico_id: string
        }
        Update: {
          cliente_id?: string
          tecnico_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suporte_tecnico_clientes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "suporte_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suporte_tecnico_clientes_tecnico_id_fkey"
            columns: ["tecnico_id"]
            isOneToOne: false
            referencedRelation: "suporte_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      suporte_usuarios: {
        Row: {
          cargo: string | null
          cliente_id: string | null
          created_at: string
          email: string
          filial_id: string | null
          id: string
          nome: string
          perfil: Database["public"]["Enums"]["suporte_perfil"]
          setor: string | null
          status: string
          telefone: string | null
          user_id: string | null
        }
        Insert: {
          cargo?: string | null
          cliente_id?: string | null
          created_at?: string
          email: string
          filial_id?: string | null
          id?: string
          nome: string
          perfil?: Database["public"]["Enums"]["suporte_perfil"]
          setor?: string | null
          status?: string
          telefone?: string | null
          user_id?: string | null
        }
        Update: {
          cargo?: string | null
          cliente_id?: string | null
          created_at?: string
          email?: string
          filial_id?: string | null
          id?: string
          nome?: string
          perfil?: Database["public"]["Enums"]["suporte_perfil"]
          setor?: string | null
          status?: string
          telefone?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suporte_usuarios_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "suporte_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suporte_usuarios_filial_id_cliente_id_fkey"
            columns: ["filial_id", "cliente_id"]
            isOneToOne: false
            referencedRelation: "suporte_filiais"
            referencedColumns: ["id", "cliente_id"]
          },
        ]
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
          role: Database["public"]["Enums"]["app_role"]
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
      vendedores: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nome: string
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      visionyx_smart_tags: {
        Row: {
          access_count: number
          client_name: string | null
          code: string
          created_at: string
          destination_type: string | null
          destination_url: string | null
          id: string
          status: string
          updated_at: string
          vendedor_id: string | null
        }
        Insert: {
          access_count?: number
          client_name?: string | null
          code: string
          created_at?: string
          destination_type?: string | null
          destination_url?: string | null
          id?: string
          status?: string
          updated_at?: string
          vendedor_id?: string | null
        }
        Update: {
          access_count?: number
          client_name?: string | null
          code?: string
          created_at?: string
          destination_type?: string | null
          destination_url?: string | null
          id?: string
          status?: string
          updated_at?: string
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visionyx_smart_tags_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "vendedores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_smart_tag_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_smart_tag_access: {
        Args: { _code: string }
        Returns: undefined
      }
      is_my_vendedor: { Args: { _vendedor_id: string }; Returns: boolean }
      link_suporte_account: {
        Args: never
        Returns: {
          cliente_id: string
          filial_id: string
          id: string
          nome: string
          perfil: Database["public"]["Enums"]["suporte_perfil"]
          status: string
        }[]
      }
      link_vendedor_account: {
        Args: never
        Returns: {
          email: string
          id: string
          nome: string
          status: string
        }[]
      }
      resolve_smart_tag: {
        Args: { _code: string }
        Returns: {
          code: string
          destination_url: string
          status: string
        }[]
      }
      suporte_atualizar_meu_perfil: {
        Args: {
          _cargo: string
          _nome: string
          _setor: string
          _telefone: string
        }
        Returns: undefined
      }
      suporte_is_admin: { Args: never; Returns: boolean }
      suporte_is_tecnico_do_cliente: {
        Args: { _cliente_id: string }
        Returns: boolean
      }
      suporte_me: {
        Args: never
        Returns: {
          cliente_id: string
          filial_id: string
          id: string
          perfil: Database["public"]["Enums"]["suporte_perfil"]
        }[]
      }
      suporte_pode_ver_chamado: {
        Args: { _cliente_id: string; _filial_id: string }
        Returns: boolean
      }
      suporte_pode_ver_chamado_v2: {
        Args: { _cliente_id: string; _filial_id: string; _usuario_id: string }
        Returns: boolean
      }
      suporte_pode_ver_cliente: {
        Args: { _cliente_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      chamado_categoria:
        | "Computador"
        | "Internet"
        | "Rede / Wi-Fi"
        | "Impressora"
        | "Sistema / Software"
        | "E-mail"
        | "Telefonia / PABX"
        | "Firewall / Segurança"
        | "Outros"
      chamado_prioridade: "Baixa" | "Normal" | "Alta" | "Urgente"
      chamado_status:
        | "Aberto"
        | "Em atendimento"
        | "Aguardando cliente"
        | "Resolvido"
        | "Fechado"
      suporte_perfil:
        | "admin_visionyx"
        | "tecnico_visionyx"
        | "admin_cliente"
        | "usuario_filial"
        | "admin_filial"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      chamado_categoria: [
        "Computador",
        "Internet",
        "Rede / Wi-Fi",
        "Impressora",
        "Sistema / Software",
        "E-mail",
        "Telefonia / PABX",
        "Firewall / Segurança",
        "Outros",
      ],
      chamado_prioridade: ["Baixa", "Normal", "Alta", "Urgente"],
      chamado_status: [
        "Aberto",
        "Em atendimento",
        "Aguardando cliente",
        "Resolvido",
        "Fechado",
      ],
      suporte_perfil: [
        "admin_visionyx",
        "tecnico_visionyx",
        "admin_cliente",
        "usuario_filial",
        "admin_filial",
      ],
    },
  },
} as const
