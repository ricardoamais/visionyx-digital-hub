import { motion } from "framer-motion";

const About = () => (
  <section id="sobre" className="py-24 relative">
    <div className="absolute inset-0 gradient-radial opacity-30" />
    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Sobre a <span className="text-primary text-glow">Empresa</span>
        </h2>
        <div className="space-y-4 text-muted-foreground font-body leading-relaxed text-lg">
          <p>
            A <strong className="text-foreground">Visionyx Informática</strong> é especializada em manutenção de computadores, notebooks e suporte técnico. Atuamos com foco na qualidade, agilidade e satisfação dos nossos clientes.
          </p>
          <p>
            Realizamos formatação, limpeza interna e externa, montagem de computadores, instalação de programas, backup e recuperação de dados. Nossa equipe é qualificada e utiliza as melhores práticas do mercado para garantir o melhor desempenho do seu equipamento.
          </p>
          <p>
            Acreditamos que tecnologia de qualidade deve ser acessível a todos. Por isso, oferecemos preços justos com atendimento personalizado para cada cliente.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default About;
