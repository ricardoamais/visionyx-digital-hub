import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Differentials from "@/components/Differentials";
import Enterprise from "@/components/Enterprise";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { MessageCircle } from "lucide-react";

const Index = () => (
  <div className="min-h-screen">
    <Header />
    <Hero />
    <Services />
    <Pricing />
    <Differentials />
    <Enterprise />
    <About />
    <Contact />
    <Footer />

    {/* Floating WhatsApp button */}
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

export default Index;
