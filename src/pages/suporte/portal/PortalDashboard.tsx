import { Link } from "react-router-dom";
import { PlusCircle, Ticket } from "lucide-react";
import { usePortal, perfilLabel } from "@/components/suporte/PortalLayout";
import { useMeusChamados } from "./PortalChamados";

const PortalDashboard = () => {
  const { user } = usePortal();
  const lista = useMeusChamados() ?? [];
  const n = (s: string) => lista.filter((c) => c.status === s).length;
  const cards = [
    ["Meus chamados abertos", n("Aberto"), "text-[#38BDF8]"],
    ["Em atendimento", n("Em atendimento"), "text-amber-300"],
    ["Aguardando cliente", n("Aguardando cliente"), "text-orange-300"],
    ["Resolvidos", n("Resolvido"), "text-emerald-300"],
  ] as const;

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-extrabold">Olá, {user.nome.split(" ")[0]}!</h1>
      <p className="text-[#38BDF8] font-semibold mt-1">{user.cliente_nome} — Filial {user.filial_nome}</p>
      <p className="text-sm text-white/50">{perfilLabel[user.perfil] ?? user.perfil}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {cards.map(([l, v, c]) => (
          <div key={l} className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-[0_0_20px_rgba(56,189,248,0.08)]">
            <p className="text-sm text-white/60">{l}</p>
            <p className={"text-3xl font-extrabold mt-1 " + c}>{v}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        <Link to="/suporte/novo-chamado" className="flex items-center justify-center gap-3 rounded-xl bg-[#16A34A] hover:brightness-110 py-5 text-lg font-bold">
          <PlusCircle size={24} />+ Abrir Novo Chamado
        </Link>
        <Link to="/suporte/chamados" className="flex items-center justify-center gap-3 rounded-xl bg-[#1A56DB] hover:bg-[#38BDF8] py-5 text-lg font-bold">
          <Ticket size={24} />Meus Chamados
        </Link>
      </div>
    </div>
  );
};

export default PortalDashboard;
