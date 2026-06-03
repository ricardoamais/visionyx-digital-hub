import { motion } from "framer-motion";
import { Settings, Sparkles, Wrench, Monitor, Download, Database, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { icon: Settings, title: "Formatação", desc: "Sistema otimizado e limpo", link: "/formatacao-de-computador" },
  { icon: Sparkles, title: "Limpeza", desc: "Interna e externa completa", link: "/limpeza-de-computador" },
  { icon: Wrench, title: "Montagem", desc: "De computadores sob medida", link: "/montagem-de-pc" },
  { icon: Monitor, title: "Desktop e Notebook", desc: "Reparo e manutenção", link: "/manutencao-de-notebook" },
  { icon: Download, title: "Instalação", desc: "De programas e drivers", link: "/formatacao-de-computador" },
  { icon: Database, title: "Backup", desc: "Recuperação de dados", link: "/backup-e-recuperacao-de-dados" },
];

const Services = () => (
  <section id="servicos" className="py-16 bg-[#EBF3FB] relative">
    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#185FA5] font-bold text-sm tracking-widest uppercase mb-4 block">Nossos Serviços</span>
          <h2 className="text-3xl md:text-6xl font-display font-bold mb-6 text-[#042C53] leading-tight">
            Soluções Completas em Tecnologia
          </h2>
          <p className="text-[#5F5E5A] text-lg leading-relaxed max-w-2xl mx-auto">
            Atendimento técnico especializado para manter sua produtividade em alta. Experiência e qualidade comprovada em Curitiba.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s, i) => (
          <Link to={s.link} key={s.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white border border-[#D3D1C7] rounded-2xl p-5 hover:border-[#185FA5] hover:shadow-2xl hover:shadow-[#185FA5]/10 transition-all duration-300 h-full relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-[#E6F1FB] flex items-center justify-center mb-4 group-hover:bg-[#185FA5] group-hover:text-white transition-all duration-300 text-[#185FA5]">
                <s.icon size={20} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#042C53] group-hover:text-[#185FA5] transition-colors">{s.title}</h3>
              <p className="text-[#5F5E5A] text-lg mb-3 leading-relaxed">{s.desc}</p>
              <span className="text-[#185FA5] text-sm font-bold flex items-center gap-2">
                Saiba mais <ArrowRight size={16} />
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default Services;