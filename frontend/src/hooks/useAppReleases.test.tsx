import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet } = vi.hoisted(() => ({
  apiGet: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGet },
  getAuthToken: () => null,
  getApiErrorMessage: (_e: unknown, fallback: string) => fallback,
}))

import { usePublicAppReleasesList } from '@/hooks/useAppReleases'

describe('useAppReleases', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches public app releases', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: [
          {
            id: 1,
            uuid: 'u-1',
            version: '1.0.0',
            title: 'Rilis awal',
            body: 'Catatan',
            published_at: null,
            is_published: true,
          },
        ],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
        links: {},
      },
    })

    const { result } = renderHook(() => usePublicAppReleasesList({ page: 1 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data[0]?.version).toBe('1.0.0')
    expect(apiGet).toHaveBeenCalledWith('/v1/app-releases', { params: { page: 1 } })
  })
})
