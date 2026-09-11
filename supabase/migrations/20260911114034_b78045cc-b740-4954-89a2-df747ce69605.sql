ALTER TABLE public.visionyx_smart_tags
  ADD COLUMN IF NOT EXISTS access_count integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_smart_tag_access(_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.visionyx_smart_tags
  SET access_count = access_count + 1
  WHERE code = _code;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_smart_tag_access(text) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_smart_tag_access(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_smart_tag_access(text) TO service_role;