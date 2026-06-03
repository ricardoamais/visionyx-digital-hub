import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = ["Início", "Serviços", "Empresas", "Sobre", "Contato"];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} className="font-display text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-[#042C53]">
          <span className="sm:hidden uppercase">VISIONYX</span>
          <span className="hidden sm:inline uppercase">VISIONYX <span className="text-[#185FA5]">INFORMÁTICA</span></span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(sectionMap[item])}
              className="text-sm font-medium text-[#5F5E5A] hover:text-[#185FA5] transition-colors"
            >
              {item}
            </button>
          ))}
          <a
            href="https://wa.me/5541995236952?text=Olá! Gostaria de solicitar uma proposta de suporte técnico para minha empresa."
            className="bg-[#185FA5] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#378ADD] transition-all"
          >
            Solicitar orçamento
          </a>
        </nav>

        <button className="md:hidden text-[#042C53] p-2 -mr-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(sectionMap[item])}
                  className="text-left text-[#5F5E5A] hover:text-[#185FA5] py-4 px-2 transition-colors text-base border-b border-slate-100 last:border-0"
                >
                  {item}
                </button>
              ))}
              <a
                href="https://wa.me/5541995236952"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-4 rounded-lg font-semibold mt-4"
              >
                <MessageCircle size={16} />
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
