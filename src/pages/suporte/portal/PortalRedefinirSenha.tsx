import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const PortalRedefinirSenha = () => {
  const nav = useNavigate();
  const [senha, setSenha] = useState("");
  const [conf, setConf] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha !== conf) return setErro("As senhas não conferem.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setBusy(false);
    if (error) return setErro("Link expirado ou inválido. Solicite um novo em \"Esqueci minha senha\".");
    toast({ title: "Senha alterada", description: "Faça login com a nova senha." });
    await supabase.auth.signOut();
    nav("/suporte", { replace: true });
  };

  const input = "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/40";
  return (
    <div className="min-h-screen bg-[#0A1F3F] text-white flex items-center justify-center px-4">
      <form onSubmit={salvar} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0F2D5C] p-6 sm:p-8 space-y-4">
        <h1 className="text-2xl font-extrabold">Criar nova senha</h1>
        <input className={input} type="password" required minLength={6} placeholder="Nova senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
        <input className={input} type="password" required minLength={6} placeholder="Confirme a nova senha" value={conf} onChange={(e) => setConf(e.target.value)} />
        {erro && <p className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200">{erro}</p>}
        <button disabled={busy} className="w-full rounded-lg bg-[#1A56DB] hover:bg-[#38BDF8] py-3.5 font-bold disabled:opacity-60">
          {busy ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </div>
  );
};

export default PortalRedefinirSenha;
