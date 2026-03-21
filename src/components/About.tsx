import { motion } from "framer-motion";
import repairImg from "@/assets/repair-service.jpg";

const About = () => (
  <section id="sobre" className="py-24 relative">
    <div className="absolute inset-0 gradient-radial opacity-30" />
    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-border box-glow order-2 lg:order-1"
        >
          <img src={repairImg} alt="Técnico reparando computador" className="w-full h-72 lg:h-96 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="order-1 lg:order-2"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Sobre a <span className="text-primary text-glow">Empresa</span>
          </h2>
          <div className="space-y-4 text-muted-foreground font-body leading-relaxed text-lg">
            <p>
              A <strong className="text-foreground">Visionyx Informática</strong> é especializada em manutenção de computadores, notebooks e suporte técnico. Atuamos com foco na qualidade, agilidade e satisfação dos nossos clientes.
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
