import ServicePageLayout from "@/components/ServicePageLayout";
import { motion } from "framer-motion";
import { CheckCircle, Database } from "lucide-react";

const benefits = [
  "Backup completo de arquivos e documentos",
  "Recuperação de dados de HD e SSD",
  "Recuperação de dados de pendrives",
  "Backup em nuvem configurado",
  "Backup automatizado para empresas",
  "Recuperação de sistemas corrompidos",
];

const BackupRecuperacao = () => (
  <ServicePageLayout
    title="Backup e Recuperação de Dados"
    seoTitle="Backup e Recuperação de Dados em Curitiba | Visionyx Informática"
    seoDescription="Backup e recuperação de dados em Curitiba. Recuperação de HD, SSD e pendrive. Backup empresarial automatizado. (41) 99523-6952."
    heroText="Proteja seus dados com backup profissional e recuperação segura de arquivos."
    whatsappMessage="Olá! Preciso de ajuda com backup ou recuperação de dados."
  >
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card border border-border rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Database className="text-primary" size={24} />
          </div>
          <h2 className="text-2xl font-bold">O que inclui</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((b) => (
            <div key={b} className="flex items-start gap-3">
              <CheckCircle size={18} className="text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground font-body">{b}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </ServicePageLayout>
);

export default BackupRecuperacao;
