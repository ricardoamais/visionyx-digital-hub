CREATE OR REPLACE FUNCTION public.generate_smart_tag_code()
RETURNS text
LANGUAGE plpgsql
VOLATILE
SET search_path = public
AS $$
DECLARE
  generated_code text;
BEGIN
  LOOP
    generated_code := 'VX-' || upper(substr(md5(random()::text || clock_timestamp()::text || gen_random_uuid()::text), 1, 6));
    EXIT WHEN NOT EXISTS (
      SELECT 1
      FROM public.visionyx_smart_tags
      WHERE code = generated_code
    );
  END LOOP;

  RETURN generated_code;
END;
$$;

ALTER TABLE public.visionyx_smart_tags
  ALTER COLUMN code SET DEFAULT public.generate_smart_tag_code();

ALTER TABLE public.visionyx_smart_tags
  DROP CONSTRAINT IF EXISTS visionyx_smart_tags_code_key;

ALTER TABLE public.visionyx_smart_tags
  ADD CONSTRAINT visionyx_smart_tags_code_key UNIQUE (code);