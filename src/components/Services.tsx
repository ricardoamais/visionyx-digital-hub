import { motion } from "framer-motion";
import { Settings, Sparkles, Wrench, Monitor, Download, Database, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import repairImg from "@/assets/repair-service.jpg";

const services = [
  { icon: Settings, title: "Formatação", desc: "Sistema otimizado e limpo", link: "/formatacao-de-computador" },
  { icon: Sparkles, title: "Limpeza", desc: "Interna e externa completa", link: "/limpeza-de-computador" },
  { icon: Wrench, title: "Montagem", desc: "De computadores sob medida", link: "/montagem-de-pc" },
  { icon: Monitor, title: "Desktop e Notebook", desc: "Reparo e manutenção", link: "/manutencao-de-notebook" },
  { icon: Download, title: "Instalação", desc: "De programas e drivers", link: "/formatacao-de-computador" },
  { icon: Database, title: "Backup", desc: "Recuperação de dados", link: "/backup-e-recuperacao-de-dados" },
];

const Services = () => (
  <section id="servicos" className="py-14 md:py-24 bg-white relative">
    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-10 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#185FA5] font-bold text-xs tracking-widest uppercase mb-3 block">Nossos Serviços</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-6 text-slate-900 leading-tight">
            Soluções Completas em Tecnologia
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl">
            Atendimento técnico especializado para manter sua produtividade em alta. Experiência e qualidade comprovada em Curitiba.
          </p>
        </motion.div>
        
        <div className="hidden lg:block relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl">
          <img src={repairImg} alt="Manutenção de computadores" className="w-full h-64 object-cover" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s, i) => (
          <Link to={s.link} key={s.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white border border-slate-200 rounded-2xl p-5 md:p-6 hover:border-[#185FA5] hover:shadow-xl hover:shadow-[#185FA5]/10 transition-all duration-300 h-full relative overflow-hidden"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-[#185FA5] group-hover:text-white transition-all duration-300 text-[#185FA5]">
                <s.icon size={20} />
              </div>
              <h3 className="text-base md:text-lg font-bold mb-2 text-slate-900 group-hover:text-[#185FA5] transition-colors">{s.title}</h3>
              <p className="text-slate-600 text-sm md:text-base mb-3 leading-relaxed">{s.desc}</p>
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
