import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import SuporteAdminShell, { btnCls, inputCls } from "@/components/suporte/SuporteAdminShell";
import { validarFiliais, type FilialInput, type ImportRow } from "@/lib/filialImport";

type Filial = FilialInput & { id: string; status: string };
type Chamado = { filial_id: string; status: string };

const vazio: FilialInput & { status: string } = {
  codigo: "", nome: "", cnpj: null, endereco: null, numero: null, bairro: null, cidade: null,
  estado: null, cep: null, telefone: null, email: null, responsavel: null, status: "ativo",
};
const campos: [keyof FilialInput, string][] = [
  ["codigo", "Código da filial *"], ["nome", "Nome da filial *"], ["cnpj", "CNPJ"], ["endereco", "Endereço"],
  ["numero", "Número"], ["bairro", "Bairro"], ["cidade", "Cidade"], ["estado", "Estado (UF)"], ["cep", "CEP"],
  ["telefone", "Telefone"], ["email", "E-mail"], ["responsavel", "Responsável"],
];

const Conteudo = ({ clienteId }: { clienteId: string }) => {
  const [nome, setNome] = useState("");
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [usuarios, setUsuarios] = useState<{ filial_id: string | null }[]>([]);
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [busca, setBusca] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [status, setStatus] = useState("");
  const [ordem, setOrdem] = useState<"codigo" | "nome">("codigo");
  const [form, setForm] = useState<(typeof vazio & { id?: string }) | null>(null);
  const [preview, setPreview] = useState<ImportRow[] | null>(null);

  const load = async () => {
    const [c, f, u, ch] = await Promise.all([
      supabase.from("suporte_clientes").select("nome").eq("id", clienteId).maybeSingle(),
      supabase.from("suporte_filiais").select("*").eq("cliente_id", clienteId),
      supabase.from("suporte_usuarios").select("filial_id").eq("cliente_id", clienteId),
      supabase.from("suporte_chamados").select("filial_id, status").eq("cliente_id", clienteId),
    ]);
    setNome(c.data?.nome ?? "");
    setFiliais((f.data as Filial[]) ?? []);
    setUsuarios(u.data ?? []);
    setChamados((ch.data as Chamado[]) ?? []);
  };
  useEffect(() => { load(); }, [clienteId]);

  const countBy = (arr: { filial_id: string | null }[], id: string) => arr.filter((x) => x.filial_id === id).length;
  const cidades = [...new Set(filiais.map((f) => f.cidade).filter(Boolean))].sort() as string[];
  const estados = [...new Set(filiais.map((f) => f.estado).filter(Boolean))].sort() as string[];

  const lista = useMemo(() => {
    const q = busca.toLowerCase();
    return filiais
      .filter((f) => !q || [f.codigo, f.nome, f.cidade, f.responsavel].some((v) => v?.toLowerCase().includes(q)))
      .filter((f) => (!cidade || f.cidade === cidade) && (!estado || f.estado === estado) && (!status || f.status === status))
      .sort((a, b) => a[ordem].localeCompare(b[ordem], "pt-BR", { numeric: true }));
  }, [filiais, busca, cidade, estado, status, ordem]);

  const ch = (s: string) => chamados.filter((c) => c.status === s).length;
  const cards = [
    ["Total de filiais", filiais.length], ["Filiais ativas", filiais.filter((f) => f.status === "ativo").length],
    ["Filiais inativas", filiais.filter((f) => f.status !== "ativo").length], ["Total de usuários", usuarios.length],
    ["Chamados abertos", ch("Aberto")], ["Em atendimento", ch("Em atendimento")],
    ["Aguardando cliente", ch("Aguardando cliente")], ["Resolvidos", ch("Resolvido")],
  ] as const;

  const salvar = async () => {
    if (!form) return;
    if (!form.codigo.trim() || !form.nome.trim()) return toast({ title: "Preencha código e nome", variant: "destructive" });
    const { id, ...dados } = form;
    const payload = { ...dados, estado: dados.estado?.toUpperCase() || null, cliente_id: clienteId };
    const { error } = id
      ? await supabase.from("suporte_filiais").update(payload).eq("id", id)
      : await supabase.from("suporte_filiais").insert(payload);
    if (error) {
      const msg = error.code === "23505" ? "Código ou CNPJ já cadastrado." : error.message;
      return toast({ title: "Erro ao salvar", description: msg, variant: "destructive" });
    }
    setForm(null);
    load();
  };

  const lerArquivo = async (file: File) => {
    const wb = XLSX.read(await file.arrayBuffer());
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[wb.SheetNames[0]], { defval: "" });
    setPreview(validarFiliais(rows, filiais));
  };

  const importar = async () => {
    const ok = (preview ?? []).filter((r) => r.erros.length === 0);
    if (!ok.length) return;
    const { error } = await supabase.from("suporte_filiais").insert(ok.map((r) => ({ ...r.dados, cliente_id: clienteId })));
    if (error) return toast({ title: "Erro na importação", description: error.message, variant: "destructive" });
    toast({ title: `${ok.length} filiais importadas` });
    setPreview(null);
    load();
  };

  return (
    <>
      <h2 className="text-xl font-bold text-[#38BDF8] mb-4">{nome}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {cards.map(([l, v]) => (
          <div key={l} className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-[0_0_20px_rgba(56,189,248,0.08)]">
            <p className="text-xs text-white/60">{l}</p>
            <p className="text-2xl font-extrabold mt-1">{v}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 className="text-lg font-bold">Filiais</h3>
        <div className="flex gap-2">
          <label className={btnCls + " cursor-pointer bg-white/10"}>
            Importar Filiais
            <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) lerArquivo(f); e.target.value = ""; }} />
          </label>
          <button className={btnCls} onClick={() => setForm({ ...vazio })}>+ Nova Filial</button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-3">
        <input className={inputCls} placeholder="Pesquisar..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        <select className={inputCls} value={cidade} onChange={(e) => setCidade(e.target.value)}>
          <option value="">Todas as cidades</option>{cidades.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className={inputCls} value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos os estados</option>{estados.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Ativas e inativas</option><option value="ativo">Ativas</option><option value="inativo">Inativas</option>
        </select>
        <select className={inputCls} value={ordem} onChange={(e) => setOrdem(e.target.value as "codigo" | "nome")}>
          <option value="codigo">Ordenar por código</option><option value="nome">Ordenar por nome</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-white/60">
            <tr>{["Código", "Filial", "Cidade", "UF", "Telefone", "Status", "Usuários", "Chamados abertos", "Ações"].map((h) => <th key={h} className="px-3 py-3 whitespace-nowrap">{h}</th>)}</tr>
          </thead>
          <tbody>
            {lista.map((f) => (
              <tr key={f.id} className="border-t border-white/10">
                <td className="px-3 py-2 font-mono">{f.codigo}</td>
                <td className="px-3 py-2 font-semibold">{f.nome}</td>
                <td className="px-3 py-2">{f.cidade || "—"}</td>
                <td className="px-3 py-2">{f.estado || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">{f.telefone || "—"}</td>
                <td className="px-3 py-2">{f.status === "ativo" ? "Ativa" : "Inativa"}</td>
                <td className="px-3 py-2">{countBy(usuarios, f.id)}</td>
                <td className="px-3 py-2">{chamados.filter((c) => c.filial_id === f.id && c.status === "Aberto").length}</td>
                <td className="px-3 py-2 space-x-3 whitespace-nowrap">
                  <Link className="text-[#38BDF8]" to={`/central-de-suporte/admin/filiais/${f.id}`}>Usuários</Link>
                  <button className="text-white/70 hover:text-white" onClick={() => setForm({ ...f })}>Editar</button>
                </td>
              </tr>
            ))}
            {!lista.length && <tr><td colSpan={9} className="px-3 py-6 text-center text-white/50">Nenhuma filial encontrada.</td></tr>}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl bg-[#0F2D5C] p-6">
            <h2 className="font-bold text-lg mb-4">{form.id ? "Editar filial" : "Nova filial"}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {campos.map(([k, l]) => (
                <input key={k} className={inputCls} placeholder={l} value={(form[k] as string) ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              ))}
              <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="ativo">Ativa</option><option value="inativo">Inativa</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button className="text-white/70" onClick={() => setForm(null)}>Cancelar</button>
              <button className={btnCls} onClick={salvar}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[85vh] flex flex-col rounded-xl bg-[#0F2D5C] p-6">
            <h2 className="font-bold text-lg">Prévia da importação</h2>
            <p className="text-sm text-white/70 mb-3">
              {preview.filter((r) => !r.erros.length).length} serão importadas · {preview.filter((r) => r.erros.length).length} com erros (ignoradas)
            </p>
            <div className="overflow-auto flex-1 rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-left text-white/60 sticky top-0">
                  <tr>{["Linha", "Código", "Nome", "Cidade", "UF", "Situação"].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {preview.map((r) => (
                    <tr key={r.linha} className="border-t border-white/10">
                      <td className="px-3 py-2">{r.linha}</td>
                      <td className="px-3 py-2">{r.dados.codigo}</td>
                      <td className="px-3 py-2">{r.dados.nome}</td>
                      <td className="px-3 py-2">{r.dados.cidade}</td>
                      <td className="px-3 py-2">{r.dados.estado}</td>
                      <td className={"px-3 py-2 " + (r.erros.length ? "text-red-300" : "text-emerald-300")}>{r.erros.length ? r.erros.join("; ") : "OK"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button className="text-white/70" onClick={() => setPreview(null)}>Cancelar</button>
              <button className={btnCls} disabled={!preview.some((r) => !r.erros.length)} onClick={importar}>Importar válidas</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SuporteCliente = () => {
  const { id = "" } = useParams();
  return (
    <SuporteAdminShell title="Cliente" back={{ to: "/central-de-suporte/admin", label: "Clientes" }}>
      <Conteudo clienteId={id} />
    </SuporteAdminShell>
  );
};

export default SuporteCliente;
