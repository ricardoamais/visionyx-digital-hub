import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const Pricing = () => (
  <section className="py-16 md:py-24 bg-[#0F2D5C] relative overflow-hidden">
    <div className="absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(26,86,219,0.2) 0%, transparent 70%)`
      }}
    />
    <div className="container mx-auto px-4 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto bg-[#0A1628] border border-[#1A56DB]/30 rounded-3xl p-8 md:p-14 text-center relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent rounded-full" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1A56DB]/20 rounded-full blur-[100px] -mr-32 -mt-32" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] rounded-full px-4 py-1.5 mb-4 text-xs font-bold uppercase tracking-wider">
            <Zap size={14} />
            Oferta mais procurada
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 text-white uppercase tracking-tight">
            FORMATAÇÃO COMPLETA
          </h2>

          <p className="text-slate-400 mb-6 md:mb-8 text-base md:text-lg">
            Sistema otimizado, drivers atualizados e limpeza básica.
          </p>

          <div className="flex items-baseline justify-center gap-1 md:gap-2 mb-8 md:mb-10">
            <span className="text-slate-500 text-xl md:text-2xl font-bold">R$</span>
            <span className="text-6xl sm:text-7xl md:text-9xl font-black text-[#38BDF8] leading-none">90</span>
            <span className="text-slate-500 text-2xl md:text-3xl font-bold">,00</span>
          </div>

          <a
            href="https://wa.me/5541995236952?text=Olá! Gostaria de agendar uma formatação."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-[#16A34A] hover:bg-[#15803D] text-white w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 rounded-xl text-base md:text-lg font-bold shadow-xl shadow-green-900/40 transition-all hover:-translate-y-1"
          >
            Agendar Agora
          </a>
          <p className="text-slate-400 text-xs mt-4">
            ⚡ Resposta em até 15 minutos · 🛡️ Garantia no serviço
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Pricing;
