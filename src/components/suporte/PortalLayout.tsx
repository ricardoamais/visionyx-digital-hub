import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, Ticket, PlusCircle, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface PortalUser {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  setor: string | null;
  cargo: string | null;
  perfil: string;
  cliente_id: string;
  filial_id: string;
  cliente_nome: string;
  filial_nome: string;
}

export const perfilLabel: Record<string, string> = {
  usuario_filial: "Usuário da Filial",
  admin_filial: "Administrador da Filial",
  admin_cliente: "Administrador Cliente",
  tecnico_visionyx: "Técnico Visionyx",
  admin_visionyx: "Administrador Visionyx",
};

const Ctx = createContext<{ user: PortalUser; reload: () => Promise<void> } | null>(null);
export const usePortal = () => useContext(Ctx)!;

export async function carregarUsuarioPortal(): Promise<PortalUser | null> {
  const { data } = await supabase.rpc("link_suporte_account");
  const row = Array.isArray(data) ? data[0] : null;
  if (!row || row.status !== "ativo" || !row.cliente_id || !row.filial_id) return null;
  const [u, c, f] = await Promise.all([
    supabase.from("suporte_usuarios").select("id, nome, email, telefone, setor, cargo, perfil").eq("id", row.id).maybeSingle(),
    supabase.from("suporte_clientes").select("nome").eq("id", row.cliente_id).maybeSingle(),
    supabase.from("suporte_filiais").select("nome").eq("id", row.filial_id).maybeSingle(),
  ]);
  if (!u.data) return null;
  return { ...u.data, cliente_id: row.cliente_id, filial_id: row.filial_id, cliente_nome: c.data?.nome ?? "", filial_nome: f.data?.nome ?? "" };
}

const menu = [
  { to: "/suporte/dashboard", label: "Dashboard", icon: Home },
  { to: "/suporte/chamados", label: "Meus Chamados", icon: Ticket },
  { to: "/suporte/novo-chamado", label: "Abrir Chamado", icon: PlusCircle },
  { to: "/suporte/perfil", label: "Meu Perfil", icon: User },
];

const PortalLayout = () => {
  const nav = useNavigate();
  const [user, setUser] = useState<PortalUser | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return nav("/suporte", { replace: true });
    const u = await carregarUsuarioPortal();
    if (!u) {
      await supabase.auth.signOut();
      return nav("/suporte?erro=sem-acesso", { replace: true });
    }
    setUser(u);
    setLoading(false);
  }, [nav]);

  useEffect(() => { reload(); }, [reload]);

  const sair = async () => {
    await supabase.auth.signOut();
    nav("/suporte", { replace: true });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1F3F]">
        <div className="w-8 h-8 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold transition-colors " +
    (isActive ? "bg-[#1A56DB] text-white" : "text-white/70 hover:bg-white/10 hover:text-white");

  return (
    <Ctx.Provider value={{ user, reload }}>
      <div className="min-h-screen bg-[#0A1F3F] text-white md:flex">
        <aside className="md:w-64 md:min-h-screen border-b md:border-b-0 md:border-r border-white/10 bg-[#0F2D5C]">
          <div className="px-5 h-16 flex items-center font-extrabold uppercase">
            Visionyx <span className="ml-2 text-[#38BDF8] text-xs tracking-[0.3em]">Suporte</span>
          </div>
          <nav className="hidden md:flex flex-col gap-1 px-3 pb-6">
            {menu.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={linkCls}><Icon size={20} />{label}</NavLink>
            ))}
            <button onClick={sair} className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold text-white/70 hover:bg-white/10 hover:text-white">
              <LogOut size={20} />Sair
            </button>
          </nav>
        </aside>
        <main className="flex-1 px-4 py-6 md:px-8 pb-28 md:pb-8">
          <Outlet />
        </main>
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-5 border-t border-white/10 bg-[#0F2D5C]">
          {menu.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => "flex flex-col items-center gap-1 py-3 text-[11px] " + (isActive ? "text-[#38BDF8]" : "text-white/60")}>
              <Icon size={22} />{label.replace("Meus ", "").replace("Abrir ", "Novo ")}
            </NavLink>
          ))}
          <button onClick={sair} className="flex flex-col items-center gap-1 py-3 text-[11px] text-white/60"><LogOut size={22} />Sair</button>
        </nav>
      </div>
    </Ctx.Provider>
  );
};

export default PortalLayout;
