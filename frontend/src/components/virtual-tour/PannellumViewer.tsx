import { useEffect, useRef, useState } from 'react'
import type { PannellumTourConfig } from '@/types/virtualTour'
import { loadPannellum, type PannellumViewerInstance } from '@/lib/pannellum-loader'
import { cn } from '@/lib/utils'

type PannellumViewerProps = {
  config: PannellumTourConfig | null
  className?: string
  placementMode?: boolean
  onCoordsPick?: (coords: { pitch: number; yaw: number }) => void
  onSceneChange?: (sceneId: string) => void
}

export function PannellumViewer({
  config,
  className,
  placementMode = false,
  onCoordsPick,
  onSceneChange,
}: PannellumViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<PannellumViewerInstance | null>(null)
  const onCoordsPickRef = useRef(onCoordsPick)
  const onSceneChangeRef = useRef(onSceneChange)
  const [loadError, setLoadError] = useState<string | null>(null)

  onCoordsPickRef.current = onCoordsPick
  onSceneChangeRef.current = onSceneChange

  useEffect(() => {
    if (!config || !containerRef.current) {
      return
    }

    let cancelled = false
    setLoadError(null)

    loadPannellum()
      .then((pannellum) => {
        if (cancelled || !containerRef.current) {
          return
        }

        viewerRef.current?.destroy()
        viewerRef.current = pannellum.viewer(containerRef.current, {
          ...config.default,
          scenes: config.scenes,
          showControls: true,
          compass: false,
        })

        viewerRef.current.on('scenechange', (sceneId) => {
          if (typeof sceneId === 'string') {
            onSceneChangeRef.current?.(sceneId)
          }
        })
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError('Gagal memuat penampil panorama. Periksa koneksi lalu muat ulang halaman.')
        }
      })

    return () => {
      cancelled = true
      viewerRef.current?.destroy()
      viewerRef.current = null
    }
  }, [config])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !placementMode) {
      return
    }

    const handleMouseDown = (event: MouseEvent) => {
      if (!viewerRef.current || event.button !== 0) {
        return
      }

      const [pitch, yaw] = viewerRef.current.mouseEventToCoords(event)
      onCoordsPickRef.current?.({ pitch, yaw })
    }

    container.addEventListener('mousedown', handleMouseDown)

    return () => container.removeEventListener('mousedown', handleMouseDown)
  }, [placementMode, config])

  if (!config) {
    return (
      <div className={cn('flex min-h-[320px] items-center justify-center rounded-xl border border-dashed bg-muted/30', className)}>
        <p className="text-sm text-muted-foreground">Unggah panorama 360° untuk memulai.</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className={cn('flex min-h-[320px] items-center justify-center rounded-xl border border-dashed bg-muted/30 p-6 text-center', className)}>
        <p className="text-sm text-muted-foreground">{loadError}</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative min-h-[320px] overflow-hidden rounded-xl border bg-black sm:min-h-[420px] lg:min-h-[520px]', className)}
      data-placement-mode={placementMode ? 'true' : 'false'}
      aria-label="Penampil tur virtual 360 derajat"
    />
  )
}
