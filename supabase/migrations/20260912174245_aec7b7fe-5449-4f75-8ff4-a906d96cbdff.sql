ALTER TABLE public.vendedores ADD COLUMN IF NOT EXISTS user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS vendedores_email_lower_idx ON public.vendedores (lower(email));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendedores TO authenticated;
GRANT ALL ON public.vendedores TO service_role;

DROP POLICY IF EXISTS "Vendedores can read own record" ON public.vendedores;
CREATE POLICY "Vendedores can read own record" ON public.vendedores
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.link_vendedor_account()
RETURNS TABLE (id uuid, nome text, email text, status text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  uemail text;
BEGIN
  IF uid IS NULL THEN
    RETURN;
  END IF;
  SELECT lower(u.email) INTO uemail FROM auth.users u WHERE u.id = uid;
  IF uemail IS NULL THEN
    RETURN;
  END IF;

  UPDATE public.vendedores v
  SET user_id = uid
  WHERE lower(v.email) = uemail
    AND v.status = 'ativo'
    AND (v.user_id IS NULL OR v.user_id = uid);

  RETURN QUERY
  SELECT v.id, v.nome, v.email, v.status
  FROM public.vendedores v
  WHERE v.user_id = uid;
END;
$$;

REVOKE ALL ON FUNCTION public.link_vendedor_account() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.link_vendedor_account() TO authenticated;