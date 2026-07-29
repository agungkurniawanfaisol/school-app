import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PmbPortalHeader } from '@/components/layout/PmbPortalHeader'

vi.mock('@/hooks/useAuth', () => ({
  useAuthMe: () => ({ data: { name: 'Ibu Siti', email: 'siti@test.id', role: 'pendaftar' } }),
  useLogout: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('@/hooks/usePmb', () => ({
  usePmbNotifications: () => ({ data: { unread_count: 0, items: [] }, isLoading: false }),
  useMarkPmbNotificationsRead: () => ({ mutate: vi.fn(), isPending: false }),
}))

function renderHeader(isAuthenticated = true) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <PmbPortalHeader title="Pendaftaran PMB" isAuthenticated={isAuthenticated} />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('PmbPortalHeader', () => {
  it('renders info and logout as one action group when authenticated', () => {
    renderHeader(true)

    expect(screen.getByRole('group', { name: 'Aksi portal' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Notifikasi' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Info PMB/i })).toHaveAttribute('href', '/pmb')
    expect(screen.getByRole('button', { name: /Keluar dari portal/i })).toBeInTheDocument()
  })

  it('hides logout and notifications when guest', () => {
    renderHeader(false)

    expect(screen.getByRole('link', { name: /Info PMB/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Notifikasi' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Keluar dari portal/i })).not.toBeInTheDocument()
  })
})
