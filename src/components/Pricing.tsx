import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const Pricing = () => (
  <section className="py-24 bg-white relative">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto bg-slate-900 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
            <Zap size={14} /> Oferta Especial
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white uppercase tracking-tight">FORMATAÇÃO COMPLETA</h2>
          <p className="text-slate-400 mb-8 text-lg">Sistema otimizado, drivers atualizados e limpeza básica.</p>
          <div className="flex items-baseline justify-center gap-2 mb-10">
            <span className="text-slate-500 text-2xl font-bold">R$</span>
            <span className="text-7xl md:text-9xl font-black text-white">90</span>
            <span className="text-slate-500 text-3xl font-bold">,00</span>
          </div>
          <a
            href="https://wa.me/5541995236952?text=Olá! Gostaria de agendar uma formatação."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-12 py-5 rounded-xl text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:-translate-y-1"
          >
            Agendar Agora
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Pricing;
