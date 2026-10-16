ALTER TABLE public.visionyx_smart_tags
  ADD COLUMN IF NOT EXISTS google_place_id text,
  ADD COLUMN IF NOT EXISTS google_place_name text,
  ADD COLUMN IF NOT EXISTS google_place_address text,
  ADD COLUMN IF NOT EXISTS activated_at timestamptz,
  ADD COLUMN IF NOT EXISTS activation_pin text,
  ADD COLUMN IF NOT EXISTS pin_attempts integer NOT NULL DEFAULT 0;

UPDATE public.visionyx_smart_tags
SET activation_pin = lpad((floor(random() * 1000000))::int::text, 6, '0')
WHERE activation_pin IS NULL;

CREATE OR REPLACE FUNCTION public.smart_tag_set_pin()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.activation_pin IS NULL THEN
    NEW.activation_pin := lpad((floor(random() * 1000000))::int::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_smart_tags_pin ON public.visionyx_smart_tags;
CREATE TRIGGER trg_smart_tags_pin BEFORE INSERT ON public.visionyx_smart_tags
FOR EACH ROW EXECUTE FUNCTION public.smart_tag_set_pin();

CREATE OR REPLACE FUNCTION public.smart_tag_check_pin(_code text, _pin text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE t public.visionyx_smart_tags%ROWTYPE;
BEGIN
  SELECT * INTO t FROM public.visionyx_smart_tags WHERE code = upper(trim(_code));
  IF NOT FOUND OR t.status <> 'Disponível' OR t.pin_attempts >= 10 THEN RETURN false; END IF;
  IF t.activation_pin IS NOT NULL AND t.activation_pin = trim(_pin) THEN RETURN true; END IF;
  UPDATE public.visionyx_smart_tags SET pin_attempts = pin_attempts + 1 WHERE id = t.id;
  RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION public.activate_smart_tag(
  _code text, _pin text, _place_id text, _place_name text, _place_address text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE t public.visionyx_smart_tags%ROWTYPE;
BEGIN
  IF _place_id IS NULL OR length(trim(_place_id)) < 10 OR length(_place_id) > 300
     OR _place_id !~ '^[A-Za-z0-9_-]+$' THEN RETURN false; END IF;
  SELECT * INTO t FROM public.visionyx_smart_tags WHERE code = upper(trim(_code)) FOR UPDATE;
  IF NOT FOUND OR t.status <> 'Disponível' OR t.pin_attempts >= 10 THEN RETURN false; END IF;
  IF t.activation_pin IS NULL OR t.activation_pin <> trim(_pin) THEN
    UPDATE public.visionyx_smart_tags SET pin_attempts = pin_attempts + 1 WHERE id = t.id;
    RETURN false;
  END IF;
  UPDATE public.visionyx_smart_tags
  SET status = 'Ativa',
      google_place_id = trim(_place_id),
      google_place_name = left(_place_name, 200),
      google_place_address = left(_place_address, 300),
      client_name = COALESCE(client_name, left(_place_name, 200)),
      destination_type = 'Google Avaliações',
      destination_url = 'https://search.google.com/local/writereview?placeid=' || trim(_place_id),
      activated_at = now(),
      pin_attempts = 0
  WHERE id = t.id;
  RETURN true;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.smart_tag_check_pin(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.smart_tag_check_pin(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.activate_smart_tag(text, text, text, text, text) TO anon, authenticated;