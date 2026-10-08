CREATE OR REPLACE FUNCTION public.suporte_atualizar_meu_perfil(_nome text, _telefone text, _setor text, _cargo text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF coalesce(trim(_nome), '') = '' THEN RAISE EXCEPTION 'Nome obrigatório'; END IF;
  UPDATE public.suporte_usuarios
  SET nome = trim(_nome), telefone = nullif(trim(_telefone), ''), setor = nullif(trim(_setor), ''), cargo = nullif(trim(_cargo), '')
  WHERE user_id = auth.uid() AND status = 'ativo';
END; $$;
REVOKE EXECUTE ON FUNCTION public.suporte_atualizar_meu_perfil(text,text,text,text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.suporte_atualizar_meu_perfil(text,text,text,text) TO authenticated;