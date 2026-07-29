import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DATE_LOCALE_MAP: Record<string, string> = {
  id: 'id-ID',
  en: 'en-US',
  ar: 'ar-SA',
  ja: 'ja-JP',
}

export function formatDate(
  date: string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  locale?: string,
) {
  if (!date) return '-'
  const resolvedLocale = locale ? (DATE_LOCALE_MAP[locale] ?? locale) : 'id-ID'
  return new Intl.DateTimeFormat(resolvedLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(new Date(date))
}

/** Relative time labels in Bahasa Indonesia (e.g. "2 jam lalu"). */
export function formatRelativeTimeId(date: string | null | undefined, now = Date.now()): string {
  if (!date) return ''
  const then = new Date(date).getTime()
  if (Number.isNaN(then)) return ''

  const diffSec = Math.round((now - then) / 1000)
  if (diffSec < 45) return 'Baru saja'
  if (diffSec < 3600) {
    const m = Math.max(1, Math.floor(diffSec / 60))
    return `${m} menit lalu`
  }
  if (diffSec < 86400) {
    const h = Math.max(1, Math.floor(diffSec / 3600))
    return `${h} jam lalu`
  }
  if (diffSec < 86400 * 7) {
    const d = Math.max(1, Math.floor(diffSec / 86400))
    return `${d} hari lalu`
  }

  return formatDate(date)
}

export function formatCurrency(amount: number | null | undefined, freeLabel = 'Gratis') {
  if (amount == null) return freeLabel
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
