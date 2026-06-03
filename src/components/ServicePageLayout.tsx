import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareWhatsApp from "@/components/ShareWhatsApp";
import type { ReactNode } from "react";

interface ServicePageLayoutProps {
  title: string;
  seoTitle: string;
  seoDescription: string;
  heroText: string;
  children: ReactNode;
  whatsappMessage: string;
}

const ServicePageLayout = ({ title, seoTitle, seoDescription, heroText, children, whatsappMessage }: ServicePageLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <SEOHead title={seoTitle} description={seoDescription} />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 relative bg-[#E6F1FB]/30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#185FA5]/5 blur-[120px] rounded-full" />
        <div className="container mx-auto px-4 relative z-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-[#5F5E5A] hover:text-[#185FA5] mb-12 transition-colors font-bold uppercase text-xs tracking-widest">
            <ArrowLeft size={16} /> Voltar para o início
          </button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-7xl font-display font-bold text-[#042C53] mb-6 tracking-tight">
              {title}
            </h1>
            <p className="text-[#5F5E5A] text-xl md:text-2xl max-w-3xl leading-relaxed">{heroText}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {children}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-24"
            >
              <a
                href={`https://wa.me/5541995236952?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 bg-[#185FA5] hover:bg-[#378ADD] text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl shadow-[#185FA5]/30 transition-all hover:-translate-y-1"
              >
                <MessageCircle size={24} />
                Solicitar Orçamento Agora
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <ShareWhatsApp />

      <a
        href="https://wa.me/5541995236952"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] hover:bg-[#20ba56] p-5 rounded-full shadow-2xl transition-all hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle size={32} className="text-white" />
      </a>
    </div>
  );
};

export default ServicePageLayout;