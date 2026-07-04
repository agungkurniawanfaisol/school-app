import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiGet } = vi.hoisted(() => ({
  apiGet: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { get: apiGet },
}))

import { usePhotoAlbumsList } from '@/hooks/usePhotoAlbums'

describe('usePhotoAlbums', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches photo albums list', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        data: [{ id: 1, title: 'Album Pramuka', photos_count: 5 }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
        links: {},
      },
    })

    const { result } = renderHook(() => usePhotoAlbumsList({}), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data[0]?.title).toBe('Album Pramuka')
    expect(apiGet).toHaveBeenCalledWith('/v1/photo-albums', { params: {} })
  })
})
