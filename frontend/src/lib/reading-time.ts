const WORDS_PER_MINUTE = 200

export function estimateReadingTimeMinutes(text: string | null | undefined): number {
  if (!text?.trim()) return 0
  const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const words = plain.split(' ').filter(Boolean).length
  if (words === 0) return 0
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}
