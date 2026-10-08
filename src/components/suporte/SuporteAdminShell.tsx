import { ReactNode, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const inputCls =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40";
export const btnCls =
  "rounded-lg bg-[#1A56DB] hover:bg-[#38BDF8] px-4 py-2 text-sm font-bold text-white transition-colors disabled:opacity-60";

const SuporteAdminShell = ({ title, back, children }: { title: string; back?: { to: string; label: string }; children: ReactNode }) => {
  const [state, setState] = useState<"loading" | "login" | "denied" | "ok">("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const check = useCallback(async () => {
    const { data: s } = await supabase.auth.getSession();
    if (!s.session) return setState("login");
    const { data } = await supabase.rpc("suporte_is_admin");
    setState(data ? "ok" : "denied");
  }, []);

  useEffect(() => {
    check();
    const { data } = supabase.auth.onAuthStateChange(() => setTimeout(check, 0));
    return () => data.subscription.unsubscribe();
  }, [check]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast({ title: "Falha no login", description: error.message, variant: "destructive" });
  };

  return (
    <div className="min-h-screen bg-[#0A1F3F] text-white">
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/central-de-suporte" className="font-extrabold uppercase">
            Visionyx <span className="text-[#38BDF8] text-xs tracking-[0.3em]">Suporte</span>
          </Link>
          {state === "ok" && (
            <button className="text-sm text-white/60 hover:text-white" onClick={() => supabase.auth.signOut()}>Sair</button>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {back && <Link to={back.to} className="text-sm text-[#38BDF8]">← {back.label}</Link>}
        <h1 className="text-2xl md:text-3xl font-extrabold mt-2 mb-6">{title}</h1>
        {state === "loading" && <p className="text-white/60">Carregando...</p>}
        {state === "denied" && <p className="text-red-300">Acesso restrito ao Administrador Visionyx.</p>}
        {state === "login" && (
          <form onSubmit={login} className="max-w-sm space-y-3">
            <input className={inputCls} type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className={inputCls} type="password" required placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className={btnCls + " w-full"}>Entrar</button>
          </form>
        )}
        {state === "ok" && children}
      </main>
    </div>
  );
};

export default SuporteAdminShell;
