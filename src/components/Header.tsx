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
    <header className="fixed top-9 md:top-10 left-0 right-0 z-50 bg-[#0A1F3F] shadow-xl shadow-[#0A1F3F]/40">
      <div className="container mx-auto px-4 h-16 md:h-18 flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-3">
          <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 shrink-0">
            <path d="M4 4h9l3 8-4.5 4L4 4Z" fill="#38BDF8" />
            <path d="M28 4h-9L9.5 28 16 20l6.5 8L28 4Z" fill="#1A56DB" />
          </svg>
          <span className="flex flex-col leading-none">
            <span className="font-body text-base sm:text-lg font-extrabold tracking-tight text-white uppercase">
              Visionyx
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.35em] text-[#38BDF8] uppercase">
              Informática
            </span>
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
