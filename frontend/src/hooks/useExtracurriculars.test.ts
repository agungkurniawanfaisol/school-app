import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet } = vi.hoisted(() => ({
  apiGet: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGet },
}))

import { useExtracurricularsList } from '@/hooks/useExtracurriculars'

describe('useExtracurriculars', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches extracurriculars list', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: [{ id: 1, name: 'Pramuka', category: 'lainnya', is_active: true }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
        links: {},
      },
    })

    const { result } = renderHook(() => useExtracurricularsList({ category: 'lainnya' }), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data[0]?.name).toBe('Pramuka')
    expect(apiGet).toHaveBeenCalledWith('/v1/extracurriculars', { params: { category: 'lainnya' } })
  })
})
