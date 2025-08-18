import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { api } from '../api'
type Point = { t: string; impressions: number; clicks: number; spend: number }
export const Dashboard: React.FC = () => {
  const [campaignId, setCampaignId] = useState('')
  const [data, setData] = useState<Point[]>([])
  const [timer, setTimer] = useState<any>(null)
  const load = async () => { if (!campaignId) return; try { const { data } = await api.get('/metrics/timeseries', { params: { campaignId } }); setData(data) } catch {} }
  useEffect(() => { if (timer) clearInterval(timer); if (campaignId) { load(); const t = setInterval(load, 10000); setTimer(t); return () => clearInterval(t) } }, [campaignId])
  const latest = data[data.length-1]
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between"><div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-gray-600">Live KPI från backenden.</p></div><div className="flex gap-2"><Link to="/editor" className="btn">Annonseditor</Link></div></div>
      <div className="card flex gap-2 items-center"><input className="input max-w-sm" placeholder="Campaign ID" value={campaignId} onChange={e=>setCampaignId(e.target.value)} /><button className="btn" onClick={load} disabled={!campaignId}>Uppdatera</button></div>
      <div className="grid md:grid-cols-3 gap-4"><div className="card"><div className="text-sm text-gray-600">Impressions</div><div className="text-3xl font-bold">{latest?.impressions ?? '—'}</div></div><div className="card"><div className="text-sm text-gray-600">Clicks</div><div className="text-3xl font-bold">{latest?.clicks ?? '—'}</div></div><div className="card"><div className="text-sm text-gray-600">Spend (SEK)</div><div className="text-3xl font-bold">{latest?.spend ?? '—'}</div></div></div>
      <div className="card h-[340px]"><div className="font-semibold mb-2">KPI (timeseries)</div><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="t" /><YAxis /><Tooltip /><Line type="monotone" dataKey="impressions" stroke="#8884d8" dot={false} /><Line type="monotone" dataKey="clicks" stroke="#82ca9d" dot={false} /><Line type="monotone" dataKey="spend" stroke="#6B8355" dot={false} /></LineChart></ResponsiveContainer></div>
    </div>
  )
}
