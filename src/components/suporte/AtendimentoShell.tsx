import { useCallback, useEffect, useState } from "react";
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, LayoutDashboard, ListChecks, LogOut } from "lucide-react";
import { SupportThemeToggle } from "./SupportAppearance";
import darkaLogo from "@/assets/tintas-darka-logo.png.asset.json";
import ChamadoNotifier from "./ChamadoNotifier";

/** Painel de Atendimento: só Administrador/Técnico Visionyx (o banco também bloqueia). */
const AtendimentoShell = () => {
  const loc = useLocation();
  const [state, setState] = useState<"loading" | "login" | "cliente" | "ok">("loading");
  const [email, setEmail] = useState("");
  const [darka, setDarka] = useState(false);

  const check = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return setState("login");
    setEmail(data.user.email ?? "");
    await supabase.rpc("link_suporte_account");
    const { data: staff } = await supabase.rpc("suporte_is_staff");
    if (staff) {
      const { data: cls } = await supabase.from("suporte_clientes").select("nome");
      setDarka(!!cls?.length && cls.every((c) => /darka/i.test(c.nome ?? "")));
    }
    setState(staff ? "ok" : "cliente");
  }, []);

  useEffect(() => { check(); }, [check]);

  if (state === "loading") return <div className="min-h-screen bg-[#0A1F3F] text-white/60 p-8">Carregando...</div>;
  if (state === "login") return <Navigate to="/suporte" replace />;
  if (state === "cliente") {
    const m = loc.pathname.match(/^\/suporte\/admin\/chamado\/([\w-]+)/);
    return <Navigate to={m ? `/suporte/chamado/${m[1]}` : "/suporte/dashboard"} replace />;
  }

  const link = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? "bg-[#1A56DB] text-white" : "text-white/70 hover:text-white"}`;

  return (
    <div data-brand={darka ? "darka" : undefined} className="min-h-screen bg-[#0A1F3F] text-white overflow-x-hidden break-words">
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {darka ? (
            <span className="flex items-center gap-2 font-extrabold uppercase"><img src={darkaLogo.url} alt="Tintas Darka" className="h-11 w-11 rounded-md bg-white object-contain p-0.5" /><span className="text-sm">Tintas Darka <span className="block text-[10px] tracking-[0.3em] text-[#38BDF8]">Atendimento</span></span></span>
          ) : (
            <span className="font-extrabold uppercase">Visionyx <span className="text-[#38BDF8] text-xs tracking-[0.3em]">Atendimento</span></span>
          )}
          <nav className="flex items-center gap-1">
            <SupportThemeToggle />
            <NavLink end to="/suporte/admin" className={link}><LayoutDashboard size={16} /><span className="hidden sm:inline">Dashboard</span></NavLink>
            <NavLink to="/suporte/admin/chamados" className={link}><ListChecks size={16} /><span className="hidden sm:inline">Todos os Chamados</span></NavLink>
            <NavLink to="/suporte/admin/relatorio" className={link}><BarChart3 size={16} /><span className="hidden sm:inline">Relatório B.I.</span></NavLink>
            {email && <span className="hidden lg:inline ml-2 max-w-48 truncate rounded-full border border-white/15 px-3 py-1 text-xs text-white/70" title={email}>{email}</span>}
            <button onClick={async () => { await supabase.auth.signOut(); setState("login"); }} className="ml-2 inline-flex items-center gap-1 text-sm text-white/60 hover:text-white" aria-label="Sair"><LogOut size={18} /><span className="hidden md:inline">Sair</span></button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6"><Outlet />
<ChamadoNotifier base="/suporte/admin" /></main>
    </div>
  );
};

export default AtendimentoShell;
