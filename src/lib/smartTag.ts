export const SMART_TAG_BASE_URL = "https://visionyx.com.br";

export const DESTINATION_TYPES = [
  "Google Avaliações",
  "WhatsApp",
  "Instagram",
  "Site",
  "Outro",
] as const;

export const SMART_TAG_STATUS = ["Disponível", "Ativa", "Inativa"] as const;

export type SmartTagStatus = (typeof SMART_TAG_STATUS)[number];

export interface SmartTag {
  id: string;
  code: string;
  client_name: string | null;
  destination_url: string | null;
  destination_type: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

/** URL permanente da plaquinha (QR Code e NFC). Nunca muda. */
export const getSmartTagUrl = (code: string) =>
  `${SMART_TAG_BASE_URL}/r/${code.trim().toUpperCase()}`;

/** Valida a URL de destino. Retorna mensagem de erro ou null. */
export const validateDestinationUrl = (value: string): string | null => {
  const url = value.trim();
  if (!url) return "Informe a URL de destino.";
  if (/^javascript:/i.test(url) || /^data:/i.test(url)) {
    return "Endereço não permitido.";
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return "URL inválida. Use o formato https://...";
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return "A URL deve começar com http:// ou https://";
  }
  if (!parsed.hostname.includes(".")) {
    return "Endereço de site inválido.";
  }
  return null;
};

export const formatDate = (value: string) =>
  new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
