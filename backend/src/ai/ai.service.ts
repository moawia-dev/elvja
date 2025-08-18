import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
@Injectable()
export class AiService {
  generateAdCopy(industry: string, goal: string, tone: string = 'professionell') {
    const headline = `${industry} som levererar – ${goal}`.slice(0, 80);
    const body = `Upptäck hur vi hjälper ${industry.toLowerCase()} att nå ${goal.toLowerCase()}. Boka en demo idag.`;
    const variants = [
      { headline, body },
      { headline: `${goal} för ${industry}`, body: `Snabbt, mätbart och skalbart. ${goal} börjar här.` },
      { headline: `Skala ${goal} med AI`, body: `Optimera budget, målgrupper och kreativa. Starta på 5 minuter.` }
    ];
    return { primary: variants[0], variants };
  }
  generateBannerSvg(hexPrimary: string = '#6B8355', hexSecondary: string = '#A3B18A', text: string = 'ELVJA') {
    const svg = `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${hexSecondary}"/><stop offset="100%" stop-color="${hexPrimary}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="60" y="360" font-family="Inter, system-ui, sans-serif" font-size="80" fill="#fff" font-weight="700">${text}</text></svg>`;
    const base64 = Buffer.from(svg).toString('base64'); return `data:image/svg+xml;base64,${base64}`;
  }
  async suggestAudienceFromUrl(url: string) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(url, { signal: controller.signal });
      const html = await res.text();
      const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      const words = text.toLowerCase().match(/[a-zåäö0-9\-]{3,}/g) || [];
      const stop = new Set(['och','det','att','som','är','för','med','till','den','på','en','av','ett','har','kan','från','in','the','and','you','your','för','oss','vi']);
      const freq: Record<string, number> = {}; for (const w of words) { if (!stop.has(w)) freq[w]=(freq[w]||0)+1; }
      const top = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,20).map(([k])=>k);
      const segments = top.map(k => ({ keyword: k, interest: `int:${k}`, affinity: Math.max(0.3, Math.min(0.95, (freq[k]||1)/50)) }));
      return { keywords: top, segments };
    } catch (err) {
      if ((err as any)?.name === 'AbortError') {
        return { keywords: [], segments: [] };
      }
      return { keywords: [], segments: [] };
    } finally {
      clearTimeout(timer);
    }
  }
  optimizeBudget(channels: Array<{name:string, spend:number, clicks?:number, conversions?:number, revenue?:number, cpa?:number}>, target: 'roas'|'cpa'|'clicks'='roas') {
    const scored = channels.map(ch => {
      let score = 0.0001;
      if (target === 'roas') { const roas = (ch.revenue||0)/Math.max(1, ch.spend); score = roas; }
      else if (target === 'cpa') { const cpa = (ch.cpa!=null ? ch.cpa : (ch.spend/Math.max(1, ch.conversions||0))); score = 1/Math.max(1e-6, cpa); }
      else if (target === 'clicks') { score = (ch.clicks||0)/Math.max(1, ch.spend); }
      return { ...ch, score };
    });
    const totalScore = scored.reduce((s,c)=>s+c.score,0)||1; const totalBudget = scored.reduce((s,c)=>s+c.spend,0);
    const suggested = scored.map(c => { const share = c.score/totalScore; const newSpend = Math.round((totalBudget*share)*100)/100; return { name:c.name, current:c.spend, suggested:newSpend, delta: Math.round((newSpend-c.spend)*100)/100 }; });
    return { target, totalBudget, suggested };
  }
}
