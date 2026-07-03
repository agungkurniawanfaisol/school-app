export type NewsDisplayStatus = 'draft' | 'scheduled' | 'live' | 'ended' | 'archived'

export const NEWS_DISPLAY_STATUS_LABELS: Record<NewsDisplayStatus, string> = {
  draft: 'Draf',
  scheduled: 'Terjadwal',
  live: 'Tayang',
  ended: 'Selesai',
  archived: 'Diarsipkan',
}

export const NEWS_DISPLAY_STATUS_VARIANTS: Record<
  NewsDisplayStatus,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  draft: 'secondary',
  scheduled: 'outline',
  live: 'default',
  ended: 'secondary',
  archived: 'secondary',
}

export function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function fromDatetimeLocalValue(value: string): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}
