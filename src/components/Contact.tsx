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
    <section id="contato" className="py-24 bg-[#F1EFE8]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#185FA5] font-bold text-sm tracking-widest uppercase mb-4 block">CONTATO</span>
          <h2 className="text-3xl md:text-6xl font-display font-bold mb-6 text-[#042C53] leading-tight">
            Pronto para Resolver seus Problemas de <span className="text-[#185FA5]">TI</span>?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-start">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div>
              <h3 className="text-3xl font-display font-bold mb-6 text-[#042C53]">Visionyx Informática</h3>
              <p className="text-[#5F5E5A] text-xl leading-relaxed mb-8">
                Atendimento presencial em Curitiba e suporte remoto para todo o Brasil. Escolha o canal de sua preferência.
              </p>
            </div>

            <div className="bg-[#E6F1FB] border border-[#185FA5]/20 rounded-2xl p-8 mb-8">
              <p className="text-[#042C53] text-lg font-medium italic">
                "Atendimento especializado para empresas com foco em contratos de manutenção preventiva e corretiva."
              </p>
            </div>

            <div className="space-y-6">
              <a
                href="https://wa.me/5541995236952"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-[#25D366] hover:bg-[#20ba56] text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-green-200 w-fit"
              >
                <MessageCircle size={24} />
                (41) 99523-6952
              </a>

              <div className="flex items-center gap-4 text-[#5F5E5A] text-xl font-medium ml-2">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-[#185FA5]">
                  <Phone size={24} />
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
            className="bg-white rounded-3xl p-10 shadow-2xl border border-[#D3D1C7]/50"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#042C53] ml-1 uppercase tracking-wider">Seu nome</label>
                <input
                  type="text"
                  placeholder="Ex: João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#F1EFE8]/50 border border-[#D3D1C7] rounded-xl px-6 py-5 text-[#042C53] placeholder:text-[#5F5E5A]/50 focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#042C53] ml-1 uppercase tracking-wider">Sua mensagem</label>
                <textarea
                  placeholder="Ex: Gostaria de um orçamento para formatação de 3 computadores..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="w-full bg-[#F1EFE8]/50 border border-[#D3D1C7] rounded-xl px-6 py-5 text-[#042C53] placeholder:text-[#5F5E5A]/50 focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-4 bg-[#185FA5] hover:bg-[#378ADD] text-white px-8 py-6 rounded-2xl font-bold transition-all shadow-xl shadow-[#185FA5]/20 w-full justify-center group text-lg"
              >
                <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Enviar Mensagem agora
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;