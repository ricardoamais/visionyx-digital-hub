import ServicePageLayout from "@/components/ServicePageLayout";
import { motion } from "framer-motion";
import { CheckCircle, Settings } from "lucide-react";

const benefits = [
  "Sistema operacional limpo e otimizado",
  "Instalação de drivers atualizados",
  "Remoção completa de vírus e malwares",
  "Instalação de programas essenciais",
  "Backup dos seus arquivos importantes",
  "Configuração personalizada do sistema",
];

const FormatacaoComputador = () => (
  <ServicePageLayout
    title="Formatação de Computador"
    seoTitle="Formatação de Computador em Curitiba | Visionyx Informática"
    seoDescription="Formatação de computador e notebook em Curitiba. Sistema otimizado, instalação de drivers e programas. A partir de R$90. Ligue (41) 99523-6952."
    heroText="Formatação profissional com sistema otimizado, instalação de drivers e programas. Seu computador como novo!"
    whatsappMessage="Olá! Gostaria de agendar uma formatação de computador."
  >
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card border border-border rounded-2xl p-8 mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Settings className="text-primary" size={24} />
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

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-card border border-primary/30 rounded-2xl p-8 text-center box-glow"
      >
        <p className="text-muted-foreground font-body mb-2">A partir de</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-muted-foreground text-lg">R$</span>
          <span className="text-5xl font-bold text-primary text-glow">90</span>
          <span className="text-muted-foreground text-xl">,00</span>
        </div>
      </motion.div>
    </div>
  </ServicePageLayout>
);

export default FormatacaoComputador;
