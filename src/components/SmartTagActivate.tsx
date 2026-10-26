import { useState } from "react";
import { z } from "zod";
import { Check, KeyRound, Loader2, MapPin, Search, Star, ArrowLeft, Store, ShieldCheck } from "lucide-react";
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
  pin: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{4,12}$/, "O código deve ter de 4 a 12 letras e números."),
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

const btn =
  "w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition disabled:opacity-60";
const primary = `${btn} bg-gradient-to-r from-[#1A56DB] to-[#38BDF8] text-white shadow-[0_8px_24px_-8px_rgba(56,189,248,0.6)] hover:brightness-110`;
const input =
  "w-full rounded-xl bg-white/10 border border-white/15 pl-10 pr-3 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/30";

const STEPS = ["Código", "Negócio", "Confirmar"];

const Stepper = ({ step }: { step: number }) => (
  <ol className="flex items-center justify-between gap-1 mb-2" aria-label="Etapas da ativação">
    {STEPS.map((label, i) => {
      const done = i < step;
      const current = i === step;
      return (
        <li key={label} className="flex-1 flex items-center gap-1">
          <div className="flex flex-col items-center gap-1 min-w-0">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border transition ${
                done
                  ? "bg-[#16A34A] border-[#16A34A] text-white"
                  : current
                    ? "bg-[#1A56DB] border-[#38BDF8] text-white shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                    : "border-white/20 text-white/50"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span className={`text-[11px] ${current ? "text-white" : "text-white/50"}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <span className={`h-0.5 flex-1 rounded mb-5 ${done ? "bg-[#16A34A]" : "bg-white/15"}`} />
          )}
        </li>
      );
    })}
  </ol>
);

const SmartTagActivate = ({ code, onActivated }: Props) => {
  const [pin, setPin] = useState("");
  const [query, setQuery] = useState("");
  const [errors, setErrors] = useState<{ pin?: string; query?: string; general?: string }>({});
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [details, setDetails] = useState<Details | null>(null);
  const [loading, setLoading] = useState<"search" | "details" | "activate" | null>(null);
  const [selecting, setSelecting] = useState<string | null>(null);

  const step = details ? 2 : places ? 1 : 0;

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
    setSelecting(place.place_id);
    const { data, error } = await supabase.functions.invoke("google-places", {
      body: { action: "details", code, pin: pin.trim(), place_id: place.place_id },
    });
    setLoading(null);
    setSelecting(null);
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
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold">Ativar sua plaquinha</h1>
        <p className="text-xs text-white/60">
          Placa <span className="font-mono text-[#38BDF8]">{code}</span> · leva menos de 1 minuto
        </p>
      </div>

      <Stepper step={step} />

      {errors.general && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {errors.general}
        </p>
      )}

      {details ? (
        <div className="space-y-4">
          <div className="rounded-xl bg-white/5 border border-[#38BDF8]/40 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1A56DB]/30">
                <Store className="h-5 w-5 text-[#38BDF8]" />
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-bold break-words">{details.name}</h2>
                <p className="text-sm text-white/70 break-words">{details.address}</p>
                <p className="mt-1 text-sm">
                  <Stars value={details.rating} /> {details.rating?.toFixed(1) ?? "-"}{" "}
                  <span className="text-white/60">({details.total} avaliações)</span>
                </p>
              </div>
            </div>
          </div>
          {details.reviews?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-white/50">Últimas avaliações</p>
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
            </div>
          )}
          <p className="font-semibold text-center">É este o seu negócio?</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDetails(null)}
              disabled={loading !== null}
              className={`${btn} border border-white/20 text-white hover:bg-white/5`}
            >
              <ArrowLeft className="h-4 w-4" /> Não, voltar
            </button>
            <button onClick={activate} disabled={loading !== null} className={primary}>
              {loading === "activate" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Ativando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" /> Sim, ativar
                </>
              )}
            </button>
          </div>
          <p className="flex items-center justify-center gap-1 text-xs text-white/50">
            <ShieldCheck className="h-3.5 w-3.5" /> Depois de ativar, quem encostar o celular vai direto para avaliar você no Google.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-1">
            <label className="text-sm text-white/80" htmlFor="pin">
              Código de ativação (veio com a placa)
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                id="pin"
                inputMode="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={12}
                placeholder="Ex.: VX0004"
                value={pin}
                onChange={(e) => setPin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                className={`${input} uppercase tracking-widest`}
              />
            </div>
            {errors.pin && <p className="text-sm text-red-400">{errors.pin}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm text-white/80" htmlFor="query">
              Nome do negócio e cidade
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                id="query"
                maxLength={120}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                placeholder="Ex.: Padaria Central Curitiba"
                className={input}
              />
            </div>
            {errors.query && <p className="text-sm text-red-400">{errors.query}</p>}
          </div>
          <button onClick={search} disabled={loading !== null} className={primary}>
            {loading === "search" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Buscando...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" /> Buscar meu negócio
              </>
            )}
          </button>

          {places && places.length === 0 && (
            <p className="text-sm text-white/70 text-center">Nenhum negócio encontrado. Tente incluir a cidade.</p>
          )}
          {places && places.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-white/50">Toque no seu negócio</p>
              <ul className="space-y-2">
                {places.slice(0, 6).map((p) => (
                  <li key={p.place_id}>
                    <button
                      onClick={() => openDetails(p)}
                      disabled={loading !== null}
                      className="w-full flex items-start gap-3 text-left rounded-xl bg-white/5 border border-white/10 p-3 hover:border-[#38BDF8] hover:bg-white/10 transition disabled:opacity-60"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1A56DB]/30">
                        {selecting === p.place_id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-[#38BDF8]" />
                        ) : (
                          <Store className="h-4 w-4 text-[#38BDF8]" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold break-words">{p.name}</span>
                        <span className="block text-xs text-white/60 break-words">{p.address}</span>
                        <span className="flex items-center gap-1 text-xs mt-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {p.rating?.toFixed(1) ?? "-"}
                          <span className="text-white/60">({p.total} avaliações)</span>
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SmartTagActivate;
