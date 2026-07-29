export type CompressImageOptions = {
  /** Longest side in pixels. Default 1280. */
  maxEdge?: number
  /** Soft target size in bytes; quality is reduced until under this when possible. */
  maxBytes?: number
  /** Initial canvas quality 0–1. Default 0.72 (speed/size balance). */
  quality?: number
  /** Preferred output MIME. JPEG is faster to encode than WebP on most devices. */
  mimeType?: 'image/webp' | 'image/jpeg'
}

const DEFAULT_MAX_EDGE = 1280
const DEFAULT_QUALITY = 0.72

function extensionForMime(mime: string): string {
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/png') return 'png'
  return 'jpg'
}

function renameFile(original: File, mime: string): string {
  const base = original.name.replace(/\.[^.]+$/, '') || 'image'
  return `${base}.${extensionForMime(mime)}`
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality)
  })
}

function scaleDimensions(width: number, height: number, maxEdge: number): { width: number; height: number } {
  const longest = Math.max(width, height)
  if (longest <= maxEdge) {
    return { width, height }
  }
  const scale = maxEdge / longest
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

/** Read JPEG SOF dimensions without a full decode. */
function readJpegSize(bytes: Uint8Array): { width: number; height: number } | null {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null
  let offset = 2
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) return null
    const marker = bytes[offset + 1]
    const size = (bytes[offset + 2] << 8) | bytes[offset + 3]
    // SOF0 / SOF2 baseline & progressive
    if (marker === 0xc0 || marker === 0xc2) {
      const height = (bytes[offset + 5] << 8) | bytes[offset + 6]
      const width = (bytes[offset + 7] << 8) | bytes[offset + 8]
      if (width > 0 && height > 0) return { width, height }
      return null
    }
    if (size < 2) return null
    offset += 2 + size
  }
  return null
}

/** Read PNG IHDR dimensions without a full decode. */
function readPngSize(bytes: Uint8Array): { width: number; height: number } | null {
  if (bytes.length < 24) return null
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  for (let i = 0; i < 8; i++) {
    if (bytes[i] !== sig[i]) return null
  }
  const width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19]
  const height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23]
  if (width > 0 && height > 0) return { width, height }
  return null
}

async function peekImageSize(file: File): Promise<{ width: number; height: number } | null> {
  const header = new Uint8Array(await file.slice(0, 128 * 1024).arrayBuffer())
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    return readJpegSize(header)
  }
  if (file.type === 'image/png') {
    return readPngSize(header)
  }
  // Some phones omit type; sniff magic bytes.
  return readJpegSize(header) ?? readPngSize(header)
}

/**
 * Decode at target size when dimensions are known (JPEG/PNG header peek).
 * Falls back to a full decode when headers cannot be read.
 */
async function decodeForMaxEdge(file: File, maxEdge: number): Promise<{
  bitmap: ImageBitmap
  width: number
  height: number
  /** True when the source pixels already fit under maxEdge (no geometric downscale needed). */
  sourceWithinMaxEdge: boolean
}> {
  const peeked = await peekImageSize(file)
  if (peeked) {
    const target = scaleDimensions(peeked.width, peeked.height, maxEdge)
    const sourceWithinMaxEdge = target.width === peeked.width && target.height === peeked.height
    if (!sourceWithinMaxEdge) {
      try {
        const bitmap = await createImageBitmap(file, {
          resizeWidth: target.width,
          resizeHeight: target.height,
          resizeQuality: 'medium',
        })
        return { bitmap, width: target.width, height: target.height, sourceWithinMaxEdge: false }
      } catch {
        // Fall through to full decode.
      }
    } else {
      const bitmap = await createImageBitmap(file)
      return { bitmap, width: bitmap.width, height: bitmap.height, sourceWithinMaxEdge: true }
    }
  }

  const bitmap = await createImageBitmap(file)
  const target = scaleDimensions(bitmap.width, bitmap.height, maxEdge)
  const sourceWithinMaxEdge = target.width === bitmap.width && target.height === bitmap.height
  return { bitmap, width: target.width, height: target.height, sourceWithinMaxEdge }
}

/**
 * Resize + compress an image file in the browser before upload.
 * Non-image files are returned unchanged.
 *
 * Tuned for speed: JPEG by default (faster than WebP), one encode pass,
 * optional second pass only when over maxBytes.
 */
export async function compressImageFile(
  file: File,
  options: CompressImageOptions = {},
): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file
  }

  const maxEdge = options.maxEdge ?? DEFAULT_MAX_EDGE
  const maxBytes = options.maxBytes
  const preferredMime = options.mimeType ?? 'image/jpeg'
  const quality = options.quality ?? DEFAULT_QUALITY

  let bitmap: ImageBitmap | null = null
  try {
    const decoded = await decodeForMaxEdge(file, maxEdge)
    bitmap = decoded.bitmap
    const { width, height, sourceWithinMaxEdge } = decoded

    // Skip only when the *source* was already small enough — not when we only
    // resized during decode (bitmap then looks "small" but the File is still huge).
    const alreadySmallEnough =
      sourceWithinMaxEdge && (maxBytes === undefined || file.size <= maxBytes)

    if (alreadySmallEnough && (file.type === 'image/jpeg' || file.type === 'image/webp')) {
      return file
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) {
      return file
    }
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()
    bitmap = null

    // JPEG-first: one encode. WebP only if caller insists (slower on many devices).
    const tryMimes =
      preferredMime === 'image/webp' ? (['image/webp', 'image/jpeg'] as const) : (['image/jpeg'] as const)

    let bestBlob: Blob | null = null
    let bestMime = file.type

    for (const mime of tryMimes) {
      let blob = await canvasToBlob(canvas, mime, quality)
      if (!blob || blob.size === 0) continue

      if (maxBytes !== undefined && blob.size > maxBytes && quality > 0.5) {
        const next = await canvasToBlob(canvas, mime, Math.max(0.5, quality - 0.2))
        if (next && next.size > 0 && next.size < blob.size) {
          blob = next
        }
      }

      bestBlob = blob
      bestMime = mime
      if (maxBytes === undefined || blob.size <= maxBytes) break
    }

    if (!bestBlob) {
      return file
    }

    if (bestBlob.size >= file.size && (maxBytes === undefined || file.size <= maxBytes)) {
      return file
    }

    return new File([bestBlob], renameFile(file, bestMime), {
      type: bestMime,
      lastModified: Date.now(),
    })
  } catch {
    return file
  } finally {
    bitmap?.close()
  }
}
