import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SmartTagQr from "@/components/SmartTagQr";
import {
  DESTINATION_TYPES,
  SMART_TAG_STATUS,
  SmartTag,
  formatDate,
  getSmartTagUrl,
  validateDestinationUrl,
} from "@/lib/smartTag";

const emptyForm = {
  id: "",
  code: "",
  client_name: "",
  destination_url: "",
  destination_type: "",
  status: "Disponível",
};

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/40";

const SmartTagAdmin = () => {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);

  const [tags, setTags] = useState<SmartTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    document.title = "Visionyx Smart Tag — Painel";
  }, []);

  const checkAdmin = useCallback(async (userId: string) => {
    const { data } = await supabase.rpc("claim_smart_tag_admin");
    if (data === true) return true;
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    return !!roles;
  }, []);

  const loadSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    setAuthed(!!user);
    setIsAdmin(user ? await checkAdmin(user.id) : false);
    setChecking(false);
  }, [checkAdmin]);

  useEffect(() => {
    loadSession();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadSession();
    });
    return () => sub.subscription.unsubscribe();
  }, [loadSession]);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("visionyx_smart_tags")
      .select("*")
      .order("code");
    if (error) toast.error("Não foi possível carregar os Smart Tags.");
    setTags((data as SmartTag[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) fetchTags();
  }, [isAdmin, fetchTags]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/smart-tag-admin` },
          });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(mode === "login" ? "Bem-vindo!" : "Conta criada.");
    loadSession();
  };

  const stats = useMemo(
    () => ({
      total: tags.length,
      disponivel: tags.filter((t) => t.status === "Disponível").length,
      ativa: tags.filter((t) => t.status === "Ativa").length,
      inativa: tags.filter((t) => t.status === "Inativa").length,
    }),
    [tags],
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tags.filter((t) => {
      const matchQ =
        !q ||
        t.code.toLowerCase().includes(q) ||
        (t.client_name || "").toLowerCase().includes(q);
      const matchF = filter === "Todos" || t.status === filter;
      return matchQ && matchF;
    });
  }, [tags, search, filter]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    if (!code) return toast.error("Informe o código.");
    if (form.destination_url.trim()) {
      const err = validateDestinationUrl(form.destination_url);
      if (err) return toast.error(err);
    }
    if (form.status === "Ativa" && !form.destination_url.trim()) {
      return toast.error("Um Smart Tag ativo precisa de uma URL de destino.");
    }
    const payload = {
      code,
      client_name: form.client_name.trim() || null,
      destination_url: form.destination_url.trim() || null,
      destination_type: form.destination_type || null,
      status: form.status,
    };
    setBusy(true);
    const { error } = form.id
      ? await supabase.from("visionyx_smart_tags").update(payload).eq("id", form.id)
      : await supabase.from("visionyx_smart_tags").insert(payload);
    setBusy(false);
    if (error) {
      toast.error(
        error.code === "23505" ? "Já existe um Smart Tag com esse código." : error.message,
      );
      return;
    }
    toast.success("Smart Tag salvo!");
    setForm(emptyForm);
    fetchTags();
  };

  const copyUrl = async (code: string) => {
    try {
      await navigator.clipboard.writeText(getSmartTagUrl(code));
      toast.success("URL copiada!");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed || !isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0A1F3F] px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
          <h1 className="text-xl font-extrabold text-[#0A1F3F]">Visionyx Smart Tag</h1>
          <p className="text-sm text-slate-500 mt-1 mb-6">Acesso restrito ao administrador.</p>
          {authed && !isAdmin ? (
            <div className="space-y-4">
              <p className="text-sm text-red-600">
                Esta conta não tem permissão para administrar os Smart Tags.
              </p>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  loadSession();
                }}
                className="w-full rounded-lg bg-slate-200 py-2.5 text-sm font-bold text-slate-700"
              >
                Sair
              </button>
            </div>
          ) : (
            <form onSubmit={handleAuth} className="space-y-3">
              <input
                type="email"
                required
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-lg bg-[#1A56DB] py-2.5 text-sm font-bold text-white disabled:opacity-60"
              >
                {mode === "login" ? "Entrar" : "Criar conta de administrador"}
              </button>
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="w-full text-xs font-semibold text-slate-500 hover:text-[#1A56DB]"
              >
                {mode === "login" ? "Primeiro acesso? Criar conta" : "Já tenho conta"}
              </button>
            </form>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <header className="bg-[#0A1F3F] text-white">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
              <path d="M4 4h9l3 8-4.5 4L4 4Z" fill="#38BDF8" />
              <path d="M28 4h-9L9.5 28 16 20l6.5 8L28 4Z" fill="#1A56DB" />
            </svg>
            <div>
              <p className="font-extrabold uppercase leading-none">Visionyx</p>
              <p className="text-[10px] tracking-[0.3em] text-[#38BDF8] uppercase">Smart Tag</p>
            </div>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              loadSession();
            }}
            className="text-xs font-semibold text-white/70 hover:text-white"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total", value: stats.total, color: "text-[#0A1F3F]" },
            { label: "Disponíveis", value: stats.disponivel, color: "text-slate-500" },
            { label: "Ativas", value: stats.ativa, color: "text-emerald-600" },
            { label: "Inativas", value: stats.inativa, color: "text-red-500" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white border border-slate-200 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
              <p className={`text-3xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-xl bg-white border border-slate-200 p-5">
          <h2 className="text-base font-bold text-[#0A1F3F] mb-4">
            {form.id ? "Editar Smart Tag" : "Cadastrar Smart Tag"}
          </h2>
          <form onSubmit={save} className="grid gap-3 md:grid-cols-2">
            <input
              placeholder="Código (ex: VX0001)"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className={inputClass}
            />
            <input
              placeholder="Cliente"
              value={form.client_name}
              onChange={(e) => setForm({ ...form, client_name: e.target.value })}
              className={inputClass}
            />
            <input
              placeholder="URL de destino (https://...)"
              value={form.destination_url}
              onChange={(e) => setForm({ ...form, destination_url: e.target.value })}
              className={inputClass}
            />
            <select
              value={form.destination_type}
              onChange={(e) => setForm({ ...form, destination_type: e.target.value })}
              className={inputClass}
            >
              <option value="">Tipo de destino</option>
              {DESTINATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={inputClass}
            >
              {SMART_TAG_STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={busy}
                className="flex-1 rounded-lg bg-[#1A56DB] py-2.5 text-sm font-bold text-white disabled:opacity-60"
              >
                Salvar Smart Tag
              </button>
              {form.id && (
                <button
                  type="button"
                  onClick={() => setForm(emptyForm)}
                  className="rounded-lg bg-slate-200 px-4 text-sm font-bold text-slate-700"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-xl bg-white border border-slate-200 p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              placeholder="Pesquisar por código ou cliente"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} sm:max-w-xs`}
            />
            <div className="flex flex-wrap gap-2">
              {["Todos", ...SMART_TAG_STATUS].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold border ${
                    filter === s
                      ? "bg-[#1A56DB] text-white border-[#1A56DB]"
                      : "bg-white text-slate-600 border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <th className="py-2 pr-4">Código</th>
                  <th className="py-2 pr-4">Cliente</th>
                  <th className="py-2 pr-4">Destino</th>
                  <th className="py-2 pr-4">Tipo</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Criado</th>
                  <th className="py-2 pr-4">Atualizado</th>
                  <th className="py-2 pr-4">Acessos</th>
                  <th className="py-2 pr-4">QR Code</th>
                  <th className="py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={10} className="py-6 text-center text-slate-400">
                      Carregando...
                    </td>
                  </tr>
                )}
                {!loading && visible.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-6 text-center text-slate-400">
                      Nenhum Smart Tag encontrado.
                    </td>
                  </tr>
                )}
                {visible.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4 font-bold text-[#0A1F3F]">{t.code}</td>
                    <td className="py-3 pr-4">{t.client_name || "—"}</td>
                    <td className="py-3 pr-4 max-w-[220px] truncate">
                      {t.destination_url ? (
                        <a
                          href={t.destination_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1A56DB] hover:underline"
                        >
                          {t.destination_url}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3 pr-4">{t.destination_type || "—"}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          t.status === "Ativa"
                            ? "bg-emerald-100 text-emerald-700"
                            : t.status === "Inativa"
                              ? "bg-red-100 text-red-600"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-500">{formatDate(t.created_at)}</td>
                    <td className="py-3 pr-4 text-xs text-slate-500">{formatDate(t.updated_at)}</td>
                    <td className="py-3 pr-4 font-bold text-[#0A1F3F]">{t.access_count ?? 0}</td>
                    <td className="py-3 pr-4">
                      <SmartTagQr code={t.code} />
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setForm({
                              id: t.id,
                              code: t.code,
                              client_name: t.client_name || "",
                              destination_url: t.destination_url || "",
                              destination_type: t.destination_type || "",
                              status: t.status,
                            })
                          }
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700"
                        >
                          Editar
                        </button>
                        <a
                          href={getSmartTagUrl(t.code)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700"
                        >
                          Testar
                        </a>
                        <button
                          onClick={() => copyUrl(t.code)}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700"
                        >
                          Copiar URL
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SmartTagAdmin;
