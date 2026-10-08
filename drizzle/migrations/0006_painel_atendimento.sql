ALTER TABLE public.suporte_chamados
  ADD COLUMN IF NOT EXISTS iniciado_em timestamptz,
  ADD COLUMN IF NOT EXISTS resolvido_em timestamptz,
  ADD COLUMN IF NOT EXISTS solucao text;
CREATE INDEX IF NOT EXISTS idx_chamados_created ON public.suporte_chamados (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chamados_status ON public.suporte_chamados (status);
CREATE INDEX IF NOT EXISTS idx_chamados_prioridade ON public.suporte_chamados (prioridade);
CREATE INDEX IF NOT EXISTS idx_chamados_tecnico ON public.suporte_chamados (tecnico_id);
CREATE INDEX IF NOT EXISTS idx_chamados_usuario ON public.suporte_chamados (usuario_id);

ALTER TABLE public.suporte_chamado_eventos
  ADD COLUMN IF NOT EXISTS autor_nome text,
  ADD COLUMN IF NOT EXISTS autor_perfil text,
  ADD COLUMN IF NOT EXISTS status_anterior text,
  ADD COLUMN IF NOT EXISTS status_novo text;

CREATE TABLE public.suporte_chamado_mensagens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chamado_id uuid NOT NULL REFERENCES public.suporte_chamados(id) ON DELETE CASCADE,
  autor_id uuid REFERENCES public.suporte_usuarios(id),
  autor_nome text NOT NULL,
  autor_perfil text NOT NULL,
  autor_filial text,
  mensagem text NOT NULL CHECK (length(mensagem) BETWEEN 1 AND 5000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.suporte_chamado_mensagens (chamado_id, created_at);
GRANT SELECT ON public.suporte_chamado_mensagens TO authenticated;
GRANT ALL ON public.suporte_chamado_mensagens TO service_role;
ALTER TABLE public.suporte_chamado_mensagens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver mensagens do chamado" ON public.suporte_chamado_mensagens FOR SELECT TO authenticated USING (public.suporte_pode_ver_chamado_id(chamado_id));

ALTER TABLE public.suporte_chamado_anexos ADD COLUMN IF NOT EXISTS mensagem_id uuid REFERENCES public.suporte_chamado_mensagens(id) ON DELETE SET NULL;

-- Staff helpers
CREATE OR REPLACE FUNCTION public.suporte_is_staff()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.suporte_is_admin() OR EXISTS (SELECT 1 FROM public.suporte_me() m WHERE m.perfil = 'tecnico_visionyx')
$$;
CREATE OR REPLACE FUNCTION public.suporte_staff_do_chamado(_chamado_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.suporte_chamados c WHERE c.id = _chamado_id
    AND (public.suporte_is_admin() OR public.suporte_is_tecnico_do_cliente(c.cliente_id)))
$$;

-- Anexos: staff também pode anexar
DROP POLICY IF EXISTS "Solicitante anexa arquivos" ON public.suporte_chamado_anexos;
CREATE POLICY "Participantes anexam arquivos" ON public.suporte_chamado_anexos FOR INSERT TO authenticated
  WITH CHECK ((public.suporte_e_solicitante(chamado_id) OR public.suporte_staff_do_chamado(chamado_id))
    AND enviado_por = (SELECT m.id FROM public.suporte_me() m) AND path LIKE chamado_id::text || '/%'
    AND NOT EXISTS (SELECT 1 FROM public.suporte_chamados c WHERE c.id = chamado_id AND c.status = 'Fechado'));
DROP POLICY IF EXISTS "Solicitante envia anexos" ON storage.objects;
CREATE POLICY "Participantes enviam anexos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'chamados-anexos' AND (public.suporte_e_solicitante(((storage.foldername(name))[1])::uuid)
    OR public.suporte_staff_do_chamado(((storage.foldername(name))[1])::uuid)));

-- Todas as alterações de atendimento passam por funções
DROP POLICY IF EXISTS "Tecnico atende chamados" ON public.suporte_chamados;

CREATE OR REPLACE FUNCTION public.suporte_bloquear_fechado()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF OLD.status = 'Fechado' THEN RAISE EXCEPTION 'Chamado fechado não pode ser alterado'; END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_chamado_fechado BEFORE UPDATE ON public.suporte_chamados FOR EACH ROW EXECUTE FUNCTION public.suporte_bloquear_fechado();

CREATE OR REPLACE FUNCTION public.suporte_registrar_evento(_chamado uuid, _tipo text, _desc text, _ant text, _novo text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE m record; nome text;
BEGIN
  SELECT * INTO m FROM public.suporte_me() LIMIT 1;
  SELECT u.nome INTO nome FROM public.suporte_usuarios u WHERE u.id = m.id;
  INSERT INTO public.suporte_chamado_eventos (chamado_id, tipo, descricao, autor_id, autor_nome, autor_perfil, status_anterior, status_novo)
  VALUES (_chamado, _tipo, _desc, m.id, coalesce(nome, 'Administrador Visionyx'), coalesce(m.perfil::text, 'admin_visionyx'), _ant, _novo);
END; $$;
REVOKE EXECUTE ON FUNCTION public.suporte_registrar_evento(uuid,text,text,text,text) FROM anon, public, authenticated;

CREATE OR REPLACE FUNCTION public.suporte_assumir_chamado(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE m record; c record;
BEGIN
  IF NOT public.suporte_staff_do_chamado(_id) THEN RAISE EXCEPTION 'Sem permissão'; END IF;
  SELECT * INTO m FROM public.suporte_me() LIMIT 1;
  IF m.id IS NULL THEN RAISE EXCEPTION 'Cadastre-se como técnico para assumir chamados'; END IF;
  SELECT * INTO c FROM public.suporte_chamados WHERE id = _id FOR UPDATE;
  IF c.status IN ('Resolvido','Fechado') THEN RAISE EXCEPTION 'Chamado já resolvido ou fechado'; END IF;
  UPDATE public.suporte_chamados SET tecnico_id = m.id, status = 'Em atendimento', iniciado_em = coalesce(iniciado_em, now()) WHERE id = _id;
  PERFORM public.suporte_registrar_evento(_id, 'assumido', 'Técnico assumiu o chamado.', c.status::text, 'Em atendimento');
  INSERT INTO public.suporte_notificacoes (chamado_id, evento) VALUES (_id, 'tecnico_assumiu');
END; $$;

CREATE OR REPLACE FUNCTION public.suporte_alterar_status(_id uuid, _status public.chamado_status, _motivo text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c record;
BEGIN
  IF NOT public.suporte_staff_do_chamado(_id) THEN RAISE EXCEPTION 'Sem permissão'; END IF;
  IF _status IN ('Resolvido','Fechado') THEN RAISE EXCEPTION 'Use as ações Resolver ou Fechar'; END IF;
  SELECT * INTO c FROM public.suporte_chamados WHERE id = _id FOR UPDATE;
  IF c.status = _status THEN RETURN; END IF;
  UPDATE public.suporte_chamados SET status = _status,
    iniciado_em = CASE WHEN _status = 'Em atendimento' THEN coalesce(iniciado_em, now()) ELSE iniciado_em END,
    resolvido_em = CASE WHEN c.status = 'Resolvido' THEN NULL ELSE resolvido_em END
  WHERE id = _id;
  PERFORM public.suporte_registrar_evento(_id, CASE WHEN _status = 'Aguardando cliente' THEN 'aguardando' ELSE 'status' END,
    'Status alterado de ' || c.status || ' para ' || _status || coalesce(nullif(': ' || trim(_motivo), ': '), '') , c.status::text, _status::text);
  INSERT INTO public.suporte_notificacoes (chamado_id, evento) VALUES (_id, 'status_alterado');
END; $$;

CREATE OR REPLACE FUNCTION public.suporte_alterar_prioridade(_id uuid, _prioridade public.chamado_prioridade)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c record;
BEGIN
  IF NOT public.suporte_staff_do_chamado(_id) THEN RAISE EXCEPTION 'Sem permissão'; END IF;
  SELECT * INTO c FROM public.suporte_chamados WHERE id = _id FOR UPDATE;
  IF c.prioridade = _prioridade THEN RETURN; END IF;
  UPDATE public.suporte_chamados SET prioridade = _prioridade WHERE id = _id;
  PERFORM public.suporte_registrar_evento(_id, 'prioridade', 'Prioridade alterada de ' || c.prioridade || ' para ' || _prioridade, NULL, NULL);
END; $$;

CREATE OR REPLACE FUNCTION public.suporte_resolver_chamado(_id uuid, _solucao text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c record; m record;
BEGIN
  IF NOT public.suporte_staff_do_chamado(_id) THEN RAISE EXCEPTION 'Sem permissão'; END IF;
  IF coalesce(trim(_solucao), '') = '' OR length(_solucao) > 5000 THEN RAISE EXCEPTION 'Descreva a solução'; END IF;
  SELECT * INTO m FROM public.suporte_me() LIMIT 1;
  SELECT * INTO c FROM public.suporte_chamados WHERE id = _id FOR UPDATE;
  IF c.status = 'Resolvido' THEN RAISE EXCEPTION 'Chamado já resolvido'; END IF;
  UPDATE public.suporte_chamados SET status = 'Resolvido', solucao = trim(_solucao), resolvido_em = now(),
    iniciado_em = coalesce(iniciado_em, now()), tecnico_id = coalesce(tecnico_id, m.id) WHERE id = _id;
  PERFORM public.suporte_registrar_evento(_id, 'resolvido', 'Chamado resolvido. Solução: ' || trim(_solucao), c.status::text, 'Resolvido');
  INSERT INTO public.suporte_notificacoes (chamado_id, evento) VALUES (_id, 'resolvido');
END; $$;

CREATE OR REPLACE FUNCTION public.suporte_fechar_chamado(_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c record;
BEGIN
  IF NOT public.suporte_staff_do_chamado(_id) THEN RAISE EXCEPTION 'Sem permissão'; END IF;
  SELECT * INTO c FROM public.suporte_chamados WHERE id = _id FOR UPDATE;
  IF c.status <> 'Resolvido' THEN RAISE EXCEPTION 'Somente chamados resolvidos podem ser fechados'; END IF;
  UPDATE public.suporte_chamados SET status = 'Fechado', closed_at = now() WHERE id = _id;
  PERFORM public.suporte_registrar_evento(_id, 'fechado', 'Chamado fechado.', 'Resolvido', 'Fechado');
  INSERT INTO public.suporte_notificacoes (chamado_id, evento) VALUES (_id, 'status_alterado');
END; $$;

CREATE OR REPLACE FUNCTION public.suporte_enviar_mensagem(_id uuid, _mensagem text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c record; m record; u record; staff boolean; fil text; mid uuid;
BEGIN
  staff := public.suporte_staff_do_chamado(_id);
  IF NOT staff AND NOT public.suporte_e_solicitante(_id) THEN RAISE EXCEPTION 'Sem permissão'; END IF;
  IF coalesce(trim(_mensagem), '') = '' OR length(_mensagem) > 5000 THEN RAISE EXCEPTION 'Mensagem inválida'; END IF;
  SELECT * INTO c FROM public.suporte_chamados WHERE id = _id FOR UPDATE;
  IF c.status = 'Fechado' THEN RAISE EXCEPTION 'Chamado fechado'; END IF;
  SELECT * INTO m FROM public.suporte_me() LIMIT 1;
  SELECT * INTO u FROM public.suporte_usuarios WHERE id = m.id;
  IF NOT staff THEN SELECT f.nome INTO fil FROM public.suporte_filiais f WHERE f.id = c.filial_id; END IF;
  INSERT INTO public.suporte_chamado_mensagens (chamado_id, autor_id, autor_nome, autor_perfil, autor_filial, mensagem)
  VALUES (_id, m.id, coalesce(u.nome, 'Técnico Visionyx'), coalesce(m.perfil::text, 'admin_visionyx'), fil, trim(_mensagem))
  RETURNING id INTO mid;
  PERFORM public.suporte_registrar_evento(_id, 'mensagem', CASE WHEN staff THEN 'Técnico enviou uma mensagem.' ELSE 'Filial enviou uma mensagem.' END, NULL, NULL);
  IF staff THEN
    INSERT INTO public.suporte_notificacoes (chamado_id, evento) VALUES (_id, 'tecnico_respondeu');
    UPDATE public.suporte_chamados SET updated_at = now() WHERE id = _id;
  ELSIF c.status = 'Aguardando cliente' THEN
    UPDATE public.suporte_chamados SET status = 'Em atendimento' WHERE id = _id;
    PERFORM public.suporte_registrar_evento(_id, 'status', 'Filial respondeu; status alterado para Em atendimento', 'Aguardando cliente', 'Em atendimento');
  ELSE
    UPDATE public.suporte_chamados SET updated_at = now() WHERE id = _id;
  END IF;
  RETURN mid;
END; $$;

CREATE OR REPLACE FUNCTION public.suporte_registrar_anexo_evento(_id uuid, _nome text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT (public.suporte_staff_do_chamado(_id) OR public.suporte_e_solicitante(_id)) THEN RAISE EXCEPTION 'Sem permissão'; END IF;
  PERFORM public.suporte_registrar_evento(_id, 'anexo', 'Arquivo anexado: ' || left(_nome, 200), NULL, NULL);
END; $$;

-- Busca paginada (filtros no banco)
CREATE OR REPLACE FUNCTION public.suporte_buscar_chamados(
  _cliente uuid DEFAULT NULL, _filial uuid DEFAULT NULL, _status text DEFAULT NULL, _prioridade text DEFAULT NULL,
  _categoria text DEFAULT NULL, _tecnico uuid DEFAULT NULL, _desde timestamptz DEFAULT NULL, _ate timestamptz DEFAULT NULL,
  _busca text DEFAULT NULL, _limite int DEFAULT 25, _offset int DEFAULT 0)
RETURNS TABLE(id uuid, protocolo text, numero bigint, created_at timestamptz, updated_at timestamptz, cliente text, filial text,
  solicitante text, categoria text, assunto text, prioridade text, status text, tecnico text, total bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT c.id, c.protocolo, c.numero, c.created_at, c.updated_at, cl.nome, f.nome, u.nome, c.categoria::text, c.assunto,
    c.prioridade::text, c.status::text, t.nome, count(*) OVER()
  FROM public.suporte_chamados c
  JOIN public.suporte_clientes cl ON cl.id = c.cliente_id
  JOIN public.suporte_filiais f ON f.id = c.filial_id
  LEFT JOIN public.suporte_usuarios u ON u.id = c.usuario_id
  LEFT JOIN public.suporte_usuarios t ON t.id = c.tecnico_id
  WHERE public.suporte_is_staff()
    AND (public.suporte_is_admin() OR public.suporte_is_tecnico_do_cliente(c.cliente_id))
    AND (_cliente IS NULL OR c.cliente_id = _cliente)
    AND (_filial IS NULL OR c.filial_id = _filial)
    AND (_status IS NULL OR c.status::text = _status)
    AND (_prioridade IS NULL OR c.prioridade::text = _prioridade)
    AND (_categoria IS NULL OR c.categoria::text = _categoria)
    AND (_tecnico IS NULL OR c.tecnico_id = _tecnico)
    AND (_desde IS NULL OR c.created_at >= _desde)
    AND (_ate IS NULL OR c.created_at < _ate)
    AND (_busca IS NULL OR _busca = '' OR c.protocolo ILIKE '%' || _busca || '%' OR c.numero::text = _busca
      OR c.assunto ILIKE '%' || _busca || '%' OR u.nome ILIKE '%' || _busca || '%'
      OR f.nome ILIKE '%' || _busca || '%' OR f.codigo ILIKE '%' || _busca || '%' OR c.equipamento ILIKE '%' || _busca || '%')
  ORDER BY c.created_at DESC
  LIMIT least(greatest(_limite, 1), 100) OFFSET greatest(_offset, 0)
$$;

CREATE OR REPLACE FUNCTION public.suporte_contadores(_cliente uuid DEFAULT NULL)
RETURNS TABLE(abertos bigint, em_atendimento bigint, aguardando bigint, resolvidos bigint, urgentes bigint, total bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT count(*) FILTER (WHERE status = 'Aberto'), count(*) FILTER (WHERE status = 'Em atendimento'),
    count(*) FILTER (WHERE status = 'Aguardando cliente'), count(*) FILTER (WHERE status = 'Resolvido'),
    count(*) FILTER (WHERE prioridade = 'Urgente' AND status NOT IN ('Resolvido','Fechado')), count(*)
  FROM public.suporte_chamados c
  WHERE public.suporte_is_staff() AND (public.suporte_is_admin() OR public.suporte_is_tecnico_do_cliente(c.cliente_id))
    AND (_cliente IS NULL OR c.cliente_id = _cliente)
$$;

CREATE OR REPLACE FUNCTION public.suporte_visao_filiais(_cliente uuid)
RETURNS TABLE(filial_id uuid, codigo text, nome text, abertos bigint, em_atendimento bigint, aguardando bigint, urgentes bigint, resolvidos bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT f.id, f.codigo, f.nome,
    count(c.id) FILTER (WHERE c.status = 'Aberto'), count(c.id) FILTER (WHERE c.status = 'Em atendimento'),
    count(c.id) FILTER (WHERE c.status = 'Aguardando cliente'),
    count(c.id) FILTER (WHERE c.prioridade = 'Urgente' AND c.status NOT IN ('Resolvido','Fechado')),
    count(c.id) FILTER (WHERE c.status = 'Resolvido')
  FROM public.suporte_filiais f LEFT JOIN public.suporte_chamados c ON c.filial_id = f.id
  WHERE f.cliente_id = _cliente AND public.suporte_is_staff()
    AND (public.suporte_is_admin() OR public.suporte_is_tecnico_do_cliente(_cliente))
  GROUP BY f.id, f.codigo, f.nome ORDER BY f.codigo
$$;

CREATE OR REPLACE FUNCTION public.suporte_listar_tecnicos()
RETURNS TABLE(id uuid, nome text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT u.id, u.nome FROM public.suporte_usuarios u
  WHERE public.suporte_is_staff() AND u.perfil IN ('tecnico_visionyx','admin_visionyx') AND u.status = 'ativo' ORDER BY u.nome
$$;

CREATE OR REPLACE FUNCTION public.suporte_chamado_detalhe(_id uuid)
RETURNS TABLE(id uuid, protocolo text, numero bigint, created_at timestamptz, updated_at timestamptz, iniciado_em timestamptz,
  resolvido_em timestamptz, closed_at timestamptz, cliente text, filial text, filial_codigo text, solicitante text,
  solicitante_telefone text, solicitante_email text, categoria text, prioridade text, assunto text, descricao text,
  equipamento text, status text, solucao text, tecnico_id uuid, tecnico text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT c.id, c.protocolo, c.numero, c.created_at, c.updated_at, c.iniciado_em, c.resolvido_em, c.closed_at,
    cl.nome, f.nome, f.codigo, u.nome, u.telefone, u.email, c.categoria::text, c.prioridade::text, c.assunto, c.descricao,
    c.equipamento, c.status::text, c.solucao, c.tecnico_id, t.nome
  FROM public.suporte_chamados c
  JOIN public.suporte_clientes cl ON cl.id = c.cliente_id
  JOIN public.suporte_filiais f ON f.id = c.filial_id
  LEFT JOIN public.suporte_usuarios u ON u.id = c.usuario_id
  LEFT JOIN public.suporte_usuarios t ON t.id = c.tecnico_id
  WHERE c.id = _id AND public.suporte_staff_do_chamado(_id)
$$;

REVOKE EXECUTE ON FUNCTION public.suporte_is_staff(), public.suporte_staff_do_chamado(uuid), public.suporte_assumir_chamado(uuid),
  public.suporte_alterar_status(uuid, public.chamado_status, text), public.suporte_alterar_prioridade(uuid, public.chamado_prioridade),
  public.suporte_resolver_chamado(uuid, text), public.suporte_fechar_chamado(uuid), public.suporte_enviar_mensagem(uuid, text),
  public.suporte_registrar_anexo_evento(uuid, text),
  public.suporte_buscar_chamados(uuid, uuid, text, text, text, uuid, timestamptz, timestamptz, text, int, int),
  public.suporte_contadores(uuid), public.suporte_visao_filiais(uuid), public.suporte_listar_tecnicos(), public.suporte_chamado_detalhe(uuid)
  FROM anon, public;
GRANT EXECUTE ON FUNCTION public.suporte_is_staff(), public.suporte_staff_do_chamado(uuid), public.suporte_assumir_chamado(uuid),
  public.suporte_alterar_status(uuid, public.chamado_status, text), public.suporte_alterar_prioridade(uuid, public.chamado_prioridade),
  public.suporte_resolver_chamado(uuid, text), public.suporte_fechar_chamado(uuid), public.suporte_enviar_mensagem(uuid, text),
  public.suporte_registrar_anexo_evento(uuid, text),
  public.suporte_buscar_chamados(uuid, uuid, text, text, text, uuid, timestamptz, timestamptz, text, int, int),
  public.suporte_contadores(uuid), public.suporte_visao_filiais(uuid), public.suporte_listar_tecnicos(), public.suporte_chamado_detalhe(uuid)
  TO authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.suporte_chamados;
ALTER PUBLICATION supabase_realtime ADD TABLE public.suporte_chamado_mensagens;