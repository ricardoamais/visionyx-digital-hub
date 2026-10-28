import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/** Pop-ups em tempo real: técnico assumiu o chamado / nova mensagem de outra pessoa. Só exibe, não altera nada. */
const ChamadoNotifier = ({ base }: { base: string }) => {
  const navigate = useNavigate();
  const avisados = useRef(new Set<string>());

  useEffect(() => {
    let meId: string | null = null;
    supabase.rpc("suporte_me").then(({ data }) => { meId = (data as { id: string }[] | null)?.[0]?.id ?? null; });
    const abrir = (id: string) => ({ label: "Abrir", onClick: () => navigate(`${base}/chamado/${id}`) });

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
      })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, [base, navigate]);

  return null;
};

export default ChamadoNotifier;
