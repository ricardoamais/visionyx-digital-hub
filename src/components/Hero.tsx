import { motion } from "framer-motion";
import { MessageCircle, CheckCircle2, ShieldCheck, Zap, MapPin } from "lucide-react";

const Hero = () => (
  <section id="hero" className="relative min-h-[100svh] md:min-h-[90vh] flex items-center justify-center overflow-hidden pt-36 md:pt-40 bg-gradient-to-br from-white via-slate-50 to-blue-50">
    {/* Decorative blobs */}
    <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#185FA5]/10 rounded-full blur-3xl -z-0" />
    <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-400/10 rounded-full blur-3xl -z-0" />

    <div className="container mx-auto px-5 sm:px-6 relative z-10 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Online now badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-xs sm:text-sm font-semibold text-green-700">Atendendo agora • Resposta em até 15 minutos</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-white border border-slate-300 rounded-full px-3 py-1 mb-5 md:mb-8 shadow-sm">
            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-slate-600">
              Curitiba • Paraná
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-[1.15] mb-4 md:mb-6 text-slate-900 max-w-4xl">
            Tecnologia que <span className="text-[#185FA5] italic">impulsiona</span> o seu negócio
          </h1>

          <p className="text-slate-600 text-base md:text-lg lg:text-xl max-w-2xl mb-6 leading-relaxed">
            Atendimento especializado em Curitiba com agilidade e transparência. Do suporte corporativo à manutenção preventiva.
          </p>

          {/* Social proof */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex -space-x-2">
              {["MA", "CF", "RL", "JP"].map((initials) => (
                <div key={initials} className="w-9 h-9 rounded-full bg-[#185FA5]/10 border-2 border-white flex items-center justify-center text-xs font-bold text-[#185FA5]">
                  {initials}
                </div>
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1 text-amber-500">
                ★★★★★ <span className="text-slate-700 font-bold ml-1">4.9</span>
              </div>
              <span className="text-slate-500 text-xs">+500 clientes atendidos em Curitiba</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <a
              href="https://wa.me/5541995236952"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20ba56] text-white w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-xl text-base md:text-lg font-bold shadow-2xl shadow-green-500/30 transition-all hover:-translate-y-1 hover:shadow-green-500/50 group"
            >
              <span className="absolute inset-0 rounded-xl bg-[#25D366] animate-pulse opacity-40 group-hover:opacity-0 -z-10" />
              <MessageCircle size={22} className="shrink-0" />
              Falar agora no WhatsApp
            </a>

            <a
              href="#servicos"
              className="inline-flex items-center justify-center gap-2 text-slate-600 hover:text-[#185FA5] font-semibold px-4 py-4 transition-colors"
            >
              Ver serviços ↓
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-6 text-xs md:text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-green-600" />
              Garantia no serviço
            </div>
            <div className="flex items-center gap-1.5">
              <Zap size={16} className="text-amber-500" />
              Atendimento rápido
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={16} className="text-[#185FA5]" />
              Curitiba e região
            </div>
          </div>
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
          <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-[#185FA5]/5 rounded-2xl border border-[#185FA5]/10" />
        </motion.div>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
  </section>
);

export default Hero;
