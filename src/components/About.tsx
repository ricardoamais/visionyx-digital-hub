import { motion } from "framer-motion";
import repairImg from "@/assets/repair-service.jpg";

const About = () => (
  <section id="sobre" className="py-24 bg-[#F1EFE8] relative">
    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-1"
        >
          <img src={repairImg} alt="Técnico de informática em Curitiba reparando computador" className="w-full h-[500px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#042C53]/20 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="order-1 lg:order-2"
        >
          <span className="text-[#185FA5] font-bold text-sm tracking-widest uppercase mb-4 block">SOBRE NÓS</span>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 text-[#042C53] leading-tight">
            Excelência em <span className="text-[#185FA5]">Tecnologia</span> no Paraná
          </h2>
          <div className="space-y-6 text-[#5F5E5A] text-lg leading-relaxed">
            <p>
              A <strong className="text-[#042C53]">Visionyx Informática</strong> é sua parceira ideal para manutenção de computadores, notebooks e suporte técnico em Curitiba. Atuamos com foco na qualidade, agilidade e satisfação dos nossos clientes em todo o Paraná.
            </p>
            <p>
              Realizamos formatação, limpeza interna e externa, montagem de computadores, instalação de programas, backup e recuperação de dados. Nossa equipe é qualificada e utiliza as melhores práticas do mercado.
            </p>
            <p>
              Acreditamos que tecnologia de qualidade deve ser acessível a todos. Por isso, oferecemos preços justos com atendimento personalizado.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default About;