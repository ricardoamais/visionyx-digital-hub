import { Link } from "react-router-dom";
import { LogIn, LayoutDashboard, PlusCircle, ListChecks, Wrench, Settings, Building2, BarChart3, ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const modulos = [
  { icon: LogIn, titulo: "Login", desc: "Acesso seguro por e-mail e senha." },
  { icon: LayoutDashboard, titulo: "Dashboard", desc: "Visão geral dos atendimentos." },
  { icon: PlusCircle, titulo: "Abrir chamado", desc: "Registre um problema em segundos." },
  { icon: ListChecks, titulo: "Meus chamados", desc: "Acompanhe o status de cada pedido." },
  { icon: Wrench, titulo: "Atendimento técnico", desc: "Área dos técnicos Visionyx." },
  { icon: Settings, titulo: "Administração", desc: "Clientes, usuários e permissões." },
  { icon: Building2, titulo: "Filiais", desc: "Cadastro e importação de filiais." },
  { icon: BarChart3, titulo: "Relatórios", desc: "Indicadores de atendimento." },
];

const CentralSuporte = () => (
  <div className="min-h-screen bg-[#0A1F3F] text-white">
    <SEOHead title="Central de Suporte - Visionyx Informática" description="Central de chamados de suporte técnico da Visionyx Informática para empresas clientes." />
    <header className="border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
            <path d="M4 4h9l3 8-4.5 4L4 4Z" fill="#38BDF8" />
            <path d="M28 4h-9L9.5 28 16 20l6.5 8L28 4Z" fill="#1A56DB" />
          </svg>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-extrabold uppercase">Visionyx</span>
            <span className="text-[10px] font-semibold tracking-[0.35em] text-[#38BDF8] uppercase">Informática</span>
          </span>
        </Link>
        <Link to="/" className="flex items-center gap-1 text-sm text-white/70 hover:text-white">
          <ArrowLeft size={16} /> Voltar ao site
        </Link>
      </div>
    </header>

    <main className="container mx-auto px-4 py-16">
      <p className="text-[#38BDF8] text-xs font-semibold tracking-[0.3em] uppercase">Suporte Técnico</p>
      <h1 className="text-3xl md:text-5xl font-extrabold mt-3">Central de Suporte</h1>
      <p className="text-white/70 mt-4 max-w-2xl">
        Abertura e acompanhamento de chamados para empresas clientes da Visionyx. Acesso restrito a usuários cadastrados.
      </p>
      <Link to="/central-de-suporte/admin" className="inline-block mt-6 rounded-lg bg-[#1A56DB] hover:bg-[#38BDF8] px-5 py-2.5 text-sm font-bold">
        Administração Visionyx
      </Link>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
        {modulos.map(({ icon: Icon, titulo, desc }) => (
          <div key={titulo} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <Icon className="text-[#38BDF8]" size={24} />
            <h2 className="font-bold mt-3">{titulo}</h2>
            <p className="text-sm text-white/60 mt-1">{desc}</p>
            <span className="inline-block mt-3 text-[10px] uppercase tracking-wider text-white/40">Em breve</span>
          </div>
        ))}
      </div>
    </main>
  </div>
);

export default CentralSuporte;
