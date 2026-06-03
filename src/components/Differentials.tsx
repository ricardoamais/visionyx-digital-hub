import { motion } from "framer-motion";
import { Clock, ShieldCheck, HeadphonesIcon } from "lucide-react";

const items = [
  { icon: Clock, title: "Atendimento Rápido", desc: "Agilidade na resolução dos seus problemas" },
  { icon: ShieldCheck, title: "Serviço Confiável", desc: "Garantia de qualidade em cada serviço" },
  { icon: HeadphonesIcon, title: "Suporte Especializado", desc: "Equipe técnica qualificada" },
];

const Differentials = () => (
  <section className="py-14 md:py-24 bg-slate-50">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-center"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#185FA5]/5 flex items-center justify-center mx-auto mb-4">
              <item.icon className="text-[#185FA5]" size={24} />
            </div>
            <h3 className="text-base md:text-lg font-bold mb-2 text-slate-900">{item.title}</h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Differentials;
