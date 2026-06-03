import { motion } from "framer-motion";
import { Handshake } from "lucide-react";

const partners = [
  {
    name: "Algar Telecom",
    category: "Telecomunicações",
    description: "Conectividade corporativa, links dedicados e soluções de internet para empresas.",
    icon: "📡",
    color: "#E8F4FD",
    iconColor: "#0077C8",
    badge: "Parceiro Oficial",
  },
  {
    name: "Fortinet",
    category: "Cibersegurança",
    description: "Firewall FortiGate, proteção de redes e segurança corporativa de nível enterprise.",
    icon: "🛡️",
    color: "#FFF3E0",
    iconColor: "#EE2024",
    badge: "Parceiro Certificado",
  },
];

const Partners = () => (
  <section className="py-14 md:py-20 bg-white relative overflow-hidden">
    {/* Linha decorativa de fundo */}
    <div className="absolute inset-0 opacity-[0.03]"
      style={{ backgroundImage: 'radial-gradient(#185FA5 1px, transparent 1px)', backgroundSize: '32px 32px' }}
    />

    <div className="container mx-auto px-5 sm:px-6 relative z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10 md:mb-14"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
          <Handshake size={14} className="text-primary" />
          <span className="text-xs font-bold text-primary tracking-widest uppercase">Parceiros Tecnológicos</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
          Tecnologia de <span className="text-primary">ponta</span> para sua empresa
        </h2>
        <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Trabalhamos com as melhores marcas do mercado para entregar soluções completas e confiáveis.
        </p>
      </motion.div>

      {/* Cards de parceiros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto mb-12">
        {partners.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/8 transition-all duration-300 group"
          >
            {/* Ícone e badge */}
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: p.color }}
              >
                {p.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {p.badge}
              </span>
            </div>

            {/* Nome e categoria */}
            <h3 className="text-lg font-extrabold text-slate-900 mb-1 group-hover:text-primary transition-colors">
              {p.name}
            </h3>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              {p.category}
            </p>

            {/* Descrição */}
            <p className="text-slate-500 text-sm leading-relaxed">
              {p.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Banner de credibilidade */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
      >
        <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
          <Handshake size={20} className="text-primary" />
        </div>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
          Como parceiros certificados, entregamos <strong className="text-slate-800">soluções integradas de conectividade e segurança</strong> para empresas de todos os portes em Curitiba e região.
        </p>
      </motion.div>
    </div>
  </section>
);

export default Partners;
