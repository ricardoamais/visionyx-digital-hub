import { motion } from "framer-motion";
import { MessageCircle, CheckCircle2, ShieldCheck, Zap, MapPin, Monitor } from "lucide-react";

const Hero = () => (
  <section id="hero" className="relative min-h-[100svh] md:min-h-screen flex items-center overflow-hidden bg-[#0F2D5C] pt-32 md:pt-36 pb-16">
    <div className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(rgba(56,189,248,0.05) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(56,189,248,0.05) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}
    />

    <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#1A56DB]/20 rounded-full blur-[120px] -z-0" />
    <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-[80px] -z-0" />

    <div className="container mx-auto px-5 sm:px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Atendendo agora</span>
          </div>

          <div className="inline-flex items-center gap-2 border border-[#38BDF8]/30 bg-[#38BDF8]/10 rounded-full px-4 py-1.5 mb-6">
            <MapPin size={12} className="text-[#38BDF8]" />
            <span className="text-[#38BDF8] text-xs font-bold uppercase tracking-widest">Curitiba • Paraná</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6 text-white">
            Tecnologia que{" "}
            <span className="relative inline-block">
              <span className="text-[#38BDF8] italic">impulsiona</span>
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#38BDF8] to-transparent" />
            </span>
            {" "}o seu negócio
          </h1>

          <p className="text-white/60 text-base md:text-lg lg:text-xl max-w-xl mb-8 leading-relaxed">
            Atendimento especializado em Curitiba com agilidade e transparência. Do suporte corporativo à manutenção preventiva.
          </p>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex -space-x-2">
              {["MA", "CF", "RL", "JP"].map((initials) => (
                <div key={initials} className="w-9 h-9 rounded-full bg-[#1A56DB]/40 border-2 border-[#0F2D5C] flex items-center justify-center text-xs font-bold text-white">
                  {initials}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-[#F59E0B] text-sm">
                ★★★★★ <span className="text-white font-bold ml-1">4.9</span>
              </div>
              <span className="text-white/40 text-xs">+500 clientes atendidos em Curitiba</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <a
              href="https://wa.me/5541995236952"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center gap-3 bg-[#16A34A] hover:bg-[#15803D] text-white w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold shadow-2xl shadow-green-900/40 transition-all hover:-translate-y-1 group overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <MessageCircle size={20} className="shrink-0" />
              Falar agora no WhatsApp
            </a>
            <a
              href="#servicos"
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-[#38BDF8] text-white/70 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all"
            >
              Ver serviços →
            </a>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-white/40">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-green-400" />
              Garantia no serviço
            </div>
            <div className="flex items-center gap-1.5">
              <Zap size={14} className="text-[#F59E0B]" />
              Resposta em 15 min
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-[#38BDF8]" />
              Curitiba e região
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block"
        >
          <div className="relative">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1A56DB] flex items-center justify-center">
                    <Monitor size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Painel de Suporte</p>
                    <p className="text-white/40 text-xs">Visionyx Informática</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs font-bold">Online</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Manutenção Notebook", status: "Em andamento", color: "text-[#38BDF8]", bg: "bg-[#38BDF8]/10", dot: "bg-[#38BDF8]" },
                  { label: "Criação de Site", status: "Concluído", color: "text-green-400", bg: "bg-green-400/10", dot: "bg-green-400" },
                  { label: "Suporte Corporativo", status: "Agendado", color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", dot: "bg-[#F59E0B]" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-[#1A56DB]" />
                      <span className="text-white/80 text-sm font-medium">{item.label}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${item.bg} px-2.5 py-1 rounded-full`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                      <span className={`text-[10px] font-bold uppercase ${item.color}`}>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/10">
                {[{ v: "500+", l: "Clientes" }, { v: "8+", l: "Anos" }, { v: "98%", l: "Satisfação" }].map(s => (
                  <div key={s.l} className="text-center">
                    <p className="text-white font-bold text-lg">{s.v}</p>
                    <p className="text-white/40 text-xs">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-6 -left-8 bg-[#1A56DB] rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <ShieldCheck size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white text-xs font-bold">Garantia no serviço</p>
                <p className="text-white/60 text-[10px]">Em todos os atendimentos</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F8FAFF] to-transparent" />
  </section>
);

export default Hero;
