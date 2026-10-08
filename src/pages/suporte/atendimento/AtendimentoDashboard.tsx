import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Cont = { abertos: number; em_atendimento: number; aguardando: number; resolvidos: number; urgentes: number; total: number };
type Fil = { filial_id: string; codigo: string; nome: string; abertos: number; em_atendimento: number; aguardando: number; urgentes: number; resolvidos: number };

const AtendimentoDashboard = () => {
  const [clientes, setClientes] = useState<{ id: string; nome: string }[]>([]);
  const [cliente, setCliente] = useState("");
  const [c, setC] = useState<Cont | null>(null);
  const [fils, setFils] = useState<Fil[]>([]);

  useEffect(() => {
    supabase.from("suporte_clientes").select("id, nome").order("nome").then(({ data }) => {
      setClientes(data ?? []);
      const darka = data?.find((x) => /darka/i.test(x.nome)) ?? data?.[0];
      if (darka) setCliente(darka.id);
    });
  }, []);

  const load = useCallback(async () => {
    const r = await supabase.rpc("suporte_contadores", { _cliente: cliente || null });
    setC((Array.isArray(r.data) ? r.data[0] : null) as Cont | null);
    if (cliente) {
      const f = await supabase.rpc("suporte_visao_filiais", { _cliente: cliente });
      setFils((f.data as Fil[]) ?? []);
    }
  }, [cliente]);

  useEffect(() => {
    load();
    const ch = supabase.channel("dash-chamados")
      .on("postgres_changes", { event: "*", schema: "public", table: "suporte_chamados" }, () => load()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  const cards: [string, keyof Cont, string][] = [
    ["Chamados Abertos", "abertos", "Aberto"], ["Em Atendimento", "em_atendimento", "Em atendimento"],
    ["Aguardando Cliente", "aguardando", "Aguardando cliente"], ["Resolvidos", "resolvidos", "Resolvido"],
    ["Urgentes", "urgentes", ""], ["Total", "total", ""],
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold">Painel de Atendimento</h1>
        <select value={cliente} onChange={(e) => setCliente(e.target.value)} className="rounded-lg border border-white/15 bg-[#0F2D5C] px-3 py-2 text-sm">
          {clientes.map((x) => <option key={x.id} value={x.id}>{x.nome}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map(([l, k, st]) => (
          <Link key={k} to={`/suporte/admin/chamados?${new URLSearchParams({ ...(cliente && { cliente }), ...(st && { status: st }), ...(k === "urgentes" && { prioridade: "Urgente" }) })}`}
            className={`rounded-xl border p-4 hover:border-[#38BDF8] ${k === "urgentes" ? "border-red-400/40 bg-red-500/10" : "border-white/10 bg-white/5"}`}>
            <p className="text-xs text-white/60">{l}</p>
            <p className="text-3xl font-extrabold mt-1">{c ? c[k] : "—"}</p>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3">Visão por Filial</h2>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-white/60">
            <tr><th className="p-3">Filial</th><th className="p-3">Abertos</th><th className="p-3">Em atendimento</th><th className="p-3">Aguardando</th><th className="p-3">Urgentes</th><th className="p-3">Resolvidos</th></tr>
          </thead>
          <tbody>
            {fils.length === 0 && <tr><td colSpan={6} className="p-4 text-white/50">Nenhuma filial cadastrada.</td></tr>}
            {fils.map((f) => (
              <tr key={f.filial_id} className="border-t border-white/10 hover:bg-white/5">
                <td className="p-3"><Link className="text-[#38BDF8] hover:underline" to={`/suporte/admin/chamados?cliente=${cliente}&filial=${f.filial_id}`}>{f.codigo} — {f.nome}</Link></td>
                <td className="p-3">{f.abertos}</td><td className="p-3">{f.em_atendimento}</td><td className="p-3">{f.aguardando}</td>
                <td className={`p-3 ${f.urgentes ? "font-bold text-red-300" : ""}`}>{f.urgentes}</td><td className="p-3">{f.resolvidos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AtendimentoDashboard;
