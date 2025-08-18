import React, { useMemo, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { api, apiBase } from '../api'
export const Editor: React.FC = () => {
  const [campaignId, setCampaignId] = useState('')
  const [title, setTitle] = useState('Ny kampanj')
  const [body, setBody] = useState('<p>Skriv din annonscopy här...</p>')
  const [image, setImage] = useState<File|undefined>()
  const [preview, setPreview] = useState<string|undefined>()
  const modules = useMemo(() => ({ toolbar: [[{ header: [1,2,3,false] }], ['bold','italic','underline','strike'], [{ 'list':'ordered'}, {'list':'bullet' }], [{ 'align': [] }], ['link','clean'] ] }), [])
  const onImage = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; setImage(f); const reader = new FileReader(); reader.onload = () => setPreview(reader.result as string); reader.readAsDataURL(f) }
  const publish = async () => { if (!campaignId) { alert('Ange Campaign ID'); return; } const { data } = await api.post('/creatives', { campaignId, type: 'IMAGE', headline: title, body }); const id = data?.id; if (id && image) { const form = new FormData(); form.append('file', image); const r = await api.post(`/creatives/${id}/image`, form, { headers: { 'Content-Type': 'multipart/form-data' } }); alert('Creative publicerad. Bild: ' + (apiBase + r.data.imageUrl)) } else { alert('Creative publicerad.') } }
  return (
    <div className="space-y-4"><h1 className="text-2xl font-bold">Annonseditor</h1>
      <div className="card mb-2 flex gap-2 items-center"><input className="input max-w-sm" placeholder="Campaign ID" value={campaignId} onChange={e=>setCampaignId(e.target.value)} /><button className="btn btn-primary" onClick={publish}>Publicera</button></div>
      <div className="grid md:grid-cols-2 gap-4"><div className="card grid gap-3"><div><div className="label">Rubrik</div><input className="input" value={title} onChange={e=>setTitle(e.target.value)} /></div><div><div className="label">Copy</div><ReactQuill theme="snow" value={body} onChange={setBody} modules={modules} /></div><div><div className="label">Bild</div><input type="file" accept="image/*" onChange={onImage} /></div></div><div className="card"><div className="font-semibold mb-2">Förhandsgranskning</div><div className="rounded-xl border p-4 bg-white dark:bg-[#0F1623]">{preview && <img src={preview} className="w-full rounded-xl mb-3" />}<div className="text-lg font-semibold mb-1">{title}</div><div className="prose max-w-none" dangerouslySetInnerHTML={{__html: body}} /></div></div></div>
    </div>
  )
}
