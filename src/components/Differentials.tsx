import { motion } from "framer-motion";
import { Clock, ShieldCheck, HeadphonesIcon } from "lucide-react";

const items = [
  { icon: Clock, title: "Atendimento Rápido", desc: "Agilidade na resolução dos seus problemas" },
  { icon: ShieldCheck, title: "Serviço Confiável", desc: "Garantia de qualidade em cada serviço" },
  { icon: HeadphonesIcon, title: "Suporte Especializado", desc: "Equipe técnica qualificada" },
];

const Differentials = () => (
  <section className="py-16 bg-[#EBF3FB]">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-white p-6 rounded-3xl border border-[#D3D1C7]/50 hover:border-[#185FA5] hover:shadow-2xl transition-all duration-300 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E6F1FB] flex items-center justify-center mx-auto mb-4 text-[#185FA5]">
              <item.icon size={22} />
            </div>
            <h3 className="text-2xl font-display font-bold mb-4 text-[#042C53]">{item.title}</h3>
            <p className="text-[#5F5E5A] text-lg leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Differentials;