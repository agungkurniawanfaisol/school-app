import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import idLanding from '@/locales/id/landing.json'
import idLayout from '@/locales/id/layout.json'
import idPages from '@/locales/id/pages.json'

const LANG_KEY = 'nurul-hikmah-lang'
const SUPPORTED_LOCALES = ['id', 'en', 'ar', 'ja'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

const NAMESPACES = ['landing', 'layout', 'pages'] as const

function getStoredLang(): SupportedLocale {
  if (typeof window === 'undefined') return 'id'
  const stored = localStorage.getItem(LANG_KEY)
  if (stored && (SUPPORTED_LOCALES as readonly string[]).includes(stored)) return stored as SupportedLocale
  return 'id'
}

const localeLoaders: Record<string, () => Promise<Record<string, unknown>>> = {
  'en/landing': () => import('@/locales/en/landing.json').then(m => m.default),
  'en/layout': () => import('@/locales/en/layout.json').then(m => m.default),
  'en/pages': () => import('@/locales/en/pages.json').then(m => m.default),
  'ar/landing': () => import('@/locales/ar/landing.json').then(m => m.default),
  'ar/layout': () => import('@/locales/ar/layout.json').then(m => m.default),
  'ar/pages': () => import('@/locales/ar/pages.json').then(m => m.default),
  'ja/landing': () => import('@/locales/ja/landing.json').then(m => m.default),
  'ja/layout': () => import('@/locales/ja/layout.json').then(m => m.default),
  'ja/pages': () => import('@/locales/ja/pages.json').then(m => m.default),
}

const loadedLocales = new Set<string>(['id'])

export async function loadLocale(locale: SupportedLocale): Promise<void> {
  if (loadedLocales.has(locale)) return

  const loads = NAMESPACES.map(async (ns) => {
    const loader = localeLoaders[`${locale}/${ns}`]
    if (!loader) return
    const resources = await loader()
    i18n.addResourceBundle(locale, ns, resources, true, true)
  })

  await Promise.all(loads)
  loadedLocales.add(locale)
}

i18n.use(initReactI18next).init({
  resources: {
    id: { landing: idLanding, layout: idLayout, pages: idPages },
  },
  lng: 'id',
  fallbackLng: 'id',
  ns: [...NAMESPACES],
  defaultNS: 'landing',
  interpolation: { escapeValue: false },
})

const storedLang = getStoredLang()
if (storedLang !== 'id') {
  loadLocale(storedLang).then(() => {
    i18n.changeLanguage(storedLang)
  })
}

export { LANG_KEY, SUPPORTED_LOCALES }
export type { SupportedLocale }
export default i18n
