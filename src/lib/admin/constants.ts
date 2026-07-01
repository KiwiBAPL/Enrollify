export const ADMIN_BASE = '/enrollify-manage'

export type LeadBand = 'all' | 'hot' | 'warm' | 'nurture' | 'cold'

export const LEAD_BANDS: { id: LeadBand; label: string; description: string }[] = [
  { id: 'all', label: 'All', description: 'All leads' },
  { id: 'hot', label: 'Hot', description: 'Score ≥ 80' },
  { id: 'warm', label: 'Warm', description: 'Score 60–79' },
  { id: 'nurture', label: 'Nurture', description: 'Score 40–59' },
  { id: 'cold', label: 'Cold', description: 'Score < 40' },
]

export type LeadChannel = 'webchat' | 'facebook' | 'lead_bot'

export const LEAD_CHANNELS: { id: LeadChannel | 'all'; label: string }[] = [
  { id: 'all', label: 'All sources' },
  { id: 'lead_bot', label: 'Consultation' },
  { id: 'webchat', label: 'Website chat' },
  { id: 'facebook', label: 'Facebook' },
]

export function channelLabel(channel: string): string {
  if (channel === 'webchat') return 'Website'
  if (channel === 'facebook') return 'Facebook'
  if (channel === 'lead_bot') return 'Consultation'
  return channel
}
