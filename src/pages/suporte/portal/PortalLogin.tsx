import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { carregarUsuarioPortal } from "@/components/suporte/PortalLayout";

const input = "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/40";
const btn = "w-full rounded-lg bg-[#1A56DB] hover:bg-[#38BDF8] py-3.5 text-base font-bold text-white transition-colors disabled:opacity-60";

// Links de e-mail sempre apontam para o endereço público (nunca para o preview interno).
const PUBLIC_URL = /lovable\.app$|lovableproject\.com$|localhost/.test(window.location.hostname) ? "https://visionyx.com.br" : window.location.origin;

const PortalLogin = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [modo, setModo] = useState<"login" | "esqueci" | "primeiro">("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState<string | null>(
    params.get("erro") === "sem-acesso" ? "Seu e-mail não está liberado ou está inativo. Fale com a Visionyx." : null,
  );

  const confirmado = params.get("confirmado") === "1";
  useEffect(() => {
    if (confirmado) {
      // Link de confirmação cria uma sessão automática; encerramos para o usuário entrar com e-mail e senha.
      const t = setTimeout(() => supabase.auth.signOut(), 300);
      return () => clearTimeout(t);
    }
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      if (await carregarUsuarioPortal()) nav("/suporte/dashboard", { replace: true });
      else if ((await supabase.rpc("suporte_is_staff")).data) nav("/suporte/admin", { replace: true });
    });
  }, [nav, confirmado]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setBusy(true);
    const mail = email.trim().toLowerCase();
    if (modo === "esqueci") {
      const { error } = await supabase.auth.resetPasswordForEmail(mail, { redirectTo: `${PUBLIC_URL}/suporte/redefinir-senha` });
      setBusy(false);
      if (error) return setErro("Não foi possível enviar. Tente novamente em instantes.");
      toast({ title: "E-mail enviado", description: "Confira sua caixa de entrada para criar uma nova senha." });
      return setModo("login");
    }
    if (modo === "primeiro") {
      const { error } = await supabase.auth.signUp({ email: mail, password: senha });
      if (error) {
        setBusy(false);
        return setErro(error.message.includes("registered") ? "Este e-mail já possui conta. Use Entrar." : error.message);
      }
      // Sem confirmação de e-mail: segue direto para o login abaixo.
    }
    const { error } = await supabase.auth.signInWithPassword({ email: mail, password: senha });
    if (error) {
      setBusy(false);
      return setErro(error.message.includes("confirm") ? "Confirme seu e-mail antes de entrar." : "E-mail ou senha incorretos.");
    }
    const u = await carregarUsuarioPortal();
    setBusy(false);
    if (!u && (await supabase.rpc("suporte_is_staff")).data) return nav("/suporte/admin", { replace: true });
    if (!u) {
      await supabase.auth.signOut();
      return setErro("Seu e-mail não está liberado ou está inativo. Fale com a Visionyx.");
    }
    toast({ title: `Bem-vindo, ${u.nome.split(" ")[0]}!`, description: "Login realizado com sucesso." });
    nav("/suporte/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0A1F3F] text-white flex items-center justify-center px-4">
      <SEOHead title="Central de Suporte Visionyx - Acesso" description="Acesse a Central de Suporte Visionyx para abrir e acompanhar chamados." />
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0F2D5C] p-6 sm:p-8 shadow-[0_0_40px_rgba(56,189,248,0.12)]">
        <Link to="/" className="text-xs font-semibold tracking-[0.3em] text-[#38BDF8] uppercase">Visionyx Informática</Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">Central de Suporte Visionyx</h1>
        <p className="text-white/70 mt-2 mb-6">
          {modo === "esqueci" ? "Informe seu e-mail cadastrado para criar uma nova senha."
            : modo === "primeiro" ? "Crie sua senha usando o e-mail cadastrado pela Visionyx."
            : "Bem-vindo à Central de Suporte. Acesse sua conta para abrir e acompanhar seus chamados."}
        </p>
        <form onSubmit={enviar} className="space-y-4">
          <input className={input} type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          {modo !== "esqueci" && (
            <input className={input} type="password" required minLength={6} placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
          )}
          {confirmado && !erro && <p className="rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-200">E-mail confirmado com sucesso! Agora entre com seu e-mail e senha.</p>}
          {erro && <p className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200">{erro}</p>}
          <button className={btn} disabled={busy}>
            {busy ? "Aguarde..." : modo === "esqueci" ? "Enviar link" : modo === "primeiro" ? "Criar senha" : "Entrar"}
          </button>
        </form>
        <div className="mt-5 flex flex-col gap-3 text-sm text-center">
          {modo === "login" ? (
            <>
              <button className="text-[#38BDF8]" onClick={() => { setModo("esqueci"); setErro(null); }}>Esqueci minha senha</button>
              <button className="text-white/60" onClick={() => { setModo("primeiro"); setErro(null); }}>Primeiro acesso</button>
            </>
          ) : (
            <button className="text-[#38BDF8]" onClick={() => { setModo("login"); setErro(null); }}>Voltar para o login</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortalLogin;
