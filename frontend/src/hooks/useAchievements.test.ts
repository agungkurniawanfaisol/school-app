import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet } = vi.hoisted(() => ({
  apiGet: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGet },
}))

import { useAchievementsList } from '@/hooks/useAchievements'

describe('useAchievements', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches achievements list', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: [{ id: 1, title: 'Juara 1 Olimpiade', category: 'akademik', year: 2025 }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
        links: {},
      },
    })

    const { result } = renderHook(() => useAchievementsList({ category: 'akademik' }), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data[0]?.title).toBe('Juara 1 Olimpiade')
    expect(apiGet).toHaveBeenCalledWith('/v1/achievements', { params: { category: 'akademik' } })
  })
})
