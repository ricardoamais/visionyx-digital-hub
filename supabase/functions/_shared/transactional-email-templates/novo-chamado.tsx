import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  protocolo?: string; cliente?: string; filial?: string; solicitante?: string; email?: string; telefone?: string
  categoria?: string; prioridade?: string; assunto?: string; descricao?: string; equipamento?: string
  data?: string; link?: string; temAnexos?: boolean
}

const Linha = ({ l, v }: { l: string; v?: string }) => (
  <Text style={row}><span style={label}>{l}:</span> {v || '—'}</Text>
)

const NovoChamado = (p: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Novo chamado {p.protocolo ?? ''} — {p.assunto ?? ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brand}>VISIONYX <span style={{ color: '#38BDF8' }}>SUPORTE</span></Text>
        </Section>
        <Section style={content}>
          <Heading style={h1}>Novo chamado recebido</Heading>
          <Linha l="Número" v={p.protocolo} />
          <Linha l="Cliente" v={p.cliente} />
          <Linha l="Filial" v={p.filial} />
          <Linha l="Solicitante" v={p.solicitante} />
          <Linha l="E-mail do solicitante" v={p.email} />
          <Linha l="Telefone" v={p.telefone} />
          <Linha l="Categoria" v={p.categoria} />
          <Linha l="Prioridade" v={p.prioridade} />
          <Linha l="Assunto" v={p.assunto} />
          <Text style={{ ...row, marginTop: 12 }}><span style={label}>Descrição:</span></Text>
          <Text style={box}>{p.descricao || '—'}</Text>
          <Linha l="Equipamento" v={p.equipamento} />
          <Linha l="Data e hora" v={p.data} />
          {p.temAnexos && <Text style={aviso}>Este chamado possui anexos. Acesse o chamado para visualizá-los.</Text>}
          {p.link && <Button href={p.link} style={button}>Visualizar chamado</Button>}
          <Hr style={{ borderColor: '#E2E8F0', margin: '24px 0 12px' }} />
          <Text style={foot}>Visionyx Informática — Central de Suporte</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NovoChamado,
  subject: (d: Record<string, any>) => `[Visionyx] Novo chamado ${d.protocolo ?? ''} — ${d.cliente ?? ''} — Filial ${d.filial ?? ''}`,
  displayName: 'Novo chamado',
  previewData: {
    protocolo: '#2026-00001', cliente: 'Tintas Darka', filial: 'Xaxim', solicitante: 'João da Silva', email: 'joao@tintasdarka.com.br',
    telefone: '(41) 99999-0000', categoria: 'Internet', prioridade: 'Alta', assunto: 'Internet sem conexão',
    descricao: 'A internet da loja caiu às 9h.', equipamento: 'ROTEADOR01', data: '08/10/2026 15:00',
    link: 'https://visionyx.com.br/suporte/admin/chamado/123', temAnexos: true,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { maxWidth: '600px', margin: '0 auto' }
const header = { backgroundColor: '#0A1F3F', padding: '18px 24px', borderRadius: '10px 10px 0 0' }
const brand = { color: '#ffffff', fontWeight: 800, fontSize: '18px', letterSpacing: '2px', margin: 0 }
const content = { border: '1px solid #E2E8F0', borderTop: 'none', padding: '24px', borderRadius: '0 0 10px 10px' }
const h1 = { color: '#0A1F3F', fontSize: '22px', margin: '0 0 16px' }
const row = { color: '#1E293B', fontSize: '14px', margin: '4px 0' }
const label = { fontWeight: 700, color: '#0A1F3F' }
const box = { backgroundColor: '#EBF3FB', padding: '12px', borderRadius: '8px', fontSize: '14px', color: '#1E293B', whiteSpace: 'pre-wrap' as const }
const aviso = { backgroundColor: '#FEF3C7', color: '#92400E', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', margin: '16px 0' }
const button = { backgroundColor: '#1A56DB', color: '#ffffff', padding: '12px 22px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginTop: '12px' }
const foot = { color: '#64748B', fontSize: '12px' }
