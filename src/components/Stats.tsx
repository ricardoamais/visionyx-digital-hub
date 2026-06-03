import { motion } from "framer-motion";

const stats = [
  { label: "Clientes atendidos", value: "500+" },
  { label: "Anos de experiência", value: "8+" },
  { label: "Satisfação dos clientes", value: "98%" },
  { label: "Tempo médio de resposta", value: "24h" },
];

const Stats = () => (
  <section className="py-24 bg-[#042C53] relative overflow-hidden">
    {/* Decorative blur */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#185FA5]/10 blur-[120px] rounded-full" />
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
              {stat.value}
            </div>
            <div className="text-[#378ADD] font-bold text-sm md:text-base uppercase tracking-wider">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;