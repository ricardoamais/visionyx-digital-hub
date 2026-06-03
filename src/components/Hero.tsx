import { motion } from "framer-motion";
import { MessageCircle, CheckCircle2 } from "lucide-react";

const Hero = () => (
  <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 bg-white">
    {/* Subtle gradient background */}
    <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#E6F1FB] blur-[120px] rounded-full opacity-60" />
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#E6F1FB] text-[#185FA5] border border-[#185FA5]/20 rounded-full px-4 py-1.5 mb-8">
            <span className="text-xs font-bold tracking-wider uppercase">
              Curitiba • Paraná
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-[1.1] mb-6 text-[#042C53]">
            Tecnologia que <span className="text-[#185FA5] italic">impulsiona</span> o seu negócio
          </h1>

          <p className="text-[#5F5E5A] text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            Atendimento especializado em Curitiba com agilidade e transparência. Do suporte corporativo à manutenção preventiva.
          </p>

          <a
            href="https://wa.me/5541995236952"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#185FA5] hover:bg-[#378ADD] text-white px-10 py-5 rounded-lg text-lg font-bold shadow-xl shadow-[#185FA5]/20 transition-all hover:-translate-y-1"
          >
            <MessageCircle size={22} />
            Falar no WhatsApp
          </a>
        </motion.div>

        {/* Decorative Client Panel Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block relative"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-[#D3D1C7]/50 p-8 max-w-md ml-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D3D1C7]/30">
              <h3 className="font-bold text-[#042C53]">Painel de Suporte</h3>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div className="space-y-6">
              {[
                { label: "Manutenção Notebook", status: "Em andamento", color: "text-blue-500", bg: "bg-blue-50" },
                { label: "Criação de Site", status: "Concluído", color: "text-green-500", bg: "bg-green-50" },
                { label: "Suporte Corporativo", status: "Agendado", color: "text-amber-500", bg: "bg-amber-50" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#185FA5]" />
                    <span className="text-[#5F5E5A] font-medium">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${item.bg} ${item.color}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Decorative element behind card */}
          <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-[#185FA5]/5 rounded-2xl border border-[#185FA5]/10" />
        </motion.div>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
  </section>
);

export default Hero;