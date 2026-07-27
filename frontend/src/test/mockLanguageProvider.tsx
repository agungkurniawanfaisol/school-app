import type { ReactNode } from 'react'
import { vi } from 'vitest'

export function MockLanguageProvider({ children }: { children: ReactNode }) {
  return children
}

export const mockLanguageProviderModule = {
  useLanguage: () => ({
    locale: 'id' as const,
    dir: 'ltr' as const,
    isChangingLocale: false,
    isReady: true,
    setLocale: vi.fn(),
  }),
  LanguageProvider: MockLanguageProvider,
}
