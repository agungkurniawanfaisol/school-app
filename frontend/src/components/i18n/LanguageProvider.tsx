import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/lib/api'
import { LANG_KEY, SUPPORTED_LOCALES, loadLocale, type SupportedLocale } from '@/lib/i18n'

export type Locale = SupportedLocale
export type Dir = 'ltr' | 'rtl'

interface LanguageContextValue {
  locale: Locale
  dir: Dir
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getDir(locale: Locale): Dir {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

function getStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(LANG_KEY)
    if (stored && (SUPPORTED_LOCALES as readonly string[]).includes(stored)) return stored as Locale
  } catch {
    // localStorage unavailable
  }
  return 'id'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale)

  const applyLocale = useCallback((loc: Locale) => {
    const root = document.documentElement
    root.setAttribute('lang', loc)
    root.setAttribute('dir', getDir(loc))
    api.defaults.headers.common['X-Locale'] = loc
  }, [])

  const setLocale = useCallback(async (next: Locale) => {
    await loadLocale(next)
    setLocaleState(next)
    localStorage.setItem(LANG_KEY, next)
    i18n.changeLanguage(next)
    applyLocale(next)
  }, [i18n, applyLocale])

  useEffect(() => {
    applyLocale(locale)
  }, [locale, applyLocale])

  const value = useMemo(
    () => ({ locale, dir: getDir(locale), setLocale }),
    [locale, setLocale],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
