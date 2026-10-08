import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import SuporteAdminShell, { btnCls, inputCls } from "@/components/suporte/SuporteAdminShell";

type Perfil = "usuario_filial" | "admin_filial";
type Usuario = { id?: string; nome: string; email: string; telefone: string | null; setor: string | null; cargo: string | null; perfil: Perfil; status: string };
const perfis: Record<string, string> = { usuario_filial: "Usuário da Filial", admin_filial: "Administrador da Filial" };
const vazio: Usuario = { nome: "", email: "", telefone: null, setor: null, cargo: null, perfil: "usuario_filial", status: "ativo" };

const Conteudo = ({ filialId }: { filialId: string }) => {
  const [filial, setFilial] = useState<{ nome: string; codigo: string; cliente_id: string } | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState<Usuario | null>(null);

  const load = async () => {
    const [f, u] = await Promise.all([
      supabase.from("suporte_filiais").select("nome, codigo, cliente_id").eq("id", filialId).maybeSingle(),
      supabase.from("suporte_usuarios").select("id, nome, email, telefone, setor, cargo, perfil, status").eq("filial_id", filialId).order("nome"),
    ]);
    setFilial(f.data);
    setUsuarios((u.data as Usuario[]) ?? []);
  };
  useEffect(() => { load(); }, [filialId]);

  const salvar = async () => {
    if (!form || !filial) return;
    if (!form.nome.trim() || !form.email.trim()) return toast({ title: "Preencha nome e e-mail", variant: "destructive" });
    const { id, ...dados } = form;
    const payload = { ...dados, email: dados.email.trim().toLowerCase(), filial_id: filialId, cliente_id: filial.cliente_id };
    const { error } = id
      ? await supabase.from("suporte_usuarios").update(payload).eq("id", id)
      : await supabase.from("suporte_usuarios").insert(payload);
    if (error) {
      const msg = error.code === "23505" ? "E-mail já cadastrado." : error.message;
      return toast({ title: "Erro ao salvar", description: msg, variant: "destructive" });
    }
    setForm(null);
    load();
  };

  if (!filial) return <p className="text-white/60">Carregando...</p>;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold text-[#38BDF8]">{filial.codigo} · {filial.nome} — Usuários</h2>
        <button className={btnCls} onClick={() => setForm({ ...vazio })}>+ Novo Usuário</button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-white/60">
            <tr>{["Nome", "E-mail", "WhatsApp", "Setor", "Cargo", "Perfil", "Status", ""].map((h) => <th key={h} className="px-3 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">{u.nome}</td>
                <td className="px-3 py-2">{u.email}</td>
                <td className="px-3 py-2">{u.telefone || "—"}</td>
                <td className="px-3 py-2">{u.setor || "—"}</td>
                <td className="px-3 py-2">{u.cargo || "—"}</td>
                <td className="px-3 py-2">{perfis[u.perfil] ?? u.perfil}</td>
                <td className="px-3 py-2 capitalize">{u.status}</td>
                <td className="px-3 py-2"><button className="text-white/70 hover:text-white" onClick={() => setForm(u)}>Editar</button></td>
              </tr>
            ))}
            {!usuarios.length && <tr><td colSpan={8} className="px-3 py-6 text-center text-white/50">Nenhum usuário cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl bg-[#0F2D5C] p-6">
            <h2 className="font-bold text-lg mb-4">{form.id ? "Editar usuário" : "Novo usuário"}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {([["nome", "Nome *"], ["email", "E-mail *"], ["telefone", "WhatsApp/telefone"], ["setor", "Setor"], ["cargo", "Cargo"]] as const).map(([k, l]) => (
                <input key={k} className={inputCls} placeholder={l} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              ))}
              <select className={inputCls} value={form.perfil} onChange={(e) => setForm({ ...form, perfil: e.target.value as Perfil })}>
                <option value="usuario_filial">Usuário da Filial</option><option value="admin_filial">Administrador da Filial</option>
              </select>
              <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="ativo">Ativo</option><option value="inativo">Inativo</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button className="text-white/70" onClick={() => setForm(null)}>Cancelar</button>
              <button className={btnCls} onClick={salvar}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SuporteFilial = () => {
  const { id = "" } = useParams();
  return (
    <SuporteAdminShell title="Filial" back={{ to: "/central-de-suporte/admin", label: "Clientes" }}>
      <Conteudo filialId={id} />
    </SuporteAdminShell>
  );
};

export default SuporteFilial;
