import { motion } from "framer-motion";

const stats = [
  { label: "Clientes atendidos", value: "500+" },
  { label: "Anos de experiência", value: "8+" },
  { label: "Satisfação dos clientes", value: "98%" },
  { label: "Tempo médio de resposta", value: "24h" },
];

const Stats = () => (
  <section className="py-16 md:py-24 bg-[#0F2D5C] relative overflow-hidden border-t-4 border-[#1A56DB]">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#1A56DB]/10 blur-[120px] rounded-full" />

    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y-2 lg:divide-y-0 lg:divide-x divide-white/10 text-center">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="py-10 lg:py-0 px-6"
          >
            <div className="text-5xl md:text-7xl font-display font-bold text-[#38BDF8] mb-3">
              {stat.value}
            </div>
            <div className="text-white/50 font-semibold text-sm md:text-base uppercase tracking-wider">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;
