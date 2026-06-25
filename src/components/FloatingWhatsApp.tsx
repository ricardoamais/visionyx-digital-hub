import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

const FloatingWhatsApp = () => {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-end gap-2">
      {showBubble && (
        <div className="hidden sm:flex items-start gap-2 bg-white border border-slate-200 rounded-xl rounded-br-none shadow-xl px-4 py-3 text-sm text-slate-700 max-w-[240px] animate-in fade-in slide-in-from-bottom-2">
          <span>Precisa de ajuda? Fale com a gente agora! 👋</span>
          <button
            onClick={() => setShowBubble(false)}
            aria-label="Fechar"
            className="text-slate-400 hover:text-slate-600 shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <a
        href="https://wa.me/5541995236952"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba56] rounded-full shadow-xl shadow-green-400/40 transition-all hover:scale-110 shrink-0"
        aria-label="WhatsApp"
      >
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50 animate-ping" />
        <MessageCircle size={28} className="text-white relative z-10" />
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
