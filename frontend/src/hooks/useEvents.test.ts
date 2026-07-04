import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet } = vi.hoisted(() => ({
  apiGet: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGet },
}))

import { useEventsList } from '@/hooks/useEvents'

describe('useEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches events list', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: [{ id: 1, title: 'Peringatan Isra Miraj', event_date: '2026-07-15', category: 'keagamaan' }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
        links: {},
      },
    })

    const { result } = renderHook(() => useEventsList({ category: 'keagamaan' }), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data[0]?.title).toBe('Peringatan Isra Miraj')
    expect(apiGet).toHaveBeenCalledWith('/v1/events', { params: { category: 'keagamaan' } })
  })
})
