import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { getSmartTagUrl } from "@/lib/smartTag";

interface Props {
  code: string;
  centered?: boolean;
}

const SmartTagQr = ({ code, centered = false }: Props) => {
  const url = getSmartTagUrl(code);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(url, { width: 256, margin: 1, errorCorrectionLevel: "H" })
      .then((d) => active && setPreview(d))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [url]);

  const fileName = `Visionyx-SmartTag-${code.trim().toUpperCase()}`;

  const download = (href: string, ext: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = `${fileName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const downloadPng = async () => {
    try {
      const data = await QRCode.toDataURL(url, {
        width: 1200,
        margin: 2,
        errorCorrectionLevel: "H",
      });
      download(data, "png");
    } catch {
      toast.error("Não foi possível gerar o QR Code.");
    }
  };

  const downloadSvg = async () => {
    try {
      const svg = await QRCode.toString(url, {
        type: "svg",
        margin: 2,
        errorCorrectionLevel: "H",
      });
      const blobUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      download(blobUrl, "svg");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    } catch {
      toast.error("Não foi possível gerar o SVG.");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado!");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  if (centered) {
    return (
      <div className="flex flex-col items-center gap-3 w-full">
        {preview ? (
          <img
            src={preview}
            alt={`QR Code do Smart Tag ${code}`}
            className="w-28 h-28 rounded-md border border-slate-200 bg-white"
          />
        ) : (
          <div className="w-28 h-28 rounded-md border border-slate-200 bg-slate-50" />
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-[#1A56DB] hover:underline break-all text-center"
        >
          {url}
        </a>
        <div className="grid grid-cols-2 gap-2 w-full">
          <button
            onClick={copyLink}
            className="rounded-md border border-slate-300 px-2 py-1.5 text-xs font-semibold text-slate-700"
          >
            Copiar link
          </button>
          <button
            onClick={downloadPng}
            className="rounded-md bg-[#1A56DB] px-2 py-1.5 text-xs font-semibold text-white"
          >
            Baixar PNG
          </button>
          <button
            onClick={downloadSvg}
            className="rounded-md border border-slate-300 px-2 py-1.5 text-xs font-semibold text-slate-700 col-span-2"
          >
            Baixar SVG
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      {preview ? (
        <img
          src={preview}
          alt={`QR Code do Smart Tag ${code}`}
          className="w-20 h-20 rounded-md border border-slate-200 bg-white"
        />
      ) : (
        <div className="w-20 h-20 rounded-md border border-slate-200 bg-slate-50" />
      )}
      <div className="space-y-1">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs font-semibold text-[#1A56DB] hover:underline break-all"
        >
          {url}
        </a>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={copyLink}
            className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700"
          >
            Copiar link
          </button>
          <button
            onClick={downloadPng}
            className="rounded-md bg-[#1A56DB] px-2 py-1 text-xs font-semibold text-white"
          >
            Baixar PNG
          </button>
          <button
            onClick={downloadSvg}
            className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700"
          >
            Baixar SVG
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartTagQr;
