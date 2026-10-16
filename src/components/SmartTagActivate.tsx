import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  code: string;
  onActivated: (url: string) => void;
}

interface Place {
  place_id: string;
  name: string;
  address: string;
  rating: number | null;
  total: number;
}
interface Review {
  author: string;
  rating: number | null;
  text: string;
  when: string;
}
interface Details extends Place {
  reviews: Review[];
}

const schema = z.object({
  pin: z.string().trim().regex(/^\d{4,12}$/, "O código deve ter de 4 a 12 números."),
  query: z.string().trim().min(3, "Informe o nome do negócio e a cidade.").max(120, "Máximo de 120 caracteres."),
});

const Stars = ({ value }: { value: number | null }) => {
  const n = Math.round(value ?? 0);
  return (
    <span className="text-amber-400" aria-label={`${value ?? 0} estrelas`}>
      {"★".repeat(n)}
      <span className="text-white/20">{"★".repeat(5 - n)}</span>
    </span>
  );
};

const btn = "w-full rounded-lg px-4 py-3 text-sm font-semibold transition disabled:opacity-60";
const input =
  "w-full rounded-lg bg-white/10 border border-white/15 px-3 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#38BDF8]";

const SmartTagActivate = ({ code, onActivated }: Props) => {
  const [pin, setPin] = useState("");
  const [query, setQuery] = useState("");
  const [errors, setErrors] = useState<{ pin?: string; query?: string; general?: string }>({});
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [details, setDetails] = useState<Details | null>(null);
  const [loading, setLoading] = useState<"search" | "details" | "activate" | null>(null);

  const search = async () => {
    const p = schema.safeParse({ pin, query });
    if (!p.success) {
      const f = p.error.flatten().fieldErrors;
      setErrors({ pin: f.pin?.[0], query: f.query?.[0] });
      return;
    }
    setErrors({});
    setLoading("search");
    const { data, error } = await supabase.functions.invoke("google-places", {
      body: { action: "search", code, pin: p.data.pin, query: p.data.query },
    });
    setLoading(null);
    if (error || !data) {
      setErrors({ general: "Não foi possível buscar. Confira o código de ativação." });
      return;
    }
    setPlaces(data.places ?? []);
    setDetails(null);
  };

  const openDetails = async (place: Place) => {
    setErrors({});
    setLoading("details");
    const { data, error } = await supabase.functions.invoke("google-places", {
      body: { action: "details", code, pin: pin.trim(), place_id: place.place_id },
    });
    setLoading(null);
    if (error || !data) {
      setErrors({ general: "Não foi possível carregar os detalhes." });
      return;
    }
    setDetails(data as Details);
  };

  const activate = async () => {
    if (!details) return;
    setErrors({});
    setLoading("activate");
    const { data, error } = await supabase.rpc("activate_smart_tag", {
      _code: code,
      _pin: pin.trim(),
      _place_id: details.place_id,
      _place_name: details.name,
      _place_address: details.address,
    });
    setLoading(null);
    if (error || data !== true) {
      setErrors({ general: "Não foi possível ativar. Confira o código de ativação." });
      return;
    }
    onActivated("https://search.google.com/local/writereview?placeid=" + details.place_id);
  };

  return (
    <div className="w-full text-left text-white space-y-4">
      {errors.general && <p className="text-sm text-red-400">{errors.general}</p>}

      {details ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold">{details.name}</h2>
            <p className="text-sm text-white/70">{details.address}</p>
            <p className="mt-1 text-sm">
              <Stars value={details.rating} /> {details.rating?.toFixed(1) ?? "-"}{" "}
              <span className="text-white/60">({details.total} avaliações)</span>
            </p>
          </div>
          {details.reviews?.length > 0 && (
            <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {details.reviews.map((r, i) => (
                <li key={i} className="rounded-lg bg-white/5 border border-white/10 p-3">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-semibold break-words">{r.author}</span>
                    <span className="text-xs text-white/50 shrink-0">{r.when}</span>
                  </div>
                  <Stars value={r.rating} />
                  {r.text && <p className="mt-1 text-sm text-white/80 break-words">{r.text}</p>}
                </li>
              ))}
            </ul>
          )}
          <p className="font-semibold text-center">É este o seu negócio?</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDetails(null)}
              disabled={loading !== null}
              className={`${btn} border border-white/20 text-white`}
            >
              Não, voltar
            </button>
            <button
              onClick={activate}
              disabled={loading !== null}
              className={`${btn} bg-[#1A56DB] text-white hover:bg-[#1A56DB]/90`}
            >
              {loading === "activate" ? "Ativando..." : "Sim, ativar"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-xl font-bold text-center">Ativar sua plaquinha</h1>
          <div className="space-y-1">
            <label className="text-sm text-white/80" htmlFor="pin">
              Código de ativação (veio com a placa)
            </label>
            <input
              id="pin"
              inputMode="numeric"
              maxLength={12}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className={input}
            />
            {errors.pin && <p className="text-sm text-red-400">{errors.pin}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm text-white/80" htmlFor="query">
              Nome do negócio e cidade
            </label>
            <input
              id="query"
              maxLength={120}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Ex.: Padaria Central Curitiba"
              className={input}
            />
            {errors.query && <p className="text-sm text-red-400">{errors.query}</p>}
          </div>
          <button
            onClick={search}
            disabled={loading !== null}
            className={`${btn} bg-[#1A56DB] text-white hover:bg-[#1A56DB]/90`}
          >
            {loading === "search" ? "Buscando..." : "Buscar meu negócio"}
          </button>

          {places && places.length === 0 && (
            <p className="text-sm text-white/70 text-center">Nenhum negócio encontrado. Tente incluir a cidade.</p>
          )}
          {places && places.length > 0 && (
            <ul className="space-y-2">
              {places.slice(0, 6).map((p) => (
                <li key={p.place_id}>
                  <button
                    onClick={() => openDetails(p)}
                    disabled={loading !== null}
                    className="w-full text-left rounded-lg bg-white/5 border border-white/10 p-3 hover:border-[#38BDF8] disabled:opacity-60"
                  >
                    <p className="font-semibold break-words">{p.name}</p>
                    <p className="text-xs text-white/60 break-words">{p.address}</p>
                    <p className="text-xs mt-1">
                      <Stars value={p.rating} /> {p.rating?.toFixed(1) ?? "-"}{" "}
                      <span className="text-white/60">({p.total} avaliações)</span>
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {loading === "details" && <p className="text-sm text-[#38BDF8] text-center">Carregando detalhes...</p>}
        </>
      )}
    </div>
  );
};

export default SmartTagActivate;
