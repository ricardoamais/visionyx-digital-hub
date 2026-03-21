import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const Pricing = () => (
  <section className="py-24 relative">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto bg-card border border-primary/30 rounded-2xl p-10 text-center box-glow relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="relative z-10">
          <Zap className="mx-auto text-primary mb-4 animate-pulse-glow" size={40} />
          <h2 className="text-2xl md:text-3xl font-bold mb-2">FORMATAÇÃO</h2>
          <p className="text-muted-foreground mb-6 font-body">por apenas</p>
          <div className="flex items-baseline justify-center gap-1 mb-6">
            <span className="text-muted-foreground text-xl">R$</span>
            <span className="text-6xl md:text-8xl font-bold text-primary text-glow">90</span>
            <span className="text-muted-foreground text-2xl">,00</span>
          </div>
          <a
            href="https://wa.me/5541995236952?text=Olá! Gostaria de agendar uma formatação."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
          >
            Agendar Agora
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Pricing;
