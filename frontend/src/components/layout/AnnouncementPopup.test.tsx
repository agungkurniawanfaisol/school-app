import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnnouncementPopup } from '@/components/layout/AnnouncementPopup'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@/hooks/useAnnouncements', () => ({
  useAnnouncementsList: () => ({
    data: {
      data: [
        {
          id: 1,
          uuid: 'ann-1',
          title: 'Pendaftaran Siswa Baru Telah Dibuka',
          content: 'Kuota terbatas.',
          priority: 'urgent',
          is_pinned: true,
          is_active: true,
          cta_text: 'Buka Sekarang',
          cta_url: 'https://nurulhikmah.sch.id/pmb/daftar',
        },
      ],
    },
  }),
}))

describe('AnnouncementPopup', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  it('rewrites legacy absolute CTA to in-app /pmb/daftar link', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <AnnouncementPopup />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    await vi.advanceTimersByTimeAsync(900)

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Buka Sekarang' })).toHaveAttribute(
        'href',
        '/pmb/daftar',
      )
    })
  })
})
