import { motion } from "framer-motion";
import { Paintbrush, Shirt, Zap } from "lucide-react";

const clients = [
  { 
    name: "Tintas Darka", 
    category: "Tintas & Revestimentos", 
    icon: Paintbrush,
    badge: "Contrato Ativo"
  },
  { 
    name: "Hering Store", 
    category: "Moda & Varejo", 
    icon: Shirt,
    badge: "Contrato Ativo",
    sub: "10 Unidades • Curitiba"
  },
  { 
    name: "Ads Eletro", 
    category: "Eletroeletrônicos", 
    icon: Zap,
    badge: "Contrato Ativo"
  }
];

const Clients = () => (
  <section className="py-12 bg-[#F1EFE8]">
    <div className="container mx-auto px-4">
      <p className="text-center text-[#5F5E5A] text-xs font-bold uppercase tracking-[0.2em] mb-10">
        EMPRESAS QUE CONFIAM NA VISIONYX
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {clients.map((client, i) => (
          <motion.div
            key={client.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-[#D3D1C7] rounded-xl p-6 flex flex-col items-center text-center group hover:border-[#185FA5] transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-[#E6F1FB] flex items-center justify-center text-[#185FA5] mb-4 group-hover:bg-[#185FA5] group-hover:text-white transition-colors">
              <client.icon size={24} />
            </div>
            <h3 className="text-[#042C53] font-bold text-lg">{client.name}</h3>
            <p className="text-[#5F5E5A] text-sm mb-4">{client.category}</p>
            {client.sub && <p className="text-[#5F5E5A] text-[10px] mb-2 uppercase font-bold tracking-wider">{client.sub}</p>}
            <span className="bg-[#E6F1FB] text-[#042C53] text-[10px] font-bold uppercase px-3 py-1 rounded-full">
              {client.badge}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Clients;