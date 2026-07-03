import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet } = vi.hoisted(() => ({
  apiGet: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGet },
  getAuthToken: () => 'test-token',
  getApiErrorMessage: vi.fn(),
}))

import { useAdminHeroSlidersList } from '@/hooks/useHeroSliders'

describe('useHeroSliders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches admin hero sliders list', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: [{ id: 1, title: 'Slider Utama', image: '/img.jpg', order: 0, is_active: true }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
        links: {},
      },
    })

    const { result } = renderHook(() => useAdminHeroSlidersList({ per_page: 15 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(1)
    expect(apiGet).toHaveBeenCalledWith('/admin/hero-sliders', { params: { per_page: 15 } })
  })
})
