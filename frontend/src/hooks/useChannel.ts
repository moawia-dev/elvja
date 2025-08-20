import { useQuery } from '@tanstack/react-query'
import { get } from '../lib/http'

export type ChannelData = { /* shape as you like */ }

export function useChannel(key?: string) {
  return useQuery({
    queryKey: ['channel', key ?? null],       // keep cache keys stable
    queryFn: () => get<ChannelData>('/metrics/channel', { key }),
    enabled: !!key,                           // only runs when key is truthy
  })
}
