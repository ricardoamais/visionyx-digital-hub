import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import SuporteAdminShell, { btnCls, inputCls } from "@/components/suporte/SuporteAdminShell";

type Cliente = { id: string; nome: string; cnpj: string | null; telefone: string | null; email: string | null; endereco: string | null; status: string; created_at: string };

const Lista = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filiais, setFiliais] = useState<Record<string, number>>({});
  const [usuarios, setUsuarios] = useState<Record<string, number>>({});
  const [edit, setEdit] = useState<Cliente | null>(null);

  const load = async () => {
    const [c, f, u] = await Promise.all([
      supabase.from("suporte_clientes").select("*").order("nome"),
      supabase.from("suporte_filiais").select("cliente_id"),
      supabase.from("suporte_usuarios").select("cliente_id"),
    ]);
    setClientes((c.data as Cliente[]) ?? []);
    const count = (rows: { cliente_id: string | null }[] | null) =>
      (rows ?? []).reduce<Record<string, number>>((a, r) => (r.cliente_id ? { ...a, [r.cliente_id]: (a[r.cliente_id] ?? 0) + 1 } : a), {});
    setFiliais(count(f.data));
    setUsuarios(count(u.data));
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!edit) return;
    const { id, created_at, ...rest } = edit;
    const { error } = await supabase.from("suporte_clientes").update(rest).eq("id", id);
    if (error) return toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    setEdit(null);
    load();
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-white/60">
            <tr>{["Empresa", "CNPJ", "Filiais", "Usuários", "Status", "Cadastro", "Ações"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id} className="border-t border-white/10">
                <td className="px-4 py-3 font-semibold">{c.nome}</td>
                <td className="px-4 py-3">{c.cnpj || "—"}</td>
                <td className="px-4 py-3">{filiais[c.id] ?? 0}</td>
                <td className="px-4 py-3">{usuarios[c.id] ?? 0}</td>
                <td className="px-4 py-3 capitalize">{c.status}</td>
                <td className="px-4 py-3">{new Date(c.created_at).toLocaleDateString("pt-BR")}</td>
                <td className="px-4 py-3 space-x-3 whitespace-nowrap">
                  <Link to={`/central-de-suporte/admin/clientes/${c.id}`} className="text-[#38BDF8]">Visualizar</Link>
                  <button className="text-white/70 hover:text-white" onClick={() => setEdit(c)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-[#0F2D5C] p-6 space-y-3">
            <h2 className="font-bold text-lg">Editar cliente</h2>
            {(["nome", "cnpj", "telefone", "email", "endereco"] as const).map((k) => (
              <input key={k} className={inputCls} placeholder={k} value={edit[k] ?? ""} onChange={(e) => setEdit({ ...edit, [k]: e.target.value })} />
            ))}
            <select className={inputCls} value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
              <option value="ativo">Ativo</option><option value="inativo">Inativo</option>
            </select>
            <div className="flex justify-end gap-3 pt-2">
              <button className="text-white/70" onClick={() => setEdit(null)}>Cancelar</button>
              <button className={btnCls} onClick={save}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SuporteClientes = () => (
  <SuporteAdminShell title="Clientes" back={{ to: "/central-de-suporte", label: "Central de Suporte" }}>
    <Lista />
  </SuporteAdminShell>
);

export default SuporteClientes;
