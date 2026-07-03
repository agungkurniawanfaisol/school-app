import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PmbInfoPage } from '@/pages/pmb/PmbInfoPage'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('@/components/layout/Header', () => ({
  Header: () => <header>Header</header>,
}))

vi.mock('@/components/layout/Footer', () => ({
  Footer: () => <footer>Footer</footer>,
}))

vi.mock('@/hooks/useSchool', () => ({
  useSchool: () => ({
    data: { id: 1, name: 'Nurul Hikmah School' },
    isLoading: false,
  }),
}))

vi.mock('@/hooks/usePmb', () => ({
  usePmbSettings: () => ({
    data: [],
    isLoading: false,
  }),
}))

describe('PmbInfoPage', () => {
  it('renders PMB information page', () => {
    renderWithProviders(<PmbInfoPage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Penerimaan Murid Baru' })).toBeInTheDocument()
    expect(screen.getByText(/Nurul Hikmah School/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Daftar Sekarang' })).toHaveAttribute('href', '/pmb/daftar')
  })
})
