import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, CheckCircle2, Clock, Inbox, Layers, Search, Wrench, ArrowUpDown, Building2 } from "lucide-react";

type Cont = { abertos: number; em_atendimento: number; aguardando: number; resolvidos: number; urgentes: number; total: number };
type Fil = { filial_id: string; codigo: string; nome: string; abertos: number; em_atendimento: number; aguardando: number; urgentes: number; resolvidos: number };
type Ch = { status: string; prioridade: string; created_at: string; resolvido_em: string | null };

const COR = { aberto: "#3B82F6", atend: "#38BDF8", aguard: "#F59E0B", resolv: "#16A34A", urg: "#EF4444", total: "#A78BFA" };
const PRIO_COR: Record<string, string> = { Baixa: "#22C55E", Média: "#3B82F6", Media: "#3B82F6", Alta: "#F59E0B", Urgente: "#EF4444" };
const STATUS_COR = ["#3B82F6", "#38BDF8", "#F59E0B", "#16A34A", "#64748B", "#A78BFA", "#EC4899"];
const tip = { contentStyle: { background: "#0F2D5C", border: "1px solid rgba(255,255,255,.15)", borderRadius: 8, color: "#fff" } };
type SortKey = "nome" | "abertos" | "em_atendimento" | "aguardando" | "urgentes" | "resolvidos" | "total";
const PAGE = 15;

const AtendimentoDashboard = () => {
  const nav = useNavigate();
  const [clientes, setClientes] = useState<{ id: string; nome: string }[]>([]);
  const [cliente, setCliente] = useState("");
  const [c, setC] = useState<Cont | null>(null);
  const [fils, setFils] = useState<Fil[]>([]);
  const [chs, setChs] = useState<Ch[]>([]);
  const [loading, setLoading] = useState(true);
  const [dias, setDias] = useState(30);
  const [q, setQ] = useState("");
  const [sit, setSit] = useState("");
  const [sort, setSort] = useState<{ k: SortKey; d: 1 | -1 }>({ k: "urgentes", d: -1 });
  const [page, setPage] = useState(0);

  useEffect(() => {
    supabase.from("suporte_clientes").select("id, nome").order("nome").then(({ data }) => {
      setClientes(data ?? []);
      const darka = data?.find((x) => /darka/i.test(x.nome)) ?? data?.[0];
      if (darka) setCliente(darka.id);
    });
  }, []);

  const load = useCallback(async () => {
    const desde = new Date(Date.now() - dias * 864e5).toISOString();
    let chq = supabase.from("suporte_chamados").select("status, prioridade, created_at, resolvido_em").gte("created_at", desde).limit(5000);
    if (cliente) chq = chq.eq("cliente_id", cliente);
    const [r, f, h] = await Promise.all([
      supabase.rpc("suporte_contadores", { _cliente: cliente || null }),
      cliente ? supabase.rpc("suporte_visao_filiais", { _cliente: cliente }) : Promise.resolve({ data: [] as Fil[] }),
      chq,
    ]);
    setC((Array.isArray(r.data) ? r.data[0] : null) as Cont | null);
    setFils((f.data as Fil[]) ?? []);
    setChs((h.data as Ch[]) ?? []);
    setLoading(false);
  }, [cliente, dias]);

  useEffect(() => {
    load();
    const ch = supabase.channel("dash-chamados")
      .on("postgres_changes", { event: "*", schema: "public", table: "suporte_chamados" }, () => load()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  const cards: { l: string; k: keyof Cont; st: string; d: string; cor: string; Icon: typeof Inbox }[] = [
    { l: "Chamados Abertos", k: "abertos", st: "Aberto", d: "Aguardando técnico", cor: COR.aberto, Icon: Inbox },
    { l: "Em Atendimento", k: "em_atendimento", st: "Em atendimento", d: "Sendo resolvidos", cor: COR.atend, Icon: Wrench },
    { l: "Aguardando Cliente", k: "aguardando", st: "Aguardando cliente", d: "Retorno da filial", cor: COR.aguard, Icon: Clock },
    { l: "Resolvidos", k: "resolvidos", st: "Resolvido", d: "Concluídos", cor: COR.resolv, Icon: CheckCircle2 },
    { l: "Urgentes", k: "urgentes", st: "", d: "Prioridade máxima", cor: COR.urg, Icon: AlertTriangle },
    { l: "Total de Chamados", k: "total", st: "", d: "Todos os registros", cor: COR.total, Icon: Layers },
  ];

  const statusData = useMemo(() => {
    const m: Record<string, number> = {};
    chs.forEach((x) => (m[x.status] = (m[x.status] ?? 0) + 1));
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [chs]);
  const prioData = useMemo(() => {
    const m: Record<string, number> = {};
    chs.forEach((x) => (m[x.prioridade] = (m[x.prioridade] ?? 0) + 1));
    return ["Baixa", "Média", "Media", "Alta", "Urgente", ...Object.keys(m)].filter((v, i, a) => m[v] && a.indexOf(v) === i).map((name) => ({ name, value: m[name] }));
  }, [chs]);
  const evol = useMemo(() => {
    const out: { dia: string; Abertos: number; Resolvidos: number }[] = [];
    const idx: Record<string, number> = {};
    for (let i = dias - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5);
      const key = d.toISOString().slice(0, 10);
      idx[key] = out.length;
      out.push({ dia: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`, Abertos: 0, Resolvidos: 0 });
    }
    chs.forEach((x) => {
      const a = idx[x.created_at.slice(0, 10)]; if (a !== undefined) out[a].Abertos++;
      if (x.resolvido_em) { const b = idx[x.resolvido_em.slice(0, 10)]; if (b !== undefined) out[b].Resolvidos++; }
    });
    return out;
  }, [chs, dias]);
  const topFil = useMemo(() => fils.map((f) => ({ name: f.codigo, nome: f.nome, value: f.abertos + f.em_atendimento + f.aguardando + f.resolvidos }))
    .filter((f) => f.value > 0).sort((a, b) => b.value - a.value).slice(0, 10), [fils]);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return fils
      .map((f) => ({ ...f, total: f.abertos + f.em_atendimento + f.aguardando + f.resolvidos }))
      .filter((f) => !t || `${f.codigo} ${f.nome}`.toLowerCase().includes(t))
      .filter((f) => !sit || (f[sit as keyof Fil] as number) > 0)
      .sort((a, b) => {
        const va = sort.k === "nome" ? `${a.codigo}` : a[sort.k];
        const vb = sort.k === "nome" ? `${b.codigo}` : b[sort.k];
        return (va > vb ? 1 : va < vb ? -1 : 0) * sort.d;
      });
  }, [fils, q, sit, sort]);
  useEffect(() => setPage(0), [q, sit, cliente]);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const view = rows.slice(page * PAGE, page * PAGE + PAGE);
  const toggle = (k: SortKey) => setSort((s) => ({ k, d: s.k === k ? (s.d === 1 ? -1 : 1) : -1 }));
  const goFil = (id: string) => nav(`/suporte/admin/chamados?cliente=${cliente}&filial=${id}`);

  const Th = ({ k, children }: { k: SortKey; children: string }) => (
    <th className="p-3 font-semibold whitespace-nowrap">
      <button onClick={() => toggle(k)} className="inline-flex items-center gap-1 hover:text-[#38BDF8]">
        {children}<ArrowUpDown className={`h-3 w-3 ${sort.k === k ? "text-[#38BDF8]" : "opacity-40"}`} />
      </button>
    </th>
  );
  const Pill = ({ n, cor }: { n: number; cor: string }) => (
    <span className="inline-flex min-w-8 justify-center rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: n ? `${cor}26` : "transparent", color: n ? cor : "rgba(148,163,184,.6)" }}>{n}</span>
  );
  const Panel = ({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) => (
    <section className={`rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 min-w-0 ${className}`}>
      <h3 className="text-sm font-semibold text-white/80 mb-3">{title}</h3>
      {children}
    </section>
  );
  const Empty = () => <div className="h-56 grid place-items-center text-sm text-white/50">{loading ? "Carregando…" : "Sem dados no período."}</div>;

  return (
    <div className="font-sans space-y-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#38BDF8] font-semibold">Help Desk Visionyx</p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Painel de Atendimento</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <select aria-label="Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} className="rounded-lg border border-white/15 bg-[#0F2D5C] px-3 py-2 text-sm">
            {clientes.map((x) => <option key={x.id} value={x.id}>{x.nome}</option>)}
          </select>
          <select aria-label="Período" value={dias} onChange={(e) => setDias(Number(e.target.value))} className="rounded-lg border border-white/15 bg-[#0F2D5C] px-3 py-2 text-sm">
            {[7, 15, 30, 60, 90].map((d) => <option key={d} value={d}>Gráficos: últimos {d} dias</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {cards.map(({ l, k, st, d, cor, Icon }) => (
          <Link key={k} to={`/suporte/admin/chamados?${new URLSearchParams({ ...(cliente && { cliente }), ...(st && { status: st }), ...(k === "urgentes" && { prioridade: "Urgente" }) })}`}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:border-[#38BDF8]/60">
            <span className="absolute inset-x-0 top-0 h-1" style={{ background: cor }} />
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-white/70">{l}</p>
              <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${cor}22`, color: cor }}><Icon className="h-4 w-4" /></span>
            </div>
            <p className="text-3xl font-bold mt-2 tabular-nums" style={{ color: k === "urgentes" && c?.urgentes ? cor : undefined }}>{c ? c[k] : "—"}</p>
            <p className="text-[11px] text-white/50 mt-0.5">{d}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Distribuição por status">
          {statusData.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {statusData.map((_, i) => <Cell key={i} fill={STATUS_COR[i % STATUS_COR.length]} />)}
                </Pie>
                <Tooltip {...tip} /><Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <Empty />}
        </Panel>
        <Panel title="Chamados por prioridade">
          {prioData.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={prioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.15)" />
                <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 12 }} /><YAxis allowDecimals={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <Tooltip {...tip} cursor={{ fill: "rgba(56,189,248,.08)" }} />
                <Bar dataKey="value" name="Chamados" radius={[6, 6, 0, 0]}>
                  {prioData.map((p) => <Cell key={p.name} fill={PRIO_COR[p.name] ?? "#38BDF8"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <Empty />}
        </Panel>
        <Panel title={`Abertura x resolução — últimos ${dias} dias`}>
          {chs.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={evol}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.15)" />
                <XAxis dataKey="dia" tick={{ fill: "#94A3B8", fontSize: 11 }} minTickGap={16} /><YAxis allowDecimals={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <Tooltip {...tip} /><Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="Abertos" stroke={COR.aberto} fill={COR.aberto} fillOpacity={0.25} />
                <Area type="monotone" dataKey="Resolvidos" stroke={COR.resolv} fill={COR.resolv} fillOpacity={0.25} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <Empty />}
        </Panel>
        <Panel title="Top 10 filiais por chamados">
          {topFil.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topFil} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.15)" />
                <XAxis type="number" allowDecimals={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={44} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <Tooltip {...tip} labelFormatter={(_, p) => p?.[0]?.payload?.nome ?? ""} cursor={{ fill: "rgba(56,189,248,.08)" }} />
                <Bar dataKey="value" name="Chamados" radius={[0, 6, 6, 0]}>
                  {topFil.map((_, i) => <Cell key={i} fill={STATUS_COR[i % STATUS_COR.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <Empty />}
        </Panel>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2"><Building2 className="h-5 w-5 text-[#38BDF8]" />Visão por Filial <span className="text-xs font-normal text-white/50">({rows.length})</span></h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar filial…" className="w-full sm:w-56 rounded-lg border border-white/15 bg-[#0F2D5C] pl-9 pr-3 py-2 text-sm" />
            </label>
            <select aria-label="Situação" value={sit} onChange={(e) => setSit(e.target.value)} className="rounded-lg border border-white/15 bg-[#0F2D5C] px-3 py-2 text-sm">
              <option value="">Todas as situações</option>
              <option value="abertos">Com abertos</option><option value="em_atendimento">Em atendimento</option>
              <option value="aguardando">Aguardando cliente</option><option value="urgentes">Com urgentes</option><option value="resolvidos">Com resolvidos</option>
            </select>
          </div>
        </div>

        {view.length === 0 ? (
          <p className="p-6 text-center text-sm text-white/50">{loading ? "Carregando…" : fils.length ? "Nenhuma filial encontrada." : "Nenhuma filial cadastrada."}</p>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-left text-white/60">
                  <tr><Th k="nome">Filial</Th><Th k="abertos">Abertos</Th><Th k="em_atendimento">Em atendimento</Th><Th k="aguardando">Aguardando</Th><Th k="urgentes">Urgentes</Th><Th k="resolvidos">Resolvidos</Th><Th k="total">Total</Th></tr>
                </thead>
                <tbody>
                  {view.map((f) => (
                    <tr key={f.filial_id} onClick={() => goFil(f.filial_id)} className={`cursor-pointer border-t border-white/10 hover:bg-white/5 ${f.urgentes ? "bg-red-500/10 shadow-[inset_3px_0_0_#EF4444]" : ""}`}>
                      <td className="p-3"><Link onClick={(e) => e.stopPropagation()} className="text-[#38BDF8] hover:underline font-medium" to={`/suporte/admin/chamados?cliente=${cliente}&filial=${f.filial_id}`}>{f.codigo} — {f.nome}</Link></td>
                      <td className="p-3"><Pill n={f.abertos} cor={COR.aberto} /></td><td className="p-3"><Pill n={f.em_atendimento} cor={COR.atend} /></td>
                      <td className="p-3"><Pill n={f.aguardando} cor={COR.aguard} /></td><td className="p-3"><Pill n={f.urgentes} cor={COR.urg} /></td>
                      <td className="p-3"><Pill n={f.resolvidos} cor={COR.resolv} /></td><td className="p-3 font-bold tabular-nums">{f.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-2">
              {view.map((f) => (
                <button key={f.filial_id} onClick={() => goFil(f.filial_id)} className={`w-full text-left rounded-xl border p-3 ${f.urgentes ? "border-red-400/50 bg-red-500/10" : "border-white/10 bg-white/5"}`}>
                  <div className="flex justify-between gap-2"><span className="font-medium text-[#38BDF8] truncate">{f.codigo} — {f.nome}</span><span className="font-bold">{f.total}</span></div>
                  <div className="mt-2 grid grid-cols-5 gap-1 text-[10px] text-white/60 text-center">
                    {([["Abert.", f.abertos, COR.aberto], ["Atend.", f.em_atendimento, COR.atend], ["Aguard.", f.aguardando, COR.aguard], ["Urg.", f.urgentes, COR.urg], ["Resolv.", f.resolvidos, COR.resolv]] as const).map(([l, n, cr]) => (
                      <div key={l}><Pill n={n} cor={cr} /><div className="mt-0.5">{l}</div></div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
            {pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-4 text-sm">
                <button disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded-lg border border-white/15 px-3 py-1.5 disabled:opacity-40">Anterior</button>
                <span className="text-white/60">{page + 1} / {pages}</span>
                <button disabled={page >= pages - 1} onClick={() => setPage(page + 1)} className="rounded-lg border border-white/15 px-3 py-1.5 disabled:opacity-40">Próxima</button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default AtendimentoDashboard;
