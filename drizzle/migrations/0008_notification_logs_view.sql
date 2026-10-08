CREATE VIEW public.notification_logs WITH (security_invoker = true) AS
SELECT id, chamado_id AS ticket_id, destinatario AS recipient, tipo AS notification_type, assunto AS subject,
  status, erro AS error_message, created_at AS sent_at
FROM public.suporte_notificacao_envios;
GRANT SELECT ON public.notification_logs TO authenticated;
GRANT ALL ON public.notification_logs TO service_role;