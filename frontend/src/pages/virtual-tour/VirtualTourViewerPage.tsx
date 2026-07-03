import { Link, useParams } from 'react-router-dom'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { PannellumViewer } from '@/components/virtual-tour/PannellumViewer'
import { PageMeta } from '@/components/seo/PageMeta'
import { Button } from '@/components/ui/button'
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
      <div className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-6xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Button asChild variant="ghost" size="sm" className="mb-2 min-h-11 px-0">
                  <Link to="/tur-virtual">← Daftar tur virtual</Link>
                </Button>
                {isLoading ? (
                  <Skeleton className="h-8 w-64" />
                ) : (
                  <>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{tour?.title}</h1>
                    {tour?.description ? (
                      <p className="mt-1 max-w-2xl text-muted-foreground">{tour.description}</p>
                    ) : null}
                  </>
                )}
              </div>
            </div>

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
