import { ArrowRight, Camera, Images } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FadeInView } from '@/components/motion/FadeInView'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { usePhotoAlbumsList } from '@/hooks/usePhotoAlbums'
import { formatDate } from '@/lib/utils'
import type { PhotoAlbum } from '@/types'

function AlbumCard({ album }: { album: PhotoAlbum }) {
  return (
    <Card className="group relative overflow-hidden border-primary/10">
      <div className="relative aspect-[4/3] overflow-hidden">
        {album.cover_image ? (
          <img
            src={album.cover_image}
            alt={album.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            <Images className="h-12 w-12 text-muted-foreground/50" aria-hidden />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {album.photos_count != null && album.photos_count > 0 && (
          <Badge className="absolute top-3 right-3 border-0 bg-black/50 text-white backdrop-blur-sm">
            <Camera className="mr-1 h-3 w-3" aria-hidden />
            {album.photos_count}
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-sm font-semibold text-white line-clamp-2 md:text-base">
            {album.title}
          </h3>
          {album.event_date && (
            <p className="mt-1 text-xs text-white/70">{formatDate(album.event_date)}</p>
          )}
        </div>
      </div>
    </Card>
  )
}

export function GallerySection() {
  const { t } = useTranslation('landing')
  const { data, isLoading } = usePhotoAlbumsList({ per_page: 4 })
  const albums = data?.data ?? []

  return (
    <section id="galeri" className="section-padding">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            badge={t('gallery.badge')}
            title={t('gallery.title')}
            description={t('gallery.desc')}
            align="left"
            className="mb-0 md:mb-0"
          />
          <Button
            asChild
            variant="outline"
            className="min-h-11 shrink-0 border-primary text-primary hover:bg-secondary"
          >
            <Link to="/galeri">
              {t('gallery.viewAll')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
            ))}
          </div>
        ) : albums.length === 0 ? (
          <p className="text-center text-muted-foreground">{t('gallery.empty')}</p>
        ) : (
          <FadeInView direction="up" tier="full">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </FadeInView>
        )}
      </div>
    </section>
  )
}
