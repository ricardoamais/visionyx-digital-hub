import { motion } from "framer-motion";
import videoAsset from "@/assets/video_manutençao.mp4.asset.json";

const About = () => (
  <section id="sobre" className="py-14 md:py-24 bg-white relative">
    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl order-2 lg:order-1"
        >
          <video
            src={videoAsset.url}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-52 sm:h-64 lg:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#042C53]/20 to-transparent pointer-events-none" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="order-1 lg:order-2"
        >
          <span className="text-[#185FA5] font-bold text-sm tracking-widest uppercase mb-4 block">SOBRE NÓS</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 md:mb-8 text-slate-900 leading-tight">
            Excelência em <span className="text-[#185FA5]">Tecnologia</span> no Paraná
          </h2>
          <div className="space-y-4 text-slate-600 text-base md:text-lg leading-relaxed">
            <p>
              A <strong className="text-slate-900">Visionyx Informática</strong> é sua parceira ideal para manutenção de computadores, notebooks e suporte técnico em Curitiba. Atuamos com foco na qualidade, agilidade e satisfação dos nossos clientes em todo o Paraná.
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
