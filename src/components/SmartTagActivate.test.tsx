import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import SmartTagActivate from "./SmartTagActivate";

const mocks = vi.hoisted(() => ({ invoke: vi.fn(), rpc: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke: mocks.invoke }, rpc: mocks.rpc } }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });

it("completes the demonstration without Google requests, real activation or redirects", () => {
  const onActivated = vi.fn();
  render(<SmartTagActivate code="VX0004" demo onActivated={onActivated} />);
  fireEvent.change(screen.getByLabelText("Código de ativação (veio com a placa)"), { target: { value: "VX0004" } });
  fireEvent.change(screen.getByLabelText("Nome do negócio e cidade"), { target: { value: "Visionyx Curitiba" } });
  fireEvent.click(screen.getByRole("button", { name: "Buscar meu negócio" }));
  fireEvent.click(screen.getByRole("button", { name: /Visionyx Curitiba \(fictício\)/ }));
  fireEvent.click(screen.getByRole("button", { name: "Sim, ativar" }));
  expect(screen.getByText("Teste concluído!")).toBeInTheDocument();
  expect(mocks.invoke).not.toHaveBeenCalled();
  expect(mocks.rpc).not.toHaveBeenCalled();
  expect(onActivated).not.toHaveBeenCalled();
});