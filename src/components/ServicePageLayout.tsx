import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, ArrowLeft, Share2 } from "lucide-react";
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
    <div className="min-h-screen">
      <SEOHead title={seoTitle} description={seoDescription} />
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-16 relative">
        <div className="absolute inset-0 gradient-radial opacity-40" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="container mx-auto px-4 relative z-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors font-body">
            <ArrowLeft size={18} /> Voltar
          </button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4">
              {title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-body">{heroText}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {children}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <a
              href={`https://wa.me/5541995236952?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-foreground px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105"
              style={{ boxShadow: "0 0 20px rgba(34,197,94,0.3)" }}
            >
              <MessageCircle size={22} />
              Solicitar Orçamento
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ShareWhatsApp />

      <a
        href="https://wa.me/5541995236952"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-500 p-4 rounded-full shadow-lg transition-all hover:scale-110"
        style={{ boxShadow: "0 0 20px rgba(34,197,94,0.4)" }}
        aria-label="WhatsApp"
      >
        <MessageCircle size={28} className="text-foreground" />
      </a>
    </div>
  );
};

export default ServicePageLayout;
