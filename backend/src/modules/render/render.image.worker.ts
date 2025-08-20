
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
export async function renderSquare({ title, tagline, outPath }:{ title:string; tagline:string; outPath:string }) {
  const width = 1080, height = 1080;
  const bg = { r: 15, g: 23, b: 42, alpha: 1 };
  const svg = (t: string, sub: string) => `
    <svg width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="rgb(${bg.r},${bg.g},${bg.b})"/>
      <text x="60" y="420" font-size="72" fill="#ffffff" font-family="Inter, Arial" font-weight="700">${t}</text>
      <text x="60" y="520" font-size="32" fill="#cbd5e1" font-family="Inter, Arial">${sub}</text>
      <rect x="60" y="620" width="400" height="60" rx="16" ry="16" fill="#1f2937"/>
      <text x="80" y="660" font-size="28" fill="#e5e7eb" font-family="Inter, Arial">B2B • Sverige • SEK exkl. moms</text>
    </svg>`;
  const buffer = Buffer.from(svg(title, tagline));
  await sharp(buffer).png().toFile(outPath);
  return outPath;
}
if (require.main === module) {
  const out = path.resolve(process.cwd(), 'rendered-creative.png');
  renderSquare({ title: 'Elvja', tagline: 'Growth OS för datadriven marknadsföring', outPath: out })
    .then(() => console.log('Skapad:', out))
    .catch((e) => { console.error(e); process.exit(1); });
}
