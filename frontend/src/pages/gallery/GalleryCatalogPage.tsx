import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PublicCatalogPagination } from '@/components/content/PublicCatalogPagination'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { usePhotoAlbumsList } from '@/hooks/usePhotoAlbums'
import { formatDate } from '@/lib/utils'

const PER_PAGE = 12

export function GalleryCatalogPage() {
  const { t } = useTranslation('pages')
  const { locale } = useLanguage()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading, isFetching } = usePhotoAlbumsList({
    page,
    per_page: PER_PAGE,
    search: search || undefined,
  })

  const items = data?.data ?? []

  return (
    <PublicPageShell>
      <PageMeta
        title={t('gallery.title')}
        description={t('gallery.metaDesc')}
      />
      <SubpageHero
        title={t('gallery.title')}
        subtitle={t('gallery.subtitle')}
        backHref="/"
        backLabel={t('gallery.backHome')}
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="relative mx-auto max-w-md">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder={t('gallery.search')}
              className="h-11 pl-9"
              aria-label={t('gallery.searchAria')}
            />
          </div>

          {isLoading ? (
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-xl" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {search ? t('gallery.empty') : t('gallery.noAlbums')}
            </p>
          ) : (
            <div className={`grid gap-4 grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}>
              {items.map((album) => (
                <Link
                  key={album.id}
                  to={`/galeri/detail/${album.uuid}`}
                  className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Card className="card-hover relative h-full overflow-hidden border-primary/10 transition-colors hover:border-primary/30">
                    <div className="relative aspect-square overflow-hidden">
                      {album.cover_image ? (
                        <img
                          src={album.cover_image}
                          alt={album.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <Camera className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {album.photos_count != null && (
                        <Badge className="absolute right-2 top-2 bg-black/60 text-white hover:bg-black/70">
                          {album.photos_count} {t('gallery.photoUnit')}
                        </Badge>
                      )}
                      <div className="absolute bottom-0 inset-x-0 p-3">
                        <h3 className="line-clamp-2 text-sm font-semibold text-white sm:text-base">
                          {album.title}
                        </h3>
                        {album.event_date && (
                          <p className="mt-1 text-xs text-white/70">{formatDate(album.event_date, undefined, locale)}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {data?.meta && (
            <PublicCatalogPagination
              page={page}
              lastPage={data.meta.last_page}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </PublicPageShell>
  )
}
