/** Strip non-digits and leading 0 / 62 for local input. */
export function normalizeIndonesiaPhoneDigits(raw: string): string {
  return raw.replace(/\D/g, '').replace(/^62/, '').replace(/^0/, '')
}

/** Format as +62XXXXXXXXXX for storage. */
export function formatIndonesiaPhone(digits: string): string {
  const cleaned = normalizeIndonesiaPhoneDigits(digits)
  return cleaned ? `+62${cleaned}` : ''
}

/** Display local part after +62. */
export function displayIndonesiaPhone(stored: string | null | undefined): string {
  if (!stored) return ''
  return normalizeIndonesiaPhoneDigits(stored)
}

export const INDONESIA_PHONE_REGEX = /^\+62[0-9]{9,13}$/
