import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3.23.8'
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts'

// Destinatários fixos — definidos somente no servidor.
const DESTINATARIOS = ['cpd1@tintasdarka.com.br', 'adm@tintasdarka.com.br', 'suporte@visionyx.com.br']
const SITE = 'https://visionyx.com.br'
const Body = z.object({ chamado_id: z.string().uuid() })
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const auth = req.headers.get('Authorization')
  if (!auth) return json({ error: 'unauthorized' }, 401)
  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return json({ error: 'chamado_id inválido' }, 400)
  const id = parsed.data.chamado_id

  const url = Deno.env.get('SUPABASE_URL')!
  const userClient = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } })
  const { data: u } = await userClient.auth.getUser()
  if (!u.user) return json({ error: 'unauthorized' }, 401)
  const [{ data: sol }, { data: staff }] = await Promise.all([
    userClient.rpc('suporte_e_solicitante', { _chamado_id: id }),
    userClient.rpc('suporte_staff_do_chamado', { _chamado_id: id }),
  ])
  if (!sol && !staff) return json({ error: 'forbidden' }, 403)

  const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: c } = await admin.from('suporte_chamados')
    .select('id, status, protocolo, numero, created_at, categoria, prioridade, assunto, descricao, equipamento, cliente_id, filial_id, usuario_id').eq('id', id).maybeSingle()
  if (!c) return json({ error: 'não encontrado' }, 404)
  const [cl, fi, us, an, env] = await Promise.all([
    admin.from('suporte_clientes').select('nome').eq('id', c.cliente_id).maybeSingle(),
    admin.from('suporte_filiais').select('nome').eq('id', c.filial_id).maybeSingle(),
    c.usuario_id ? admin.from('suporte_usuarios').select('nome, email, telefone').eq('id', c.usuario_id).maybeSingle() : Promise.resolve({ data: null }),
    admin.from('suporte_chamado_anexos').select('id', { count: 'exact', head: true }).eq('chamado_id', id),
    admin.from('suporte_notificacao_envios').select('destinatario').eq('chamado_id', id).eq('tipo', 'novo_chamado').eq('status', 'enviado'),
  ])
  const jaEnviados = new Set((env.data ?? []).map((r: { destinatario: string }) => r.destinatario))

  const templateData = {
    protocolo: c.protocolo ?? `#${c.numero}`, cliente: cl.data?.nome, filial: fi.data?.nome,
    solicitante: us.data?.nome, email: us.data?.email, telefone: us.data?.telefone ?? undefined,
    categoria: c.categoria, prioridade: c.prioridade, assunto: c.assunto, descricao: c.descricao ?? '',
    equipamento: c.equipamento ?? undefined,
    data: new Date(c.created_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }),
    status: c.status,
    link: `${SITE}/suporte/admin/chamado/${c.id}`, temAnexos: (an.count ?? 0) > 0,
  }
  const assunto = `[Visionyx] Novo chamado ${templateData.protocolo} — ${templateData.cliente ?? ''} — Filial ${templateData.filial ?? ''}`

  const resultados: { destinatario: string; status: string }[] = []
  for (const to of DESTINATARIOS) {
    if (jaEnviados.has(to)) { resultados.push({ destinatario: to, status: 'enviado' }); continue }
    let status = 'enviado'; let erro: string | null = null
    try {
      const r = await sendTemplateEmail('novo-chamado', to, { templateData, idempotencyKey: `novo-chamado-${id}-${to}` })
      if (!r.sent) { status = 'bloqueado'; erro = 'Destinatário bloqueado (descadastro ou devolução)' }
    } catch (e) {
      status = 'falhou'; erro = e instanceof Error ? e.message.slice(0, 500) : 'erro'
    }
    const ins = await admin.from('suporte_notificacao_envios').insert({ chamado_id: id, destinatario: to, tipo: 'novo_chamado', assunto, status, erro })
    if (ins.error) console.error('log falhou', ins.error.code, ins.error.message)
    resultados.push({ destinatario: to, status })
  }
  await admin.from('suporte_notificacoes').update({ canal: 'email', status: resultados.every((r) => r.status === 'enviado') ? 'enviada' : 'falhou', enviada_em: new Date().toISOString() })
    .eq('chamado_id', id).eq('evento', 'aberto')
  return json({ resultados })
})
