import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet, apiPatch } = vi.hoisted(() => ({
  apiGet: vi.fn(),
  apiPatch: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGet, patch: apiPatch },
  getApiErrorMessage: vi.fn((_error, fallback) => fallback),
  getAuthToken: () => 'token',
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

import { useAdminActivityDetail, usePublishActivity } from '@/hooks/useActivities'

describe('usePublishActivity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updates admin detail cache so save will not revert to draft', async () => {
    const uuid = 'act-uuid-1'
    apiGet.mockResolvedValueOnce({
      data: {
        data: {
          uuid,
          title: 'Kegiatan',
          status: 'draft',
          published_at: null,
          is_featured: false,
        },
      },
    })
    apiPatch.mockResolvedValueOnce({
      data: {
        data: {
          uuid,
          title: 'Kegiatan',
          status: 'published',
          published_at: '2026-07-29T00:00:00+00:00',
          is_featured: false,
        },
      },
    })

    const wrapper = createWrapper()
    const { result: detail } = renderHook(() => useAdminActivityDetail(uuid), { wrapper })
    await waitFor(() => expect(detail.current.isSuccess).toBe(true))
    expect(detail.current.data?.status).toBe('draft')

    const { result: publish } = renderHook(() => usePublishActivity(), { wrapper })
    await publish.current.mutateAsync(uuid)

    await waitFor(() => {
      expect(detail.current.data?.status).toBe('published')
    })
    expect(apiPatch).toHaveBeenCalledWith(`/admin/student-activities/${uuid}/publish`)
  })
})
