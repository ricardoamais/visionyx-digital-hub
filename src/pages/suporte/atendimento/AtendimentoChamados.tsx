import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIAS, PRIORIDADES } from "@/lib/chamado";

const STATUS = ["Aberto", "Em atendimento", "Aguardando cliente", "Resolvido", "Fechado"];
const POR_PAGINA = 25;
type Row = { id: string; protocolo: string | null; numero: number; created_at: string; updated_at: string; cliente: string; filial: string; solicitante: string | null; categoria: string; assunto: string; prioridade: string; status: string; tecnico: string | null; total: number };
const dt = (s: string) => new Date(s).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
const sel = "rounded-lg border border-white/15 bg-[#0F2D5C] px-2 py-2 text-sm";

export const prioridadeCls: Record<string, string> = {
  Urgente: "bg-red-500/20 text-red-200 border-red-400/50",
  Alta: "bg-amber-500/15 text-amber-200 border-amber-400/40",
  Normal: "bg-[#1A56DB]/20 text-white border-[#38BDF8]/30",
  Baixa: "bg-white/5 text-white/70 border-white/15",
};

function periodo(p: string, de: string, ate: string): [string | null, string | null] {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  if (p === "hoje") return [d.toISOString(), null];
  if (p === "7") return [new Date(d.getTime() - 6 * 864e5).toISOString(), null];
  if (p === "30") return [new Date(d.getTime() - 29 * 864e5).toISOString(), null];
  if (p === "custom") return [de ? new Date(de + "T00:00").toISOString() : null, ate ? new Date(new Date(ate + "T00:00").getTime() + 864e5).toISOString() : null];
  return [null, null];
}

const AtendimentoChamados = () => {
  const [sp, setSp] = useSearchParams();
  const f = (k: string) => sp.get(k) ?? "";
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); if (k !== "pag") n.delete("pag"); if (k === "cliente") n.delete("filial"); setSp(n, { replace: true }); };
  const pag = Number(f("pag") || 0);

  const [clientes, setClientes] = useState<{ id: string; nome: string }[]>([]);
  const [filiais, setFiliais] = useState<{ id: string; nome: string; codigo: string }[]>([]);
  const [tecnicos, setTecnicos] = useState<{ id: string; nome: string }[]>([]);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [busca, setBusca] = useState(f("q"));

  useEffect(() => {
    supabase.from("suporte_clientes").select("id, nome").order("nome").then(({ data }) => setClientes(data ?? []));
    supabase.rpc("suporte_listar_tecnicos").then(({ data }) => setTecnicos((data as { id: string; nome: string }[]) ?? []));
  }, []);
  useEffect(() => {
    if (!f("cliente")) return setFiliais([]);
    supabase.from("suporte_filiais").select("id, nome, codigo").eq("cliente_id", f("cliente")).order("codigo").then(({ data }) => setFiliais(data ?? []));
  }, [sp]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setTimeout(() => busca !== f("q") && set("q", busca.trim()), 400); return () => clearTimeout(t); }, [busca]); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    const [desde, ate] = periodo(f("periodo"), f("de"), f("ate"));
    const { data } = await supabase.rpc("suporte_buscar_chamados", {
      _cliente: f("cliente") || null, _filial: f("filial") || null, _status: f("status") || null, _prioridade: f("prioridade") || null,
      _categoria: f("categoria") || null, _tecnico: f("tecnico") || null, _desde: desde, _ate: ate, _busca: f("q") || null,
      _limite: POR_PAGINA, _offset: pag * POR_PAGINA,
    });
    setRows((data as Row[]) ?? []);
  }, [sp]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    load();
    const ch = supabase.channel("lista-chamados")
      .on("postgres_changes", { event: "*", schema: "public", table: "suporte_chamados" }, () => load()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  const total = rows?.[0]?.total ?? 0;
  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-extrabold mb-4">Todos os Chamados</h1>
      <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar por número, assunto, solicitante, filial ou equipamento"
        className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm placeholder:text-white/40 mb-3" />
      <div className="flex flex-wrap gap-2 mb-4">
        <select className={sel} value={f("cliente")} onChange={(e) => set("cliente", e.target.value)}><option value="">Todos os clientes</option>{clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</select>
        <select className={sel} value={f("filial")} onChange={(e) => set("filial", e.target.value)} disabled={!f("cliente")}><option value="">Todas as filiais</option>{filiais.map((x) => <option key={x.id} value={x.id}>{x.codigo} — {x.nome}</option>)}</select>
        <select className={sel} value={f("status")} onChange={(e) => set("status", e.target.value)}><option value="">Todos os status</option>{STATUS.map((s) => <option key={s}>{s}</option>)}</select>
        <select className={sel} value={f("prioridade")} onChange={(e) => set("prioridade", e.target.value)}><option value="">Todas as prioridades</option>{PRIORIDADES.map((s) => <option key={s}>{s}</option>)}</select>
        <select className={sel} value={f("categoria")} onChange={(e) => set("categoria", e.target.value)}><option value="">Todas as categorias</option>{CATEGORIAS.map((s) => <option key={s}>{s}</option>)}</select>
        <select className={sel} value={f("tecnico")} onChange={(e) => set("tecnico", e.target.value)}><option value="">Todos os técnicos</option>{tecnicos.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}</select>
        <select className={sel} value={f("periodo")} onChange={(e) => set("periodo", e.target.value)}>
          <option value="">Qualquer período</option><option value="hoje">Hoje</option><option value="7">Últimos 7 dias</option><option value="30">Últimos 30 dias</option><option value="custom">Personalizado</option></select>
        {f("periodo") === "custom" && (<>
          <input type="date" className={sel} value={f("de")} onChange={(e) => set("de", e.target.value)} />
          <input type="date" className={sel} value={f("ate")} onChange={(e) => set("ate", e.target.value)} />
        </>)}
        <button onClick={() => { setBusca(""); setSp({}, { replace: true }); }} className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:border-[#38BDF8]">Limpar filtros</button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm whitespace-nowrap">
          <thead className="bg-white/5 text-left text-white/60">
            <tr>{["Número", "Data", "Cliente", "Filial", "Solicitante", "Categoria", "Assunto", "Prioridade", "Status", "Técnico", "Atualização"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows === null && <tr><td colSpan={11} className="p-4 text-white/50">Carregando...</td></tr>}
            {rows?.length === 0 && <tr><td colSpan={11} className="p-4 text-white/50">Nenhum chamado encontrado.</td></tr>}
            {rows?.map((r) => (
              <tr key={r.id} className={`border-t border-white/10 hover:bg-white/5 ${r.prioridade === "Urgente" && !["Resolvido", "Fechado"].includes(r.status) ? "bg-red-500/10 border-l-4 border-l-red-400" : ""}`}>
                <td className="p-3"><Link to={`/suporte/admin/chamado/${r.id}`} className="font-bold text-[#38BDF8] hover:underline">{r.protocolo ?? `#${r.numero}`}</Link></td>
                <td className="p-3">{dt(r.created_at)}</td><td className="p-3">{r.cliente}</td><td className="p-3">{r.filial}</td><td className="p-3">{r.solicitante ?? "—"}</td>
                <td className="p-3">{r.categoria}</td>
                <td className="p-3 max-w-[260px] truncate"><Link to={`/suporte/admin/chamado/${r.id}`} className="hover:underline">{r.assunto}</Link></td>
                <td className="p-3"><span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${prioridadeCls[r.prioridade]}`}>{r.prioridade}</span></td>
                <td className="p-3">{r.status}</td><td className="p-3">{r.tecnico ?? "—"}</td><td className="p-3">{dt(r.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3 text-sm text-white/70">
        <span>{total} chamado(s)</span>
        <div className="flex items-center gap-2">
          <button disabled={pag === 0} onClick={() => set("pag", String(pag - 1))} className="rounded border border-white/20 px-3 py-1 disabled:opacity-40">Anterior</button>
          <span>{pag + 1} / {paginas}</span>
          <button disabled={pag + 1 >= paginas} onClick={() => set("pag", String(pag + 1))} className="rounded border border-white/20 px-3 py-1 disabled:opacity-40">Próxima</button>
        </div>
      </div>
    </div>
  );
};

export default AtendimentoChamados;
