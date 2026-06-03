import { MessageCircle, Phone } from "lucide-react";

const Footer = () => (
  <footer className="bg-[#1E293B] border-t border-white/5 py-24 text-white">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
        {/* Brand Column */}
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#185FA5] rounded-sm transform rotate-45" />
            <span className="font-display text-2xl font-bold tracking-tight">
              Vision<span className="text-[#185FA5]">yx</span>
            </span>
          </div>
          <p className="text-gray-400 text-lg leading-relaxed">
            Soluções completas em tecnologia para empresas e pessoas físicas em Curitiba e região.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://wa.me/5541995236952" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <MessageCircle size={24} />
            </a>
            <span className="text-gray-400">Curitiba / PR</span>
          </div>
        </div>

        {/* Services Column */}
        <div className="space-y-8">
          <h4 className="text-lg font-bold uppercase tracking-widest text-[#185FA5]">Serviços</h4>
          <ul className="space-y-4 text-gray-400 text-lg">
            <li><a href="/formatacao-de-computador" className="hover:text-white transition-colors">Formatação</a></li>
            <li><a href="/limpeza-de-computador" className="hover:text-white transition-colors">Limpeza</a></li>
            <li><a href="/montagem-de-pc" className="hover:text-white transition-colors">Montagem de PC</a></li>
            <li><a href="/manutencao-de-notebook" className="hover:text-white transition-colors">Notebooks</a></li>
            <li><a href="/backup-e-recuperacao-de-dados" className="hover:text-white transition-colors">Backup</a></li>
          </ul>
        </div>

        {/* Company Column */}
        <div className="space-y-8">
          <h4 className="text-lg font-bold uppercase tracking-widest text-[#185FA5]">Empresa</h4>
          <ul className="space-y-4 text-gray-400 text-lg">
            <li><button onClick={() => document.getElementById("sobre")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors">Sobre nós</button></li>
            <li><button onClick={() => document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors">Contato</button></li>
            <li><button onClick={() => document.getElementById("empresas")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors">Empresas</button></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-8">
          <h4 className="text-lg font-bold uppercase tracking-widest text-[#185FA5]">Contato</h4>
          <div className="space-y-6">
            <a href="https://wa.me/5541995236952" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#185FA5]/20 transition-colors">
                <MessageCircle size={20} className="text-[#185FA5]" />
              </div>
              <span className="text-lg">(41) 99523-6952</span>
            </a>
            <div className="flex items-center gap-4 text-gray-400 group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                <Phone size={20} className="text-[#185FA5]" />
              </div>
              <span className="text-lg">(41) 99523-6952</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Visionyx Informática. CNPJ: 56.666.903/0001-08. Todos os direitos reservados.
        </div>
        <div className="flex items-center gap-8 text-sm text-gray-500">
          <span className="uppercase tracking-widest font-bold text-[10px]">Desenvolvido por Visionyx</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;