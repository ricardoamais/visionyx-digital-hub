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
    "Sobre": "sobre",
    "Contato": "contato",
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} className="font-display text-lg md:text-xl font-bold tracking-wider text-foreground">
          VISIONYX <span className="text-primary">INFORMÁTICA</span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(sectionMap[item])}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item}
            </button>
          ))}
          <a
            href="https://wa.me/5541995236952"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </nav>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(sectionMap[item])}
                  className="text-left text-foreground hover:text-primary py-2 transition-colors"
                >
                  {item}
                </button>
              ))}
              <a
                href="https://wa.me/5541995236952"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 text-foreground px-4 py-3 rounded-lg font-semibold"
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
