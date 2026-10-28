DO $$
DECLARE f record;
BEGIN
  FOR f IN SELECT p.oid::regprocedure AS sig FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
    WHERE n.nspname='public' AND p.prorettype <> 'trigger'::regtype
      AND (p.proname LIKE 'suporte_%' OR p.proname IN ('link_suporte_account','link_vendedor_account','has_role','is_my_vendedor','claim_smart_tag_admin','resolve_smart_tag','increment_smart_tag_access'))
  LOOP
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated, service_role', f.sig);
  END LOOP;
  GRANT EXECUTE ON FUNCTION public.resolve_smart_tag(text) TO anon;
  GRANT EXECUTE ON FUNCTION public.increment_smart_tag_access(text) TO anon;
END $$;