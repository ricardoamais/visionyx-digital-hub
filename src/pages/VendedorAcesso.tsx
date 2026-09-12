import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface VendedorRow {
  id: string;
  nome: string;
  email: string;
  status: string;
}

const VendedorAcesso = () => {
  const [checking, setChecking] = useState(true);
  const [vendedor, setVendedor] = useState<VendedorRow | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);
  const [blocked, setBlocked] = useState<string | null>(null);

  const check = useCallback(async () => {
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) {
      setVendedor(null);
      setBlocked(null);
      setChecking(false);
      return;
    }
    const { data } = await supabase.rpc("link_vendedor_account");
    const row = Array.isArray(data) ? (data[0] as VendedorRow | undefined) : undefined;
    if (!row) {
      setVendedor(null);
      setBlocked("Esta conta não está liberada. Fale com o administrador.");
    } else if (row.status !== "ativo") {
      setVendedor(null);
      setBlocked("Seu acesso está inativo. Fale com o administrador.");
    } else {
      setVendedor(row);
      setBlocked(null);
    }
    setChecking(false);
  }, []);

  useEffect(() => {
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      setTimeout(check, 0);
    });
    return () => sub.subscription.unsubscribe();
  }, [check]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/vendedor` },
          });
    setBusy(false);
    if (error) {
      toast({ title: "Não foi possível continuar", description: error.message, variant: "destructive" });
      return;
    }
    if (mode === "signup") {
      toast({ title: "Confira seu e-mail", description: "Enviamos um link para confirmar sua conta." });
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Carregando...</p>
      </div>
    );
  }

  if (vendedor) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">Olá, {vendedor.nome}</h1>
          <p className="text-slate-500 mt-1 break-words">{vendedor.email}</p>
          <p className="mt-4 inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 text-sm px-3 py-1">
            Acesso ativo
          </p>
          <button
            className="mt-8 text-sm text-slate-500 underline"
            onClick={async () => {
              await supabase.auth.signOut();
              await check();
            }}
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Área do Vendedor</h1>
        <p className="text-sm text-slate-500 mt-1 mb-6">Visionyx Smart Tag</p>

        {blocked ? (
          <div className="space-y-4">
            <p className="text-sm text-red-600">{blocked}</p>
            <button
              className="text-sm text-slate-500 underline"
              onClick={async () => {
                await supabase.auth.signOut();
                await check();
              }}
            >
              Sair
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail cadastrado"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium disabled:opacity-60"
            >
              {mode === "login" ? "Entrar" : "Criar minha conta"}
            </button>
            <button
              type="button"
              className="w-full text-sm text-slate-500 underline"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Primeiro acesso? Criar conta" : "Já tenho conta"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default VendedorAcesso;
