import React from 'react'
import { useState } from 'react'
import { useSummary } from '../hooks/useSummary'
import { useChannel } from '../hooks/useChannel'
import { TotalsCard } from '../components/TotalsCard'
import { ChannelCard } from '../components/ChannelCard'
import { ChannelDrawer } from '../components/ChannelDrawer'

export default function Dashboard() {
  const { data, isLoading, isError, error } = useSummary()
  const [open, setOpen] = useState<null | string>(null)

  // Call the hook unconditionally; it only fetches when `open` is set
  useChannel(open ?? undefined)

  if (isLoading) return <div>Laddar…</div>
  if (isError)   return <div>Ett fel uppstod – försök igen</div>

 const totals = isError
    ? { spend: 0, clicks: 0, roasKr: 0 } // fallback istället för att blanka sidan
    : (data?.totals ?? { spend: 0, clicks: 0, roasKr: 0 });
  const channels = [
    { name: 'Google',   key: 'google' },
    { name: 'Meta',     key: 'meta' },
    { name: 'LinkedIn', key: 'linkedin' },
    { name: 'Display',  key: 'display' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Översikt</h1>
      <TotalsCard totals={totals} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map(c => (
          <ChannelCard
            key={c.key}
            name={c.name}
            spend={Math.round((totals.spend ?? 0) / 4)}
            clicks={Math.round((totals.clicks ?? 0) / 4)}
            onClick={() => setOpen(c.key)}
          />
        ))}
      </div>
      <ChannelDrawer open={!!open} onClose={() => setOpen(null)} name={open ?? ''} />
    </div>
  )
}
