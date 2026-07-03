import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PmbRegisterPage } from '@/pages/pmb/PmbRegisterPage'
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
  usePmbRegister: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

describe('PmbRegisterPage', () => {
  it('shows validation errors on empty submit', async () => {
    renderWithProviders(<PmbRegisterPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Kirim Pendaftaran' }))

    expect(await screen.findByText('Nama siswa wajib diisi')).toBeInTheDocument()
    expect(screen.getByText('Nama orang tua wajib diisi')).toBeInTheDocument()
    expect(screen.getByText('Nomor telepon wajib diisi')).toBeInTheDocument()
    expect(screen.getByText('Jenjang pendaftaran wajib diisi')).toBeInTheDocument()
  })
})
