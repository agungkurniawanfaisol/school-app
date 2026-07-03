import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet, apiPost, apiPut, apiDelete } = vi.hoisted(() => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPut: vi.fn(),
  apiDelete: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGet, post: apiPost, put: apiPut, delete: apiDelete },
  getAuthToken: () => 'token',
  getApiErrorMessage: () => 'error',
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

import { useAdminTeachersList, useCreateTeacher, useTeacherDetailByUuid, useTeachersList } from '@/hooks/useTeachers'

describe('useTeachers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches teachers list', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: [{ id: 1, uuid: 'abc', name: 'Ustadz Ahmad', slug: 'ustadz-ahmad' }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
        links: {},
      },
    })

    const { result } = renderHook(() => useTeachersList({ featured: true }), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data[0]?.name).toBe('Ustadz Ahmad')
    expect(apiGet).toHaveBeenCalledWith('/v1/teachers', { params: { featured: true } })
  })

  it('creates teacher via admin API', async () => {
    apiPost.mockResolvedValueOnce({
      data: { data: { uuid: 'new-uuid', name: 'Guru Baru' } },
    })
    apiGet.mockResolvedValue({ data: { data: [], meta: {}, links: {} } })

    const { result } = renderHook(() => useCreateTeacher(), { wrapper: createWrapper() })

    await result.current.mutateAsync({
      school_id: 1,
      name: 'Guru Baru',
      slug: 'guru-baru',
      order: 0,
      is_active: true,
      is_featured: false,
    })

    expect(apiPost).toHaveBeenCalledWith('/admin/teachers', expect.objectContaining({ name: 'Guru Baru' }))
  })

  it('fetches admin teachers list', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: [],
        meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 },
        links: {},
      },
    })

    const { result } = renderHook(() => useAdminTeachersList(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(apiGet).toHaveBeenCalledWith('/admin/teachers', { params: {} })
  })

  it('fetches teacher detail by uuid', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: { id: 1, uuid: 'uuid-abc', name: 'Ustadz Ahmad', slug: 'ustadz-ahmad', bio: 'Bio' },
      },
    })

    const { result } = renderHook(() => useTeacherDetailByUuid('uuid-abc'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe('Ustadz Ahmad')
    expect(apiGet).toHaveBeenCalledWith('/v1/teachers/uuid/uuid-abc')
  })
})
