import { MessageCircle } from "lucide-react";

const Footer = () => (
  <footer className="bg-[#080F1E] border-t border-white/5 py-12 md:py-16 text-white">
    <div className="container mx-auto px-4">
      <div className="h-px bg-gradient-to-r from-transparent via-[#1A56DB] to-transparent mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#1A56DB] flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <circle cx="10" cy="10" r="2.5" fill="white"/>
              </svg>
            </div>
            <span className="font-display text-lg font-extrabold uppercase">Visionyx <span className="text-[#38BDF8]">Informática</span></span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-4">
            Soluções completas em tecnologia para empresas e pessoas físicas em Curitiba e região.
          </p>
          <a href="https://wa.me/5541995236952" className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all">
            <MessageCircle size={16} />
            (41) 99523-6952
          </a>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Serviços</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            {["Formatação", "Limpeza", "Montagem de PC", "Manutenção Notebook", "Backup e Dados"].map(s => (
              <li key={s}><span className="hover:text-white transition-colors cursor-pointer">{s}</span></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Empresa</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            {[
              { label: "Sobre nós", id: "sobre" },
              { label: "Suporte Empresarial", id: "empresas" },
              { label: "Contato", id: "contato" },
            ].map(item => (
              <li key={item.label}>
                <button
                  onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}
                  className="hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li><span className="text-slate-500 text-xs">CNPJ: 56.666.903/0001-08</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
        <span>© {new Date().getFullYear()} Visionyx Informática. Todos os direitos reservados.</span>
        <span>Curitiba / PR 🌲</span>
      </div>
    </div>
  </footer>
);

export default Footer;
