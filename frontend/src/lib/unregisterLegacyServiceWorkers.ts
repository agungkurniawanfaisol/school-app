/**
 * Remove Hostinger-CDN-cached legacy /sw.js workers that intercept /api
 * navigations (Google OAuth callback) and serve the SPA landing page.
 */
export async function unregisterLegacyServiceWorkers(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false
  }

  const registrations = await navigator.serviceWorker.getRegistrations()
  let removed = false

  await Promise.all(
    registrations.map(async (registration) => {
      const scriptURL =
        registration.active?.scriptURL ??
        registration.waiting?.scriptURL ??
        registration.installing?.scriptURL ??
        ''

      const isLegacy =
        /\/sw\.js(\?|$)/.test(scriptURL) || scriptURL.endsWith('/sw.js')

      if (isLegacy) {
        removed = (await registration.unregister()) || removed
      }
    }),
  )

  if ('caches' in window) {
    const keys = await caches.keys()
    await Promise.all(
      keys
        .filter((key) => key.includes('workbox-precache') || key.includes('api-public'))
        .map((key) => caches.delete(key)),
    )
  }

  return removed
}

/** Unregister every service worker on this origin (OAuth callback rescue). */
export async function unregisterAllServiceWorkers(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false
  }

  const registrations = await navigator.serviceWorker.getRegistrations()
  let removed = false

  await Promise.all(
    registrations.map(async (registration) => {
      removed = (await registration.unregister()) || removed
    }),
  )

  if ('caches' in window) {
    const keys = await caches.keys()
    await Promise.all(keys.map((key) => caches.delete(key)))
  }

  return removed
}
