import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Paperclip } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PRIORIDADES } from "@/lib/chamado";
import ChamadoConversa, { abrirAnexo } from "@/components/suporte/ChamadoConversa";
import { prioridadeCls } from "./AtendimentoChamados";

type D = { id: string; protocolo: string | null; numero: number; created_at: string; updated_at: string; iniciado_em: string | null; resolvido_em: string | null; closed_at: string | null; cliente: string; filial: string; filial_codigo: string; solicitante: string | null; solicitante_telefone: string | null; solicitante_email: string | null; categoria: string; prioridade: string; assunto: string; descricao: string | null; equipamento: string | null; status: string; solucao: string | null; tecnico_id: string | null; tecnico: string | null };
type Ev = { id: string; descricao: string; created_at: string; autor_nome: string | null };
type An = { id: string; nome: string; path: string };
const dt = (s?: string | null) => (s ? new Date(s).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—");
const btn = "rounded-lg px-4 py-2 text-sm font-bold disabled:opacity-50";

const AtendimentoChamadoDetalhe = () => {
  const { id = "" } = useParams();
  const [c, setC] = useState<D | null | undefined>(undefined);
  const [ev, setEv] = useState<Ev[]>([]);
  const [an, setAn] = useState<An[]>([]);
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState<null | "aguardando" | "resolver">(null);
  const [txt, setTxt] = useState("");
  const [envios, setEnvios] = useState<{ id: string; destinatario: string; status: string; erro: string | null; created_at: string }[]>([]);

  const load = useCallback(async () => {
    const [d, e, a] = await Promise.all([
      supabase.rpc("suporte_chamado_detalhe", { _id: id }),
      supabase.from("suporte_chamado_eventos").select("id, descricao, created_at, autor_nome").eq("chamado_id", id).order("created_at"),
      supabase.from("suporte_chamado_anexos").select("id, nome, path").eq("chamado_id", id).is("mensagem_id", null).order("created_at"),
    ]);
    setC(((Array.isArray(d.data) ? d.data[0] : null) as D) ?? null);
    setEv((e.data as Ev[]) ?? []); setAn(a.data ?? []);
    const n = await supabase.from("suporte_notificacao_envios").select("id, destinatario, status, erro, created_at").eq("chamado_id", id).order("created_at", { ascending: false });
    setEnvios(n.data ?? []);
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const acao = async (fn: () => PromiseLike<{ error: { message: string } | null }>, ok: string) => {
    setBusy(true);
    const { error } = await fn();
    setBusy(false);
    if (error) return toast({ title: "Não foi possível", description: error.message, variant: "destructive" });
    toast({ title: ok }); setModal(null); setTxt(""); load();
  };

  if (c === undefined) return <p className="text-white/60">Carregando...</p>;
  if (c === null) return <div><p className="text-white/70">Chamado não encontrado ou sem permissão.</p><Link to="/suporte/admin/chamados" className="text-[#38BDF8]">← Todos os chamados</Link></div>;

  const fechado = c.status === "Fechado";
  const info = (l: string, v?: string | null) => <div><p className="text-xs text-white/50">{l}</p><p className="font-semibold break-words">{v || "—"}</p></div>;

  return (
    <div className="max-w-5xl">
      <Link to="/suporte/admin/chamados" className="text-sm text-[#38BDF8]">← Todos os chamados</Link>
      <div className="flex flex-wrap items-center gap-3 mt-2">
        <h1 className="text-2xl font-extrabold">{c.protocolo ?? `#${c.numero}`}</h1>
        <span className="rounded-full bg-[#1A56DB]/30 px-3 py-1 text-sm font-semibold">{c.status}</span>
        <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${prioridadeCls[c.prioridade]}`}>{c.prioridade}</span>
      </div>
      <p className="text-lg mt-1">{c.assunto}</p>

      <div className="grid lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {info("Abertura", dt(c.created_at))}{info("Cliente", c.cliente)}{info("Filial", `${c.filial_codigo} — ${c.filial}`)}
            {info("Solicitante", c.solicitante)}{info("Telefone", c.solicitante_telefone)}{info("E-mail", c.solicitante_email)}
            {info("Categoria", c.categoria)}{info("Equipamento", c.equipamento)}{info("Última atualização", dt(c.updated_at))}
          </div>
          <h2 className="font-bold mt-6 mb-2">Descrição</h2>
          <p className="whitespace-pre-wrap rounded-xl border border-white/10 bg-white/5 p-4 text-white/90">{c.descricao}</p>
          {c.solucao && (<><h2 className="font-bold mt-6 mb-2">Solução</h2><p className="whitespace-pre-wrap rounded-xl border border-green-400/30 bg-green-500/10 p-4">{c.solucao}</p></>)}
          <h2 className="font-bold mt-6 mb-2">Anexos da abertura</h2>
          {an.length ? an.map((a) => <button key={a.id} onClick={() => abrirAnexo(a.path)} className="flex items-center gap-2 text-[#38BDF8] hover:underline"><Paperclip size={16} />{a.nome}</button>)
            : <p className="text-white/50 text-sm">Nenhum anexo.</p>}
          <ChamadoConversa chamadoId={c.id} fechado={fechado} onEnviado={load} />
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            {info("Técnico responsável", c.tecnico)}
            {!fechado && (<>
              {c.status !== "Resolvido" && <button disabled={busy} onClick={() => acao(() => supabase.rpc("suporte_assumir_chamado", { _id: c.id }), "Chamado assumido")} className={`${btn} w-full bg-[#1A56DB] hover:bg-[#38BDF8]`}>Assumir chamado</button>}
              <label className="block text-xs text-white/50">Status
                <select disabled={busy} value="" onChange={(e) => {
                  const v = e.target.value; if (!v) return;
                  if (v === "Aguardando cliente") return setModal("aguardando");
                  acao(() => supabase.rpc("suporte_alterar_status", { _id: c.id, _status: v as "Aberto", _motivo: "" }), "Status alterado");
                }} className="mt-1 w-full rounded-lg border border-white/15 bg-[#0F2D5C] px-2 py-2 text-sm text-white">
                  <option value="">Alterar status…</option>
                  {["Aberto", "Em atendimento", "Aguardando cliente"].filter((s) => s !== c.status).map((s) => <option key={s}>{s}</option>)}
                </select></label>
              <label className="block text-xs text-white/50">Prioridade
                <select disabled={busy} value={c.prioridade} onChange={(e) => acao(() => supabase.rpc("suporte_alterar_prioridade", { _id: c.id, _prioridade: e.target.value as "Normal" }), "Prioridade alterada")}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-[#0F2D5C] px-2 py-2 text-sm text-white">
                  {PRIORIDADES.map((p) => <option key={p}>{p}</option>)}</select></label>
              {c.status !== "Resolvido" && <button disabled={busy} onClick={() => setModal("resolver")} className={`${btn} w-full bg-[#16A34A] hover:bg-green-500`}>Marcar como Resolvido</button>}
              <button disabled={busy || c.status !== "Resolvido"} title={c.status !== "Resolvido" ? "Somente após Resolvido" : ""}
                onClick={() => confirm("Fechar este chamado? Ele não poderá mais ser alterado.") && acao(() => supabase.rpc("suporte_fechar_chamado", { _id: c.id }), "Chamado fechado")}
                className={`${btn} w-full border border-white/20 hover:border-[#38BDF8]`}>Fechar Chamado</button>
            </>)}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 grid grid-cols-2 gap-3 text-sm">
            {info("Abertura", dt(c.created_at))}{info("Início atendimento", dt(c.iniciado_em))}{info("Resolução", dt(c.resolvido_em))}{info("Fechamento", dt(c.closed_at))}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
            <p className="font-bold mb-2">E-mails de novo chamado</p>
            {envios.length === 0 && <p className="text-white/50">Nenhum envio registrado.</p>}
            {Array.from(new Map([...envios].reverse().map((x) => [x.destinatario, x])).values()).map((x) => (
              <p key={x.id} className="break-all" title={x.erro ?? ""}>{x.destinatario} → <b className={x.status === "enviado" ? "text-green-300" : "text-red-300"}>{x.status === "enviado" ? "Enviado" : x.status === "bloqueado" ? "Bloqueado" : "Falhou"}</b></p>
            ))}
            {envios.length < 3 || Array.from(new Map([...envios].reverse().map((x) => [x.destinatario, x])).values()).some((x) => x.status !== "enviado") ? (
              <button disabled={busy} onClick={() => acao(() => supabase.functions.invoke("notificar-novo-chamado", { body: { chamado_id: c.id } }).then((r) => ({ error: r.error })), "Envio processado")}
                className="mt-2 w-full rounded-lg border border-white/20 px-3 py-2 font-bold hover:border-[#38BDF8]">Reenviar e-mail</button>
            ) : null}
          </div>

          <div>
            <h2 className="font-bold mb-3">Linha do tempo</h2>
            <ol className="relative border-l border-[#38BDF8]/40 ml-2 space-y-4">
              {ev.map((e) => (
                <li key={e.id} className="pl-5 relative">
                  <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
                  <p className="text-xs font-bold">{dt(e.created_at)}{e.autor_nome ? ` · ${e.autor_nome}` : ""}</p>
                  <p className="text-sm text-white/80">{e.descricao}</p>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0F2D5C] p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">{modal === "resolver" ? "Descrição da solução" : "Motivo / informação solicitada"}</h3>
            <textarea value={txt} onChange={(e) => setTxt(e.target.value)} rows={4} maxLength={5000}
              placeholder={modal === "resolver" ? "Ex.: Reiniciado equipamento de rede e reconfigurado conexão." : "Ex.: Favor enviar uma foto do erro apresentado na tela. (opcional)"}
              className="mt-3 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40" />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setModal(null)} className={`${btn} border border-white/20`}>Cancelar</button>
              <button disabled={busy || (modal === "resolver" && !txt.trim())}
                onClick={() => modal === "resolver"
                  ? acao(() => supabase.rpc("suporte_resolver_chamado", { _id: c.id, _solucao: txt }), "Chamado resolvido")
                  : acao(() => supabase.rpc("suporte_alterar_status", { _id: c.id, _status: "Aguardando cliente", _motivo: txt }), "Aguardando cliente")}
                className={`${btn} bg-[#1A56DB] hover:bg-[#38BDF8]`}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtendimentoChamadoDetalhe;
