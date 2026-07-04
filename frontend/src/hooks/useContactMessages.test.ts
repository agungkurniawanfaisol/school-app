import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet } = vi.hoisted(() => ({
  apiGet: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGet, post: vi.fn(), delete: vi.fn(), patch: vi.fn() },
  getAuthToken: () => 'test-token',
  getApiErrorMessage: (err: unknown, fallback: string) => fallback,
}))

import { useAdminContactMessagesList } from '@/hooks/useContactMessages'

describe('useContactMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches admin contact messages list', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: [
          {
            id: 1,
            school_id: 1,
            name: 'Ahmad',
            email: 'ahmad@example.com',
            phone: null,
            subject: 'Pertanyaan',
            message: 'Halo, saya ingin bertanya.',
            is_read: false,
            read_at: null,
            replied_at: null,
            created_at: '2026-07-04T10:00:00+07:00',
          },
        ],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
        links: {},
      },
    })

    const { result } = renderHook(
      () => useAdminContactMessagesList({ page: 1, per_page: 15 }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toHaveLength(1)
    expect(result.current.data?.data[0].name).toBe('Ahmad')
    expect(apiGet).toHaveBeenCalledWith('/admin/contact-messages', {
      params: { page: 1, per_page: 15 },
    })
  })
})
