export const ADMIN_BASE = '/enrollify-manage'

export type LeadBand = 'all' | 'hot' | 'warm' | 'cold'

export const LEAD_BANDS: { id: LeadBand; label: string; description: string }[] = [
  { id: 'all', label: 'All', description: 'All leads' },
  { id: 'hot', label: 'Hot', description: 'Score ≥ 70' },
  { id: 'warm', label: 'Warm', description: 'Score 40–69' },
  { id: 'cold', label: 'Cold', description: 'Score < 40' },
]

export type LeadChannel = 'webchat' | 'facebook'

export function channelLabel(channel: string): string {
  if (channel === 'webchat') return 'Website'
  if (channel === 'facebook') return 'Facebook'
  return channel
}
