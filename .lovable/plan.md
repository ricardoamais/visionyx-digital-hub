# Topo do site no estilo da arte anexada

Objetivo: deixar o topo (TrustBar + Header + Hero) com o mesmo visual da imagem — azul marinho profundo, textura de servidor/rede ao fundo, logo "V" com wordmark VISIONYX INFORMÁTICA e headline em caixa alta com destaque azul.

## O que muda

1. Header
   - Logo redesenhado: marca "V" angular em azul (#1A56DB/#38BDF8) + wordmark "VISIONYX" em caixa alta, com "INFORMÁTICA" espaçado abaixo em fonte menor.
   - Fundo azul marinho (#0A1F3F → #0F2D5C), sem borda dura, com leve transparência ao rolar.

2. Hero
   - Fundo azul marinho escuro com gradiente radial + textura tecnológica sutil (grid e brilho), mantendo o padrão atual mas mais profundo/escuro.
   - Headline reescrita no estilo da arte: "TECNOLOGIA QUE" em branco, "CONECTA E IMPULSIONA" em azul (#2F80FF), caixa alta, peso extrabold, tracking apertado.
   - Subtítulo curto: "Soluções em TI para empresas que não podem parar."
   - Mantém todos os elementos de conversão atuais: badge "Atendendo agora", badge Curitiba • Paraná, prova social 4.9 / +500 clientes, botão verde do WhatsApp, "Ver serviços", selos de garantia.
   - Painel lateral "Painel de Suporte" permanece, com bordas e brilho ajustados ao novo azul.

3. TrustBar
   - Mesmo conteúdo, tom de azul alinhado ao novo topo.

## Observações

- Nada é publicado: as mudanças aparecem só no preview até você pedir para publicar.
- Rotas, textos de serviços, SEO e demais seções ficam intactos.
- A arte anexada é referência visual; ela não será inserida como imagem no site (os logos de clientes continuam como estão hoje).

## Detalhes técnicos

- Arquivos: `src/components/Header.tsx`, `src/components/Hero.tsx`, `src/components/TrustBar.tsx`.
- Paleta usada: `#0A1F3F` (base), `#0F2D5C` (superfície), `#1A56DB` / `#2F80FF` (azul de marca), `#38BDF8` (acento).
- Logo em SVG inline (sem novo asset).
