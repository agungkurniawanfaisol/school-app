import { resolveAssetUrl } from '@/lib/safe-url'

export const DEFAULT_SCHOOL_LOGO = '/logo.png'
export const DEFAULT_SCHOOL_FAVICON = '/favicon.png'

export function getSchoolLogo(logo?: string | null): string {
  return resolveAssetUrl(logo, DEFAULT_SCHOOL_LOGO)
}

export function getSchoolFavicon(favicon?: string | null): string {
  return resolveAssetUrl(favicon, DEFAULT_SCHOOL_FAVICON)
}
