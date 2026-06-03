import { MessageCircle, Phone } from "lucide-react";

const Footer = () => (
  <footer className="bg-slate-900 border-t border-white/10 py-10 md:py-16 text-white">
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between mb-10 md:mb-16">
        {/* Brand Column */}
        <div className="space-y-6 text-center md:text-left">
          <div className="font-display text-xl md:text-2xl font-extrabold tracking-tight">
            VISIONYX <span className="text-[#185FA5]">INFORMÁTICA</span>
          </div>
          <p className="text-slate-400 text-base max-w-xs mx-auto md:mx-0">
            Soluções completas em tecnologia para empresas e pessoas físicas em Curitiba.
          </p>
        </div>

        {/* Links Column */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-sm text-slate-400 font-medium">
          <button onClick={() => document.getElementById("servicos")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors">Serviços</button>
          <button onClick={() => document.getElementById("empresas")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors">Empresas</button>
          <button onClick={() => document.getElementById("sobre")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors">Sobre nós</button>
          <button onClick={() => document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors">Contato</button>
        </div>

        {/* Contact info Column */}
        <div className="flex flex-col items-center md:items-end gap-3 text-slate-400">
          <a href="https://wa.me/5541995236952" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
            <MessageCircle size={18} className="text-[#185FA5]" />
            (41) 99523-6952
          </a>
          <div className="flex items-center gap-2">
            <Phone size={18} className="text-[#185FA5]" />
            (41) 99523-6952
          </div>
        </div>
      </div>

      <div className="text-center mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/5 text-xs md:text-sm text-slate-500 px-4">
        © {new Date().getFullYear()} Visionyx Informática · CNPJ: 56.666.903/0001-08 · Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
