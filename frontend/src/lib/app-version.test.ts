import { describe, expect, it, beforeEach, vi } from 'vitest'
import {
  compareSemver,
  formatAppVersion,
  getSeenVersion,
  setSeenVersion,
  shouldNotifyUpdate,
} from '@/lib/app-version'

describe('app-version', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubEnv('VITE_APP_VERSION', '1.0.0')
  })

  it('formats version with v prefix', () => {
    expect(formatAppVersion('1.2.0')).toBe('v1.2.0')
    expect(formatAppVersion('v1.2.0')).toBe('v1.2.0')
  })

  it('compares semver', () => {
    expect(compareSemver('1.1.0', '1.0.0')).toBe(1)
    expect(compareSemver('1.0.0', '1.0.1')).toBe(-1)
    expect(compareSemver('1.0.0', '1.0.0')).toBe(0)
  })

  it('notifies when server is newer than build and unseen', () => {
    expect(shouldNotifyUpdate('1.1.0', '1.0.0')).toBe(true)
  })

  it('does not notify when already seen server version', () => {
    setSeenVersion('1.1.0')
    expect(shouldNotifyUpdate('1.1.0', '1.0.0')).toBe(false)
  })

  it('does not notify when server matches running build', () => {
    expect(shouldNotifyUpdate('1.0.0', '1.0.0')).toBe(false)
  })

  it('does not notify when build is ahead of server', () => {
    setSeenVersion('1.0.0')
    expect(shouldNotifyUpdate('1.0.0', '1.2.0')).toBe(false)
  })

  it('stores seen version', () => {
    setSeenVersion('1.0.0')
    expect(getSeenVersion()).toBe('1.0.0')
  })
})
