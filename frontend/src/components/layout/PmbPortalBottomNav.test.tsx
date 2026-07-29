import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { PmbPortalBottomNav } from '@/components/layout/PmbPortalBottomNav'

vi.mock('@/hooks/usePmb', () => ({
  usePmbNotifications: () => ({ data: { unread_count: 2, items: [] }, isLoading: false }),
}))

describe('PmbPortalBottomNav', () => {
  it('renders guest nav items on mobile', () => {
    render(
      <MemoryRouter initialEntries={['/pmb/daftar']}>
        <PmbPortalBottomNav isAuthenticated={false} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('navigation', { name: 'Navigasi utama portal PMB' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Masuk & Daftar/i })).toHaveAttribute('href', '/pmb/daftar')
    expect(screen.getByRole('link', { name: /Info PMB/i })).toHaveAttribute('href', '/pmb')
  })

  it('shows status link after registration is submitted', () => {
    render(
      <MemoryRouter initialEntries={['/pmb/portal/pendaftaran/uuid-1']}>
        <PmbPortalBottomNav
          isAuthenticated
          registration={{ uuid: 'uuid-1', status: 'awaiting_verification' } as never}
        />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /Status & Timeline/i })).toHaveAttribute(
      'href',
      '/pmb/portal/pendaftaran/uuid-1',
    )
    expect(screen.getByLabelText(/2 notifikasi belum dibaca/i)).toBeInTheDocument()
  })
})
