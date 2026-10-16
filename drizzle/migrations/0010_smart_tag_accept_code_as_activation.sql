CREATE OR REPLACE FUNCTION public.smart_tag_check_pin(_code text, _pin text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE t public.visionyx_smart_tags%ROWTYPE;
DECLARE v_pin text := upper(replace(trim(_pin), ' ', ''));
BEGIN
  SELECT * INTO t FROM public.visionyx_smart_tags WHERE code = upper(trim(_code));
  IF NOT FOUND OR t.status <> 'Disponível' OR t.pin_attempts >= 10 THEN RETURN false; END IF;
  IF v_pin = '' THEN RETURN false; END IF;
  IF t.activation_pin IS NOT NULL AND t.activation_pin = trim(_pin) THEN RETURN true; END IF;
  IF v_pin = upper(t.code) THEN RETURN true; END IF;
  UPDATE public.visionyx_smart_tags SET pin_attempts = pin_attempts + 1 WHERE id = t.id;
  RETURN false;
END;
$function$;

CREATE OR REPLACE FUNCTION public.activate_smart_tag(_code text, _pin text, _place_id text, _place_name text, _place_address text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE t public.visionyx_smart_tags%ROWTYPE;
DECLARE v_pin text := upper(replace(trim(_pin), ' ', ''));
BEGIN
  IF _place_id IS NULL OR length(trim(_place_id)) < 10 OR length(_place_id) > 300
     OR _place_id !~ '^[A-Za-z0-9_-]+$' THEN RETURN false; END IF;
  SELECT * INTO t FROM public.visionyx_smart_tags WHERE code = upper(trim(_code)) FOR UPDATE;
  IF NOT FOUND OR t.status <> 'Disponível' OR t.pin_attempts >= 10 THEN RETURN false; END IF;
  IF v_pin = '' THEN RETURN false; END IF;
  IF NOT (t.activation_pin IS NOT NULL AND t.activation_pin = trim(_pin)) AND v_pin <> upper(t.code) THEN
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
$function$;