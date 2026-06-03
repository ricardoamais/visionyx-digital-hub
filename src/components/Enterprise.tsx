import { motion } from "framer-motion";
import { MessageCircle, Building2, FileText, Wifi, MapPin, Monitor, Database, Network, Server, ShieldCheck } from "lucide-react";

const services = [
  { icon: Building2, title: "Suporte para Empresas", desc: "Atendimento técnico dedicado" },
  { icon: FileText, title: "Contrato Mensal", desc: "Manutenção preventiva contínua" },
  { icon: Wifi, title: "Atendimento Remoto", desc: "Suporte rápido à distância" },
  { icon: MapPin, title: "Atendimento Presencial", desc: "Visita técnica no local" },
  { icon: Monitor, title: "Monitoramento", desc: "Acompanhamento de equipamentos" },
  { icon: Database, title: "Backup Empresarial", desc: "Proteção dos seus dados" },
  { icon: Network, title: "Rede e Impressoras", desc: "Configuração completa" },
  { icon: Server, title: "Servidores", desc: "Compartilhamentos e gestão" },
  { icon: ShieldCheck, title: "Segurança Corporativa", desc: "Antivírus e proteção" },
];

const Enterprise = () => (
  <section id="empresas" className="py-24 bg-slate-900 relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/20 blur-[150px] opacity-20" />

    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-5 py-2 mb-6">
          <Building2 size={16} className="text-primary" />
          <span className="text-sm text-primary font-bold tracking-widest uppercase">Soluções Corporativas</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-white">
          Gestão de TI e Suporte para <span className="text-primary">Empresas</span>
        </h2>
        <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">
          Oferecemos suporte técnico especializado para empresas através de contratos mensais, garantindo atendimento rápido, manutenção preventiva, suporte remoto e presencial, monitoramento de equipamentos e prioridade em chamados.
        </p>
      </motion.div>

      {/* Clients Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <p className="text-center text-slate-500 text-sm font-bold uppercase tracking-[0.2em] mb-8">Empresas que confiam em nosso trabalho</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
          <div className="text-center group">
            <div className="text-white text-xl md:text-2xl font-black tracking-tighter group-hover:text-primary transition-colors">TINTAS DARKA</div>
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1">41 Filiais • Curitiba/PR</div>
          </div>
          <div className="text-center group">
            <div className="text-white text-xl md:text-2xl font-extrabold tracking-tight italic group-hover:text-primary transition-colors">HERING STORE</div>
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1">10 Unidades • Curitiba</div>
          </div>
          <div className="text-center group">
            <div className="text-white text-xl md:text-2xl font-bold tracking-widest border-2 border-white px-3 py-1 group-hover:border-primary group-hover:text-primary transition-colors">ADS ELETRO</div>
            <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1">Suporte Especializado</div>
          </div>
        </div>
      </motion.div>

      {/* Highlight banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 text-center mb-16 backdrop-blur-sm"
      >
        <p className="text-xl md:text-2xl font-bold text-white leading-tight">
          Sua empresa não pode parar. Oferecemos <span className="text-primary underline underline-offset-8">atendimento prioritário</span> com contratos sob medida.
        </p>
      </motion.div>

      {/* Services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 flex items-start gap-5"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 text-primary group-hover:scale-110 transition-transform">
              <s.icon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-1">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <a
          href="https://wa.me/5541995236952?text=Olá! Gostaria de solicitar uma proposta de suporte técnico para minha empresa."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-lg text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:-translate-y-1"
        >
          <MessageCircle size={22} />
          Solicitar proposta para empresa
        </a>
      </motion.div>
    </div>
  </section>
);

export default Enterprise;
