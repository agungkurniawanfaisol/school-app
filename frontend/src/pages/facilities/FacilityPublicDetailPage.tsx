import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { PageMeta } from '@/components/seo/PageMeta'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useFacilityDetail } from '@/hooks/useFacilities'
import type { FacilityPhoto } from '@/types'

function photoSrc(photo: FacilityPhoto) {
  const src = photo.url ?? photo.path
  if (src.startsWith('http') || src.startsWith('/')) return src
  return `/storage/${src}`
}

export function FacilityPublicDetailPage() {
  const { t } = useTranslation('pages')
  const { slug } = useParams<{ slug: string }>()
  const { data: facility, isLoading, isError } = useFacilityDetail(slug ?? '')
  const [activePhoto, setActivePhoto] = useState(0)

  if (isLoading) {
    return (
      <PublicPageShell>
        <div className="container-page section-padding">
          <Skeleton className="mb-6 h-11 w-40" />
          <Skeleton className="mb-8 aspect-video w-full rounded-xl" />
          <Skeleton className="h-40 w-full" />
        </div>
      </PublicPageShell>
    )
  }

  if (isError || !facility) {
    return (
      <PublicPageShell>
        <div className="container-page section-padding text-center">
          <p className="text-muted-foreground">{t('facilityDetail.notFound')}</p>
          <Button asChild className="mt-4 min-h-11">
            <Link to="/fasilitas">{t('facilityDetail.backToList')}</Link>
          </Button>
        </div>
      </PublicPageShell>
    )
  }

  const photos = facility.photos ?? []
  const heroSrc = facility.thumbnail ?? (photos[activePhoto] ? photoSrc(photos[activePhoto]) : null)

  return (
    <PublicPageShell>
      <PageMeta
        title={facility.name}
        description={facility.description ?? t('facilityDetail.metaDesc', { name: facility.name })}
      />
      <SubpageHero
        title={facility.name}
        subtitle={facility.description}
        badge={facility.category}
        backHref="/fasilitas"
        backLabel={t('facilityDetail.backBtn')}
      />
      <article className="container-page section-padding">
        <div className="mx-auto max-w-4xl space-y-8">

          {heroSrc && (
            <img
              src={heroSrc}
              alt={facility.name}
              className="aspect-video w-full rounded-xl object-cover shadow-sm"
            />
          )}

          {facility.description && (
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{facility.description}</p>
          )}

          {photos.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('facilityDetail.gallery')}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setActivePhoto(index)}
                    className={`min-h-11 overflow-hidden rounded-xl border-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      activePhoto === index ? 'border-primary' : 'border-transparent hover:border-primary/30'
                    }`}
                    aria-label={photo.caption ?? t('facilityDetail.photoAria', { index: index + 1 })}
                    aria-pressed={activePhoto === index}
                  >
                    <img
                      src={photoSrc(photo)}
                      alt={photo.caption ?? facility.name}
                      className="aspect-[4/3] w-full object-cover"
                      loading="lazy"
                    />
                    {photo.caption && (
                      <p className="border-t px-3 py-2 text-xs text-muted-foreground">{photo.caption}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <BlockRenderer contentJson={facility.content_json} contentHtml={facility.content} />
        </div>
      </article>
    </PublicPageShell>
  )
}
