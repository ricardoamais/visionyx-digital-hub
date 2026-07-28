import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = ["Início", "Serviços", "Empresas", "Sobre", "Contato"];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 110;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  const sectionMap: Record<string, string> = {
    "Início": "hero",
    "Serviços": "servicos",
    "Empresas": "empresas",
    "Sobre": "sobre",
    "Contato": "contato",
  };

  return (
    <header className="fixed top-9 md:top-10 left-0 right-0 z-50 bg-[#0F2D5C] shadow-xl shadow-[#0F2D5C]/30">
      <div className="container mx-auto px-4 h-16 md:h-18 flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1A56DB] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
              <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="10" cy="10" r="2.5" fill="white"/>
            </svg>
          </div>
          <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-white uppercase">
            Visionyx <span className="text-[#38BDF8]">Informática</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(sectionMap[item])}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              {item}
            </button>
          ))}
          <a
            href="https://wa.me/5541995236952?text=Olá! Gostaria de solicitar uma proposta de suporte técnico para minha empresa."
            className="bg-[#1A56DB] hover:bg-[#38BDF8] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-[#1A56DB]/30"
          >
            Solicitar orçamento
          </a>
        </nav>

        <button className="md:hidden text-white p-2 -mr-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0F2D5C] border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(sectionMap[item])}
                  className="text-left text-white/70 hover:text-white py-4 px-2 transition-colors text-base border-b border-white/10 last:border-0"
                >
                  {item}
                </button>
              ))}
              <a
                href="https://wa.me/5541995236952"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#16A34A] text-white px-4 py-4 rounded-lg font-bold mt-4"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
