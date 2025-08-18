import React, { useState } from 'react'
import { api } from '../api'
type Step = 1|2|3
export const Onboarding: React.FC = () => {
  const [step, setStep] = useState<Step>(1)
  const [accountName, setAccountName] = useState('Mitt företag')
  const [primary, setPrimary] = useState('#6B8355')
  const [secondary, setSecondary] = useState('#A3B18A')
  const [logo, setLogo] = useState<string | null>(null)
  const [geo, setGeo] = useState('Sverige')
  const [interests, setInterests] = useState('B2B, Marknadsföring')
  const next = () => setStep((s) => (s === 3 ? 3 : (s + 1) as Step))
  const prev = () => setStep((s) => (s === 1 ? 1 : (s - 1) as Step))
  const finish = async () => {
    try { await api.post('/accounts', { name: accountName }) } catch {}
    localStorage.setItem('elvja_brandkit', JSON.stringify({ primary, secondary, logo }))
    localStorage.setItem('elvja_audience', JSON.stringify({ geo, interests }))
    alert('Klart! Konto skapat och brandkit/målgrupp sparade.')
  }
  const onLogo = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; const reader = new FileReader(); reader.onload = () => setLogo(reader.result as string); reader.readAsDataURL(f) }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Onboarding</h1>
      <div className="card max-w-2xl">
        <div className="mb-4 text-sm text-gray-600">Steg {step} av 3</div>
        {step===1 && (<div className="grid gap-3"><label className="label">Kontonamn</label><input className="input" value={accountName} onChange={e=>setAccountName(e.target.value)} /><div className="flex gap-2"><button className="btn" onClick={next}>Nästa</button></div></div>)}
        {step===2 && (<div className="grid gap-3"><div className="grid grid-cols-2 gap-3"><div><label className="label">Primärfärg</label><input className="input" type="color" value={primary} onChange={e=>setPrimary(e.target.value)} /></div><div><label className="label">Sekundärfärg</label><input className="input" type="color" value={secondary} onChange={e=>setSecondary(e.target.value)} /></div></div><div><label className="label">Logotyp</label><input type="file" accept="image/*" onChange={onLogo} />{logo && <img src={logo} className="h-16 mt-2 rounded" />}</div><div className="flex gap-2"><button className="btn" onClick={prev}>Tillbaka</button><button className="btn" onClick={next}>Nästa</button></div></div>)}
        {step===3 && (<div className="grid gap-3"><div><label className="label">Geografi</label><input className="input" value={geo} onChange={e=>setGeo(e.target.value)} /></div><div><label className="label">Intressen</label><input className="input" value={interests} onChange={e=>setInterests(e.target.value)} /></div><div className="flex gap-2"><button className="btn" onClick={prev}>Tillbaka</button><button className="btn btn-primary" onClick={finish}>Slutför</button></div></div>)}
      </div>
    </div>
  )
}
