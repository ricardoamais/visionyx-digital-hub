import ServicePageLayout from "@/components/ServicePageLayout";
import { motion } from "framer-motion";
import { CheckCircle, Monitor } from "lucide-react";

const benefits = [
  "Diagnóstico completo do notebook",
  "Troca de tela, teclado e bateria",
  "Reparo de placa-mãe e componentes",
  "Upgrade de memória RAM e SSD",
  "Limpeza interna e troca de pasta térmica",
  "Reinstalação do sistema operacional",
];

const ManutencaoNotebook = () => (
  <ServicePageLayout
    title="Manutenção de Notebook"
    seoTitle="Manutenção de Notebook em Curitiba | Visionyx Informática"
    seoDescription="Manutenção de notebook em Curitiba. Reparo, troca de tela, upgrade de SSD e memória RAM. Técnico especializado. (41) 99523-6952."
    heroText="Manutenção especializada de notebooks com diagnóstico completo e reparo profissional."
    whatsappMessage="Olá! Preciso de manutenção para meu notebook."
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
            <Monitor className="text-primary" size={24} />
          </div>
          <h2 className="text-2xl font-bold">O que inclui</h2>
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

export default ManutencaoNotebook;
