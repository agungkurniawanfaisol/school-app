import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { PageMeta } from '@/components/seo/PageMeta'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePublicVirtualTours } from '@/hooks/useVirtualTours'

export function VirtualTourCatalogPage() {
  const { t } = useTranslation('pages')
  const { data, isLoading } = usePublicVirtualTours({ per_page: 24 })

  const tours = data?.data ?? []

  return (
    <PublicPageShell>
      <PageMeta
        title={t('virtualTourCatalog.metaTitle')}
        description={t('virtualTourCatalog.metaDesc')}
      />
      <SubpageHero
        title={t('virtualTourCatalog.title')}
        subtitle={t('virtualTourCatalog.subtitle')}
        badge={t('virtualTourCatalog.badge')}
        backHref="/"
        backLabel={t('virtualTourCatalog.backHome')}
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-4xl space-y-8">
          {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={index} className="h-40 w-full rounded-xl" />
                ))}
              </div>
            ) : tours.length === 0 ? (
              <p className="text-center text-muted-foreground">{t('virtualTourCatalog.empty')}</p>
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
                        <Link to={`/tur-virtual/${tour.slug}`}>{t('virtualTourCatalog.start')}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
    </PublicPageShell>
  )
}
