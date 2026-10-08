ALTER TABLE public.suporte_chamados
  ADD COLUMN IF NOT EXISTS equipamento text,
  ADD COLUMN IF NOT EXISTS protocolo text UNIQUE;

CREATE TABLE public.suporte_protocolo_contador (ano int PRIMARY KEY, ultimo int NOT NULL DEFAULT 0);
GRANT ALL ON public.suporte_protocolo_contador TO service_role;
ALTER TABLE public.suporte_protocolo_contador ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.suporte_gerar_protocolo()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE a int := extract(year FROM now() AT TIME ZONE 'America/Sao_Paulo')::int; n int;
BEGIN
  IF NEW.protocolo IS NULL THEN
    INSERT INTO public.suporte_protocolo_contador (ano, ultimo) VALUES (a, 1)
    ON CONFLICT (ano) DO UPDATE SET ultimo = suporte_protocolo_contador.ultimo + 1
    RETURNING ultimo INTO n;
    NEW.protocolo := '#' || a || '-' || lpad(n::text, 5, '0');
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_chamado_protocolo BEFORE INSERT ON public.suporte_chamados FOR EACH ROW EXECUTE FUNCTION public.suporte_gerar_protocolo();

CREATE TABLE public.suporte_chamado_eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chamado_id uuid NOT NULL REFERENCES public.suporte_chamados(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  descricao text NOT NULL,
  autor_id uuid REFERENCES public.suporte_usuarios(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.suporte_chamado_eventos (chamado_id, created_at);

CREATE TABLE public.suporte_chamado_anexos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chamado_id uuid NOT NULL REFERENCES public.suporte_chamados(id) ON DELETE CASCADE,
  path text NOT NULL UNIQUE,
  nome text NOT NULL,
  tipo text NOT NULL,
  tamanho int NOT NULL CHECK (tamanho > 0 AND tamanho <= 10485760),
  enviado_por uuid REFERENCES public.suporte_usuarios(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (tipo IN ('image/jpeg','image/png','image/webp','image/gif','application/pdf','text/plain',
    'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))
);

CREATE TABLE public.suporte_notificacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chamado_id uuid NOT NULL REFERENCES public.suporte_chamados(id) ON DELETE CASCADE,
  evento text NOT NULL CHECK (evento IN ('aberto','tecnico_assumiu','tecnico_respondeu','status_alterado','resolvido')),
  canal text,
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','enviada','falhou')),
  created_at timestamptz NOT NULL DEFAULT now(),
  enviada_em timestamptz
);

GRANT SELECT ON public.suporte_chamado_eventos TO authenticated;
GRANT SELECT, INSERT ON public.suporte_chamado_anexos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suporte_notificacoes TO authenticated;
GRANT ALL ON public.suporte_chamado_eventos, public.suporte_chamado_anexos, public.suporte_notificacoes TO service_role;
ALTER TABLE public.suporte_chamado_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suporte_chamado_anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suporte_notificacoes ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.suporte_pode_ver_chamado_id(_chamado_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.suporte_chamados c WHERE c.id = _chamado_id
    AND public.suporte_pode_ver_chamado_v2(c.cliente_id, c.filial_id, c.usuario_id))
$$;
CREATE OR REPLACE FUNCTION public.suporte_e_solicitante(_chamado_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.suporte_chamados c JOIN public.suporte_me() m ON m.id = c.usuario_id WHERE c.id = _chamado_id)
$$;
REVOKE EXECUTE ON FUNCTION public.suporte_pode_ver_chamado_id(uuid), public.suporte_e_solicitante(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.suporte_pode_ver_chamado_id(uuid), public.suporte_e_solicitante(uuid) TO authenticated;

CREATE POLICY "Ver eventos do chamado" ON public.suporte_chamado_eventos FOR SELECT TO authenticated USING (public.suporte_pode_ver_chamado_id(chamado_id));
CREATE POLICY "Ver anexos do chamado" ON public.suporte_chamado_anexos FOR SELECT TO authenticated USING (public.suporte_pode_ver_chamado_id(chamado_id));
CREATE POLICY "Solicitante anexa arquivos" ON public.suporte_chamado_anexos FOR INSERT TO authenticated
  WITH CHECK (public.suporte_e_solicitante(chamado_id) AND enviado_por = (SELECT m.id FROM public.suporte_me() m) AND path LIKE chamado_id::text || '/%');
CREATE POLICY "Admin gerencia notificacoes" ON public.suporte_notificacoes FOR ALL TO authenticated USING (public.suporte_is_admin()) WITH CHECK (public.suporte_is_admin());

-- Abertura somente via função (cliente/filial/usuário/status definidos pelo banco)
DROP POLICY IF EXISTS "Abrir chamado no escopo" ON public.suporte_chamados;

CREATE OR REPLACE FUNCTION public.suporte_abrir_chamado(_categoria public.chamado_categoria, _prioridade public.chamado_prioridade, _assunto text, _descricao text, _equipamento text)
RETURNS TABLE(id uuid, protocolo text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE m record; cid uuid; prot text;
BEGIN
  SELECT * INTO m FROM public.suporte_me() LIMIT 1;
  IF m.id IS NULL OR m.cliente_id IS NULL OR m.filial_id IS NULL THEN RAISE EXCEPTION 'Usuário sem filial vinculada'; END IF;
  IF coalesce(trim(_assunto),'') = '' OR length(trim(_assunto)) > 150 THEN RAISE EXCEPTION 'Assunto inválido'; END IF;
  IF coalesce(trim(_descricao),'') = '' OR length(_descricao) > 5000 THEN RAISE EXCEPTION 'Descrição inválida'; END IF;
  IF length(coalesce(_equipamento,'')) > 150 THEN RAISE EXCEPTION 'Equipamento inválido'; END IF;
  INSERT INTO public.suporte_chamados (cliente_id, filial_id, usuario_id, categoria, prioridade, assunto, descricao, equipamento, status)
  VALUES (m.cliente_id, m.filial_id, m.id, _categoria, _prioridade, trim(_assunto), trim(_descricao), nullif(trim(_equipamento),''), 'Aberto')
  RETURNING suporte_chamados.id, suporte_chamados.protocolo INTO cid, prot;
  INSERT INTO public.suporte_chamado_eventos (chamado_id, tipo, descricao, autor_id) VALUES (cid, 'aberto', 'Chamado aberto pelo usuário.', m.id);
  INSERT INTO public.suporte_notificacoes (chamado_id, evento) VALUES (cid, 'aberto');
  RETURN QUERY SELECT cid, prot;
END; $$;
REVOKE EXECUTE ON FUNCTION public.suporte_abrir_chamado(public.chamado_categoria, public.chamado_prioridade, text, text, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.suporte_abrir_chamado(public.chamado_categoria, public.chamado_prioridade, text, text, text) TO authenticated;

-- Storage: chamados-anexos/{chamado_id}/{arquivo}
CREATE POLICY "Solicitante envia anexos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'chamados-anexos' AND public.suporte_e_solicitante(((storage.foldername(name))[1])::uuid));
CREATE POLICY "Ver anexos permitidos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'chamados-anexos' AND public.suporte_pode_ver_chamado_id(((storage.foldername(name))[1])::uuid));