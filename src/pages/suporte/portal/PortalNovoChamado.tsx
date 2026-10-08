import { usePortal } from "@/components/suporte/PortalLayout";

const PortalNovoChamado = () => {
  const { user } = usePortal();
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-extrabold">Abrir Novo Chamado</h1>
      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-5 space-y-2">
        <p><span className="text-white/60">Solicitante:</span> <b>{user.nome}</b></p>
        <p><span className="text-white/60">Cliente:</span> <b>{user.cliente_nome}</b></p>
        <p><span className="text-white/60">Filial:</span> <b>{user.filial_nome}</b></p>
      </div>
      <p className="mt-4 text-white/60">O formulário de abertura de chamado estará disponível em breve.</p>
    </div>
  );
};

export default PortalNovoChamado;
