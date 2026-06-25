import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Clients from "@/components/Clients";
import Pricing from "@/components/Pricing";
import Differentials from "@/components/Differentials";
import Enterprise from "@/components/Enterprise";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Partners from "@/components/Partners";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";

import GoogleMap from "@/components/GoogleMap";
import TrustBar from "@/components/TrustBar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Index = () => (
  <div className="min-h-screen pt-8 md:pt-9">
    <SEOHead
      title="Visionyx Informática - Manutenção de Computadores em Curitiba"
      description="Manutenção de computadores, formatação, limpeza, montagem de PC, suporte técnico para empresas em Curitiba. Técnico de informática. (41) 99523-6952."
    />
    <JsonLd />
    <TrustBar />
    <Header />
    <Hero />
    <Clients />
    <Services />
    <Pricing />
    <Differentials />
    <Partners />
    <About />
    <Stats />
    <Enterprise />
    <Contact />
    <section className="bg-[#EBF3FB] pb-24 border-t border-[#D3D1C7]/30">
      <div className="container mx-auto px-4">
        <GoogleMap />
      </div>
    </section>
    <Footer />

    
    <FloatingWhatsApp />
  </div>
);

export default Index;
