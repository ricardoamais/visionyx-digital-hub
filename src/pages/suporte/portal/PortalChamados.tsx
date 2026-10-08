import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePortal } from "@/components/suporte/PortalLayout";

type Chamado = { id: string; numero: number; protocolo: string | null; created_at: string; updated_at: string; assunto: string; categoria: string; prioridade: string; status: string };

export const useMeusChamados = () => {
  const { user } = usePortal();
  const [lista, setLista] = useState<Chamado[] | null>(null);
  useEffect(() => {
    supabase.from("suporte_chamados")
      .select("id, numero, protocolo, created_at, updated_at, assunto, categoria, prioridade, status")
      .eq("usuario_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setLista((data as Chamado[]) ?? []));
  }, [user.id]);
  return lista;
};

const filtros = ["Todos", "Aberto", "Em atendimento", "Aguardando cliente", "Resolvido", "Fechado"];
const rotulo: Record<string, string> = { Todos: "Todos", Aberto: "Abertos", Resolvido: "Resolvidos", Fechado: "Fechados" };
const dt = (s: string) => new Date(s).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

const PortalChamados = () => {
  const lista = useMeusChamados();
  const [q, setQ] = useState("");
  const [f, setF] = useState("Todos");

  const visiveis = useMemo(() => (lista ?? []).filter((c) =>
    (f === "Todos" || c.status === f) &&
    (!q || (c.protocolo ?? String(c.numero)).includes(q) || c.assunto.toLowerCase().includes(q.toLowerCase())),
  ), [lista, q, f]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-extrabold">Meus Chamados</h1>
        <Link to="/suporte/novo-chamado" className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-5 py-3 font-bold"><PlusCircle size={20} />Abrir Chamado</Link>
      </div>
      <input className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-base mb-3 placeholder:text-white/40" placeholder="Pesquisar por número ou assunto" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {filtros.map((x) => (
          <button key={x} onClick={() => setF(x)} className={"shrink-0 rounded-full px-4 py-2 text-sm font-semibold " + (f === x ? "bg-[#1A56DB]" : "bg-white/10 text-white/70")}>
            {rotulo[x] ?? x}
          </button>
        ))}
      </div>

      {lista === null ? <p className="text-white/60">Carregando...</p> : !visiveis.length ? (
        <p className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/60">Nenhum chamado encontrado.</p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-left text-white/60">
                <tr>{["Nº", "Data", "Assunto", "Categoria", "Prioridade", "Status", "Atualização"].map((h) => <th key={h} className="px-3 py-3">{h}</th>)}</tr>
              </thead>
              <tbody>
                {visiveis.map((c) => (
                  <tr key={c.id} className="border-t border-white/10">
                    <td className="px-3 py-3 font-mono">{c.protocolo ?? `#${c.numero}`}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{dt(c.created_at)}</td>
                    <td className="px-3 py-3 font-semibold"><Link className="hover:text-[#38BDF8]" to={`/suporte/chamado/${c.id}`}>{c.assunto}</Link></td>
                    <td className="px-3 py-3">{c.categoria}</td>
                    <td className="px-3 py-3">{c.prioridade}</td>
                    <td className="px-3 py-3">{c.status}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{dt(c.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-3">
            {visiveis.map((c) => (
              <Link to={`/suporte/chamado/${c.id}`} key={c.id} className="block rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex justify-between text-sm text-white/60"><span className="font-mono">{c.protocolo ?? `#${c.numero}`}</span><span>{dt(c.created_at)}</span></div>
                <p className="font-bold mt-1">{c.assunto}</p>
                <p className="text-sm text-white/70 mt-1">{c.categoria} · {c.prioridade}</p>
                <p className="mt-2 inline-block rounded-full bg-[#1A56DB]/30 px-3 py-1 text-xs font-semibold">{c.status}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PortalChamados;
