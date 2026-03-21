import { motion } from "framer-motion";

const GoogleMap = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="mt-16 max-w-4xl mx-auto"
  >
    <h3 className="text-xl font-bold mb-4 text-center">
      Nossa <span className="text-primary">Localização</span>
    </h3>
    <div className="rounded-2xl overflow-hidden border border-border box-glow">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115067.25594028478!2d-49.35874455!3d-25.4950508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce35b44d5b899%3A0x6e0daaea8e69db6e!2sCuritiba%2C%20PR!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
        width="100%"
        height="350"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Localização Visionyx Informática - Curitiba PR"
      />
    </div>
  </motion.div>
);

export default GoogleMap;
