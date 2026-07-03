import { describe, expect, it } from 'vitest'
import { estimateReadingTimeMinutes } from '@/lib/reading-time'

describe('estimateReadingTimeMinutes', () => {
  it('returns at least 1 minute for non-empty text', () => {
    const words = Array.from({ length: 250 }, () => 'kata').join(' ')
    expect(estimateReadingTimeMinutes(words)).toBeGreaterThanOrEqual(1)
  })

  it('returns 0 for empty input', () => {
    expect(estimateReadingTimeMinutes('')).toBe(0)
    expect(estimateReadingTimeMinutes(null)).toBe(0)
  })
})
