import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PmbStatusPage } from '@/pages/pmb/PmbStatusPage'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('@/components/layout/Header', () => ({
  Header: () => <header>Header</header>,
}))

vi.mock('@/components/layout/Footer', () => ({
  Footer: () => <footer>Footer</footer>,
}))

vi.mock('@/components/i18n/LanguageProvider', () => ({
  useLanguage: () => ({ locale: 'id', dir: 'ltr', isChangingLocale: false, setLocale: vi.fn() }),
}))

vi.mock('@/hooks/usePmb', () => ({
  usePmbTrack: () => ({
    data: undefined,
    isLoading: false,
    isError: false,
  }),
}))

describe('PmbStatusPage', () => {
  it('renders track form', () => {
    renderWithProviders(<PmbStatusPage />, { route: '/pmb/status', path: '/pmb/status' })

    expect(screen.getByText('Masukkan Token')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Masukkan token pendaftaran')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cek Status' })).toBeInTheDocument()
  })
})
