import ServicePageLayout from "@/components/ServicePageLayout";
import { motion } from "framer-motion";
import { CheckCircle, Building2 } from "lucide-react";

const benefits = [
  "Contrato mensal de suporte técnico",
  "Atendimento remoto e presencial",
  "Monitoramento de equipamentos",
  "Manutenção preventiva programada",
  "Backup empresarial automatizado",
  "Configuração de rede e servidores",
  "Segurança e antivírus corporativo",
  "Prioridade em chamados técnicos",
];

const SuporteEmpresas = () => (
  <ServicePageLayout
    title="Suporte para Empresas"
    seoTitle="Suporte Técnico para Empresas em Curitiba | Visionyx Informática"
    seoDescription="Suporte técnico empresarial em Curitiba. Contrato mensal de manutenção, atendimento remoto e presencial, monitoramento. (41) 99523-6952."
    heroText="Suporte técnico especializado para empresas com contratos mensais e atendimento prioritário."
    whatsappMessage="Olá! Gostaria de solicitar uma proposta de suporte técnico para minha empresa."
  >
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card border border-border rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="text-primary" size={24} />
          </div>
          <h2 className="text-2xl font-bold">Serviços inclusos</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((b) => (
            <div key={b} className="flex items-start gap-3">
              <CheckCircle size={18} className="text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground font-body">{b}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </ServicePageLayout>
);

export default SuporteEmpresas;
