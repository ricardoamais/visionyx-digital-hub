import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Differentials from "@/components/Differentials";
import Enterprise from "@/components/Enterprise";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import ShareWhatsApp from "@/components/ShareWhatsApp";
import GoogleMap from "@/components/GoogleMap";
import { MessageCircle } from "lucide-react";

const Index = () => (
  <div className="min-h-screen">
    <SEOHead
      title="Visionyx Informática - Manutenção de Computadores em Curitiba"
      description="Manutenção de computadores, formatação, limpeza, montagem de PC, suporte técnico para empresas em Curitiba. Técnico de informática. (41) 99523-6952."
    />
    <JsonLd />
    <Header />
    <Hero />
    <Services />
    <Pricing />
    <Differentials />
    <Enterprise />
    <About />
    <Contact />
    <section className="bg-white pb-24">
      <div className="container mx-auto px-4">
        <GoogleMap />
      </div>
    </section>
    <Footer />

    <ShareWhatsApp />

    {/* Floating WhatsApp button */}
    <a
      href="https://wa.me/5541995236952"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] hover:bg-[#20ba56] p-5 rounded-full shadow-2xl transition-all hover:scale-110"
      aria-label="WhatsApp"
    >
      <MessageCircle size={28} className="text-foreground" />
    </a>
  </div>
);

export default Index;
