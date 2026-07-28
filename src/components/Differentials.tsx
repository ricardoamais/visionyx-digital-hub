import { motion } from "framer-motion";
import { Clock, ShieldCheck, HeadphonesIcon } from "lucide-react";

const items = [
  { icon: Clock, title: "Atendimento Rápido", desc: "Agilidade na resolução dos seus problemas" },
  { icon: ShieldCheck, title: "Serviço Confiável", desc: "Garantia de qualidade em cada serviço" },
  { icon: HeadphonesIcon, title: "Suporte Especializado", desc: "Equipe técnica qualificada" },
];

const Differentials = () => (
  <section className="py-14 md:py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="flex flex-col items-center text-center bg-[#F8FAFF] border border-slate-100 rounded-2xl p-6 md:p-8 hover:border-[#1A56DB]/30 hover:shadow-lg transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#1A56DB] flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-[#1A56DB]/20">
              <item.icon className="text-white" size={26} />
            </div>
            <h3 className="text-base md:text-lg font-bold mb-2 text-[#0F2D5C]">{item.title}</h3>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Differentials;
