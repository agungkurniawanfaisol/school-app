import { describe, expect, it } from 'vitest'
import {
  DEFAULT_SPLASH_SCREEN,
  clampSplashDuration,
  parseSplashScreenValue,
  resolveSplashDisplay,
  splashScreenSchema,
} from '@/schemas/splashScreen'

describe('splashScreenSchema', () => {
  it('accepts the default splash payload', () => {
    expect(splashScreenSchema.safeParse(DEFAULT_SPLASH_SCREEN).success).toBe(true)
  })

  it('rejects empty title', () => {
    const result = splashScreenSchema.safeParse({ ...DEFAULT_SPLASH_SCREEN, title: '' })
    expect(result.success).toBe(false)
  })

  it('parses JSON string values', () => {
    const parsed = parseSplashScreenValue(JSON.stringify(DEFAULT_SPLASH_SCREEN))
    expect(parsed?.title).toBe(DEFAULT_SPLASH_SCREEN.title)
  })

  it('clamps duration to allowed range', () => {
    expect(clampSplashDuration(500)).toBe(1000)
    expect(clampSplashDuration(9000)).toBe(5000)
    expect(clampSplashDuration(2500)).toBe(2500)
  })

  it('resolves display with school fallback', () => {
    const display = resolveSplashDisplay(null, {
      name: 'Nurul Hikmah School',
      tagline: 'Generasi Qurani',
      logo: '/media/logo.png',
    })

    expect(display.title).toBe('Nurul Hikmah School')
    expect(display.subtitle).toBe('Generasi Qurani')
    expect(display.image).toBe('/media/logo.png')
  })
})
