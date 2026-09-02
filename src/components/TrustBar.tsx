const TrustBar = () => (
  <div className="fixed top-0 left-0 right-0 z-[60] bg-[#061530] text-white py-2 px-4 overflow-hidden">
    <div className="flex items-center justify-center gap-6 text-[11px] md:text-xs font-semibold">
      <span className="flex items-center gap-1.5">
        <span className="text-[#F59E0B]">★</span> 4.9 — +500 clientes em Curitiba
      </span>
      <span className="hidden sm:block text-white/30">|</span>
      <span className="hidden sm:flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
        Atendimento agora · Resposta em 15 min
      </span>
      <span className="hidden md:block text-white/30">|</span>
      <span className="hidden md:block">(41) 99523-6952</span>
    </div>
  </div>
);

export default TrustBar;
