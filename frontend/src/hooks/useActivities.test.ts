import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet } = vi.hoisted(() => ({
  apiGet: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGet },
}))

import { useActivitiesList } from '@/hooks/useActivities'

describe('useActivities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches activities list', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: [{ id: 1, title: 'Lomba Tahfidz', slug: 'lomba-tahfidz' }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
        links: {},
      },
    })

    const { result } = renderHook(() => useActivitiesList({ featured: true }), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data[0]?.title).toBe('Lomba Tahfidz')
    expect(apiGet).toHaveBeenCalledWith('/v1/student-activities', { params: { featured: true } })
  })
})
