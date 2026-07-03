import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet } = vi.hoisted(() => ({
  apiGet: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGet },
  SCHOOL_SLUG: 'nurul-hikmah',
}))

import { useSchool } from '@/hooks/useSchool'

describe('useSchool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches school by slug', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: { id: 1, name: 'Nurul Hikmah School', slug: 'nurul-hikmah' },
      },
    })

    const { result } = renderHook(() => useSchool('nurul-hikmah'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe('Nurul Hikmah School')
    expect(apiGet).toHaveBeenCalledWith('/v1/schools/nurul-hikmah')
  })
})
