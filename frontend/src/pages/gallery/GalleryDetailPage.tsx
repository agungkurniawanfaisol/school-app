import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CalendarDays, ChevronLeft, Images, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { PageMeta } from '@/components/seo/PageMeta'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { usePhotoAlbumDetail } from '@/hooks/usePhotoAlbums'
import { formatDate } from '@/lib/utils'
import type { AlbumPhoto } from '@/types'

export function GalleryDetailPage() {
  const { t } = useTranslation('pages')
  const { uuid } = useParams<{ uuid: string }>()
  const { data: album, isLoading } = usePhotoAlbumDetail(uuid ?? '')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const photos = album?.photos ?? []

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % photos.length)
  }, [lightboxIndex, photos.length])

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)
  }, [lightboxIndex, photos.length])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (lightboxIndex === null) return
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') setLightboxIndex(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, goNext, goPrev])

  if (isLoading) {
    return (
      <PublicPageShell>
        <SubpageHero title="" subtitle="" backHref="/galeri" backLabel={t('gallery.backToList')} />
        <div className="container-page section-padding">
          <div className="mx-auto max-w-6xl space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-96" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </PublicPageShell>
    )
  }

  if (!album) {
    return (
      <PublicPageShell>
        <SubpageHero title={t('gallery.notFound')} subtitle="" backHref="/galeri" backLabel={t('gallery.backToList')} />
        <div className="container-page section-padding text-center">
          <p className="text-muted-foreground">{t('gallery.notFoundDesc')}</p>
        </div>
      </PublicPageShell>
    )
  }

  return (
    <PublicPageShell>
      <PageMeta title={album.title} description={album.description ?? undefined} />
      <SubpageHero
        title={album.title}
        subtitle={album.description ?? ''}
        backHref="/galeri"
        backLabel={t('gallery.backToList')}
      />

      <div className="container-page section-padding">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {album.event_date && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" aria-hidden />
                {formatDate(album.event_date)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Images className="h-4 w-4" aria-hidden />
              {photos.length} foto
            </span>
          </div>

          {photos.length === 0 ? (
            <p className="text-center text-muted-foreground">{t('gallery.noPhotos')}</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((photo: AlbumPhoto, index: number) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group relative aspect-square overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption ?? `${album.title} - ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                  {photo.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="line-clamp-2 text-xs text-white">{photo.caption}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={lightboxIndex !== null} onOpenChange={() => setLightboxIndex(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-black/95 sm:max-w-5xl">
          {lightboxIndex !== null && photos[lightboxIndex] && (
            <div className="relative flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 text-white hover:bg-white/20"
                onClick={() => setLightboxIndex(null)}
              >
                <X className="h-5 w-5" />
              </Button>

              {photos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={goPrev}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={goNext}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </>
              )}

              <div className="flex flex-col items-center">
                <img
                  src={photos[lightboxIndex].url}
                  alt={photos[lightboxIndex].caption ?? ''}
                  className="max-h-[80vh] max-w-full object-contain"
                />
                {photos[lightboxIndex].caption && (
                  <p className="mt-3 px-4 text-center text-sm text-white/80">
                    {photos[lightboxIndex].caption}
                  </p>
                )}
                <p className="mt-1 text-xs text-white/50">
                  {lightboxIndex + 1} / {photos.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PublicPageShell>
  )
}
