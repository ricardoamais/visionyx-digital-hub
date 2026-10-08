import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { usePortal, perfilLabel } from "@/components/suporte/PortalLayout";

const input = "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-base text-white";

const PortalPerfil = () => {
  const { user, reload } = usePortal();
  const [f, setF] = useState({ nome: user.nome, telefone: user.telefone ?? "", setor: user.setor ?? "", cargo: user.cargo ?? "" });
  const [busy, setBusy] = useState(false);

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.rpc("suporte_atualizar_meu_perfil", { _nome: f.nome, _telefone: f.telefone, _setor: f.setor, _cargo: f.cargo });
    setBusy(false);
    if (error) return toast({ title: "Não foi possível salvar", description: "Verifique o nome e tente novamente.", variant: "destructive" });
    toast({ title: "Perfil atualizado" });
    reload();
  };

  const fixo = (l: string, v: string) => (
    <div><p className="text-sm text-white/60">{l}</p><p className="font-semibold">{v}</p></div>
  );

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-extrabold mb-4">Meu Perfil</h1>
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 grid sm:grid-cols-2 gap-4 mb-6">
        {fixo("E-mail", user.email)}
        {fixo("Cliente", user.cliente_nome)}
        {fixo("Filial", user.filial_nome)}
        {fixo("Perfil", perfilLabel[user.perfil] ?? user.perfil)}
        <p className="sm:col-span-2 text-xs text-white/50">Cliente, filial e perfil são definidos pela Visionyx.</p>
      </div>
      <form onSubmit={salvar} className="space-y-3">
        {([["nome", "Nome"], ["telefone", "WhatsApp/telefone"], ["setor", "Setor"], ["cargo", "Cargo"]] as const).map(([k, l]) => (
          <label key={k} className="block">
            <span className="text-sm text-white/60">{l}</span>
            <input className={input} required={k === "nome"} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
          </label>
        ))}
        <button disabled={busy} className="w-full rounded-lg bg-[#1A56DB] hover:bg-[#38BDF8] py-3.5 font-bold disabled:opacity-60">
          {busy ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
};

export default PortalPerfil;
