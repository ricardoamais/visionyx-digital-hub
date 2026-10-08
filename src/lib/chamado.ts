import { z } from "zod";

export const CATEGORIAS = [
  "Computador", "Notebook", "Internet", "Rede / Wi-Fi", "Impressora", "Sistema / Software", "E-mail",
  "Telefonia / PABX", "Firewall / Segurança", "Servidor", "Equipamento", "Outros",
] as const;
export const PRIORIDADES = ["Baixa", "Normal", "Alta", "Urgente"] as const;

export const MAX_ANEXO = 10 * 1024 * 1024;
export const MAX_ANEXOS = 5;
export const TIPOS_PERMITIDOS: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"], "image/png": ["png"], "image/webp": ["webp"], "image/gif": ["gif"],
  "application/pdf": ["pdf"], "text/plain": ["txt"],
  "application/msword": ["doc"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"],
  "application/vnd.ms-excel": ["xls"], "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"],
};

export const chamadoSchema = z.object({
  categoria: z.enum(CATEGORIAS, { errorMap: () => ({ message: "Escolha a categoria" }) }),
  prioridade: z.enum(PRIORIDADES, { errorMap: () => ({ message: "Escolha a prioridade" }) }),
  assunto: z.string().trim().min(1, "Informe o assunto").max(150, "Máximo de 150 caracteres"),
  descricao: z.string().trim().min(1, "Descreva o problema").max(5000, "Máximo de 5000 caracteres"),
  equipamento: z.string().trim().max(150, "Máximo de 150 caracteres").optional(),
});

/** Retorna mensagem de erro ou null se o arquivo é aceito. */
export function validarAnexo(f: { name: string; type: string; size: number }): string | null {
  const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
  const exts = TIPOS_PERMITIDOS[f.type];
  if (!exts || !exts.includes(ext)) return `${f.name}: tipo de arquivo não permitido`;
  if (f.size <= 0) return `${f.name}: arquivo vazio`;
  if (f.size > MAX_ANEXO) return `${f.name}: maior que 10 MB`;
  return null;
}
