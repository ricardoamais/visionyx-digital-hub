import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import heroImg from "@/assets/hero-computers.jpg";

const Hero = () => (
  <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
    {/* Background image */}
    <div className="absolute inset-0">
      <img src={heroImg} alt="Computadores" className="w-full h-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
    </div>

    {/* Glow effects */}
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[150px]" />

    <div className="container mx-auto px-4 text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-block border border-border rounded-full px-6 py-2 mb-8">
          <span className="text-sm text-muted-foreground tracking-widest uppercase font-body">
            Agilidade • Qualidade • Confiança
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
          MANUTENÇÃO EM{" "}
          <span className="text-primary text-glow">INFORMÁTICA</span>
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body">
          Soluções profissionais em manutenção, formatação e montagem de computadores com rapidez e qualidade.
        </p>

        <a
          href="https://wa.me/5541995236952"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-foreground px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105"
          style={{ boxShadow: "0 0 20px rgba(34,197,94,0.3)" }}
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
