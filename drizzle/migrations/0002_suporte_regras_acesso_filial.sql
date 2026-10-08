CREATE OR REPLACE FUNCTION public.suporte_pode_ver_chamado_v2(_cliente_id uuid, _filial_id uuid, _usuario_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.suporte_is_admin() OR EXISTS (
    SELECT 1 FROM public.suporte_me() m
    WHERE (m.perfil = 'admin_cliente' AND m.cliente_id = _cliente_id)
       OR (m.perfil = 'admin_filial' AND m.cliente_id = _cliente_id AND m.filial_id = _filial_id)
       OR (m.perfil = 'usuario_filial' AND m.cliente_id = _cliente_id AND m.filial_id = _filial_id AND m.id = _usuario_id)
       OR (m.perfil = 'tecnico_visionyx' AND EXISTS (SELECT 1 FROM public.suporte_tecnico_clientes tc WHERE tc.tecnico_id = m.id AND tc.cliente_id = _cliente_id))
  )
$$;
REVOKE EXECUTE ON FUNCTION public.suporte_pode_ver_chamado_v2(uuid,uuid,uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.suporte_pode_ver_chamado_v2(uuid,uuid,uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.suporte_pode_ver_cliente(_cliente_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.suporte_is_admin() OR EXISTS (
    SELECT 1 FROM public.suporte_me() m
    WHERE (m.perfil IN ('admin_cliente','admin_filial','usuario_filial') AND m.cliente_id = _cliente_id)
       OR (m.perfil = 'tecnico_visionyx' AND EXISTS (SELECT 1 FROM public.suporte_tecnico_clientes tc WHERE tc.tecnico_id = m.id AND tc.cliente_id = _cliente_id))
  )
$$;

DROP POLICY IF EXISTS "Ver chamados permitidos" ON public.suporte_chamados;
CREATE POLICY "Ver chamados permitidos" ON public.suporte_chamados FOR SELECT TO authenticated
  USING (public.suporte_pode_ver_chamado_v2(cliente_id, filial_id, usuario_id));
DROP POLICY IF EXISTS "Abrir chamado no escopo" ON public.suporte_chamados;
CREATE POLICY "Abrir chamado no escopo" ON public.suporte_chamados FOR INSERT TO authenticated
  WITH CHECK (usuario_id = (SELECT m.id FROM public.suporte_me() m) AND public.suporte_pode_ver_chamado_v2(cliente_id, filial_id, usuario_id));

CREATE POLICY "Admin filial ve usuarios da filial" ON public.suporte_usuarios FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.suporte_me() m WHERE m.perfil = 'admin_filial' AND m.filial_id = suporte_usuarios.filial_id));

ALTER TABLE public.suporte_usuarios ADD CONSTRAINT suporte_usuarios_admin_filial_req CHECK (perfil <> 'admin_filial' OR filial_id IS NOT NULL);