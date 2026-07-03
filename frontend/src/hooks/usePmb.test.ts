import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet, apiPost } = vi.hoisted(() => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: {
    get: apiGet,
    post: apiPost,
  },
}))

import { usePmbRegister, usePmbTrack } from '@/hooks/usePmb'

describe('usePmb', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('register mutation posts registration data', async () => {
    apiPost.mockResolvedValueOnce({
      data: {
        message: 'Pendaftaran berhasil',
        data: { registration_number: 'PMB-001', student_name: 'Ahmad' },
      },
    })

    const { result } = renderHook(() => usePmbRegister(), { wrapper: createWrapper() })

    result.current.mutate({
      school_id: 1,
      student_name: 'Ahmad',
      parent_name: 'Budi',
      parent_phone: '081234567890',
      grade_applied: 'Kelas 1 SD',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(apiPost).toHaveBeenCalledWith('/v1/pmb/registrations', expect.objectContaining({
      student_name: 'Ahmad',
      parent_email: null,
    }))
  })

  it('track query is enabled only when token is provided', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: {
          student_name: 'Ahmad',
          status: 'pending',
          registration_number: 'PMB-001',
          grade_applied: 'Kelas 1 SD',
          parent_name: 'Budi',
          parent_phone: '081234567890',
        },
      },
    })

    const { result } = renderHook(() => usePmbTrack('token1234567'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(apiGet).toHaveBeenCalledWith('/v1/pmb/track/token1234567')
  })

  it('track query stays idle without token', () => {
    const { result } = renderHook(() => usePmbTrack(''), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
    expect(apiGet).not.toHaveBeenCalled()
  })
})
