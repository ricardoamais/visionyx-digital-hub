import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const temSuporte = () => typeof window !== "undefined" && "Notification" in window;

/** Notificação nativa do Windows/sistema — aparece mesmo com a aba minimizada ou em segundo plano. */
const notificarSistema = (titulo: string, corpo: string, onClick: () => void) => {
  if (!temSuporte() || Notification.permission !== "granted") return;
  if (document.visibilityState === "visible" && document.hasFocus()) return; // já aparece o pop-up na tela
  try {
    const n = new Notification(titulo, { body: corpo, icon: "/favicon.png", tag: titulo + corpo.slice(0, 20) });
    n.onclick = () => { window.focus(); onClick(); n.close(); };
  } catch { /* ignora */ }
};

/** Pop-ups em tempo real: técnico assumiu o chamado / nova mensagem de outra pessoa. Só exibe, não altera nada. */
const ChamadoNotifier = ({ base }: { base: string }) => {
  const navigate = useNavigate();
  const avisados = useRef(new Set<string>());

  // Pede permissão uma única vez, no primeiro clique do usuário (exigência dos navegadores)
  useEffect(() => {
    if (!temSuporte() || Notification.permission !== "default") return;
    const pedir = () => { Notification.requestPermission().catch(() => {}); window.removeEventListener("click", pedir); };
    window.addEventListener("click", pedir);
    return () => window.removeEventListener("click", pedir);
  }, []);

  useEffect(() => {
    let meId: string | null = null;
    supabase.rpc("suporte_me").then(({ data }) => { meId = (data as { id: string }[] | null)?.[0]?.id ?? null; });
    const ir = (id: string) => navigate(`${base}/chamado/${id}`);
    const abrir = (id: string) => ({ label: "Abrir", onClick: () => ir(id) });

    const ch = supabase
      .channel(`notifier-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "suporte_chamado_mensagens" }, (p) => {
        const m = p.new as { chamado_id: string; autor_id: string | null; autor_nome: string; mensagem: string };
        if (meId && m.autor_id === meId) return;
        toast(`💬 Nova mensagem de ${m.autor_nome}`, {
          description: m.mensagem.slice(0, 120),
          action: abrir(m.chamado_id),
          duration: 10000,
        });
        notificarSistema(`💬 Nova mensagem de ${m.autor_nome}`, m.mensagem.slice(0, 120), () => ir(m.chamado_id));
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "suporte_chamados" }, (p) => {
        const c = p.new as { id: string; protocolo: string | null; tecnico_id: string | null; iniciado_em: string | null };
        if (!c.tecnico_id || !c.iniciado_em || c.tecnico_id === meId) return;
        if (Date.now() - new Date(c.iniciado_em).getTime() > 60000) return;
        const key = `${c.id}-${c.tecnico_id}`;
        if (avisados.current.has(key)) return;
        avisados.current.add(key);
        toast.success(`🛠️ Chamado #${c.protocolo ?? ""} assumido`, {
          description: "Um técnico iniciou o atendimento.",
          action: abrir(c.id),
          duration: 10000,
        });
        notificarSistema(`🛠️ Chamado #${c.protocolo ?? ""} assumido`, "Um técnico iniciou o atendimento.", () => ir(c.id));
      })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, [base, navigate]);

  return null;
};

export default ChamadoNotifier;
