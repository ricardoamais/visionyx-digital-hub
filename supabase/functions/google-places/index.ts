import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const base = { code: z.string().trim().min(1).max(40), pin: z.string().trim().min(1).max(20) };
const Body = z.discriminatedUnion("action", [
  z.object({ action: z.literal("search"), ...base, query: z.string().trim().min(3).max(120) }),
  z.object({ action: z.literal("details"), ...base, place_id: z.string().regex(/^[A-Za-z0-9_-]{10,300}$/) }),
]);

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido" }, 405);
  try {
    let raw: unknown;
    try { raw = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }
    const parsed = Body.safeParse(raw);
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const b = parsed.data;

    const key = Deno.env.get("GOOGLE_PLACES_API_KEY");
    if (!key) return json({ error: "Serviço não configurado" }, 500);

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: ok, error } = await admin.rpc("smart_tag_check_pin", { _code: b.code, _pin: b.pin });
    if (error || ok !== true) return json({ error: "PIN inválido ou Smart Tag indisponível" }, 403);

    if (b.action === "search") {
      const r = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount",
        },
        body: JSON.stringify({ textQuery: b.query, languageCode: "pt-BR", regionCode: "BR", pageSize: 6 }),
      });
      if (!r.ok) {
        const t = await r.text();
        console.error(`Places search [${r.status}]: ${t}`);
        return json({ error: "Falha na busca", status: r.status }, 502);
      }
      const d = await r.json();
      return json({
        places: (d.places ?? []).map((p: any) => ({
          place_id: p.id, name: p.displayName?.text ?? "", address: p.formattedAddress ?? "",
          rating: p.rating ?? null, total: p.userRatingCount ?? 0,
        })),
      });
    }

    const r = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(b.place_id)}?languageCode=pt-BR`,
      { headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "id,displayName,formattedAddress,rating,userRatingCount,reviews" } },
    );
    if (!r.ok) {
      const t = await r.text();
      console.error(`Places details [${r.status}]: ${t}`);
      return json({ error: "Falha ao obter detalhes", status: r.status }, 502);
    }
    const p = await r.json();
    return json({
      place_id: p.id, name: p.displayName?.text ?? "", address: p.formattedAddress ?? "",
      rating: p.rating ?? null, total: p.userRatingCount ?? 0,
      reviews: (p.reviews ?? []).slice(0, 5).map((v: any) => ({
        author: v.authorAttribution?.displayName ?? "", rating: v.rating ?? null,
        text: v.text?.text ?? "", when: v.relativePublishTimeDescription ?? "",
      })),
    });
  } catch (e) {
    console.error(e);
    return json({ error: "Erro interno" }, 500);
  }
});
