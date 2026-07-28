import { motion } from "framer-motion";
import { Paintbrush, Shirt, Zap } from "lucide-react";

const clients = [
  { name: "Tintas Darka", category: "Tintas & Revestimentos", icon: Paintbrush },
  { name: "Hering Store", category: "Moda & Varejo", icon: Shirt },
  { name: "Ads Eletro", category: "Eletroeletrônicos", icon: Zap },
];

const Clients = () => (
  <section className="py-10 bg-[#F8FAFF] border-y border-slate-100">
    <div className="container mx-auto px-4">
      <p className="text-center text-slate-400 text-[11px] font-bold uppercase tracking-[0.25em] mb-8">
        Empresas que confiam na Visionyx
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
        {clients.map((client, i) => (
          <motion.div
            key={client.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3 hover:border-[#1A56DB]/40 hover:shadow-md transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F0F6FF] flex items-center justify-center text-[#1A56DB] group-hover:bg-[#1A56DB] group-hover:text-white transition-colors shrink-0">
              <client.icon size={16} />
            </div>
            <div>
              <p className="text-[#0F2D5C] font-bold text-sm">{client.name}</p>
              <p className="text-slate-400 text-[10px]">{client.category}</p>
            </div>
            <span className="ml-2 bg-green-50 text-green-700 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border border-green-200">
              Ativo
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Clients;
