import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Paperclip } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Chamado = { id: string; protocolo: string | null; numero: number; created_at: string; categoria: string; prioridade: string; assunto: string; descricao: string | null; equipamento: string | null; status: string };
type Evento = { id: string; descricao: string; created_at: string };
type Anexo = { id: string; nome: string; path: string };
const dt = (s: string) => new Date(s).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

const PortalChamadoDetalhe = () => {
  const { id = "" } = useParams();
  const [c, setC] = useState<Chamado | null | undefined>(undefined);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [anexos, setAnexos] = useState<Anexo[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from("suporte_chamados").select("id, protocolo, numero, created_at, categoria, prioridade, assunto, descricao, equipamento, status").eq("id", id).maybeSingle(),
      supabase.from("suporte_chamado_eventos").select("id, descricao, created_at").eq("chamado_id", id).order("created_at"),
      supabase.from("suporte_chamado_anexos").select("id, nome, path").eq("chamado_id", id).order("created_at"),
    ]).then(([a, b, d]) => { setC(a.data as Chamado | null); setEventos(b.data ?? []); setAnexos(d.data ?? []); });
  }, [id]);

  const abrir = async (path: string) => {
    const { data } = await supabase.storage.from("chamados-anexos").createSignedUrl(path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
  };

  if (c === undefined) return <p className="text-white/60">Carregando...</p>;
  if (c === null) return (
    <div><p className="text-white/70">Chamado não encontrado.</p><Link to="/suporte/chamados" className="text-[#38BDF8]">← Meus chamados</Link></div>
  );

  const info = (l: string, v: string) => <div><p className="text-xs text-white/50">{l}</p><p className="font-semibold">{v}</p></div>;

  return (
    <div className="max-w-3xl">
      <Link to="/suporte/chamados" className="text-sm text-[#38BDF8]">← Meus chamados</Link>
      <div className="flex flex-wrap items-center gap-3 mt-2">
        <h1 className="text-2xl font-extrabold">{c.protocolo ?? `#${c.numero}`}</h1>
        <span className="rounded-full bg-[#1A56DB]/30 px-3 py-1 text-sm font-semibold">{c.status}</span>
      </div>
      <p className="text-lg mt-1">{c.assunto}</p>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {info("Abertura", dt(c.created_at))}{info("Categoria", c.categoria)}{info("Prioridade", c.prioridade)}{info("Equipamento", c.equipamento || "—")}
      </div>

      <h2 className="font-bold mt-6 mb-2">Descrição</h2>
      <p className="whitespace-pre-wrap rounded-xl border border-white/10 bg-white/5 p-4 text-white/90">{c.descricao}</p>

      <h2 className="font-bold mt-6 mb-2">Anexos</h2>
      {anexos.length ? (
        <ul className="space-y-2">
          {anexos.map((a) => (
            <li key={a.id}><button onClick={() => abrir(a.path)} className="flex items-center gap-2 text-[#38BDF8] hover:underline"><Paperclip size={16} />{a.nome}</button></li>
          ))}
        </ul>
      ) : <p className="text-white/50 text-sm">Nenhum anexo.</p>}

      <h2 className="font-bold mt-6 mb-3">Histórico</h2>
      <ol className="relative border-l border-[#38BDF8]/40 ml-2 space-y-5">
        {eventos.map((e) => (
          <li key={e.id} className="pl-5 relative">
            <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
            <p className="text-sm font-bold">{dt(e.created_at)}</p>
            <p className="text-white/80">{e.descricao}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default PortalChamadoDetalhe;
