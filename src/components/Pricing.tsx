import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const Pricing = () => (
  <section className="py-24 bg-white relative">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto bg-[#042C53] rounded-[2rem] p-12 text-center relative overflow-hidden shadow-2xl"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#185FA5]/20 rounded-full blur-[100px] -mr-32 -mt-32" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#378ADD]/20 text-[#378ADD] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
            <Zap size={14} /> Oferta Especial
          </div>
          
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-white uppercase tracking-tight">
            FORMATAÇÃO COMPLETA
          </h2>
          
          <p className="text-white/60 mb-12 text-lg">
            Sistema otimizado, drivers atualizados e limpeza básica.
          </p>
          
          <div className="flex items-baseline justify-center gap-2 mb-12">
            <span className="text-white/40 text-2xl font-bold">R$</span>
            <span className="text-8xl md:text-[10rem] font-display font-bold text-white leading-none">90</span>
            <span className="text-white/40 text-4xl font-bold">,00</span>
          </div>
          
          <a
            href="https://wa.me/5541995236952?text=Olá! Gostaria de agendar uma formatação."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#185FA5] hover:bg-[#378ADD] text-white px-16 py-6 rounded-xl text-xl font-bold shadow-xl shadow-[#185FA5]/20 transition-all hover:-translate-y-1"
          >
            Agendar Agora
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Pricing;