import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiPost } = vi.hoisted(() => ({
  apiPost: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: { post: apiPost },
  getApiErrorMessage: vi.fn((_error, fallback) => fallback),
}))

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}))

import { useMediaUpload } from '@/hooks/useMediaUpload'

describe('useMediaUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uploads file as multipart without forcing Content-Type header', async () => {
    apiPost.mockResolvedValueOnce({
      data: {
        message: 'File berhasil diunggah.',
        data: {
          uuid: '90474c86-7cd6-45a8-9c7e-afb24cb3cc75',
          url: '/storage/uploads/news/test.png',
          path: 'uploads/news/test.png',
          mime_type: 'image/png',
          size: 68,
        },
      },
    })

    const { result } = renderHook(() => useMediaUpload('news'), { wrapper: createWrapper() })
    const file = new File(['image'], 'photo.png', { type: 'image/png' })

    await result.current.mutateAsync(file)

    expect(apiPost).toHaveBeenCalledTimes(1)
    const [url, body, config] = apiPost.mock.calls[0] as [string, FormData, unknown]
    expect(url).toBe('/admin/uploads')
    expect(body).toBeInstanceOf(FormData)
    expect(body.get('collection')).toBe('news')
    expect(body.get('file')).toBe(file)
    expect(config).toBeUndefined()
  })

  it('returns uploaded media url', async () => {
    apiPost.mockResolvedValueOnce({
      data: {
        message: 'File berhasil diunggah.',
        data: {
          uuid: '90474c86-7cd6-45a8-9c7e-afb24cb3cc75',
          url: '/storage/uploads/news/test.png',
          path: 'uploads/news/test.png',
          mime_type: 'image/png',
          size: 68,
        },
      },
    })

    const { result } = renderHook(() => useMediaUpload('news'), { wrapper: createWrapper() })
    const file = new File(['image'], 'photo.png', { type: 'image/png' })

    let uploaded
    await waitFor(async () => {
      uploaded = await result.current.mutateAsync(file)
    })

    expect(uploaded?.url).toBe('/storage/uploads/news/test.png')
  })
})
