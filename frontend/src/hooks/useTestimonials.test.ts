import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet } = vi.hoisted(() => ({
  apiGet: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGet },
}))

import { useTestimonialsList } from '@/hooks/useTestimonials'

describe('useTestimonials', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches testimonials list', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: [{ id: 1, name: 'Ibu Siti', content: 'Sekolah yang baik' }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
        links: {},
      },
    })

    const { result } = renderHook(() => useTestimonialsList({ featured: true }), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data[0]?.name).toBe('Ibu Siti')
    expect(apiGet).toHaveBeenCalledWith('/v1/testimonials', { params: { featured: true } })
  })
})
