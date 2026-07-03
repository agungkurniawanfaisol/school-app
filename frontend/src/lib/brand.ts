export const DEFAULT_SCHOOL_LOGO = '/logo.png'
export const DEFAULT_SCHOOL_FAVICON = '/favicon.png'

export function getSchoolLogo(logo?: string | null): string {
  const trimmed = logo?.trim()
  return trimmed ? trimmed : DEFAULT_SCHOOL_LOGO
}

export function getSchoolFavicon(favicon?: string | null): string {
  const trimmed = favicon?.trim()
  return trimmed ? trimmed : DEFAULT_SCHOOL_FAVICON
}
