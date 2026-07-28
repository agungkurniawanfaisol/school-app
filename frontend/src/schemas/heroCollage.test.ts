import { describe, expect, it } from 'vitest'
import {
  DEFAULT_HERO_COLLAGE,
  displayCollageLetter,
  heroCollageSchema,
  parseHeroCollageValue,
} from '@/schemas/heroCollage'

describe('heroCollageSchema', () => {
  it('accepts the default collage payload', () => {
    expect(heroCollageSchema.safeParse(DEFAULT_HERO_COLLAGE).success).toBe(true)
  })

  it('rejects when items count is not 4', () => {
    const result = heroCollageSchema.safeParse({
      subtitle: 'Caption',
      items: DEFAULT_HERO_COLLAGE.items.slice(0, 2),
    })
    expect(result.success).toBe(false)
  })

  it('parses JSON string values', () => {
    const parsed = parseHeroCollageValue(JSON.stringify(DEFAULT_HERO_COLLAGE))
    expect(parsed?.subtitle).toBe(DEFAULT_HERO_COLLAGE.subtitle)
    expect(parsed?.items).toHaveLength(4)
  })

  it('returns null for invalid JSON', () => {
    expect(parseHeroCollageValue('{bad')).toBeNull()
  })

  it('falls back to first label character when letter empty', () => {
    expect(displayCollageLetter({ letter: '', label: 'Tahfidz' })).toBe('T')
    expect(displayCollageLetter({ letter: 'TA', label: 'Tahfidz' })).toBe('TA')
  })
})
