import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const FormatacaoComputador = lazy(() => import("./pages/FormatacaoComputador.tsx"));
const LimpezaComputador = lazy(() => import("./pages/LimpezaComputador.tsx"));
const ManutencaoNotebook = lazy(() => import("./pages/ManutencaoNotebook.tsx"));
const SuporteEmpresas = lazy(() => import("./pages/SuporteEmpresas.tsx"));
const MontagemPC = lazy(() => import("./pages/MontagemPC.tsx"));
const BackupRecuperacao = lazy(() => import("./pages/BackupRecuperacao.tsx"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/formatacao-de-computador" element={<FormatacaoComputador />} />
            <Route path="/limpeza-de-computador" element={<LimpezaComputador />} />
            <Route path="/manutencao-de-notebook" element={<ManutencaoNotebook />} />
            <Route path="/suporte-para-empresas" element={<SuporteEmpresas />} />
            <Route path="/montagem-de-pc" element={<MontagemPC />} />
            <Route path="/backup-e-recuperacao-de-dados" element={<BackupRecuperacao />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
