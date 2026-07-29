import { describe, expect, it } from 'vitest'
import {
  buildTeacherSharePath,
  resolveAssetUrl,
  resolveMailto,
  resolveSafeHref,
  resolveSocialHref,
} from './safe-url'
import { DEFAULT_SCHOOL_LOGO } from './brand'

describe('safe-url', () => {
  it('blocks javascript URLs for assets', () => {
    expect(resolveAssetUrl('javascript:alert(1)', DEFAULT_SCHOOL_LOGO)).toBe(DEFAULT_SCHOOL_LOGO)
    expect(resolveAssetUrl('data:text/html,<script>alert(1)</script>', DEFAULT_SCHOOL_LOGO)).toBe(
      DEFAULT_SCHOOL_LOGO,
    )
  })

  it('allows safe relative and https asset URLs', () => {
    expect(resolveAssetUrl('/media/logo.png', DEFAULT_SCHOOL_LOGO)).toBe('/media/logo.png')
    expect(resolveAssetUrl('https://cdn.example.com/logo.png', DEFAULT_SCHOOL_LOGO)).toBe(
      'https://cdn.example.com/logo.png',
    )
  })

  it('allows same-origin blob preview URLs for local file uploads', () => {
    expect(resolveAssetUrl('blob:http://localhost:5173/abc-123', DEFAULT_SCHOOL_LOGO)).toBe(
      'blob:http://localhost:5173/abc-123',
    )
  })

  it('rewrites docker-internal absolute api urls to relative paths', () => {
    expect(
      resolveAssetUrl(
        'http://backend:8000/api/v1/pmb/portal/media/62a082eb-790c-41fe-9b28-941753b030d5?expires=1&signature=abc',
        DEFAULT_SCHOOL_LOGO,
      ),
    ).toBe('/api/v1/pmb/portal/media/62a082eb-790c-41fe-9b28-941753b030d5?expires=1&signature=abc')
  })

  it('resolves instagram handles safely', () => {
    expect(resolveSocialHref('@ustadz-ahmad', 'instagram')).toBe('https://instagram.com/ustadz-ahmad')
    expect(resolveSocialHref('javascript:alert(1)', 'instagram')).toBeNull()
  })

  it('allows https social links only', () => {
    expect(resolveSocialHref('https://facebook.com/page', 'facebook')).toBe('https://facebook.com/page')
    expect(resolveSocialHref('//evil.com', 'facebook')).toBeNull()
  })

  it('validates mailto emails', () => {
    expect(resolveMailto('guru@nurulhikmah.sch.id')).toBe('mailto:guru@nurulhikmah.sch.id')
    expect(resolveMailto('not-an-email')).toBeNull()
    expect(resolveMailto('javascript:alert(1)')).toBeNull()
  })

  it('builds canonical teacher share path with uuid', () => {
    expect(buildTeacherSharePath('00c1d94e-b90f-43a0-9f36-1fe6e59ab72b')).toBe(
      '/guru/detail/00c1d94e-b90f-43a0-9f36-1fe6e59ab72b',
    )
  })

  it('resolveSafeHref blocks protocol-relative and javascript URLs', () => {
    expect(resolveSafeHref('/pmb/daftar')).toBe('/pmb/daftar')
    expect(resolveSafeHref('https://example.com')).toBe('https://example.com')
    expect(resolveSafeHref('//evil.com')).toBeNull()
    expect(resolveSafeHref('javascript:alert(1)')).toBeNull()
  })
})
