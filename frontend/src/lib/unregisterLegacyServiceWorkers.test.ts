import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  unregisterAllServiceWorkers,
  unregisterLegacyServiceWorkers,
} from '@/lib/unregisterLegacyServiceWorkers'

describe('unregisterLegacyServiceWorkers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('unregisters legacy /sw.js registrations and clears workbox caches', async () => {
    const unregister = vi.fn().mockResolvedValue(true)
    vi.stubGlobal('navigator', {
      serviceWorker: {
        getRegistrations: vi.fn().mockResolvedValue([
          {
            active: { scriptURL: 'https://nurulhikmahsda.sch.id/sw.js' },
            unregister,
          },
          {
            active: { scriptURL: 'https://nurulhikmahsda.sch.id/sw-nh5.js' },
            unregister: vi.fn(),
          },
        ]),
      },
    })

    const deleteCache = vi.fn().mockResolvedValue(true)
    vi.stubGlobal('caches', {
      keys: vi.fn().mockResolvedValue(['workbox-precache-v2-https://nurulhikmahsda.sch.id/', 'images']),
      delete: deleteCache,
    })

    await expect(unregisterLegacyServiceWorkers()).resolves.toBe(true)
    expect(unregister).toHaveBeenCalledTimes(1)
    expect(deleteCache).toHaveBeenCalledWith('workbox-precache-v2-https://nurulhikmahsda.sch.id/')
    expect(deleteCache).not.toHaveBeenCalledWith('images')
  })

  it('unregisters all service workers when requested', async () => {
    const unregisterA = vi.fn().mockResolvedValue(true)
    const unregisterB = vi.fn().mockResolvedValue(true)
    vi.stubGlobal('navigator', {
      serviceWorker: {
        getRegistrations: vi.fn().mockResolvedValue([
          { active: { scriptURL: 'https://nurulhikmahsda.sch.id/sw.js' }, unregister: unregisterA },
          { active: { scriptURL: 'https://nurulhikmahsda.sch.id/sw-nh5.js' }, unregister: unregisterB },
        ]),
      },
    })
    vi.stubGlobal('caches', {
      keys: vi.fn().mockResolvedValue(['workbox-precache-v2-x', 'images']),
      delete: vi.fn().mockResolvedValue(true),
    })

    await expect(unregisterAllServiceWorkers()).resolves.toBe(true)
    expect(unregisterA).toHaveBeenCalled()
    expect(unregisterB).toHaveBeenCalled()
  })
})
