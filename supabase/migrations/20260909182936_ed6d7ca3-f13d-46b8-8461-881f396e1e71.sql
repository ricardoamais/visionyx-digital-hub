CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.visionyx_smart_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  client_name text,
  destination_url text,
  destination_type text,
  status text NOT NULL DEFAULT 'Disponível',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_smart_tags_code ON public.visionyx_smart_tags (code);

GRANT SELECT ON public.visionyx_smart_tags TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visionyx_smart_tags TO authenticated;
GRANT ALL ON public.visionyx_smart_tags TO service_role;

ALTER TABLE public.visionyx_smart_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read smart tags" ON public.visionyx_smart_tags
FOR SELECT USING (true);

CREATE POLICY "Admins can insert smart tags" ON public.visionyx_smart_tags
FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update smart tags" ON public.visionyx_smart_tags
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete smart tags" ON public.visionyx_smart_tags
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_smart_tags_updated_at
BEFORE UPDATE ON public.visionyx_smart_tags
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.visionyx_smart_tags (code)
SELECT 'VX' || lpad(g::text, 4, '0') FROM generate_series(1, 10) g
ON CONFLICT (code) DO NOTHING;