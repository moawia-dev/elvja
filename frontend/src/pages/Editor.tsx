
import { useState } from 'react';
import { http } from '../lib/http';

function ModeSelector({ mode, setMode }:{ mode:string; setMode:(m:string)=>void }) {
  const modes = ['Ladda upp','Manuellt','AI Assist'];
  return (
    <div className="inline-flex rounded-xl border overflow-hidden">
      {modes.map((m) => (<button key={m} onClick={() => setMode(m)} className={`px-4 py-2 ${mode===m?'bg-black text-white':'bg-white'}`}>{m}</button>))}
    </div>
  );
}
function InspirationBrowser() {
  const [q,setQ] = useState('');
  const [items,setItems] = useState<any[]>([]);
  async function search() {
    const res = await http.get('/api/inspiration/meta', { params: { query: q, country: 'SE', limit: 25 } });
    setItems(res.data.items ?? []);
  }
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Inspiration från Meta (SE)</div>
      <div className="flex gap-2">
        <input className="border rounded px-3 py-2 w-full" placeholder="Sökord…" value={q} onChange={(e)=>setQ(e.target.value)} />
        <button onClick={search} className="px-4 py-2 rounded bg-black text-white">Sök</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-auto">
        {items.map((_, i) => (<div key={i} className="border rounded p-2 text-xs">Annons #{i+1}</div>))}
      </div>
    </div>
  );
}
function AIAssist({ onPreview }:{ onPreview:(url:string, text:string)=>void }) {
  const [prompt,setPrompt] = useState('Annons för svensk B2B målgrupp…');
  const [text,setText] = useState('');
  async function generate() {
    const tx = await http.post('/api/ai/generate-text', { prompt });
    setText(tx.data.text);
    const img = await http.post('/api/ai/generate-image', { prompt });
    onPreview(img.data.url, tx.data.text);
  }
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Beskriv vad du vill skapa</label>
      <textarea className="border rounded w-full p-2 h-28" value={prompt} onChange={(e)=>setPrompt(e.target.value)} />
      <button onClick={generate} className="px-4 py-2 rounded bg-black text-white">Generera</button>
      {text && <div className="text-sm mt-2"><strong>Copy:</strong> {text}</div>}
    </div>
  );
}
function CreativePreview({ url }:{ url:string }) {
  return (
    <div className="aspect-square w-full max-w-[360px] border rounded-xl overflow-hidden flex items-center justify-center bg-gray-50">
      {url ? <img src={url} alt="Preview" className="object-contain"/> : <div className="text-sm opacity-60">1080×1080 förhandsvisning</div>}
    </div>
  );
}
export default function Editor() {
  const [mode,setMode] = useState('AI Assist');
  const [url,setUrl] = useState('');
  async function saveCreative() { alert('Sparat (stub) – koppla mot /api/creatives'); }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Editor</h1>
      <ModeSelector mode={mode} setMode={setMode} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {mode==='AI Assist' && <AIAssist onPreview={(u)=>{setUrl(u);}} />}
          {mode==='Ladda upp' && <div className="text-sm opacity-70">Ladda upp kommer här (koppla presign).</div>}
          {mode==='Manuellt' && <div className="text-sm opacity-70">Manuellt läge (skriv text & lägg bild).</div>}
          <InspirationBrowser />
        </div>
        <div className="space-y-4">
          <CreativePreview url={url} />
          <button onClick={saveCreative} className="px-4 py-2 rounded bg-black text-white">Spara som creative</button>
        </div>
      </div>
    </div>
  );
}
