import { motion } from "framer-motion";
import { Settings, Sparkles, Wrench, Monitor, Download, Database } from "lucide-react";

const services = [
  { icon: Settings, title: "Formatação", desc: "Sistema otimizado e limpo" },
  { icon: Sparkles, title: "Limpeza", desc: "Interna e externa completa" },
  { icon: Wrench, title: "Montagem", desc: "De computadores sob medida" },
  { icon: Monitor, title: "Desktop e Notebook", desc: "Reparo e manutenção" },
  { icon: Download, title: "Instalação", desc: "De programas e drivers" },
  { icon: Database, title: "Backup", desc: "Recuperação de dados" },
];

const Services = () => (
  <section id="servicos" className="py-24 relative">
    <div className="absolute inset-0 gradient-radial opacity-50" />
    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Nossos <span className="text-primary text-glow">Serviços</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto font-body">
          Oferecemos soluções completas para seu computador
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:box-glow"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <s.icon className="text-primary" size={24} />
            </div>
            <h3 className="text-lg font-bold mb-1">{s.title}</h3>
            <p className="text-muted-foreground text-sm font-body">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
