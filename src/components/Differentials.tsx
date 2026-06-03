import { motion } from "framer-motion";
import { Clock, ShieldCheck, HeadphonesIcon } from "lucide-react";

const items = [
  { icon: Clock, title: "Atendimento Rápido", desc: "Agilidade na resolução dos seus problemas" },
  { icon: ShieldCheck, title: "Serviço Confiável", desc: "Garantia de qualidade em cada serviço" },
  { icon: HeadphonesIcon, title: "Suporte Especializado", desc: "Equipe técnica qualificada" },
];

const Differentials = () => (
  <section className="py-24 bg-slate-50">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-6">
              <item.icon className="text-primary" size={36} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
            <p className="text-slate-600 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Differentials;
