import React, { useEffect, useState } from 'react'
import { api, apiBase } from '../api'
export const Brandkit: React.FC = () => {
  const [accountId, setAccountId] = useState('')
  const [kit, setKit] = useState<{primary:string,secondary:string,logo?:string,font?:string}>({ primary: '#6B8355', secondary: '#A3B18A' })
  const [loading, setLoading] = useState(false)
  const load = async () => { if (!accountId) return; setLoading(true); try { const { data } = await api.get(`/brandkit/${accountId}`); if (data) setKit({ primary: data.primary||kit.primary, secondary: data.secondary||kit.secondary, font: data.font||'', logo: data.logoUrl? (apiBase + data.logoUrl):undefined }) } catch {} setLoading(false) }
  useEffect(() => { const saved = localStorage.getItem('elvja_brandkit'); if (saved) setKit(JSON.parse(saved)) }, [])
  const save = async () => { if (!accountId) { alert('Ange Account ID'); return; } await api.put(`/brandkit/${accountId}`, { primary: kit.primary, secondary: kit.secondary, font: kit.font }); localStorage.setItem('elvja_brandkit', JSON.stringify(kit)); alert('Brandkit sparat.') }
  const onLogo = async (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; if (!accountId) { alert('Ange Account ID först'); return; } const form = new FormData(); form.append('file', f); const { data } = await api.put(`/brandkit/${accountId}/logo`, form, { headers: { 'Content-Type': 'multipart/form-data' } }); if (data?.logoUrl) setKit(prev => ({...prev, logo: apiBase + data.logoUrl })) }
  return (
    <div className="space-y-4"><h1 className="text-2xl font-bold">Brandkit</h1>
      <div className="card flex gap-2 items-center">
        <input className="input max-w-sm" placeholder="Account ID" value={accountId} onChange={e=>setAccountId(e.target.value)} />
        <button className="btn" onClick={load} disabled={!accountId || loading}>Ladda</button>
        <button className="btn btn-primary" onClick={save} disabled={!accountId}>Spara</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card grid gap-3">
          <div><div className="label">Primärfärg</div><input type="color" className="input" value={kit.primary} onChange={e=>setKit({...kit, primary:e.target.value})} /></div>
          <div><div className="label">Sekundärfärg</div><input type="color" className="input" value={kit.secondary} onChange={e=>setKit({...kit, secondary:e.target.value})} /></div>
          <div><div className="label">Typsnitt (namn)</div><input className="input" placeholder="Ex: Inter, Roboto" value={kit.font||''} onChange={e=>setKit({...kit, font:e.target.value})} /></div>
          <div><div className="label">Logotyp</div><input type="file" accept="image/*" onChange={onLogo} /></div>
        </div>
        <div className="card"><div className="font-semibold mb-2">Förhandsgranskning</div><div className="p-4 rounded-xl" style={{ background: kit.secondary, color: 'white' }}>{kit.logo && <img src={kit.logo} className="h-12 mb-3 rounded bg-white p-1" />}<div style={{ color: kit.primary, background: 'white', padding: '8px 12px', borderRadius: 12, display: 'inline-block' }}>Knapp enligt primärfärg</div><div className="mt-3 text-sm">Typsnitt: {kit.font || 'System default'}</div></div></div>
      </div>
    </div>
  )
}
