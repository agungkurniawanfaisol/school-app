export type Theme = 'light' | 'dark' | 'system'

export type ResolvedTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'nurul-hikmah-theme'

export const THEME_META_COLORS: Record<ResolvedTheme, string> = {
  light: '#1a5f2a',
  dark: '#0f1a12',
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'system') return getSystemTheme()
  return theme
}

export function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return 'system'
}

export function applyThemeToDocument(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', THEME_META_COLORS[resolved])
  }
}
