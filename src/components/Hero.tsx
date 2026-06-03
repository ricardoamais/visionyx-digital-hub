import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import heroImg from "@/assets/hero-computers.jpg";

const Hero = () => (
  <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 bg-slate-50">
    {/* Professional grid pattern or subtle background */}
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    
    {/* Background image with better overlay */}
    <div className="absolute inset-0">
      <img src={heroImg} alt="Manutenção de computadores em Curitiba" className="w-full h-full object-cover opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent" />
    </div>

    <div className="container mx-auto px-4 relative z-10 text-left">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 mb-8">
          <span className="text-xs font-bold tracking-wider uppercase">
            Curitiba • Paraná
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-slate-900 max-w-4xl">
          Suporte Técnico e <span className="text-primary">Manutenção de Computadores</span> para sua Empresa
        </h1>

        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Atendimento especializado em Curitiba com agilidade e transparência. Do suporte corporativo à manutenção preventiva.
        </p>

        <a
          href="https://wa.me/5541995236952"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-lg text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:-translate-y-1"
        >
          <MessageCircle size={22} />
          Falar no WhatsApp
        </a>
      </motion.div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
  </section>
);

export default Hero;
