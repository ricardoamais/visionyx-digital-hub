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
  <section id="empresas" className="py-14 md:py-24 bg-slate-900 relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#185FA5]/10 blur-[150px] opacity-20" />

    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10 md:mb-20"
      >
        <div className="inline-flex items-center gap-2 bg-[#185FA5]/20 border border-[#185FA5]/30 rounded-full px-5 py-2 mb-6">
          <Building2 size={16} className="text-[#378ADD]" />
          <span className="text-sm text-[#378ADD] font-bold tracking-widest uppercase">Soluções Corporativas</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-6 text-white leading-tight">
          Gestão de TI e Suporte para <span className="text-[#185FA5]">Empresas</span>
        </h2>
        <p className="text-slate-400 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
          Oferecemos suporte técnico especializado para empresas através de contratos mensais, garantindo atendimento rápido, manutenção preventiva, suporte remoto e presencial, monitoramento de equipamentos e prioridade em chamados.
        </p>
      </motion.div>

      {/* Clients Section Reprise */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 md:mb-24 text-center"
      >
        <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-10 italic">Empresas que confiam em nosso trabalho</p>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-20">
          <div className="group cursor-default text-center">
            <div className="text-white/80 text-xl md:text-3xl font-display font-bold group-hover:text-[#185FA5] transition-colors uppercase tracking-tight">Tintas Darka</div>
            <div className="text-white/30 text-[10px] font-bold uppercase tracking-wider mt-2">41 Filiais • Curitiba/PR</div>
          </div>
          <div className="group cursor-default text-center">
            <div className="text-white/80 text-xl md:text-3xl font-display font-bold group-hover:text-[#185FA5] transition-colors uppercase tracking-tight">Hering Store</div>
            <div className="text-white/30 text-[10px] font-bold uppercase tracking-wider mt-2">10 Unidades • Curitiba</div>
          </div>
          <div className="group cursor-default text-center">
            <div className="text-white/80 text-xl md:text-3xl font-display font-bold group-hover:text-[#185FA5] transition-colors uppercase tracking-tight">Ads Eletro</div>
            <div className="text-white/30 text-[10px] font-bold uppercase tracking-wider mt-2">Suporte Especializado</div>
          </div>
        </div>
      </motion.div>

      {/* Highlight banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 text-center mb-10 md:mb-16 backdrop-blur-sm"
      >
        <p className="text-lg md:text-xl lg:text-2xl font-bold text-white leading-tight">
          Sua empresa não pode parar. Oferecemos <span className="text-[#185FA5] italic underline underline-offset-8">atendimento prioritário</span> com contratos sob medida.
        </p>
      </motion.div>

      {/* Services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-10 md:mb-12">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 hover:bg-white/10 transition-all duration-300 flex items-start gap-4 h-full"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#185FA5]/20 flex items-center justify-center shrink-0 text-[#185FA5] group-hover:scale-110 group-hover:bg-[#185FA5] group-hover:text-white transition-all duration-300">
              <s.icon size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base md:text-lg mb-1 group-hover:text-[#185FA5] transition-colors">{s.title}</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{s.desc}</p>
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
          className="inline-flex items-center justify-center gap-3 bg-[#185FA5] hover:bg-[#185FA5]/90 text-white w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 rounded-lg text-base md:text-lg font-bold shadow-xl shadow-[#185FA5]/20 transition-all hover:-translate-y-1"
        >
          <MessageCircle size={24} />
          Solicitar proposta para empresa
        </a>
      </motion.div>
    </div>
  </section>
);

export default Enterprise;
