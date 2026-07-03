import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet } = vi.hoisted(() => ({
  apiGet: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGet },
}))

import { useCoursesList } from '@/hooks/useCourses'

describe('useCourses', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches courses list', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: [{ id: 1, title: 'Belajar Tajwid', slug: 'belajar-tajwid' }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
        links: {},
      },
    })

    const { result } = renderHook(() => useCoursesList({ featured: true }), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data[0]?.title).toBe('Belajar Tajwid')
    expect(apiGet).toHaveBeenCalledWith('/v1/courses', { params: { featured: true } })
  })
})
