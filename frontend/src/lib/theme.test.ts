import { describe, expect, it } from 'vitest'
import { resolveTheme, THEME_META_COLORS } from '@/lib/theme'

describe('theme', () => {
  it('resolves explicit light and dark', () => {
    expect(resolveTheme('light')).toBe('light')
    expect(resolveTheme('dark')).toBe('dark')
  })

  it('defines meta theme colors for PWA bar', () => {
    expect(THEME_META_COLORS.light).toMatch(/^#/)
    expect(THEME_META_COLORS.dark).toMatch(/^#/)
    expect(THEME_META_COLORS.light).not.toBe(THEME_META_COLORS.dark)
  })
})
