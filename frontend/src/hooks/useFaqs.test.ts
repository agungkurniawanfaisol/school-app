import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet } = vi.hoisted(() => ({
  apiGet: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGet },
}))

import { usePublicFaqsList } from '@/hooks/useFaqs'

describe('useFaqs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches FAQ list', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: [{ id: 1, question: 'Bagaimana cara mendaftar?', answer: 'Melalui website.' }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
        links: {},
      },
    })

    const { result } = renderHook(() => usePublicFaqsList({ category: 'pmb' }), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data[0]?.question).toBe('Bagaimana cara mendaftar?')
    expect(apiGet).toHaveBeenCalledWith('/v1/faqs', { params: { category: 'pmb' } })
  })
})
