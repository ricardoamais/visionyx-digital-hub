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
      suporte_chamado_anexos: {
        Row: {
          chamado_id: string
          created_at: string
          enviado_por: string | null
          id: string
          mensagem_id: string | null
          nome: string
          path: string
          tamanho: number
          tipo: string
        }
        Insert: {
          chamado_id: string
          created_at?: string
          enviado_por?: string | null
          id?: string
          mensagem_id?: string | null
          nome: string
          path: string
          tamanho: number
          tipo: string
        }
        Update: {
          chamado_id?: string
          created_at?: string
          enviado_por?: string | null
          id?: string
          mensagem_id?: string | null
          nome?: string
          path?: string
          tamanho?: number
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "suporte_chamado_anexos_chamado_id_fkey"
            columns: ["chamado_id"]
            isOneToOne: false
            referencedRelation: "suporte_chamados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suporte_chamado_anexos_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "suporte_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suporte_chamado_anexos_mensagem_id_fkey"
            columns: ["mensagem_id"]
            isOneToOne: false
            referencedRelation: "suporte_chamado_mensagens"
            referencedColumns: ["id"]
          },
        ]
      }
      suporte_chamado_eventos: {
        Row: {
          autor_id: string | null
          autor_nome: string | null
          autor_perfil: string | null
          chamado_id: string
          created_at: string
          descricao: string
          id: string
          status_anterior: string | null
          status_novo: string | null
          tipo: string
        }
        Insert: {
          autor_id?: string | null
          autor_nome?: string | null
          autor_perfil?: string | null
          chamado_id: string
          created_at?: string
          descricao: string
          id?: string
          status_anterior?: string | null
          status_novo?: string | null
          tipo: string
        }
        Update: {
          autor_id?: string | null
          autor_nome?: string | null
          autor_perfil?: string | null
          chamado_id?: string
          created_at?: string
          descricao?: string
          id?: string
          status_anterior?: string | null
          status_novo?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "suporte_chamado_eventos_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "suporte_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suporte_chamado_eventos_chamado_id_fkey"
            columns: ["chamado_id"]
            isOneToOne: false
            referencedRelation: "suporte_chamados"
            referencedColumns: ["id"]
          },
        ]
      }
      suporte_chamado_mensagens: {
        Row: {
          autor_filial: string | null
          autor_id: string | null
          autor_nome: string
          autor_perfil: string
          chamado_id: string
          created_at: string
          id: string
          mensagem: string
        }
        Insert: {
          autor_filial?: string | null
          autor_id?: string | null
          autor_nome: string
          autor_perfil: string
          chamado_id: string
          created_at?: string
          id?: string
          mensagem: string
        }
        Update: {
          autor_filial?: string | null
          autor_id?: string | null
          autor_nome?: string
          autor_perfil?: string
          chamado_id?: string
          created_at?: string
          id?: string
          mensagem?: string
        }
        Relationships: [
          {
            foreignKeyName: "suporte_chamado_mensagens_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "suporte_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suporte_chamado_mensagens_chamado_id_fkey"
            columns: ["chamado_id"]
            isOneToOne: false
            referencedRelation: "suporte_chamados"
            referencedColumns: ["id"]
          },
        ]
      }
      suporte_chamados: {
        Row: {
          assunto: string
          categoria: Database["public"]["Enums"]["chamado_categoria"]
          cliente_id: string
          closed_at: string | null
          created_at: string
          descricao: string | null
          equipamento: string | null
          filial_id: string
          id: string
          iniciado_em: string | null
          numero: number
          prioridade: Database["public"]["Enums"]["chamado_prioridade"]
          protocolo: string | null
          resolvido_em: string | null
          solucao: string | null
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
          equipamento?: string | null
          filial_id: string
          id?: string
          iniciado_em?: string | null
          numero?: number
          prioridade?: Database["public"]["Enums"]["chamado_prioridade"]
          protocolo?: string | null
          resolvido_em?: string | null
          solucao?: string | null
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
          equipamento?: string | null
          filial_id?: string
          id?: string
          iniciado_em?: string | null
          numero?: number
          prioridade?: Database["public"]["Enums"]["chamado_prioridade"]
          protocolo?: string | null
          resolvido_em?: string | null
          solucao?: string | null
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
      suporte_notificacoes: {
        Row: {
          canal: string | null
          chamado_id: string
          created_at: string
          enviada_em: string | null
          evento: string
          id: string
          status: string
        }
        Insert: {
          canal?: string | null
          chamado_id: string
          created_at?: string
          enviada_em?: string | null
          evento: string
          id?: string
          status?: string
        }
        Update: {
          canal?: string | null
          chamado_id?: string
          created_at?: string
          enviada_em?: string | null
          evento?: string
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "suporte_notificacoes_chamado_id_fkey"
            columns: ["chamado_id"]
            isOneToOne: false
            referencedRelation: "suporte_chamados"
            referencedColumns: ["id"]
          },
        ]
      }
      suporte_protocolo_contador: {
        Row: {
          ano: number
          ultimo: number
        }
        Insert: {
          ano: number
          ultimo?: number
        }
        Update: {
          ano?: number
          ultimo?: number
        }
        Relationships: []
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
      suporte_abrir_chamado: {
        Args: {
          _assunto: string
          _categoria: Database["public"]["Enums"]["chamado_categoria"]
          _descricao: string
          _equipamento: string
          _prioridade: Database["public"]["Enums"]["chamado_prioridade"]
        }
        Returns: {
          id: string
          protocolo: string
        }[]
      }
      suporte_alterar_prioridade: {
        Args: {
          _id: string
          _prioridade: Database["public"]["Enums"]["chamado_prioridade"]
        }
        Returns: undefined
      }
      suporte_alterar_status: {
        Args: {
          _id: string
          _motivo: string
          _status: Database["public"]["Enums"]["chamado_status"]
        }
        Returns: undefined
      }
      suporte_assumir_chamado: { Args: { _id: string }; Returns: undefined }
      suporte_atualizar_meu_perfil: {
        Args: {
          _cargo: string
          _nome: string
          _setor: string
          _telefone: string
        }
        Returns: undefined
      }
      suporte_buscar_chamados: {
        Args: {
          _ate?: string
          _busca?: string
          _categoria?: string
          _cliente?: string
          _desde?: string
          _filial?: string
          _limite?: number
          _offset?: number
          _prioridade?: string
          _status?: string
          _tecnico?: string
        }
        Returns: {
          assunto: string
          categoria: string
          cliente: string
          created_at: string
          filial: string
          id: string
          numero: number
          prioridade: string
          protocolo: string
          solicitante: string
          status: string
          tecnico: string
          total: number
          updated_at: string
        }[]
      }
      suporte_chamado_detalhe: {
        Args: { _id: string }
        Returns: {
          assunto: string
          categoria: string
          cliente: string
          closed_at: string
          created_at: string
          descricao: string
          equipamento: string
          filial: string
          filial_codigo: string
          id: string
          iniciado_em: string
          numero: number
          prioridade: string
          protocolo: string
          resolvido_em: string
          solicitante: string
          solicitante_email: string
          solicitante_telefone: string
          solucao: string
          status: string
          tecnico: string
          tecnico_id: string
          updated_at: string
        }[]
      }
      suporte_contadores: {
        Args: { _cliente?: string }
        Returns: {
          abertos: number
          aguardando: number
          em_atendimento: number
          resolvidos: number
          total: number
          urgentes: number
        }[]
      }
      suporte_e_solicitante: { Args: { _chamado_id: string }; Returns: boolean }
      suporte_enviar_mensagem: {
        Args: { _id: string; _mensagem: string }
        Returns: string
      }
      suporte_fechar_chamado: { Args: { _id: string }; Returns: undefined }
      suporte_is_admin: { Args: never; Returns: boolean }
      suporte_is_staff: { Args: never; Returns: boolean }
      suporte_is_tecnico_do_cliente: {
        Args: { _cliente_id: string }
        Returns: boolean
      }
      suporte_listar_tecnicos: {
        Args: never
        Returns: {
          id: string
          nome: string
        }[]
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
      suporte_pode_ver_chamado_id: {
        Args: { _chamado_id: string }
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
      suporte_registrar_anexo_evento: {
        Args: { _id: string; _nome: string }
        Returns: undefined
      }
      suporte_registrar_evento: {
        Args: {
          _ant: string
          _chamado: string
          _desc: string
          _novo: string
          _tipo: string
        }
        Returns: undefined
      }
      suporte_resolver_chamado: {
        Args: { _id: string; _solucao: string }
        Returns: undefined
      }
      suporte_staff_do_chamado: {
        Args: { _chamado_id: string }
        Returns: boolean
      }
      suporte_visao_filiais: {
        Args: { _cliente: string }
        Returns: {
          abertos: number
          aguardando: number
          codigo: string
          em_atendimento: number
          filial_id: string
          nome: string
          resolvidos: number
          urgentes: number
        }[]
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
        | "Notebook"
        | "Servidor"
        | "Equipamento"
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
        "Notebook",
        "Servidor",
        "Equipamento",
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
