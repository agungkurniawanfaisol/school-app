import { describe, expect, it } from 'vitest'
import { DEFAULT_SCHOOL_FAVICON, DEFAULT_SCHOOL_LOGO, getSchoolFavicon, getSchoolLogo } from './brand'

describe('brand', () => {
  it('returns default logo when school logo is empty', () => {
    expect(getSchoolLogo(null)).toBe(DEFAULT_SCHOOL_LOGO)
    expect(getSchoolLogo('')).toBe(DEFAULT_SCHOOL_LOGO)
    expect(getSchoolLogo('   ')).toBe(DEFAULT_SCHOOL_LOGO)
  })

  it('returns school logo when provided', () => {
    expect(getSchoolLogo('/media/custom.png')).toBe('/media/custom.png')
  })

  it('rejects unsafe logo URLs', () => {
    expect(getSchoolLogo('javascript:alert(1)')).toBe(DEFAULT_SCHOOL_LOGO)
  })

  it('returns default favicon when school favicon is empty', () => {
    expect(getSchoolFavicon(undefined)).toBe(DEFAULT_SCHOOL_FAVICON)
    expect(getSchoolFavicon('')).toBe(DEFAULT_SCHOOL_FAVICON)
  })

  it('returns school favicon when provided', () => {
    expect(getSchoolFavicon('/media/icon.png')).toBe('/media/icon.png')
  })
})
