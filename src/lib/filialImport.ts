export interface FilialInput {
  codigo: string;
  nome: string;
  cnpj: string | null;
  endereco: string | null;
  numero: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  telefone: string | null;
  email: string | null;
  responsavel: string | null;
}

export interface ImportRow {
  linha: number;
  dados: FilialInput;
  erros: string[];
}

const norm = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]/g, "");

const COLS: Record<string, keyof FilialInput> = {
  codigo: "codigo",
  nomedafilial: "nome",
  nome: "nome",
  cnpj: "cnpj",
  endereco: "endereco",
  numero: "numero",
  bairro: "bairro",
  cidade: "cidade",
  estado: "estado",
  uf: "estado",
  cep: "cep",
  telefone: "telefone",
  email: "email",
  responsavel: "responsavel",
};

const digits = (s: string | null) => (s ? s.replace(/\D/g, "") : "");

export function validarFiliais(
  rows: Record<string, unknown>[],
  existentes: { codigo: string; cnpj: string | null }[],
): ImportRow[] {
  const codigosExist = new Set(existentes.map((e) => e.codigo.trim().toUpperCase()));
  const cnpjExist = new Set(existentes.map((e) => digits(e.cnpj)).filter(Boolean));
  const codigosArq = new Set<string>();
  const cnpjArq = new Set<string>();

  return rows.map((raw, i) => {
    const d: FilialInput = {
      codigo: "", nome: "", cnpj: null, endereco: null, numero: null, bairro: null,
      cidade: null, estado: null, cep: null, telefone: null, email: null, responsavel: null,
    };
    for (const [k, v] of Object.entries(raw)) {
      const campo = COLS[norm(k)];
      if (!campo) continue;
      const val = v == null ? "" : String(v).trim();
      (d as unknown as Record<string, string | null>)[campo] = val || (campo === "codigo" || campo === "nome" ? "" : null);
    }
    const erros: string[] = [];
    if (!d.codigo) erros.push("Código obrigatório");
    if (!d.nome) erros.push("Nome obrigatório");
    const cod = d.codigo.toUpperCase();
    if (cod && codigosExist.has(cod)) erros.push("Código já cadastrado");
    else if (cod && codigosArq.has(cod)) erros.push("Código duplicado no arquivo");
    if (cod) codigosArq.add(cod);

    if (d.cnpj) {
      const c = digits(d.cnpj);
      if (c.length !== 14) erros.push("CNPJ inválido");
      else if (cnpjExist.has(c)) erros.push("CNPJ já cadastrado");
      else if (cnpjArq.has(c)) erros.push("CNPJ duplicado no arquivo");
      cnpjArq.add(c);
    }
    if (d.estado) {
      d.estado = d.estado.toUpperCase();
      if (!/^[A-Z]{2}$/.test(d.estado)) erros.push("Estado deve ter 2 letras");
    }
    if (d.cep && digits(d.cep).length !== 8) erros.push("CEP inválido");
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) erros.push("E-mail inválido");
    return { linha: i + 2, dados: d, erros };
  });
}
