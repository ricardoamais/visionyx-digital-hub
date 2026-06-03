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
      className="fixed bottom-8 left-8 z-50 bg-white border border-slate-200 hover:border-primary p-4 rounded-full transition-all hover:scale-110 shadow-lg"
      aria-label="Compartilhar no WhatsApp"
      title="Compartilhar no WhatsApp"
    >
      <Share2 size={20} className="text-primary" />
    </button>
  );
};

export default ShareWhatsApp;
