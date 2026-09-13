
CREATE OR REPLACE FUNCTION public.is_my_vendedor(_vendedor_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _vendedor_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.vendedores v
    WHERE v.id = _vendedor_id
      AND v.user_id = auth.uid()
      AND v.status = 'ativo'
  )
$$;

CREATE OR REPLACE FUNCTION public.resolve_smart_tag(_code text)
RETURNS TABLE(code text, status text, destination_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT t.code, t.status, t.destination_url
  FROM public.visionyx_smart_tags t
  WHERE t.code = upper(trim(_code))
  LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION public.resolve_smart_tag(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_my_vendedor(uuid) TO authenticated;

DROP POLICY IF EXISTS "Public can read smart tags" ON public.visionyx_smart_tags;

CREATE POLICY "Admins and owning vendedores can read smart tags"
ON public.visionyx_smart_tags
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR public.is_my_vendedor(vendedor_id)
);

REVOKE SELECT ON public.visionyx_smart_tags FROM anon;
