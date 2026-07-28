/**
 * Legacy service worker stub.
 * Hostinger CDN may keep serving /sw.js for days; this file replaces that URL
 * once the CDN refreshes and immediately unregisters itself so Google OAuth
 * callbacks to /api are never intercepted again.
 */
self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(Promise.resolve())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
      await self.registration.unregister()
      const clients = await self.clients.matchAll({ type: 'window' })
      for (const client of clients) {
        if ('navigate' in client) {
          client.navigate(client.url)
        }
      }
    })(),
  )
})
