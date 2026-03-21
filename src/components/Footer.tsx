import { MessageCircle, Phone } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-10">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-display text-lg font-bold tracking-wider">
          VISIONYX <span className="text-primary">INFORMÁTICA</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground font-body">
          <a href="https://wa.me/5541995236952" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
            <MessageCircle size={16} /> WhatsApp
          </a>
          <span className="flex items-center gap-2">
            <Phone size={16} /> (41) 99523-6952
          </span>
        </div>
      </div>

      <div className="text-center mt-8 text-xs text-muted-foreground font-body">
        © {new Date().getFullYear()} Visionyx Informática. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
