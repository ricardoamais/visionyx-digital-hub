import ServicePageLayout from "@/components/ServicePageLayout";
import { motion } from "framer-motion";
import { CheckCircle, Wrench } from "lucide-react";

const benefits = [
  "Montagem sob medida para seu perfil de uso",
  "Seleção de componentes com melhor custo-benefício",
  "PC para trabalho, estudo ou jogos",
  "Instalação completa do sistema operacional",
  "Testes de estabilidade e performance",
  "Garantia de montagem e funcionamento",
];

const MontagemPC = () => (
  <ServicePageLayout
    title="Montagem de PC"
    seoTitle="Montagem de PC em Curitiba | Visionyx Informática"
    seoDescription="Montagem de computador personalizado em Curitiba. PC gamer, trabalho e estudo. Componentes selecionados. (41) 99523-6952."
    heroText="Montagem de computadores personalizados com os melhores componentes para sua necessidade."
    whatsappMessage="Olá! Gostaria de montar um PC personalizado."
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
            <Wrench className="text-primary" size={24} />
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

export default MontagemPC;
