import { motion } from "framer-motion";
import { Settings, Sparkles, Wrench, Monitor, Download, Database, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import desktopImg from "@/assets/desktop-pc.jpg";

const services = [
  { icon: Settings, title: "Formatação", desc: "Sistema otimizado e limpo", link: "/formatacao-de-computador" },
  { icon: Sparkles, title: "Limpeza", desc: "Interna e externa completa", link: "/limpeza-de-computador" },
  { icon: Wrench, title: "Montagem", desc: "De computadores sob medida", link: "/montagem-de-pc" },
  { icon: Monitor, title: "Desktop e Notebook", desc: "Reparo e manutenção", link: "/manutencao-de-notebook" },
  { icon: Download, title: "Instalação", desc: "De programas e drivers", link: "/formatacao-de-computador" },
  { icon: Database, title: "Backup", desc: "Recuperação de dados", link: "/backup-e-recuperacao-de-dados" },
];

const Services = () => (
  <section id="servicos" className="py-24 bg-white relative">
    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary font-bold text-sm tracking-widest uppercase mb-4 block">Nossos Serviços</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900 leading-tight">
            Soluções Completas em <span className="text-primary">Tecnologia</span>
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
            Atendimento técnico especializado para manter sua produtividade em alta. Experiência e qualidade comprovada em Curitiba.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl"
        >
          <img src={desktopImg} alt="Desktop PC corporativo" className="w-full h-64 lg:h-80 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <Link to={s.link} key={s.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white border border-slate-200 rounded-2xl p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 text-primary">
                <s.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{s.title}</h3>
              <p className="text-slate-600 text-base mb-6 leading-relaxed">{s.desc}</p>
              <span className="text-primary text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Saiba mais <ArrowRight size={14} />
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
