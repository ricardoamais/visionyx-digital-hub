import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3.23.8'
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts'

// Clientes com e-mail de conclusão: solicitante da filial + destinatários extras fixos (técnicos não recebem).
const EXTRAS_POR_CLIENTE: Record<string, string[]> = {
  'f8a23fae-8c39-4d60-9d0f-bcd996ba29be': ['adm@tintasdarka.com.br'], // Tintas Darka
}
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
  const { data: staff } = await userClient.rpc('suporte_staff_do_chamado', { _chamado_id: id })
  if (!staff) return json({ error: 'forbidden' }, 403)

  const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: c } = await admin.from('suporte_chamados')
    .select('id, status, protocolo, numero, assunto, solucao, resolvido_em, cliente_id, filial_id, usuario_id, tecnico_id').eq('id', id).maybeSingle()
  if (!c) return json({ error: 'não encontrado' }, 404)
  if (c.status !== 'Resolvido' && c.status !== 'Fechado') return json({ error: 'chamado não resolvido' }, 400)
  const extras = EXTRAS_POR_CLIENTE[c.cliente_id]
  if (!extras) return json({ resultados: [], ignorado: true })

  const [cl, fi, us, tc] = await Promise.all([
    admin.from('suporte_clientes').select('nome').eq('id', c.cliente_id).maybeSingle(),
    admin.from('suporte_filiais').select('nome, codigo').eq('id', c.filial_id).maybeSingle(),
    c.usuario_id ? admin.from('suporte_usuarios').select('nome, email').eq('id', c.usuario_id).maybeSingle() : Promise.resolve({ data: null }),
    c.tecnico_id ? admin.from('suporte_usuarios').select('nome').eq('id', c.tecnico_id).maybeSingle() : Promise.resolve({ data: null }),
  ])
  const destinatarios = [...new Set([us.data?.email?.toLowerCase().trim(), ...extras].filter(Boolean) as string[])]

  const templateData = {
    protocolo: c.protocolo ?? `#${c.numero}`, cliente: cl.data?.nome,
    filial: fi.data ? `${fi.data.codigo} - ${fi.data.nome}` : undefined,
    solicitante: us.data?.email ?? us.data?.nome, assunto: c.assunto, solucao: c.solucao ?? '',
    tecnico: tc.data?.nome ? `${tc.data.nome} (Visionyx)` : 'Visionyx',
    finalizado: new Date(c.resolvido_em ?? Date.now()).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }),
    link: `${SITE}/suporte/chamado/${c.id}`,
  }
  const assunto = `[Visionyx] Chamado Concluído ${templateData.protocolo} — ${templateData.cliente ?? ''} — Filial ${templateData.filial ?? ''}`

  const resultados: { destinatario: string; status: string }[] = []
  for (const to of destinatarios) {
    let status = 'enviado'; let erro: string | null = null
    try {
      const r = await sendTemplateEmail('chamado-concluido', to, { templateData, idempotencyKey: `chamado-concluido-${id}-${to}` })
      if (!r.sent) { status = 'bloqueado'; erro = 'Destinatário bloqueado (descadastro ou devolução)' }
    } catch (e) {
      status = 'falhou'; erro = e instanceof Error ? e.message.slice(0, 500) : 'erro'
    }
    const ins = await admin.from('suporte_notificacao_envios').insert({ chamado_id: id, destinatario: to, tipo: 'chamado_concluido', assunto, status, erro })
    if (ins.error) console.error('log falhou', ins.error.code, ins.error.message)
    resultados.push({ destinatario: to, status })
  }
  return json({ resultados })
})
