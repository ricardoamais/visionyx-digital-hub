import { MessageCircle, Phone } from "lucide-react";

const Footer = () => (
  <footer className="bg-slate-900 border-t border-white/10 py-16 text-white">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="font-display text-2xl font-extrabold tracking-tight">
          VISIONYX <span className="text-primary font-bold">INFORMÁTICA</span>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-400">
          <a href="https://wa.me/5541995236952" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors font-medium">
            <MessageCircle size={18} className="text-primary" /> WhatsApp
          </a>
          <span className="flex items-center gap-2 font-medium">
            <Phone size={18} className="text-primary" /> (41) 99523-6952
          </span>
        </div>
      </div>

      <div className="text-center mt-12 pt-8 border-t border-white/5 text-sm text-slate-500">
        © {new Date().getFullYear()} Visionyx Informática. CNPJ: 56.666.903/0001-08. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
