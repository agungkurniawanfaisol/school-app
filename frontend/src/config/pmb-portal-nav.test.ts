import { describe, expect, it } from 'vitest'
import {
  buildPmbPortalNav,
  isPmbPortalNavActive,
  isPmbRegistrationCorrectionAllowed,
  isPmbRegistrationReadonly,
  isPmbRegistrationSubmitted,
  PMB_STATUS_DESCRIPTIONS,
  PMB_STATUS_LABELS,
  resolvePipelineIndex,
} from '@/config/pmb-portal-nav'

describe('pmb-portal-nav', () => {
  it('builds guest nav with login item', () => {
    const items = buildPmbPortalNav({ isAuthenticated: false })
    expect(items.some((item) => item.id === 'register' && item.label === 'Masuk & Daftar')).toBe(true)
    expect(items.some((item) => item.id === 'logout')).toBe(false)
  })

  it('allows correction only for needs_revision', () => {
    expect(isPmbRegistrationSubmitted('needs_revision')).toBe(true)
    expect(isPmbRegistrationCorrectionAllowed('needs_revision')).toBe(true)
    expect(isPmbRegistrationReadonly('needs_revision')).toBe(false)
    expect(isPmbRegistrationCorrectionAllowed('awaiting_verification')).toBe(false)
    expect(isPmbRegistrationReadonly('awaiting_verification')).toBe(true)
  })

  it('labels simplified statuses clearly', () => {
    expect(PMB_STATUS_LABELS.awaiting_verification).toBe('Menunggu verifikasi')
    expect(PMB_STATUS_LABELS.needs_revision).toBe('Perlu perbaikan')
    expect(PMB_STATUS_DESCRIPTIONS.needs_revision).toMatch(/perbaikan/i)
    expect(PMB_STATUS_DESCRIPTIONS.awaiting_verification).toMatch(/tidak dapat mengubah/i)
  })

  it('hides status nav while registration is still draft', () => {
    const items = buildPmbPortalNav({
      isAuthenticated: true,
      registration: { uuid: 'abc-123', status: 'draft' } as never,
    })
    expect(items.some((item) => item.id === 'status')).toBe(false)
    expect(items.some((item) => item.id === 'messages')).toBe(false)
  })

  it('shows status nav after registration is submitted', () => {
    expect(isPmbRegistrationSubmitted('draft')).toBe(false)
    expect(isPmbRegistrationSubmitted('awaiting_verification')).toBe(true)
    expect(isPmbRegistrationSubmitted('needs_revision')).toBe(true)
  })

  it('keeps data pendaftaran nav pointing to wizard route after submit', () => {
    const items = buildPmbPortalNav({
      isAuthenticated: true,
      registration: {
        uuid: 'abc-123',
        status: 'awaiting_verification',
      } as never,
    })
    const register = items.find((item) => item.id === 'register')
    expect(register?.label).toBe('Data pendaftaran')
    expect(register?.href).toBe('/pmb/daftar')
  })

  it('labels register nav as perbaiki data while needs_revision', () => {
    const items = buildPmbPortalNav({
      isAuthenticated: true,
      registration: {
        uuid: 'abc-123',
        status: 'needs_revision',
      } as never,
    })
    expect(items.find((item) => item.id === 'register')?.label).toBe('Perbaiki data')
  })

  it('builds authenticated nav with status but without messages menu', () => {
    const items = buildPmbPortalNav({
      isAuthenticated: true,
      registration: {
        uuid: 'abc-123',
        status: 'awaiting_verification',
      } as never,
    })
    expect(items.some((item) => item.href === '/pmb/portal/pendaftaran/abc-123')).toBe(true)
    expect(items.some((item) => item.id === 'messages')).toBe(false)
    expect(items.some((item) => item.id === 'testimonial')).toBe(true)
  })

  it('hides LoA until accepted', () => {
    const review = buildPmbPortalNav({
      isAuthenticated: true,
      registration: { uuid: 'x', status: 'awaiting_verification' } as never,
    })
    const accepted = buildPmbPortalNav({
      isAuthenticated: true,
      registration: { uuid: 'x', status: 'accepted' } as never,
    })
    expect(review.some((item) => item.id === 'loa')).toBe(false)
    expect(accepted.some((item) => item.id === 'loa')).toBe(true)
  })

  it('detects active nav paths', () => {
    expect(isPmbPortalNavActive('/pmb/daftar', '/pmb/daftar')).toBe(true)
    expect(isPmbPortalNavActive('/pmb/daftar', '/pmb')).toBe(false)
    expect(isPmbPortalNavActive('/pmb', '/pmb')).toBe(true)
    expect(isPmbPortalNavActive('/pmb/portal/pendaftaran/uuid', '/pmb/portal/pendaftaran/uuid')).toBe(true)
    expect(isPmbPortalNavActive('/pmb/portal/pendaftaran/uuid', '/pmb/portal/pendaftaran/uuid#pesan')).toBe(false)
    expect(isPmbPortalNavActive('/pmb/portal/pendaftaran/uuid', '/pmb/portal/pendaftaran/uuid#pesan', '#pesan')).toBe(true)
    expect(isPmbPortalNavActive('/pmb/portal/pendaftaran/uuid', '/pmb/portal/pendaftaran/uuid', '#pesan')).toBe(false)
  })

  it('resolves rejected status to end of pipeline', () => {
    expect(resolvePipelineIndex('rejected')).toBe(4)
    expect(resolvePipelineIndex('awaiting_verification')).toBe(1)
  })
})
