import QRCode from "qrcode";
import { getSmartTagUrl } from "@/lib/smartTag";

// Arte 10x10 cm a 600 DPI (2362 px). Layout desenhado em 1181 px e ampliado 2x.
const BASE = 1181;
const SCALE = 2;

const star =
  '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';

export function buildPlateSvg(code: string, qrDataUrl: string) {
  const stars = [330, 440, 550, 660, 770]
    .map((x) => `<g transform="translate(${x},128) scale(2.6)" fill="#FFC928">${star}</g>`)
    .join("");
  const font = "Montserrat, Arial, Helvetica, sans-serif";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${BASE * SCALE}" height="${BASE * SCALE}" viewBox="0 0 ${BASE} ${BASE}">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="0.6"><stop offset="0" stop-color="#5B5FE0"/><stop offset=".45" stop-color="#3D7BEF"/><stop offset="1" stop-color="#22B4F0"/></linearGradient>
<linearGradient id="rb" x1="0" x2="1"><stop offset="0" stop-color="#FF8A3D"/><stop offset=".2" stop-color="#FFD43B"/><stop offset=".45" stop-color="#7BD35A"/><stop offset=".75" stop-color="#2FB86A"/><stop offset="1" stop-color="#1EA7E8"/></linearGradient>
<filter id="sh"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-opacity=".2"/></filter></defs>
<rect width="1181" height="1181" fill="#F7F8FA"/>
<path d="M0 0H1181V640C1000 600 820 655 600 610 380 565 180 520 0 560Z" fill="url(#bg)"/>
<path d="M0 520C200 490 400 540 600 585 820 630 1000 575 1181 600V650C1000 625 820 680 600 640 380 595 190 570 0 600Z" fill="url(#rb)"/>
${stars}
<text x="590" y="290" text-anchor="middle" fill="#fff" font-family="${font}" font-size="40" font-weight="500">SUA OPINIÃO É MUITO IMPORTANTE!</text>
<text x="590" y="400" text-anchor="middle" fill="#fff" font-family="${font}" font-size="92" font-weight="700" textLength="920" lengthAdjust="spacingAndGlyphs">AVALIE NO GOOGLE</text>
<circle cx="580" cy="585" r="112" fill="#fff" filter="url(#sh)"/>
<g transform="translate(500,505) scale(3.33)">
<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></g>
<g fill="none" stroke="#6B7280" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
<ellipse cx="270" cy="870" rx="140" ry="105"/>
<path d="M235 830q14 40 0 80M262 812q22 58 0 116M290 795q30 75 0 150"/>
<rect x="385" y="745" width="120" height="215" rx="18" fill="#F7F8FA"/>
<path d="M425 760h40"/>
<path d="M505 790q22 10 22 40l-10 20M385 840h-28q-14 0-14 14t14 14h28M385 868h-32q-14 0-14 14t14 14h32M385 896h-26q-14 0-14 14t14 14h26M450 960l30 50M560 960l-50 80 30 20 50-80z"/></g>
<text x="440" y="830" text-anchor="middle" fill="#6B7280" font-family="${font}" font-size="30" font-weight="700">NFC</text>
<text x="360" y="1080" text-anchor="middle" fill="#6B7280" font-family="${font}" font-size="40" font-weight="500">APROXIME O CELULAR</text>
<rect x="705" y="755" width="345" height="345" rx="22" fill="#fff" stroke="#E2E5EA" stroke-width="3"/>
<image x="735" y="785" width="285" height="285" href="${qrDataUrl}"/>
<text x="1135" y="1160" text-anchor="end" fill="#9CA3AF" font-family="${font}" font-size="20" font-weight="700">${code}</text>
</svg>`;
}

export async function downloadPlateArt(code: string) {
  const qr = await QRCode.toDataURL(getSmartTagUrl(code), {
    errorCorrectionLevel: "M",
    margin: 0,
    width: 1200,
    color: { dark: "#111111", light: "#ffffff" },
  });
  const svg = buildPlateSvg(code, qr);
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("Falha ao gerar a arte"));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = BASE * SCALE;
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/png"));
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `plaquinha_${code}_10x10.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  } finally {
    URL.revokeObjectURL(url);
  }
}
