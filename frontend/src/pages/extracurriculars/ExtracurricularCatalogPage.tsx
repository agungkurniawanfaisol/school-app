import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PublicCatalogPagination } from '@/components/content/PublicCatalogPagination'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useExtracurricularsList } from '@/hooks/useExtracurriculars'

const PER_PAGE = 12

export function ExtracurricularCatalogPage() {
  const { t } = useTranslation('pages')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading, isFetching } = useExtracurricularsList({
    page,
    per_page: PER_PAGE,
    search: search || undefined,
  })

  const items = data?.data ?? []

  return (
    <PublicPageShell>
      <PageMeta
        title={t('extracurricular.title')}
        description={t('extracurricular.metaDesc')}
      />
      <SubpageHero
        title={t('extracurricular.title')}
        subtitle={t('extracurricular.subtitle')}
        backHref="/"
        backLabel={t('extracurricular.backHome')}
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
              placeholder={t('extracurricular.search')}
              className="h-11 pl-9"
              aria-label={t('extracurricular.searchAria')}
            />
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-xl" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {search ? t('extracurricular.empty') : t('extracurricular.noData')}
            </p>
          ) : (
            <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}>
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`/ekstrakurikuler/detail/${item.uuid}`}
                  className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Card className="card-hover h-full overflow-hidden border-primary/10 transition-colors hover:border-primary/30">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center bg-muted">
                        <Dumbbell className="h-10 w-10 text-muted-foreground/40" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize">
                          {item.category}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2 text-lg leading-snug group-hover:text-primary">
                        {item.name}
                      </CardTitle>
                      {item.description && (
                        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                      )}
                    </CardHeader>
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
