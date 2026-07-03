type PannellumViewerInstance = {
  destroy: () => void
  getScene: () => string
  loadScene: (sceneId: string, pitch?: number, yaw?: number, hfov?: number) => void
  mouseEventToCoords: (event: MouseEvent) => [number, number]
  on: (event: string, callback: (...args: unknown[]) => void) => void
}

type PannellumGlobal = {
  viewer: (container: HTMLElement, config: Record<string, unknown>) => PannellumViewerInstance
}

declare global {
  interface Window {
    pannellum?: PannellumGlobal
  }
}

const PANNELLUM_CSS = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css'
const PANNELLUM_JS = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js'

let loadPromise: Promise<PannellumGlobal> | null = null

export async function loadPannellum(): Promise<PannellumGlobal> {
  if (window.pannellum) {
    return window.pannellum
  }

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      if (!document.querySelector(`link[href="${PANNELLUM_CSS}"]`)) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = PANNELLUM_CSS
        document.head.appendChild(link)
      }

      const script = document.createElement('script')
      script.src = PANNELLUM_JS
      script.async = true
      script.onload = () => {
        if (window.pannellum) {
          resolve(window.pannellum)
          return
        }
        reject(new Error('Pannellum gagal dimuat.'))
      }
      script.onerror = () => reject(new Error('Pannellum gagal dimuat.'))
      document.body.appendChild(script)
    })
  }

  return loadPromise
}

export type { PannellumViewerInstance }
