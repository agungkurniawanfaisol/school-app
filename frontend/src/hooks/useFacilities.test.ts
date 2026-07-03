import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet } = vi.hoisted(() => ({
  apiGet: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGet },
}))

import { useFacilitiesList } from '@/hooks/useFacilities'

describe('useFacilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches facilities list', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: [{ id: 1, uuid: 'abc', name: 'Perpustakaan', slug: 'perpustakaan' }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
        links: {},
      },
    })

    const { result } = renderHook(() => useFacilitiesList({ featured: true }), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data[0]?.name).toBe('Perpustakaan')
    expect(apiGet).toHaveBeenCalledWith('/v1/facilities', { params: { featured: true } })
  })
})
