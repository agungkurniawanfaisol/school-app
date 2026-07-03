import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { PageMeta } from '@/components/seo/PageMeta'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePublicVirtualTours } from '@/hooks/useVirtualTours'

export function VirtualTourCatalogPage() {
  const { data, isLoading } = usePublicVirtualTours({ per_page: 24 })

  const tours = data?.data ?? []

  return (
    <PublicPageShell>
      <PageMeta
        title="Tur Virtual"
        description="Jelajahi lingkungan Sekolah Islam Nurul Hikmah secara virtual dengan panorama 360 derajat."
      />
      <div className="section-padding pattern-bg">
        <div className="container-page">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="space-y-2 text-center">
              <Button asChild variant="ghost" size="sm" className="mb-2 min-h-11">
                <Link to="/">← Kembali ke beranda</Link>
              </Button>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Eksplorasi 360°</p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Tur Virtual Sekolah</h1>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Jelajahi ruang kelas, fasilitas, dan lingkungan sekolah dari mana saja.
              </p>
            </div>

            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={index} className="h-40 w-full rounded-xl" />
                ))}
              </div>
            ) : tours.length === 0 ? (
              <p className="text-center text-muted-foreground">Tur virtual belum tersedia.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {tours.map((tour) => (
                  <Card key={tour.uuid} className="card-hover">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Compass className="h-5 w-5 text-primary" aria-hidden />
                        {tour.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {tour.description ? (
                        <p className="line-clamp-3 text-sm text-muted-foreground">{tour.description}</p>
                      ) : null}
                      <Button asChild className="min-h-11 w-full">
                        <Link to={`/tur-virtual/${tour.slug}`}>Mulai Tur</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicPageShell>
  )
}
