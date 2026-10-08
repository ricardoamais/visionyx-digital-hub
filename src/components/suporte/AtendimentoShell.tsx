import { useCallback, useEffect, useState } from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, ListChecks, LogOut } from "lucide-react";

/** Painel de Atendimento: só Administrador/Técnico Visionyx (o banco também bloqueia). */
const AtendimentoShell = () => {
  const [state, setState] = useState<"loading" | "login" | "cliente" | "ok">("loading");

  const check = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return setState("login");
    await supabase.rpc("link_suporte_account");
    const { data: staff } = await supabase.rpc("suporte_is_staff");
    setState(staff ? "ok" : "cliente");
  }, []);

  useEffect(() => { check(); }, [check]);

  if (state === "loading") return <div className="min-h-screen bg-[#0A1F3F] text-white/60 p-8">Carregando...</div>;
  if (state === "login") return <Navigate to="/suporte" replace />;
  if (state === "cliente") return <Navigate to="/suporte/dashboard" replace />;

  const link = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? "bg-[#1A56DB] text-white" : "text-white/70 hover:text-white"}`;

  return (
    <div className="min-h-screen bg-[#0A1F3F] text-white">
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <span className="font-extrabold uppercase">Visionyx <span className="text-[#38BDF8] text-xs tracking-[0.3em]">Atendimento</span></span>
          <nav className="flex items-center gap-1">
            <NavLink end to="/suporte/admin" className={link}><LayoutDashboard size={16} /><span className="hidden sm:inline">Dashboard</span></NavLink>
            <NavLink to="/suporte/admin/chamados" className={link}><ListChecks size={16} /><span className="hidden sm:inline">Todos os Chamados</span></NavLink>
            <button onClick={async () => { await supabase.auth.signOut(); setState("login"); }} className="ml-2 text-white/60 hover:text-white" aria-label="Sair"><LogOut size={18} /></button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6"><Outlet /></main>
    </div>
  );
};

export default AtendimentoShell;
