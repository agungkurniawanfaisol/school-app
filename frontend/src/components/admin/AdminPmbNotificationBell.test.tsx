import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminPmbNotificationBell } from '@/components/admin/AdminPmbNotificationBell'
import type { PmbNotificationItem } from '@/types'

const navigateMock = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('@/hooks/usePmb', () => ({
  useAdminPmbNotifications: vi.fn(),
  useMarkAdminPmbNotificationsRead: () => ({ mutate: vi.fn(), isPending: false }),
}))

import { useAdminPmbNotifications } from '@/hooks/usePmb'

const mockUseAdminPmbNotifications = vi.mocked(useAdminPmbNotifications)

function wrap(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('AdminPmbNotificationBell', () => {
  it('shows unread badge count', () => {
    mockUseAdminPmbNotifications.mockReturnValue({
      data: { unread_count: 3, items: [] },
      isLoading: false,
    } as never)

    wrap(<AdminPmbNotificationBell />)

    expect(screen.getByLabelText('3 belum dibaca')).toBeInTheDocument()
    expect(screen.getByLabelText('Notifikasi PMB')).toBeInTheDocument()
  })

  it('navigates to registration detail on item click', () => {
    const items: PmbNotificationItem[] = [
      {
        id: 'event-1',
        source: 'event',
        source_id: 1,
        type: 'submitted',
        title: 'Pendaftaran baru dikirim',
        body: 'PMB-001 · Ahmad',
        registration_uuid: 'abc-uuid',
        href_hash: 'timeline',
        unread: true,
        created_at: '2026-07-29T10:00:00Z',
      },
    ]

    mockUseAdminPmbNotifications.mockReturnValue({
      data: { unread_count: 1, items },
      isLoading: false,
    } as never)

    wrap(<AdminPmbNotificationBell />)

    fireEvent.click(screen.getByLabelText('Notifikasi PMB'))
    fireEvent.click(screen.getByText('Pendaftaran baru dikirim'))

    expect(navigateMock).toHaveBeenCalledWith('/admin/pmb-registrations/abc-uuid#timeline')
  })
})
