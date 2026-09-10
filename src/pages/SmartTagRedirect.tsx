import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type State = "loading" | "redirecting" | "unconfigured" | "inactive" | "notfound";

/** Navegação top-level normal do navegador (sem fetch, iframe ou proxy). */
const goTo = (url: string) => {
  try {
    // Se estivermos dentro de um iframe (preview/embed), navega a janela do topo.
    if (window.top && window.top !== window.self) {
      window.top.location.href = url;
      return;
    }
  } catch {
    // cross-origin: cai no fallback abaixo
  }
  try {
    window.location.assign(url);
  } catch {
    window.location.href = url;
  }
};

const messages: Record<Exclude<State, "loading" | "redirecting">, string> = {
  unconfigured: "Smart Tag ainda não configurado.",
  inactive: "Este Smart Tag está temporariamente indisponível.",
  notfound: "Smart Tag não encontrado.",
};

const SmartTagRedirect = () => {
  const { code } = useParams<{ code: string }>();
  const [state, setState] = useState<State>("loading");
  const [target, setTarget] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const normalized = (code || "").trim().toUpperCase();
      if (!normalized) {
        setState("notfound");
        return;
      }
      const { data, error } = await supabase
        .from("visionyx_smart_tags")
        .select("code, status, destination_url")
        .eq("code", normalized)
        .maybeSingle();

      if (cancelled) return;
      if (error || !data) {
        setState("notfound");
        return;
      }
      if (data.status === "Inativa") {
        setState("inactive");
        return;
      }
      const url = (data.destination_url || "").trim();
      if (data.status === "Ativa" && /^https?:\/\//i.test(url)) {
        setTarget(url);
        setState("redirecting");
        goTo(url);
        return;
      }
      setState("unconfigured");
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [code]);

  useEffect(() => {
    document.title = "Visionyx Smart Tag";
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0A1F3F] px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
            <path d="M4 4h9l3 8-4.5 4L4 4Z" fill="#38BDF8" />
            <path d="M28 4h-9L9.5 28 16 20l6.5 8L28 4Z" fill="#1A56DB" />
          </svg>
          <span className="text-white font-extrabold tracking-tight uppercase">Visionyx</span>
        </div>

        {state === "loading" || state === "redirecting" ? (
          <>
            <div className="mx-auto w-8 h-8 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-sm text-white/70">
              {state === "redirecting" ? "Redirecionando..." : "Carregando..."}
            </p>
            {state === "redirecting" && target && (
              <a
                href={target}
                target="_top"
                rel="noopener"
                className="inline-block mt-4 text-sm font-semibold text-[#38BDF8] hover:underline"
              >
                Clique aqui se não for redirecionado
              </a>
            )}
          </>
        ) : (
          <>
            <h1 className="text-lg font-bold text-white">{messages[state]}</h1>
            <a
              href="https://visionyx.com.br"
              className="inline-block mt-6 text-sm font-semibold text-[#38BDF8] hover:underline"
            >
              Ir para o site da Visionyx
            </a>
          </>
        )}
      </div>
    </main>
  );
};

export default SmartTagRedirect;
