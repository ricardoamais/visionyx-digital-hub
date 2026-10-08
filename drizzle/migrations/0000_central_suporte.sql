
CREATE TYPE public.suporte_perfil AS ENUM ('admin_visionyx','tecnico_visionyx','admin_cliente','usuario_filial');
CREATE TYPE public.chamado_status AS ENUM ('Aberto','Em atendimento','Aguardando cliente','Resolvido','Fechado');
CREATE TYPE public.chamado_prioridade AS ENUM ('Baixa','Normal','Alta','Urgente');
CREATE TYPE public.chamado_categoria AS ENUM ('Computador','Internet','Rede / Wi-Fi','Impressora','Sistema / Software','E-mail','Telefonia / PABX','Firewall / Segurança','Outros');

CREATE TABLE public.suporte_clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  cnpj text UNIQUE,
  telefone text,
  email text,
  endereco text,
  status text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo','inativo')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.suporte_filiais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.suporte_clientes(id) ON DELETE RESTRICT,
  nome text NOT NULL,
  codigo text NOT NULL,
  endereco text,
  telefone text,
  cidade text,
  estado text,
  status text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo','inativo')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cliente_id, codigo),
  UNIQUE (id, cliente_id)
);

CREATE TABLE public.suporte_usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  nome text NOT NULL,
  email text NOT NULL UNIQUE,
  telefone text,
  cliente_id uuid REFERENCES public.suporte_clientes(id) ON DELETE RESTRICT,
  filial_id uuid,
  setor text,
  cargo text,
  perfil public.suporte_perfil NOT NULL DEFAULT 'usuario_filial',
  status text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo','inativo')),
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (filial_id, cliente_id) REFERENCES public.suporte_filiais(id, cliente_id),
  CHECK (perfil IN ('admin_visionyx','tecnico_visionyx') OR cliente_id IS NOT NULL),
  CHECK (perfil <> 'usuario_filial' OR filial_id IS NOT NULL)
);

CREATE TABLE public.suporte_tecnico_clientes (
  tecnico_id uuid NOT NULL REFERENCES public.suporte_usuarios(id) ON DELETE CASCADE,
  cliente_id uuid NOT NULL REFERENCES public.suporte_clientes(id) ON DELETE CASCADE,
  PRIMARY KEY (tecnico_id, cliente_id)
);

CREATE SEQUENCE public.suporte_chamado_numero_seq START 1000;

CREATE TABLE public.suporte_chamados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero bigint NOT NULL UNIQUE DEFAULT nextval('public.suporte_chamado_numero_seq'),
  cliente_id uuid NOT NULL REFERENCES public.suporte_clientes(id) ON DELETE RESTRICT,
  filial_id uuid NOT NULL,
  usuario_id uuid REFERENCES public.suporte_usuarios(id),
  tecnico_id uuid REFERENCES public.suporte_usuarios(id),
  categoria public.chamado_categoria NOT NULL DEFAULT 'Outros',
  prioridade public.chamado_prioridade NOT NULL DEFAULT 'Normal',
  assunto text NOT NULL,
  descricao text,
  status public.chamado_status NOT NULL DEFAULT 'Aberto',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  FOREIGN KEY (filial_id, cliente_id) REFERENCES public.suporte_filiais(id, cliente_id)
);
CREATE INDEX ON public.suporte_chamados (cliente_id, filial_id);
CREATE TRIGGER trg_chamados_updated_at BEFORE UPDATE ON public.suporte_chamados
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.suporte_clientes, public.suporte_filiais, public.suporte_usuarios, public.suporte_tecnico_clientes, public.suporte_chamados TO authenticated;
GRANT ALL ON public.suporte_clientes, public.suporte_filiais, public.suporte_usuarios, public.suporte_tecnico_clientes, public.suporte_chamados TO service_role;
GRANT USAGE ON SEQUENCE public.suporte_chamado_numero_seq TO authenticated, service_role;

-- Helpers (current active support user)
CREATE OR REPLACE FUNCTION public.suporte_me()
RETURNS TABLE(id uuid, perfil public.suporte_perfil, cliente_id uuid, filial_id uuid)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT u.id, u.perfil, u.cliente_id, u.filial_id FROM public.suporte_usuarios u
  WHERE u.user_id = auth.uid() AND u.status = 'ativo' LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.suporte_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.suporte_me() m WHERE m.perfil = 'admin_visionyx')
$$;

CREATE OR REPLACE FUNCTION public.suporte_pode_ver_cliente(_cliente_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.suporte_is_admin() OR EXISTS (
    SELECT 1 FROM public.suporte_me() m
    WHERE (m.perfil IN ('admin_cliente','usuario_filial') AND m.cliente_id = _cliente_id)
       OR (m.perfil = 'tecnico_visionyx' AND EXISTS (SELECT 1 FROM public.suporte_tecnico_clientes tc WHERE tc.tecnico_id = m.id AND tc.cliente_id = _cliente_id))
  )
$$;

CREATE OR REPLACE FUNCTION public.suporte_pode_ver_chamado(_cliente_id uuid, _filial_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.suporte_is_admin() OR EXISTS (
    SELECT 1 FROM public.suporte_me() m
    WHERE (m.perfil = 'admin_cliente' AND m.cliente_id = _cliente_id)
       OR (m.perfil = 'usuario_filial' AND m.cliente_id = _cliente_id AND m.filial_id = _filial_id)
       OR (m.perfil = 'tecnico_visionyx' AND EXISTS (SELECT 1 FROM public.suporte_tecnico_clientes tc WHERE tc.tecnico_id = m.id AND tc.cliente_id = _cliente_id))
  )
$$;

CREATE OR REPLACE FUNCTION public.suporte_is_tecnico_do_cliente(_cliente_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.suporte_me() m JOIN public.suporte_tecnico_clientes tc ON tc.tecnico_id = m.id
    WHERE m.perfil = 'tecnico_visionyx' AND tc.cliente_id = _cliente_id)
$$;

-- Link auth account to pre-registered support user by email
CREATE OR REPLACE FUNCTION public.link_suporte_account()
RETURNS TABLE(id uuid, nome text, perfil public.suporte_perfil, cliente_id uuid, filial_id uuid, status text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); uemail text;
BEGIN
  IF uid IS NULL THEN RETURN; END IF;
  SELECT lower(u.email) INTO uemail FROM auth.users u WHERE u.id = uid AND u.email_confirmed_at IS NOT NULL;
  IF uemail IS NULL THEN RETURN; END IF;
  UPDATE public.suporte_usuarios s SET user_id = uid
  WHERE lower(s.email) = uemail AND s.status = 'ativo' AND s.user_id IS NULL;
  RETURN QUERY SELECT s.id, s.nome, s.perfil, s.cliente_id, s.filial_id, s.status
  FROM public.suporte_usuarios s WHERE s.user_id = uid;
END; $$;

REVOKE EXECUTE ON FUNCTION public.suporte_me(), public.suporte_is_admin(), public.suporte_pode_ver_cliente(uuid), public.suporte_pode_ver_chamado(uuid,uuid), public.suporte_is_tecnico_do_cliente(uuid), public.link_suporte_account() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.suporte_me(), public.suporte_is_admin(), public.suporte_pode_ver_cliente(uuid), public.suporte_pode_ver_chamado(uuid,uuid), public.suporte_is_tecnico_do_cliente(uuid), public.link_suporte_account() TO authenticated;

ALTER TABLE public.suporte_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suporte_filiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suporte_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suporte_tecnico_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suporte_chamados ENABLE ROW LEVEL SECURITY;

-- Clientes
CREATE POLICY "Admin gerencia clientes" ON public.suporte_clientes FOR ALL TO authenticated USING (public.suporte_is_admin()) WITH CHECK (public.suporte_is_admin());
CREATE POLICY "Ver cliente vinculado" ON public.suporte_clientes FOR SELECT TO authenticated USING (public.suporte_pode_ver_cliente(id));

-- Filiais
CREATE POLICY "Admin gerencia filiais" ON public.suporte_filiais FOR ALL TO authenticated USING (public.suporte_is_admin()) WITH CHECK (public.suporte_is_admin());
CREATE POLICY "Ver filiais do cliente" ON public.suporte_filiais FOR SELECT TO authenticated USING (public.suporte_pode_ver_cliente(cliente_id));

-- Usuarios
CREATE POLICY "Admin gerencia usuarios" ON public.suporte_usuarios FOR ALL TO authenticated USING (public.suporte_is_admin()) WITH CHECK (public.suporte_is_admin());
CREATE POLICY "Ver proprio usuario" ON public.suporte_usuarios FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admin cliente ve usuarios do cliente" ON public.suporte_usuarios FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.suporte_me() m WHERE m.perfil = 'admin_cliente' AND m.cliente_id = suporte_usuarios.cliente_id));

-- Tecnico x clientes
CREATE POLICY "Admin gerencia acesso tecnico" ON public.suporte_tecnico_clientes FOR ALL TO authenticated USING (public.suporte_is_admin()) WITH CHECK (public.suporte_is_admin());
CREATE POLICY "Tecnico ve seus clientes" ON public.suporte_tecnico_clientes FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.suporte_me() m WHERE m.id = tecnico_id));

-- Chamados
CREATE POLICY "Admin gerencia chamados" ON public.suporte_chamados FOR ALL TO authenticated USING (public.suporte_is_admin()) WITH CHECK (public.suporte_is_admin());
CREATE POLICY "Ver chamados permitidos" ON public.suporte_chamados FOR SELECT TO authenticated USING (public.suporte_pode_ver_chamado(cliente_id, filial_id));
CREATE POLICY "Abrir chamado no escopo" ON public.suporte_chamados FOR INSERT TO authenticated
  WITH CHECK (public.suporte_pode_ver_chamado(cliente_id, filial_id) AND usuario_id = (SELECT m.id FROM public.suporte_me() m));
CREATE POLICY "Tecnico atende chamados" ON public.suporte_chamados FOR UPDATE TO authenticated
  USING (public.suporte_is_tecnico_do_cliente(cliente_id)) WITH CHECK (public.suporte_is_tecnico_do_cliente(cliente_id));

INSERT INTO public.suporte_clientes (nome) VALUES ('Tintas Darka');
