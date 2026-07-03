import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet } = vi.hoisted(() => ({
  apiGet: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGet },
}))

import { useNewsList } from '@/hooks/useNews'

describe('useNews', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches news list', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: [{ id: 1, title: 'Berita Terbaru', slug: 'berita-terbaru' }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
        links: {},
      },
    })

    const { result } = renderHook(() => useNewsList({ per_page: 3 }), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(1)
    expect(apiGet).toHaveBeenCalledWith('/v1/news', { params: { per_page: 3 } })
  })
})
