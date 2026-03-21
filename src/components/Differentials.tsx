import { motion } from "framer-motion";
import { Clock, ShieldCheck, HeadphonesIcon } from "lucide-react";

const items = [
  { icon: Clock, title: "Atendimento Rápido", desc: "Agilidade na resolução dos seus problemas" },
  { icon: ShieldCheck, title: "Serviço Confiável", desc: "Garantia de qualidade em cada serviço" },
  { icon: HeadphonesIcon, title: "Suporte Especializado", desc: "Equipe técnica qualificada" },
];

const Differentials = () => (
  <section className="py-24 bg-surface">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center p-8"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 border border-primary/20">
              <item.icon className="text-primary" size={28} />
            </div>
            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
            <p className="text-muted-foreground text-sm font-body">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Differentials;
