import { resolveAssetUrl } from '@/lib/safe-url'

export const DEFAULT_SCHOOL_LOGO = '/logo.png'
export const DEFAULT_SCHOOL_FAVICON = '/favicon.png'
export const DEFAULT_ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80'

export function getSchoolLogo(logo?: string | null): string {
  return resolveAssetUrl(logo, DEFAULT_SCHOOL_LOGO)
}

export function getSchoolFavicon(favicon?: string | null): string {
  return resolveAssetUrl(favicon, DEFAULT_SCHOOL_FAVICON)
}

export function getAboutImage(aboutImage?: string | null): string {
  return resolveAssetUrl(aboutImage, DEFAULT_ABOUT_IMAGE)
}
