import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/lib/api'
import { LANG_KEY, SUPPORTED_LOCALES, loadLocale, i18nReady, type SupportedLocale } from '@/lib/i18n'

export type Locale = SupportedLocale
export type Dir = 'ltr' | 'rtl'

interface LanguageContextValue {
  locale: Locale
  dir: Dir
  isChangingLocale: boolean
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
  const [isChangingLocale, setIsChangingLocale] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    i18nReady
      .then(() => setIsReady(true))
      .catch(() => setIsReady(true))
  }, [])

  const applyLocale = useCallback((loc: Locale) => {
    const root = document.documentElement
    root.setAttribute('lang', loc)
    root.setAttribute('dir', getDir(loc))
    api.defaults.headers.common['X-Locale'] = loc
  }, [])

  const setLocale = useCallback(async (next: Locale) => {
    setIsChangingLocale(true)
    try {
      await loadLocale(next)
      setLocaleState(next)
      localStorage.setItem(LANG_KEY, next)
      i18n.changeLanguage(next)
      applyLocale(next)
    } finally {
      setIsChangingLocale(false)
    }
  }, [i18n, applyLocale])

  useEffect(() => {
    applyLocale(locale)
  }, [locale, applyLocale])

  const value = useMemo(
    () => ({ locale, dir: getDir(locale), isChangingLocale, setLocale }),
    [locale, isChangingLocale, setLocale],
  )

  if (!isReady) {
    return (
      <div className="flex h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
