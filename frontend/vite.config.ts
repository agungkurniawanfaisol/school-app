import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === 'production'
      ? [
          VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.png', 'logo.png', 'logo-192.png', 'logo-512.png', 'manifest.json'],
            manifest: false,
            workbox: {
              globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
              runtimeCaching: [
                {
                  urlPattern: /^\/api\/v1\/(news|schools|facilities|teachers|curriculums|student-activities|testimonials|courses|hero-sliders|virtual-tours|settings)/,
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
