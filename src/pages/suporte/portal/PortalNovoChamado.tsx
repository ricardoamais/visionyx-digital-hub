import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Paperclip, X, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { usePortal } from "@/components/suporte/PortalLayout";
import { CATEGORIAS, PRIORIDADES, MAX_ANEXOS, TIPOS_PERMITIDOS, chamadoSchema, validarAnexo } from "@/lib/chamado";

const input = "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/40";
const explic: Record<string, string> = {
  Baixa: "problema sem impacto imediato.",
  Normal: "precisa de atendimento, mas permite continuar trabalhando.",
  Alta: "prejudica uma atividade importante.",
  Urgente: "operação da filial parada ou problema crítico.",
};

const PortalNovoChamado = () => {
  const { user } = usePortal();
  const [f, setF] = useState({ categoria: "", prioridade: "", assunto: "", descricao: "", equipamento: "" });
  const [arquivos, setArquivos] = useState<File[]>([]);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [ok, setOk] = useState<{ id: string; protocolo: string; assunto: string; falhas: number } | null>(null);
  const lock = useRef(false);

  const addArquivos = (list: FileList | null) => {
    if (!list) return;
    const novos: File[] = [];
    for (const a of Array.from(list)) {
      const e = validarAnexo(a);
      if (e) toast({ title: "Arquivo recusado", description: e, variant: "destructive" });
      else novos.push(a);
    }
    const total = [...arquivos, ...novos];
    if (total.length > MAX_ANEXOS) toast({ title: `Máximo de ${MAX_ANEXOS} arquivos`, variant: "destructive" });
    setArquivos(total.slice(0, MAX_ANEXOS));
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lock.current) return;
    const r = chamadoSchema.safeParse(f);
    if (!r.success) {
      setErros(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return toast({ title: "Verifique os campos destacados", variant: "destructive" });
    }
    setErros({});
    lock.current = true;
    setEnviando(true);
    const { data, error } = await supabase.rpc("suporte_abrir_chamado", {
      _categoria: r.data.categoria, _prioridade: r.data.prioridade, _assunto: r.data.assunto,
      _descricao: r.data.descricao, _equipamento: r.data.equipamento ?? "",
    });
    const row = Array.isArray(data) ? data[0] : null;
    if (error || !row) {
      lock.current = false;
      setEnviando(false);
      return toast({ title: "Não foi possível abrir o chamado", description: "Tente novamente em instantes.", variant: "destructive" });
    }
    let falhas = 0;
    for (const a of arquivos) {
      const ext = a.name.split(".").pop()!.toLowerCase();
      const path = `${row.id}/${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("chamados-anexos").upload(path, a, { contentType: a.type });
      const ins = up.error ? up : await supabase.from("suporte_chamado_anexos").insert({
        chamado_id: row.id, path, nome: a.name.slice(0, 200), tipo: a.type, tamanho: a.size, enviado_por: user.id,
      });
      if (ins.error) falhas++;
    }
    // Notificação por e-mail: em segundo plano, nunca bloqueia a abertura.
    supabase.functions.invoke("notificar-novo-chamado", { body: { chamado_id: row.id } }).catch(() => {});
    setEnviando(false);
    setOk({ id: row.id, protocolo: row.protocolo, assunto: r.data.assunto, falhas });
  };

  if (ok) {
    return (
      <div className="max-w-xl rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 sm:p-8">
        <CheckCircle2 className="text-emerald-300" size={48} />
        <h1 className="text-2xl font-extrabold mt-3">Chamado aberto com sucesso!</h1>
        <div className="mt-4 space-y-1">
          <p><span className="text-white/60">Número do chamado:</span> <b className="text-[#38BDF8]">{ok.protocolo}</b></p>
          <p><span className="text-white/60">Assunto:</span> <b>{ok.assunto}</b></p>
          <p><span className="text-white/60">Filial:</span> <b>{user.filial_nome}</b></p>
          <p><span className="text-white/60">Status:</span> <b>Aberto</b></p>
        </div>
        <p className="mt-4 text-white/80">Seu chamado foi registrado e será analisado pela equipe da Visionyx.</p>
        {ok.falhas > 0 && <p className="mt-2 text-sm text-amber-300">{ok.falhas} anexo(s) não puderam ser enviados.</p>}
        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          <Link to={`/suporte/chamado/${ok.id}`} className="rounded-lg bg-[#1A56DB] hover:bg-[#38BDF8] py-3.5 text-center font-bold">Ver chamado</Link>
          <Link to="/suporte/chamados" className="rounded-lg bg-white/10 hover:bg-white/20 py-3.5 text-center font-bold">Voltar para meus chamados</Link>
        </div>
      </div>
    );
  }

  const err = (k: string) => erros[k] && <p className="text-sm text-red-300 mt-1">{erros[k]}</p>;
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold">Abrir Novo Chamado</h1>
      <p className="text-white/70 mt-1">Descreva o problema e nossa equipe técnica irá analisar sua solicitação.</p>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 grid sm:grid-cols-3 gap-2 text-sm">
        <p><span className="text-white/60">Cliente:</span> <b>{user.cliente_nome}</b></p>
        <p><span className="text-white/60">Filial:</span> <b>{user.filial_nome}</b></p>
        <p><span className="text-white/60">Solicitante:</span> <b>{user.nome}</b></p>
      </div>

      <form onSubmit={enviar} className="mt-6 space-y-5">
        <label className="block">
          <span className="font-semibold">Categoria *</span>
          <select className={input + " mt-1"} value={f.categoria} onChange={set("categoria")}>
            <option value="">Selecione...</option>
            {CATEGORIAS.map((c) => <option key={c} value={c} className="text-black">{c}</option>)}
          </select>
          {err("categoria")}
        </label>

        <fieldset>
          <legend className="font-semibold">Prioridade *</legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
            {PRIORIDADES.map((p) => (
              <button type="button" key={p} onClick={() => setF({ ...f, prioridade: p })}
                className={"rounded-lg border py-3 font-bold " + (f.prioridade === p ? "border-[#38BDF8] bg-[#1A56DB]" : "border-white/15 bg-white/5 text-white/70")}>
                {p}
              </button>
            ))}
          </div>
          <ul className="mt-2 text-xs text-white/60 space-y-0.5">
            {PRIORIDADES.map((p) => <li key={p}><b className="text-white/80">{p}:</b> {explic[p]}</li>)}
          </ul>
          {err("prioridade")}
        </fieldset>

        <label className="block">
          <span className="font-semibold">Assunto *</span>
          <input className={input + " mt-1"} maxLength={150} placeholder="Ex.: Computador do caixa não liga" value={f.assunto} onChange={set("assunto")} />
          <span className="text-xs text-white/50">{f.assunto.length}/150</span>
          {err("assunto")}
        </label>

        <label className="block">
          <span className="font-semibold">Descrição *</span>
          <p className="text-xs text-white/60">Informe o que aconteceu, quando começou e, se possível, o que já foi testado.</p>
          <textarea className={input + " mt-1 min-h-[150px]"} maxLength={5000} placeholder="Descreva o problema com o máximo de detalhes possível." value={f.descricao} onChange={set("descricao")} />
          {err("descricao")}
        </label>

        <label className="block">
          <span className="font-semibold">Equipamento</span> <span className="text-xs text-white/50">(opcional)</span>
          <input className={input + " mt-1"} maxLength={150} placeholder="Ex.: CAIXA01 / PATRIMÔNIO 1548" value={f.equipamento} onChange={set("equipamento")} />
          {err("equipamento")}
        </label>

        <div>
          <label className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/20 py-4 cursor-pointer hover:border-[#38BDF8]">
            <Paperclip size={20} /> Adicionar fotos ou arquivos
            <input type="file" multiple className="hidden" accept={Object.values(TIPOS_PERMITIDOS).flat().map((x) => "." + x).join(",")}
              onChange={(e) => { addArquivos(e.target.files); e.target.value = ""; }} />
          </label>
          <p className="text-xs text-white/50 mt-1">Fotos, PDF, Word, Excel ou TXT · até 10 MB cada · máximo {MAX_ANEXOS} arquivos</p>
          {arquivos.length > 0 && (
            <ul className="mt-2 space-y-1">
              {arquivos.map((a, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
                  <span className="truncate">{a.name}</span>
                  <button type="button" aria-label="Remover" onClick={() => setArquivos(arquivos.filter((_, j) => j !== i))}><X size={16} /></button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button disabled={enviando} className="w-full rounded-xl bg-[#16A34A] hover:brightness-110 py-4 text-lg font-bold disabled:opacity-60">
          {enviando ? "Enviando chamado..." : "Enviar Chamado"}
        </button>
      </form>
    </div>
  );
};

export default PortalNovoChamado;
