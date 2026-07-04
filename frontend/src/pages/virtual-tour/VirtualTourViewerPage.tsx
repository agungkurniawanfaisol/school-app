import { useParams } from 'react-router-dom'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { PannellumViewer } from '@/components/virtual-tour/PannellumViewer'
import { PageMeta } from '@/components/seo/PageMeta'
import { Skeleton } from '@/components/ui/skeleton'
import { usePublicVirtualTour } from '@/hooks/useVirtualTours'

export function VirtualTourViewerPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: tour, isLoading, isError } = usePublicVirtualTour(slug ?? '')

  return (
    <PublicPageShell>
      <PageMeta
        title={tour ? `Tur Virtual — ${tour.title}` : 'Tur Virtual'}
        description={tour?.description ?? 'Jelajahi sekolah secara virtual dengan panorama 360 derajat.'}
      />
      <SubpageHero
        title={tour?.title ?? 'Tur Virtual'}
        subtitle={tour?.description}
        badge="Eksplorasi 360°"
        backHref="/tur-virtual"
        backLabel="Daftar tur virtual"
      />
      <div className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-6xl space-y-4">

            {isLoading ? (
              <Skeleton className="min-h-[60vh] w-full rounded-xl" />
            ) : isError || !tour?.pannellum ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                Tur virtual tidak ditemukan atau belum memiliki panorama.
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
