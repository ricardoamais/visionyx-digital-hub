CREATE TABLE public.suporte_notificacao_envios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chamado_id uuid NOT NULL REFERENCES public.suporte_chamados(id) ON DELETE CASCADE,
  destinatario text NOT NULL,
  tipo text NOT NULL,
  assunto text NOT NULL,
  status text NOT NULL CHECK (status IN ('enviado','falhou','bloqueado')),
  erro text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.suporte_notificacao_envios (chamado_id, tipo);
GRANT SELECT ON public.suporte_notificacao_envios TO authenticated;
GRANT ALL ON public.suporte_notificacao_envios TO service_role;
ALTER TABLE public.suporte_notificacao_envios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff ve envios" ON public.suporte_notificacao_envios FOR SELECT TO authenticated USING (public.suporte_staff_do_chamado(chamado_id));