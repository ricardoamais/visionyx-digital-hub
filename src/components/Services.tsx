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
  <section id="servicos" className="py-24 relative">
    <div className="absolute inset-0 gradient-radial opacity-50" />
    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Serviços de <span className="text-primary text-glow">Informática em Curitiba</span>
          </h2>
          <p className="text-muted-foreground max-w-xl font-body mb-6">
            Oferecemos soluções completas para seu computador, desde formatação até montagem personalizada.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-border box-glow"
        >
          <img src={desktopImg} alt="Desktop PC com LED azul" className="w-full h-64 lg:h-80 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
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
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:box-glow h-full"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <s.icon className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold mb-1">{s.title}</h3>
              <p className="text-muted-foreground text-sm font-body mb-3">{s.desc}</p>
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
