import { describe, it, expect } from "vitest";
import { validarFiliais } from "./filialImport";

describe("validarFiliais", () => {
  it("rejeita código já cadastrado", () => {
    const r = validarFiliais([{ "Código": "F01", "Nome da Filial": "Centro" }], [{ codigo: "f01", cnpj: null }]);
    expect(r[0].erros).toContain("Código já cadastrado");
  });
  it("rejeita código duplicado no arquivo", () => {
    const r = validarFiliais([{ "Código": "F02", "Nome da Filial": "A" }, { "Código": "F02", "Nome da Filial": "B" }], []);
    expect(r[1].erros).toContain("Código duplicado no arquivo");
  });
  it("rejeita CNPJ já cadastrado", () => {
    const r = validarFiliais([{ "Código": "F03", "Nome da Filial": "A", CNPJ: "11.222.333/0001-81" }], [{ codigo: "X", cnpj: "11222333000181" }]);
    expect(r[0].erros).toContain("CNPJ já cadastrado");
  });
  it("exige nome", () => {
    expect(validarFiliais([{ "Código": "F04" }], [])[0].erros).toContain("Nome obrigatório");
  });
  it("aceita linha válida", () => {
    const r = validarFiliais([{ "Código": "F05", "Nome da Filial": "Batel", Estado: "pr", CEP: "80000-000" }], []);
    expect(r[0].erros).toEqual([]);
    expect(r[0].dados.estado).toBe("PR");
  });
});
