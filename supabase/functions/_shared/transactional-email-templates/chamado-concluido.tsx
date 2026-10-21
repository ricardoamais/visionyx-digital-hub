import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  protocolo?: string; cliente?: string; filial?: string; solicitante?: string; assunto?: string
  finalizado?: string; tecnico?: string; solucao?: string; link?: string
}

const Linha = ({ l, v }: { l: string; v?: string }) => (
  <Text style={row}><span style={label}>{l}:</span> {v || '—'}</Text>
)

const ChamadoConcluido = (p: Props) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Chamado {p.protocolo ?? ''} concluído — {p.assunto ?? ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={brand}>VISIONYX <span style={{ color: '#38BDF8' }}>SUPORTE</span></Text>
        </Section>
        <Section style={content}>
          <Heading style={h1}>✓ Chamado concluído com sucesso</Heading>
          <Linha l="Número" v={p.protocolo} />
          <Linha l="Cliente" v={p.cliente} />
          <Linha l="Filial" v={p.filial} />
          <Linha l="Solicitante" v={p.solicitante} />
          <Linha l="Assunto" v={p.assunto} />
          <Linha l="Finalizado em" v={p.finalizado} />
          <Linha l="Atendido por" v={p.tecnico} />
          <Text style={{ ...row, marginTop: 12 }}><span style={label}>Solução realizada:</span></Text>
          <Text style={box}>{p.solucao || '—'}</Text>
          {p.link && <Button href={p.link} style={button}>Visualizar chamado no portal</Button>}
          <Hr style={{ borderColor: '#E2E8F0', margin: '24px 0 12px' }} />
          <Text style={foot}>Visionyx Informática — Central de Suporte</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ChamadoConcluido,
  subject: (d: Record<string, any>) => `[Visionyx] Chamado Concluído ${d.protocolo ?? ''} — ${d.cliente ?? ''} — Filial ${d.filial ?? ''}`,
  displayName: 'Chamado concluído',
  previewData: {
    protocolo: '#2026-00004', cliente: 'Tintas Darka', filial: '01 - TINTAS DARKA SJP', solicitante: 'g1@tintasdarka.com.br',
    assunto: 'Computador não liga', finalizado: '21/10/2026 16:10', tecnico: 'Ricardo',
    solucao: 'Fonte substituída e testes realizados.', link: 'https://visionyx.com.br/suporte/chamado/123',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { maxWidth: '600px', margin: '0 auto' }
const header = { backgroundColor: '#0A1F3F', padding: '18px 24px', borderRadius: '10px 10px 0 0' }
const brand = { color: '#ffffff', fontWeight: 800, fontSize: '18px', letterSpacing: '2px', margin: 0 }
const content = { border: '1px solid #E2E8F0', borderTop: 'none', padding: '24px', borderRadius: '0 0 10px 10px' }
const h1 = { color: '#16A34A', fontSize: '22px', margin: '0 0 16px' }
const row = { color: '#1E293B', fontSize: '14px', margin: '4px 0' }
const label = { fontWeight: 700, color: '#0A1F3F' }
const box = { backgroundColor: '#EBF3FB', padding: '12px', borderRadius: '8px', fontSize: '14px', color: '#1E293B', whiteSpace: 'pre-wrap' as const }
const button = { backgroundColor: '#1A56DB', color: '#ffffff', padding: '12px 22px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', display: 'inline-block', marginTop: '12px' }
const foot = { color: '#64748B', fontSize: '12px' }
