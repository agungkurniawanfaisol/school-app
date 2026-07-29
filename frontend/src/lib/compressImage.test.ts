import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { compressImageFile } from '@/lib/compressImage'

function mockImageBitmap(width = 2000, height = 1500) {
  return {
    width,
    height,
    close: vi.fn(),
  }
}

/** Minimal valid JPEG with SOF0 declaring 2000×1500. */
function makeFakeJpeg(byteLength = 900_000): File {
  const bytes = new Uint8Array(byteLength)
  bytes[0] = 0xff
  bytes[1] = 0xd8
  bytes[2] = 0xff
  bytes[3] = 0xc0 // SOF0
  bytes[4] = 0x00
  bytes[5] = 0x11 // segment length
  bytes[6] = 0x08 // precision
  bytes[7] = 0x05 // height hi (1500)
  bytes[8] = 0xdc // height lo
  bytes[9] = 0x07 // width hi (2000)
  bytes[10] = 0xd0 // width lo
  return new File([bytes], 'foto.jpg', { type: 'image/jpeg' })
}

describe('compressImageFile', () => {
  const originalCreateImageBitmap = globalThis.createImageBitmap
  const originalCreateElement = document.createElement.bind(document)

  beforeEach(() => {
    vi.stubGlobal(
      'createImageBitmap',
      vi.fn(async (_source: ImageBitmapSource, options?: ImageBitmapOptions) => {
        if (options?.resizeWidth && options?.resizeHeight) {
          return mockImageBitmap(options.resizeWidth, options.resizeHeight)
        }
        return mockImageBitmap(2000, 1500)
      }),
    )

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        const canvas = originalCreateElement('canvas') as HTMLCanvasElement
        vi.spyOn(canvas, 'getContext').mockReturnValue({
          drawImage: vi.fn(),
        } as unknown as CanvasRenderingContext2D)
        vi.spyOn(canvas, 'toBlob').mockImplementation((callback, type) => {
          const mime = typeof type === 'string' ? type : 'image/jpeg'
          const bytes = mime === 'image/webp' ? 40_000 : 50_000
          callback(new Blob([new Uint8Array(bytes)], { type: mime }))
        })
        Object.defineProperty(canvas, 'width', { writable: true, value: 0 })
        Object.defineProperty(canvas, 'height', { writable: true, value: 0 })
        return canvas
      }
      return originalCreateElement(tagName)
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    if (originalCreateImageBitmap) {
      globalThis.createImageBitmap = originalCreateImageBitmap
    }
  })

  it('returns non-image files unchanged', async () => {
    const pdf = new File(['%PDF'], 'bukti.pdf', { type: 'application/pdf' })
    const result = await compressImageFile(pdf)
    expect(result).toBe(pdf)
  })

  it('compresses large images to a smaller jpeg file by default', async () => {
    const large = makeFakeJpeg()
    const result = await compressImageFile(large, { maxEdge: 1280, maxBytes: 1024 * 1024 })

    expect(result).not.toBe(large)
    expect(result.size).toBeLessThan(large.size)
    expect(result.type).toBe('image/jpeg')
    expect(createImageBitmap).toHaveBeenCalled()
  })

  it('decodes once with resize options when JPEG headers are readable', async () => {
    const large = makeFakeJpeg()
    await compressImageFile(large, { maxEdge: 1024 })

    expect(createImageBitmap).toHaveBeenCalledTimes(1)
    expect(createImageBitmap).toHaveBeenCalledWith(
      large,
      expect.objectContaining({
        resizeWidth: 1024,
        resizeHeight: 768,
        resizeQuality: 'medium',
      }),
    )
  })

  it('returns original when compress fails', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn(async () => {
      throw new Error('decode failed')
    }))

    const file = makeFakeJpeg(10_000)
    const result = await compressImageFile(file)
    expect(result).toBe(file)
  })
})
