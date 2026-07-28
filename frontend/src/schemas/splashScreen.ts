import { z } from 'zod'
import { DEFAULT_SCHOOL_LOGO } from '@/lib/brand'
import { resolveAssetUrl } from '@/lib/safe-url'

export const MIN_SPLASH_DURATION_MS = 1000
export const MAX_SPLASH_DURATION_MS = 5000
export const DEFAULT_SPLASH_DURATION_MS = 2500

export const splashScreenSchema = z.object({
  image: z.string().max(500).optional().or(z.literal('')),
  title: z.string().trim().min(1, 'Judul wajib diisi').max(120, 'Judul maksimal 120 karakter'),
  subtitle: z.string().max(200, 'Subjudul maksimal 200 karakter').optional().or(z.literal('')),
  duration_ms: z
    .number()
    .int('Durasi harus bilangan bulat')
    .min(MIN_SPLASH_DURATION_MS, `Durasi minimal ${MIN_SPLASH_DURATION_MS} ms`)
    .max(MAX_SPLASH_DURATION_MS, `Durasi maksimal ${MAX_SPLASH_DURATION_MS} ms`),
})

export type SplashScreenFormValues = z.infer<typeof splashScreenSchema>

export const DEFAULT_SPLASH_SCREEN: SplashScreenFormValues = {
  image: '/logo.png',
  title: 'Sekolah Islam Nurul Hikmah',
  subtitle: '',
  duration_ms: DEFAULT_SPLASH_DURATION_MS,
}

export function parseSplashScreenValue(raw: string | null | undefined): SplashScreenFormValues | null {
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    const result = splashScreenSchema.safeParse(parsed)
    return result.success ? result.data : null
  } catch {
    return null
  }
}

export function clampSplashDuration(durationMs?: number | null): number {
  if (!durationMs || Number.isNaN(durationMs)) {
    return DEFAULT_SPLASH_DURATION_MS
  }
  return Math.min(MAX_SPLASH_DURATION_MS, Math.max(MIN_SPLASH_DURATION_MS, durationMs))
}

type SchoolSplashFallback = {
  name?: string | null
  tagline?: string | null
  logo?: string | null
}

export function resolveSplashDisplay(
  config: SplashScreenFormValues | null,
  school?: SchoolSplashFallback | null,
) {
  const imageSource = config?.image?.trim() || school?.logo || DEFAULT_SCHOOL_LOGO

  return {
    image: resolveAssetUrl(imageSource, DEFAULT_SCHOOL_LOGO),
    title: config?.title?.trim() || school?.name?.trim() || 'Nurul Hikmah',
    subtitle: config?.subtitle?.trim() || school?.tagline?.trim() || '',
    durationMs: clampSplashDuration(config?.duration_ms),
  }
}
