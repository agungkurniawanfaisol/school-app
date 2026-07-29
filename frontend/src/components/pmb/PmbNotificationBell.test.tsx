import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PmbNotificationBell } from '@/components/pmb/PmbNotificationBell'
import { PmbNotificationPanel } from '@/components/pmb/PmbNotificationPanel'
import type { PmbNotificationItem } from '@/types'

vi.mock('@/hooks/usePmb', () => ({
  usePmbNotifications: vi.fn(),
  useMarkPmbNotificationsRead: () => ({ mutate: vi.fn(), isPending: false }),
}))

import { usePmbNotifications } from '@/hooks/usePmb'

const mockUsePmbNotifications = vi.mocked(usePmbNotifications)

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

describe('PmbNotificationPanel', () => {
  it('shows empty state', () => {
    render(
      <PmbNotificationPanel
        items={[]}
        unreadCount={0}
        onMarkAllRead={vi.fn()}
        onItemClick={vi.fn()}
      />,
    )

    expect(screen.getByText('Belum ada notifikasi')).toBeInTheDocument()
    expect(screen.getByText(/Update dari admin/i)).toBeInTheDocument()
  })

  it('renders unread items and mark-all action', () => {
    const onMarkAll = vi.fn()
    const items: PmbNotificationItem[] = [
      {
        id: 'message-1',
        source: 'message',
        source_id: 1,
        type: 'message',
        title: 'Pesan baru dari admin',
        body: 'Silakan lengkapi dokumen.',
        registration_uuid: 'uuid-1',
        href_hash: 'pesan',
        unread: true,
        created_at: new Date().toISOString(),
      },
    ]

    render(
      <PmbNotificationPanel
        items={items}
        unreadCount={1}
        onMarkAllRead={onMarkAll}
        onItemClick={vi.fn()}
      />,
    )

    expect(screen.getByText('Pesan baru dari admin')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Tandai semua dibaca/i }))
    expect(onMarkAll).toHaveBeenCalled()
  })
})

describe('PmbNotificationBell', () => {
  it('shows unread count badge when unread_count > 0', () => {
    mockUsePmbNotifications.mockReturnValue({
      data: { unread_count: 3, items: [] },
      isLoading: false,
    } as never)

    wrap(<PmbNotificationBell />)

    expect(screen.getByRole('button', { name: 'Notifikasi' })).toBeInTheDocument()
    expect(screen.getByLabelText('3 belum dibaca')).toHaveTextContent('3')
  })

  it('hides badge when unread_count is 0', () => {
    mockUsePmbNotifications.mockReturnValue({
      data: { unread_count: 0, items: [] },
      isLoading: false,
    } as never)

    wrap(<PmbNotificationBell />)

    expect(screen.queryByLabelText(/belum dibaca/i)).not.toBeInTheDocument()
  })

  it('caps badge at 9+', () => {
    mockUsePmbNotifications.mockReturnValue({
      data: { unread_count: 12, items: [] },
      isLoading: false,
    } as never)

    wrap(<PmbNotificationBell />)

    expect(screen.getByLabelText('12 belum dibaca')).toHaveTextContent('9+')
  })
})
