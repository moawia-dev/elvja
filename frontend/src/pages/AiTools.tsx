import React, { useState } from 'react'
import { api } from '../api'
export const AiTools: React.FC = () => {
  const [useAIAd, setUseAIAd] = useState(false)
  const [industry, setIndustry] = useState('B2B SaaS')
  const [goal, setGoal] = useState('Fler demo-bokningar')
  const [tone, setTone] = useState('professionell')
  const [primary, setPrimary] = useState('#6B8355')
  const [secondary, setSecondary] = useState('#A3B18A')
  const [bannerText, setBannerText] = useState('ELVJA')
  const [adResult, setAdResult] = useState<any>(null)
  const genAd = async () => { const { data } = await api.post('/ai/adgen', { industry, goal, tone, brandPrimary: primary, brandSecondary: secondary, bannerText, useAI: useAIAd }); setAdResult(data) }
  const [useAIAud, setUseAIAud] = useState(false); const [url, setUrl] = useState('https://example.com'); const [aud, setAud] = useState<any>(null)
  const genAud = async () => { const { data } = await api.post('/ai/audience', { url, useAI: useAIAud }); setAud(data) }
  const [useAIBud, setUseAIBud] = useState(false); const [target, setTarget] = useState<'roas'|'cpa'|'clicks'>('roas'); const [channels, setChannels] = useState([{ name: 'Google', spend: 5000, clicks: 1200, conversions: 40, revenue: 12000 },{ name: 'Meta', spend: 3000, clicks: 800, conversions: 20, revenue: 6000 },{ name: 'LinkedIn', spend: 2000, clicks: 200, conversions: 5, revenue: 5000 }]); const [budget, setBudget] = useState<any>(null)
  const runBudget = async () => { const { data } = await api.post('/ai/budget', { channels, target, useAI: useAIBud }); setBudget(data) }
  const updateChannel = (i: number, key: string, val: any) => { setChannels(prev => prev.map((c, idx) => idx === i ? ({ ...c, [key]: val }) : c)) }
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">AI-verktyg</h1>
      <section className="card space-y-3">
        <div className="flex items-center justify-between"><div className="font-semibold">AI-annonsgenerering</div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={useAIAd} onChange={e=>setUseAIAd(e.target.checked)} />Använd AI</label></div>
        <div className="grid md:grid-cols-3 gap-3">
          <input className="input" placeholder="Bransch" value={industry} onChange={e=>setIndustry(e.target.value)} />
          <input className="input" placeholder="Mål" value={goal} onChange={e=>setGoal(e.target.value)} />
          <input className="input" placeholder="Ton" value={tone} onChange={e=>setTone(e.target.value)} />
          <div><div className="label">Primärfärg</div><input type="color" className="input" value={primary} onChange={e=>setPrimary(e.target.value)} /></div>
          <div><div className="label">Sekundärfärg</div><input type="color" className="input" value={secondary} onChange={e=>setSecondary(e.target.value)} /></div>
          <input className="input" placeholder="Bannertext" value={bannerText} onChange={e=>setBannerText(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={genAd}>Generera</button>
        {adResult?.ok ? (<div className="grid md:grid-cols-2 gap-4"><div className="card"><div className="font-semibold">Förslag (copy)</div><div className="mt-2"><div className="font-bold">{adResult.copy.primary.headline}</div><div className="text-sm mt-1">{adResult.copy.primary.body}</div></div><div className="mt-3 text-sm"><div className="font-semibold mb-1">Varianter</div><ul className="list-disc pl-5">{adResult.copy.variants.map((v:any,i:number)=>(<li key={i}><b>{v.headline}</b> — {v.body}</li>))}</ul></div></div><div className="card"><div className="font-semibold">Banner (SVG)</div><img src={adResult.banner} className="w-full rounded-xl" /></div></div>) : (adResult && <div className="text-sm">AI avstängt – ingen generering utfördes.</div>)}
      </section>
      <section className="card space-y-3">
        <div className="flex items-center justify-between"><div className="font-semibold">Målgruppsförslag</div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={useAIAud} onChange={e=>setUseAIAud(e.target.checked)} />Använd AI</label></div>
        <div className="flex gap-2"><input className="input flex-1" placeholder="Webbplats-URL" value={url} onChange={e=>setUrl(e.target.value)} /><button className="btn btn-primary" onClick={genAud}>Analysera</button></div>
        {aud?.segments?.length ? (<div className="grid md:grid-cols-2 gap-3"><div className="card"><div className="font-semibold">Nyckelord</div><div className="text-sm mt-2">{aud.keywords.join(', ')}</div></div><div className="card"><div className="font-semibold">Segment</div><ul className="list-disc pl-5 mt-2">{aud.segments.slice(0,12).map((s:any,i:number)=>(<li key={i}>{s.interest} ({Math.round(s.affinity*100)}%)</li>))}</ul></div></div>) : (aud && <div className="text-sm">AI avstängt eller inga förslag.</div>)}
      </section>
      <section className="card space-y-3">
        <div className="flex items-center justify-between"><div className="font-semibold">Budgetoptimering</div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={useAIBud} onChange={e=>setUseAIBud(e.target.checked)} />Använd AI</label></div>
        <div className="grid md:grid-cols-4 gap-2 items-center"><div className="label">Mål</div><select className="input" value={target} onChange={e=>setTarget(e.target.value as any)}><option value="roas">ROAS</option><option value="cpa">CPA</option><option value="clicks">Klick</option></select></div>
        <div className="grid md:grid-cols-3 gap-3">{channels.map((c,i)=>(<div className="card" key={i}><div className="font-semibold">{c.name}</div><div className="grid grid-cols-2 gap-2 mt-2"><div><div className="label">Spend</div><input className="input" type="number" value={c.spend} onChange={e=>updateChannel(i,'spend',parseFloat(e.target.value))} /></div><div><div className="label">Clicks</div><input className="input" type="number" value={c.clicks||0} onChange={e=>updateChannel(i,'clicks',parseFloat(e.target.value))} /></div><div><div className="label">Conv</div><input className="input" type="number" value={c.conversions||0} onChange={e=>updateChannel(i,'conversions',parseFloat(e.target.value))} /></div><div><div className="label">Revenue</div><input className="input" type="number" value={c.revenue||0} onChange={e=>updateChannel(i,'revenue',parseFloat(e.target.value))} /></div></div></div>))}</div>
        <button className="btn btn-primary" onClick={runBudget}>Optimera</button>
        {budget?.suggested ? (<div className="card"><div className="font-semibold mb-2">Fördelningsförslag ({budget.target.toUpperCase()})</div><table className="w-full text-sm"><thead><tr><th className="text-left">Kanal</th><th>Nu</th><th>Föreslagen</th><th>Δ</th></tr></thead><tbody>{budget.suggested.map((s:any,i:number)=>(<tr key={i}><td>{s.name}</td><td className="text-right">{s.current}</td><td className="text-right">{s.suggested}</td><td className="text-right">{s.delta}</td></tr>))}</tbody></table></div>) : (budget && <div className="text-sm">AI avstängt – inget optimeringsförslag genererat.</div>)}
      </section>
    </div>
  )
}
