import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const Pricing = () => (
  <section className="py-14 md:py-24 bg-white relative">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto bg-slate-900 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#185FA5]/20 rounded-full blur-[100px] -mr-32 -mt-32" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full px-4 py-1.5 mb-4 text-xs font-bold uppercase tracking-wider">
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
            <span className="text-6xl sm:text-7xl md:text-9xl font-black text-white leading-none">90</span>
            <span className="text-slate-500 text-2xl md:text-3xl font-bold">,00</span>
          </div>
          
          <a
            href="https://wa.me/5541995236952?text=Olá! Gostaria de agendar uma formatação."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20ba56] text-white w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 rounded-xl text-base md:text-lg font-bold shadow-xl shadow-green-500/30 transition-all hover:-translate-y-1"
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
