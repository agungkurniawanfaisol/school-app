import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { PreviewFrame } from '@/components/editor/PreviewFrame'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAdminFacilityDetail } from '@/hooks/useFacilities'
import type { FacilityPhoto } from '@/types'

function photoSrc(photo: FacilityPhoto) {
  const src = photo.url ?? photo.path
  if (src.startsWith('http') || src.startsWith('/')) return src
  return `/storage/${src}`
}

export function FacilityPreviewPage() {
  const { t } = useTranslation('admin')
  const { uuid } = useParams<{ uuid: string }>()
  const { data: facility, isLoading } = useAdminFacilityDetail(uuid ?? '')
  const [activePhoto, setActivePhoto] = useState(0)

  if (isLoading || !facility) {
    return <div className="p-6 text-muted-foreground">{t('common.loadingPreview')}</div>
  }

  const photos = facility.photos ?? []
  const heroSrc =
    facility.thumbnail ??
    (photos[activePhoto] ? photoSrc(photos[activePhoto]) : null)

  return (
    <PreviewFrame
      title={facility.name}
      isDraft={!facility.is_active}
      toolbar={
        <>
          <Button asChild variant="outline" size="sm">
            <Link to={`/admin/facilities/${facility.uuid}/edit`}>{t('common.edit')}</Link>
          </Button>
          {facility.is_active && (
            <Button asChild variant="outline" size="sm">
              <Link to="/fasilitas">{t('pages.facilities.viewAllFacilities')}</Link>
            </Button>
          )}
        </>
      }
    >
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {facility.category && <Badge variant="secondary">{facility.category}</Badge>}
        {facility.is_featured && <Badge>{t('status.featured')}</Badge>}
        {!facility.is_active && <Badge variant="outline">{t('status.inactive')}</Badge>}
      </div>

      {heroSrc && (
        <img
          src={heroSrc}
          alt={facility.name}
          className="mb-6 aspect-video w-full rounded-xl object-cover"
        />
      )}

      {facility.description && (
        <p className="mb-6 text-lg text-muted-foreground">{facility.description}</p>
      )}

      {photos.length > 0 && (
        <div className="mb-8 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('pages.facilities.photoGallery')}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActivePhoto(index)}
                className={`overflow-hidden rounded-xl border-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  activePhoto === index ? 'border-primary' : 'border-transparent hover:border-primary/30'
                }`}
                aria-label={photo.caption ?? `Foto ${index + 1}`}
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
    </PreviewFrame>
  )
}
