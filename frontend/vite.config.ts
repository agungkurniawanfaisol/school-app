import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import packageJson from './package.json' with { type: 'json' }

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const appVersion = process.env.VITE_APP_VERSION ?? packageJson.version
const gitSha = process.env.VITE_GIT_SHA ?? ''

function emitVersionJson(): Plugin {
  const payload = () =>
    `${JSON.stringify(
      {
        version: appVersion,
        builtAt: new Date().toISOString(),
        gitSha: gitSha || null,
      },
      null,
      2,
    )}\n`

  return {
    name: 'emit-version-json',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]
        if (url !== '/version.json') {
          next()
          return
        }
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store')
        res.end(payload())
      })
    },
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist')
      fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(path.join(outDir, 'version.json'), payload())
    },
  }
}

export default defineConfig(({ mode }) => ({
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion),
    'import.meta.env.VITE_GIT_SHA': JSON.stringify(gitSha),
  },
  plugins: [
    react(),
    tailwindcss(),
    emitVersionJson(),
    ...(mode === 'production'
      ? [
          VitePWA({
            registerType: 'autoUpdate',
            // Inline registration avoids a long-cached /registerSW.js that kept
            // re-installing the broken Hostinger-CDN /sw.js worker.
            injectRegister: 'inline',
            // New filename bypasses Hostinger CDN poison on stale /sw.js (breaks OAuth).
            filename: 'sw-nh6.js',
            includeAssets: ['favicon.png', 'logo.png', 'logo-192.png', 'logo-512.png', 'manifest.json'],
            manifest: false,
            workbox: {
              globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
              // vite-plugin-pwa defaults navigateFallback to index.html for SPAs.
              // Deny ALL navigations so /api OAuth callbacks always hit the network;
              // Apache .htaccess already serves index.html for frontend routes.
              navigateFallback: 'index.html',
              navigateFallbackDenylist: [/.*/],
              cleanupOutdatedCaches: true,
              runtimeCaching: [
                {
                  // Match with or without cache-bust query (?t=…).
                  urlPattern: /\/version\.json(\?.*)?$/,
                  handler: 'NetworkOnly',
                },
                {
                  urlPattern: /^\/api\/v1\/(news|schools|facilities|teachers|curriculums|student-activities|testimonials|school-values|courses|hero-sliders|virtual-tours|settings|app-releases)/,
                  handler: 'StaleWhileRevalidate',
                  options: {
                    cacheName: 'api-public',
                    expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
                    cacheableResponse: { statuses: [200] },
                  },
                },
                {
                  urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
                  handler: 'CacheFirst',
                  options: {
                    cacheName: 'images',
                    expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
                  },
                },
              ],
            },
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
      interval: 1000,
    },
    hmr: process.env.VITE_DEV_HMR_HOST
      ? {
          host: process.env.VITE_DEV_HMR_HOST,
          clientPort: Number(process.env.VITE_DEV_HMR_PORT ?? 5173),
        }
      : undefined,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:8000',
        changeOrigin: true,
      },
      '/storage': {
        target: process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  cacheDir: process.env.VITE_CACHE_DIR ?? 'node_modules/.vite',
  optimizeDeps: {
    include: [
      'qrcode',
      '@tiptap/react',
      '@tiptap/starter-kit',
      '@tiptap/extension-color',
      '@tiptap/extension-text-style',
      '@tiptap/extension-text-align',
      '@tiptap/extension-subscript',
      '@tiptap/extension-superscript',
      '@tiptap/extension-underline',
      '@tiptap/extension-image',
      '@tiptap/extension-link',
      '@tiptap/extension-placeholder',
      '@tiptap/extension-youtube',
    ],
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
  },
}))
