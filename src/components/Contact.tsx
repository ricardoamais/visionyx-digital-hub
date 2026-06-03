import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Phone, Send } from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = `Olá! Meu nome é ${name}. ${message}`;
    window.open(`https://wa.me/5541995236952?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="contato" className="py-14 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-[#185FA5] font-bold text-xs tracking-widest uppercase mb-4 block">CONTATO</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 text-slate-900 leading-tight">
            Pronto para Resolver seus Problemas de <span className="text-[#185FA5]">TI</span>?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto items-start">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 md:space-y-6"
          >
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-slate-900">Visionyx Informática</h3>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-5 md:mb-8">
                Atendimento presencial em Curitiba e suporte remoto para todo o Brasil. Escolha o canal de sua preferência.
              </p>
            </div>

            <div className="bg-[#185FA5]/5 border border-[#185FA5]/20 rounded-2xl p-4 md:p-6 mb-5 md:mb-8">
              <p className="text-[#042C53] text-lg font-medium italic">
                "Atendimento especializado para empresas com foco em contratos de manutenção preventiva e corretiva."
              </p>
            </div>

            <div className="space-y-4">
              <a
                href="https://wa.me/5541995236952"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20ba56] text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-green-200 w-full sm:w-fit"
              >
                <MessageCircle size={24} />
                (41) 99523-6952
              </a>

              <div className="flex items-center gap-4 text-slate-600 text-lg font-medium ml-2">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#185FA5]">
                  <Phone size={20} />
                </div>
                (41) 99523-6952
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100"
          >
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 ml-1 uppercase tracking-wider">Seu nome</label>
                <input
                  type="text"
                  placeholder="Ex: João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 md:px-5 md:py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 ml-1 uppercase tracking-wider">Sua mensagem</label>
                <textarea
                  placeholder="Ex: Gostaria de um orçamento..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 md:px-5 md:py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-3 bg-[#185FA5] hover:bg-[#378ADD] text-white px-6 py-4 md:px-8 md:py-5 rounded-xl font-bold w-full justify-center group text-lg transition-all shadow-lg shadow-[#185FA5]/20"
              >
                <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Enviar Mensagem
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
