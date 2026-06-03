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
    <section id="contato" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-900 leading-tight">
            Pronto para Resolver seus <span className="text-primary">Problemas de TI?</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Visionyx Informática</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Atendimento presencial em Curitiba e suporte remoto para todo o Brasil. Escolha o canal de sua preferência.
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8">
              <p className="text-slate-700 font-medium italic">
                "Atendimento especializado para empresas com foco em contratos de manutenção preventiva e corretiva."
              </p>
            </div>

            <a
              href="https://wa.me/5541995236952"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba56] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-green-200 w-fit mb-6"
            >
              <MessageCircle size={20} />
              (41) 99523-6952
            </a>

            <div className="flex items-center gap-3 text-muted-foreground font-body">
              <Phone size={20} className="text-primary" />
              (41) 99523-6952
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:box-glow transition-all font-body"
            />
            <textarea
              placeholder="Sua mensagem"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:box-glow transition-all resize-none font-body"
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 w-full justify-center"
            >
              <Send size={18} />
              Enviar via WhatsApp
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
