import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createWrapper } from '@/test/renderWithProviders'

const { apiPost, compressImageFile } = vi.hoisted(() => ({
  apiPost: vi.fn(),
  compressImageFile: vi.fn(async (file: File) => file),
}))

vi.mock('@/lib/api', () => ({
  api: { post: apiPost },
  getApiErrorMessage: vi.fn((_error, fallback) => fallback),
}))

vi.mock('@/lib/compressImage', () => ({
  compressImageFile,
}))

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}))

import { useMediaUpload } from '@/hooks/useMediaUpload'

describe('useMediaUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    compressImageFile.mockImplementation(async (file: File) => file)
  })

  it('uploads file as multipart with upload progress callback', async () => {
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

    expect(compressImageFile).toHaveBeenCalledWith(
      file,
      expect.objectContaining({ maxEdge: 1920 }),
    )
    expect(apiPost).toHaveBeenCalledTimes(1)
    const [url, body, config] = apiPost.mock.calls[0] as [
      string,
      FormData,
      { onUploadProgress?: (event: { loaded: number; total?: number }) => void },
    ]
    expect(url).toBe('/admin/uploads')
    expect(body).toBeInstanceOf(FormData)
    expect(body.get('collection')).toBe('news')
    expect(body.get('file')).toBe(file)
    expect(typeof config?.onUploadProgress).toBe('function')
  })

  it('skips compress for virtual-tour collection', async () => {
    apiPost.mockResolvedValueOnce({
      data: {
        message: 'File berhasil diunggah.',
        data: {
          uuid: '90474c86-7cd6-45a8-9c7e-afb24cb3cc75',
          url: '/storage/uploads/virtual-tour/pano.jpg',
          path: 'uploads/virtual-tour/pano.jpg',
          mime_type: 'image/jpeg',
          size: 1000,
        },
      },
    })

    const { result } = renderHook(() => useMediaUpload('virtual-tour'), { wrapper: createWrapper() })
    const file = new File(['pano'], 'pano.jpg', { type: 'image/jpeg' })

    await result.current.mutateAsync(file)

    expect(compressImageFile).not.toHaveBeenCalled()
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
