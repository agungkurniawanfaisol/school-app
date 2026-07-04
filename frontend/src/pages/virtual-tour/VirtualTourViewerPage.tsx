import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { PannellumViewer } from '@/components/virtual-tour/PannellumViewer'
import { PageMeta } from '@/components/seo/PageMeta'
import { Skeleton } from '@/components/ui/skeleton'
import { usePublicVirtualTour } from '@/hooks/useVirtualTours'

export function VirtualTourViewerPage() {
  const { t } = useTranslation('pages')
  const { slug } = useParams<{ slug: string }>()
  const { data: tour, isLoading, isError } = usePublicVirtualTour(slug ?? '')

  return (
    <PublicPageShell>
      <PageMeta
        title={tour ? `${t('virtualTourViewer.fallbackTitle')} — ${tour.title}` : t('virtualTourViewer.fallbackTitle')}
        description={tour?.description ?? t('virtualTourViewer.metaDesc')}
      />
      <SubpageHero
        title={tour?.title ?? t('virtualTourViewer.fallbackTitle')}
        subtitle={tour?.description}
        badge={t('virtualTourViewer.badge')}
        backHref="/tur-virtual"
        backLabel={t('virtualTourViewer.allTours')}
      />
      <div className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-6xl space-y-4">

            {isLoading ? (
              <Skeleton className="min-h-[60vh] w-full rounded-xl" />
            ) : isError || !tour?.pannellum ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                {t('virtualTourViewer.notFound')}
              </div>
            ) : (
              <PannellumViewer config={tour.pannellum} className="min-h-[65vh] sm:min-h-[70vh]" />
            )}
          </div>
        </div>
      </div>
    </PublicPageShell>
  )
}
