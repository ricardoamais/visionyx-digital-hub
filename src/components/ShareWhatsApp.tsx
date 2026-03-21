import { Share2 } from "lucide-react";

const ShareWhatsApp = () => {
  const handleShare = () => {
    const text = "Confira a Visionyx Informática - Manutenção de computadores em Curitiba!";
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank");
  };

  return (
    <button
      onClick={handleShare}
      className="fixed bottom-6 left-6 z-50 bg-card border border-border hover:border-primary/50 p-3 rounded-full transition-all hover:scale-110 hover:box-glow"
      aria-label="Compartilhar no WhatsApp"
      title="Compartilhar no WhatsApp"
    >
      <Share2 size={20} className="text-primary" />
    </button>
  );
};

export default ShareWhatsApp;
