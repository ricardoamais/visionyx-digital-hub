import ServicePageLayout from "@/components/ServicePageLayout";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";

const benefits = [
  "Limpeza interna completa de poeira e sujeira",
  "Troca de pasta térmica do processador",
  "Limpeza de coolers e ventoinhas",
  "Limpeza externa do gabinete e periféricos",
  "Verificação de componentes e conexões",
  "Melhoria na refrigeração e desempenho",
];

const LimpezaComputador = () => (
  <ServicePageLayout
    title="Limpeza de Computador"
    seoTitle="Limpeza de Computador em Curitiba | Visionyx Informática"
    seoDescription="Limpeza interna e externa de computadores e notebooks em Curitiba. Troca de pasta térmica, limpeza de coolers. (41) 99523-6952."
    heroText="Limpeza profissional interna e externa para manter seu equipamento funcionando perfeitamente."
    whatsappMessage="Olá! Gostaria de agendar uma limpeza de computador."
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
            <Sparkles className="text-primary" size={24} />
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

export default LimpezaComputador;
