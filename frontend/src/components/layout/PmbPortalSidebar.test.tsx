import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { PmbPortalSidebar } from '@/components/layout/PmbPortalSidebar'

vi.mock('@/hooks/useAuth', () => ({
  useLogout: () => ({ mutate: vi.fn(), isPending: false }),
  useAuthMe: () => ({ data: null }),
}))

vi.mock('@/hooks/usePmb', () => ({
  usePmbNotifications: () => ({ data: { unread_count: 2, items: [] }, isLoading: false }),
}))

describe('PmbPortalSidebar', () => {
  it('renders portal branding and register link for guests', () => {
    render(
      <MemoryRouter initialEntries={['/pmb/daftar']}>
        <PmbPortalSidebar isAuthenticated={false} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Portal Pendaftaran')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Masuk & Daftar/i })).toHaveAttribute('href', '/pmb/daftar')
    expect(screen.getByRole('link', { name: /Masuk & Daftar/i })).toHaveClass('admin-nav-link--active')
    expect(screen.getByRole('link', { name: 'Info PMB' })).not.toHaveClass('admin-nav-link--active')
    expect(screen.queryByText('Proses pendaftaran')).not.toBeInTheDocument()
  })

  it('hides registration number while draft', () => {
    render(
      <MemoryRouter initialEntries={['/pmb/daftar']}>
        <PmbPortalSidebar
          isAuthenticated
          registration={{
            uuid: 'uuid-1',
            registration_number: 'PMB-001',
            student_name: 'Ahmad',
            status: 'draft',
          } as never}
        />
      </MemoryRouter>,
    )

    expect(screen.queryByText('No. Registrasi')).not.toBeInTheDocument()
    expect(screen.getByText('Ahmad')).toBeInTheDocument()
  })

  it('shows LoA nav only when accepted', () => {
    render(
      <MemoryRouter initialEntries={['/pmb/portal/pendaftaran/uuid-1']}>
        <Routes>
          <Route
            path="/pmb/portal/pendaftaran/:uuid"
            element={
              <PmbPortalSidebar
                isAuthenticated
                registration={{
                  uuid: 'uuid-1',
                  registration_number: 'PMB-001',
                  student_name: 'Ahmad',
                  status: 'accepted',
                } as never}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Surat Penerimaan' })).toBeInTheDocument()
    expect(screen.getByLabelText(/2 notifikasi belum dibaca/i)).toBeInTheDocument()
  })
})
