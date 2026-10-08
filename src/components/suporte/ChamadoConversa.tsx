import { useCallback, useEffect, useState } from "react";
import { Paperclip, Send, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MAX_ANEXOS, validarAnexo } from "@/lib/chamado";
import { perfilLabel } from "@/components/suporte/PortalLayout";

type Msg = { id: string; autor_nome: string; autor_perfil: string; autor_filial: string | null; mensagem: string; created_at: string };
type Anexo = { id: string; nome: string; path: string; mensagem_id: string | null };
const dt = (s: string) => new Date(s).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

export async function abrirAnexo(path: string) {
  const { data } = await supabase.storage.from("chamados-anexos").createSignedUrl(path, 300);
  if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
}

/** Conversa entre filial e Visionyx, vinculada ao chamado. */
const ChamadoConversa = ({ chamadoId, fechado, onEnviado }: { chamadoId: string; fechado: boolean; onEnviado?: () => void }) => {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [texto, setTexto] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [m, a] = await Promise.all([
      supabase.from("suporte_chamado_mensagens").select("id, autor_nome, autor_perfil, autor_filial, mensagem, created_at").eq("chamado_id", chamadoId).order("created_at"),
      supabase.from("suporte_chamado_anexos").select("id, nome, path, mensagem_id").eq("chamado_id", chamadoId).not("mensagem_id", "is", null),
    ]);
    setMsgs((m.data as Msg[]) ?? []);
    setAnexos((a.data as Anexo[]) ?? []);
  }, [chamadoId]);

  useEffect(() => {
    load();
    const ch = supabase.channel(`msgs-${chamadoId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "suporte_chamado_mensagens", filter: `chamado_id=eq.${chamadoId}` }, () => setTimeout(load, 800))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [chamadoId, load]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const novos = [...files];
    for (const f of Array.from(list)) {
      const e = validarAnexo(f);
      if (e) { toast({ title: f.name, description: e, variant: "destructive" }); continue; }
      if (novos.length >= MAX_ANEXOS) break;
      novos.push(f);
    }
    setFiles(novos);
  };

  const enviar = async () => {
    if (!texto.trim() || busy) return;
    setBusy(true);
    const { data: mid, error } = await supabase.rpc("suporte_enviar_mensagem", { _id: chamadoId, _mensagem: texto });
    if (error) { setBusy(false); return toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" }); }
    const { data: me } = await supabase.rpc("suporte_me");
    const meId = Array.isArray(me) ? me[0]?.id : null;
    for (const f of files) {
      const path = `${chamadoId}/${crypto.randomUUID()}-${f.name.replace(/[^\w.-]/g, "_")}`;
      const up = await supabase.storage.from("chamados-anexos").upload(path, f, { contentType: f.type });
      if (up.error) { toast({ title: f.name, description: "Falha no envio do arquivo.", variant: "destructive" }); continue; }
      await supabase.from("suporte_chamado_anexos").insert({ chamado_id: chamadoId, path, nome: f.name, tipo: f.type, tamanho: f.size, enviado_por: meId, mensagem_id: mid as string });
      await supabase.rpc("suporte_registrar_anexo_evento", { _id: chamadoId, _nome: f.name });
    }
    setTexto(""); setFiles([]); setBusy(false);
    await load(); onEnviado?.();
  };

  return (
    <div>
      <h2 className="font-bold mt-6 mb-3">Histórico / Comunicação</h2>
      <div className="space-y-3">
        {msgs.length === 0 && <p className="text-white/50 text-sm">Nenhuma mensagem ainda.</p>}
        {msgs.map((m) => {
          const staff = m.autor_perfil === "tecnico_visionyx" || m.autor_perfil === "admin_visionyx";
          return (
            <div key={m.id} className={`rounded-xl border p-3 ${staff ? "border-[#38BDF8]/30 bg-[#1A56DB]/15" : "border-white/10 bg-white/5"}`}>
              <p className="text-sm font-bold">
                {m.autor_nome}{m.autor_filial ? ` — Filial ${m.autor_filial}` : ""}{" "}
                <span className="font-normal text-white/50">· {perfilLabel[m.autor_perfil] ?? m.autor_perfil} · {dt(m.created_at)}</span>
              </p>
              <p className="whitespace-pre-wrap text-white/90 mt-1">{m.mensagem}</p>
              {anexos.filter((a) => a.mensagem_id === m.id).map((a) => (
                <button key={a.id} onClick={() => abrirAnexo(a.path)} className="mt-1 flex items-center gap-1 text-sm text-[#38BDF8] hover:underline"><Paperclip size={14} />{a.nome}</button>
              ))}
            </div>
          );
        })}
      </div>
      {fechado ? <p className="text-white/50 text-sm mt-3">Chamado fechado — não aceita novas mensagens.</p> : (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
          <textarea value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={5000} rows={3} placeholder="Digite uma mensagem..."
            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40" />
          {files.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {files.map((f, i) => (
                <li key={i} className="flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-xs">{f.name}
                  <button onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label="Remover"><X size={12} /></button></li>
              ))}
            </ul>
          )}
          <div className="mt-2 flex items-center justify-between gap-2">
            <label className="flex cursor-pointer items-center gap-1 text-sm text-[#38BDF8]"><Paperclip size={16} />Anexar
              <input type="file" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} /></label>
            <button onClick={enviar} disabled={busy || !texto.trim()} className="flex items-center gap-2 rounded-lg bg-[#1A56DB] hover:bg-[#38BDF8] px-4 py-2 text-sm font-bold disabled:opacity-60">
              <Send size={16} />{busy ? "Enviando..." : "Enviar resposta"}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChamadoConversa;
