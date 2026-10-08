import { describe, it, expect } from "vitest";
import { chamadoSchema, validarAnexo } from "./chamado";

const base = { categoria: "Computador", prioridade: "Normal", assunto: "PC não liga", descricao: "Desde hoje cedo." };

describe("chamado", () => {
  it("rejeita assunto com mais de 150 caracteres", () => {
    expect(chamadoSchema.safeParse({ ...base, assunto: "a".repeat(151) }).success).toBe(false);
  });
  it("exige descrição", () => {
    expect(chamadoSchema.safeParse({ ...base, descricao: "  " }).success).toBe(false);
  });
  it("aceita chamado válido", () => {
    expect(chamadoSchema.safeParse(base).success).toBe(true);
  });
  it("bloqueia executável", () => {
    expect(validarAnexo({ name: "x.exe", type: "application/x-msdownload", size: 10 })).not.toBeNull();
  });
  it("bloqueia extensão disfarçada", () => {
    expect(validarAnexo({ name: "foto.exe", type: "image/png", size: 10 })).not.toBeNull();
  });
  it("bloqueia arquivo acima de 10 MB", () => {
    expect(validarAnexo({ name: "a.pdf", type: "application/pdf", size: 10 * 1024 * 1024 + 1 })).not.toBeNull();
  });
  it("aceita foto png", () => {
    expect(validarAnexo({ name: "tela.png", type: "image/png", size: 2000 })).toBeNull();
  });
});
