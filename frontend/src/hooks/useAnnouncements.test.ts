import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet } = vi.hoisted(() => ({
  apiGet: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGet },
}))

import { useAnnouncementsList } from '@/hooks/useAnnouncements'

describe('useAnnouncements', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches announcements list', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: [{ id: 1, title: 'Pengumuman Libur', content: 'Sekolah libur.' }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
        links: {},
      },
    })

    const { result } = renderHook(() => useAnnouncementsList(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data[0]?.title).toBe('Pengumuman Libur')
    expect(apiGet).toHaveBeenCalledWith('/v1/announcements', { params: {} })
  })
})
