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
  <section id="empresas" className="py-24 bg-surface relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[150px]" />

    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-5 py-2 mb-6">
          <Building2 size={16} className="text-primary" />
          <span className="text-sm text-primary font-semibold tracking-wider uppercase font-body">Corporativo</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Suporte Técnico para <span className="text-primary text-glow">Empresas em Curitiba/PR</span>
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto font-body text-lg leading-relaxed">
          Oferecemos suporte técnico especializado para empresas através de contratos mensais, garantindo atendimento rápido, manutenção preventiva, suporte remoto e presencial, monitoramento de equipamentos e prioridade em chamados.
        </p>
      </motion.div>

      {/* Highlight banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto bg-card border border-primary/30 rounded-2xl p-6 text-center box-glow mb-14"
      >
        <p className="text-lg md:text-xl font-semibold font-body">
          "Planos e contratos de suporte para empresas com{" "}
          <span className="text-primary">atendimento exclusivo e prioritário.</span>"
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
            className="group bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all hover:box-glow flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <s.icon className="text-primary" size={20} />
            </div>
            <div>
              <h3 className="font-bold mb-0.5">{s.title}</h3>
              <p className="text-muted-foreground text-sm font-body">{s.desc}</p>
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
          className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105"
        >
          <MessageCircle size={22} />
          Solicitar proposta para empresa
        </a>
      </motion.div>
    </div>
  </section>
);

export default Enterprise;
