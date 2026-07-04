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
