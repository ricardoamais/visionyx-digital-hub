import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Printer } from "lucide-react";

type Ch = {
  id: string; protocolo: string | null; created_at: string; resolvido_em: string | null; status: string;
  prioridade: string; categoria: string; assunto: string; filial_id: string;
  suporte_filiais: { codigo: string; nome: string } | null;
};

const CORES = ["#38BDF8", "#F59E0B", "#16A34A", "#EF4444", "#A855F7", "#EC4899", "#14B8A6", "#F97316", "#1A56DB", "#84CC16", "#EAB308", "#6366F1"];
const hoje = () => new Date().toISOString().slice(0, 10);
const menos30 = () => new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);

const AtendimentoRelatorio = () => {
  const [clientes, setClientes] = useState<{ id: string; nome: string }[]>([]);
  const [cliente, setCliente] = useState("");
  const [desde, setDesde] = useState(menos30());
  const [ate, setAte] = useState(hoje());
  const [rows, setRows] = useState<Ch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("suporte_clientes").select("id, nome").order("nome").then(({ data }) => {
      setClientes(data ?? []);
      const d = data?.find((x) => /darka/i.test(x.nome)) ?? data?.[0];
      if (d) setCliente(d.id);
    });
  }, []);

  useEffect(() => {
    if (!cliente) return;
    setLoading(true);
    supabase.from("suporte_chamados")
      .select("id, protocolo, created_at, resolvido_em, status, prioridade, categoria, assunto, filial_id, suporte_filiais(codigo, nome)")
      .eq("cliente_id", cliente).gte("created_at", `${desde}T00:00:00`).lte("created_at", `${ate}T23:59:59`)
      .order("created_at", { ascending: false }).limit(5000)
      .then(({ data }) => { setRows((data as unknown as Ch[]) ?? []); setLoading(false); });
  }, [cliente, desde, ate]);

  const k = useMemo(() => {
    const cont = (f: (c: Ch) => string) => {
      const m = new Map<string, number>();
      rows.forEach((c) => m.set(f(c), (m.get(f(c)) ?? 0) + 1));
      return [...m.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    };
    const resolvidos = rows.filter((c) => ["Resolvido", "Fechado"].includes(c.status));
    const tempos = resolvidos.filter((c) => c.resolvido_em).map((c) => (+new Date(c.resolvido_em!) - +new Date(c.created_at)) / 36e5);
    const media = tempos.length ? tempos.reduce((a, b) => a + b, 0) / tempos.length : 0;
    const filial = (c: Ch) => c.suporte_filiais ? `${c.suporte_filiais.codigo} - ${c.suporte_filiais.nome}` : "—";
    const porDia = new Map<string, number>();
    rows.forEach((c) => { const d = c.created_at.slice(5, 10).split("-").reverse().join("/"); porDia.set(d, (porDia.get(d) ?? 0) + 1); });
    return {
      total: rows.length, resolvidos: resolvidos.length,
      pendentes: rows.length - resolvidos.length,
      urgentes: rows.filter((c) => c.prioridade === "Urgente").length,
      taxa: rows.length ? Math.round((resolvidos.length / rows.length) * 100) : 0,
      media,
      categorias: cont((c) => c.categoria),
      filiais: cont(filial),
      status: cont((c) => c.status),
      prioridades: cont((c) => c.prioridade),
      dias: [...porDia.entries()].reverse().map(([name, value]) => ({ name, value })),
      filialCat: (() => {
        const m = new Map<string, { filial: string; total: number; cats: Map<string, number>; pend: number }>();
        rows.forEach((c) => {
          const f = filial(c); const e = m.get(f) ?? { filial: f, total: 0, cats: new Map(), pend: 0 };
          e.total++; e.cats.set(c.categoria, (e.cats.get(c.categoria) ?? 0) + 1);
          if (!["Resolvido", "Fechado"].includes(c.status)) e.pend++;
          m.set(f, e);
        });
        return [...m.values()].sort((a, b) => b.total - a.total).map((e) => ({
          ...e, principal: [...e.cats.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—",
        }));
      })(),
    };
  }, [rows]);

  const nomeCliente = clientes.find((c) => c.id === cliente)?.nome ?? "";
  const fmt = (d: string) => d.split("-").reverse().join("/");
  const horas = (h: number) => h < 1 ? `${Math.round(h * 60)} min` : h < 48 ? `${h.toFixed(1)} h` : `${(h / 24).toFixed(1)} dias`;
  const card = "rounded-xl border border-white/10 bg-white/5 p-4 bi-card";
  const tip = { contentStyle: { background: "#0F2D5C", border: "1px solid #38BDF8", borderRadius: 8, color: "#fff" } };

  return (
    <div className="bi-report">
      <style>{`@media print {
        @page { size: A4 landscape; margin: 10mm; }
        body * { visibility: hidden; } .bi-report, .bi-report * { visibility: visible; }
        .bi-report { position: absolute; left: 0; top: 0; width: 100%; color: #0A1F3F !important; background: #fff !important; }
        .bi-noprint { display: none !important; } .bi-card { background: #fff !important; border-color: #cbd5e1 !important; break-inside: avoid; }
        .bi-report p, .bi-report h1, .bi-report h2, .bi-report td, .bi-report th, .bi-report span { color: #0A1F3F !important; }
        .bi-printhead { display: flex !important; }
      }`}</style>

      <div className="bi-printhead hidden items-center justify-between border-b-2 border-[#1A56DB] pb-2 mb-4">
        <span className="font-extrabold text-lg">VISIONYX INFORMÁTICA — Relatório de Atendimento</span>
        <span className="text-sm">Emitido em {new Date().toLocaleDateString("pt-BR")}</span>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Relatório Gerencial (B.I.)</h1>
          <p className="text-sm text-white/60">{nomeCliente} · {fmt(desde)} a {fmt(ate)}</p>
        </div>
        <div className="bi-noprint flex flex-wrap items-end gap-2">
          <select value={cliente} onChange={(e) => setCliente(e.target.value)} className="rounded-lg border border-white/15 bg-[#0F2D5C] px-3 py-2 text-sm">
            {clientes.map((x) => <option key={x.id} value={x.id}>{x.nome}</option>)}
          </select>
          <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="rounded-lg border border-white/15 bg-[#0F2D5C] px-3 py-2 text-sm" />
          <input type="date" value={ate} onChange={(e) => setAte(e.target.value)} className="rounded-lg border border-white/15 bg-[#0F2D5C] px-3 py-2 text-sm" />
          <button onClick={() => { setDesde(menos30()); setAte(hoje()); }} className="rounded-lg border border-white/15 px-3 py-2 text-sm">Últimos 30 dias</button>
          <button onClick={() => window.print()} className="flex items-center gap-2 rounded-lg bg-[#1A56DB] px-4 py-2 text-sm font-semibold text-white"><Printer size={16} />Imprimir / PDF</button>
        </div>
      </div>

      {loading ? <p className="text-white/60">Carregando...</p> : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            {[["Total de chamados", k.total], ["Resolvidos", k.resolvidos], ["Pendentes", k.pendentes], ["Urgentes", k.urgentes],
              ["Taxa de resolução", `${k.taxa}%`], ["Tempo médio p/ resolver", k.media ? horas(k.media) : "—"]].map(([l, v]) => (
              <div key={l as string} className={card}><p className="text-xs text-white/60">{l}</p><p className="text-2xl font-extrabold mt-1 text-[#38BDF8]">{v}</p></div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mb-4">
            <div className={card}>
              <h2 className="font-bold mb-2">Problemas mais frequentes</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={k.categorias} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
                  <XAxis type="number" allowDecimals={false} stroke="#94a3b8" fontSize={11} />
                  <YAxis type="category" dataKey="name" width={120} stroke="#94a3b8" fontSize={11} />
                  <Tooltip {...tip} /><Bar dataKey="value" name="Chamados" radius={[0, 4, 4, 0]}>{k.categorias.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className={card}>
              <h2 className="font-bold mb-2">Chamados por filial (top 10)</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={k.filiais.slice(0, 10)} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
                  <XAxis type="number" allowDecimals={false} stroke="#94a3b8" fontSize={11} />
                  <YAxis type="category" dataKey="name" width={150} stroke="#94a3b8" fontSize={11} />
                  <Tooltip {...tip} /><Bar dataKey="value" name="Chamados" radius={[0, 4, 4, 0]}>{k.filiais.slice(0, 10).map((_, i) => <Cell key={i} fill={CORES[(i + 3) % CORES.length]} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className={card}>
              <h2 className="font-bold mb-2">Status</h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart><Pie data={k.status} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} label>
                  {k.status.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}</Pie><Legend /><Tooltip {...tip} /></PieChart>
              </ResponsiveContainer>
            </div>
            <div className={card}>
              <h2 className="font-bold mb-2">Chamados por dia</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={k.dias}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} /><YAxis allowDecimals={false} stroke="#94a3b8" fontSize={11} />
                  <Tooltip {...tip} /><Bar dataKey="value" name="Chamados" fill="#16A34A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={card}>
            <h2 className="font-bold mb-3">Resumo por filial</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-white/60 border-b border-white/10">
                  <th className="py-2 pr-3">Filial</th><th className="py-2 pr-3">Chamados</th><th className="py-2 pr-3">Pendentes</th><th className="py-2">Problema principal</th>
                </tr></thead>
                <tbody>
                  {k.filialCat.map((f) => (
                    <tr key={f.filial} className="border-b border-white/5">
                      <td className="py-2 pr-3">{f.filial}</td><td className="py-2 pr-3 font-bold">{f.total}</td>
                      <td className="py-2 pr-3">{f.pend}</td><td className="py-2">{f.principal}</td>
                    </tr>
                  ))}
                  {!k.filialCat.length && <tr><td colSpan={4} className="py-4 text-white/60">Nenhum chamado no período.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AtendimentoRelatorio;
