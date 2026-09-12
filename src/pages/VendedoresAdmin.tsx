import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Vendedor {
  id: string;
  nome: string;
  email: string;
  status: string;
  user_id: string | null;
  created_at: string;
}

const VendedoresAdmin = () => {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [list, setList] = useState<Vendedor[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("vendedores")
      .select("id, nome, email, status, user_id, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
      return;
    }
    setList((data ?? []) as Vendedor[]);
  }, []);

  const check = useCallback(async () => {
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", sess.session.user.id)
      .eq("role", "admin")
      .maybeSingle();
    const admin = !!roles;
    setIsAdmin(admin);
    setChecking(false);
    if (admin) await load();
  }, [load]);

  useEffect(() => {
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => setTimeout(check, 0));
    return () => sub.subscription.unsubscribe();
  }, [check]);

  const addVendedor = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase
      .from("vendedores")
      .insert({ nome: nome.trim(), email: email.trim().toLowerCase(), status: "ativo" });
    setBusy(false);
    if (error) {
      toast({ title: "Não foi possível cadastrar", description: error.message, variant: "destructive" });
      return;
    }
    setNome("");
    setEmail("");
    toast({ title: "Vendedor cadastrado", description: "Peça para ele criar a conta em /vendedor." });
    load();
  };

  const toggleStatus = async (v: Vendedor) => {
    const next = v.status === "ativo" ? "inativo" : "ativo";
    const patch: Record<string, unknown> = { status: next };
    if (next === "inativo") patch.user_id = null;
    const { error } = await supabase.from("vendedores").update(patch).eq("id", v.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    load();
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Carregando...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <h1 className="text-xl font-bold text-slate-900">Acesso restrito</h1>
          <p className="text-sm text-slate-500 mt-2">
            Entre com a conta de administrador em <a className="underline" href="/smart-tag-admin">/smart-tag-admin</a> e volte para esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendedores</h1>
          <p className="text-sm text-slate-500">Cadastro e acesso dos vendedores.</p>
        </div>

        <form onSubmit={addVendedor} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 grid gap-3 sm:grid-cols-3">
          <input
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
          <button disabled={busy} className="rounded-lg bg-blue-600 text-white px-4 py-2 font-medium disabled:opacity-60">
            Cadastrar
          </button>
        </form>

        <div className="space-y-3">
          {list.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 break-words">{v.nome}</p>
                <p className="text-sm text-slate-500 break-all">{v.email}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {v.user_id ? "Conta vinculada" : "Aguardando criação da conta"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    v.status === "ativo" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {v.status}
                </span>
                <button onClick={() => toggleStatus(v)} className="text-sm text-blue-600 underline">
                  {v.status === "ativo" ? "Desativar" : "Ativar"}
                </button>
              </div>
            </div>
          ))}
          {list.length === 0 && <p className="text-sm text-slate-500">Nenhum vendedor cadastrado.</p>}
        </div>
      </div>
    </div>
  );
};

export default VendedoresAdmin;
