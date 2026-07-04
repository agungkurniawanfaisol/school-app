import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PublicCatalogPagination } from '@/components/content/PublicCatalogPagination'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useActivitiesList } from '@/hooks/useActivities'
import { formatDate } from '@/lib/utils'

const PER_PAGE = 12

export function ActivitiesCatalogPage() {
  const { t } = useTranslation('pages')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading, isFetching } = useActivitiesList({
    page,
    per_page: PER_PAGE,
    search: search || undefined,
  })

  const activities = data?.data ?? []

  return (
    <PublicPageShell>
      <PageMeta
        title={t('activitiesCatalog.title')}
        description={t('activitiesCatalog.metaDesc')}
      />
      <SubpageHero
        title={t('activitiesCatalog.title')}
        subtitle={t('activitiesCatalog.subtitle')}
        backHref="/#kegiatan"
        backLabel={t('activitiesCatalog.backHome')}
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
              placeholder={t('activitiesCatalog.search')}
              className="h-11 pl-9"
              aria-label={t('activitiesCatalog.searchAria')}
            />
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-xl" />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {search ? t('activitiesCatalog.empty') : t('activitiesCatalog.noData')}
            </p>
          ) : (
            <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}>
              {activities.map((activity) => (
                <Link
                  key={activity.id}
                  to={`/kegiatan/detail/${activity.uuid}`}
                  className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Card className="card-hover h-full overflow-hidden border-primary/10 transition-colors hover:border-primary/30">
                    {activity.thumbnail && (
                      <img
                        src={activity.thumbnail}
                        alt={activity.title}
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <CardHeader>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <CardTitle className="line-clamp-2 text-lg leading-snug group-hover:text-primary">
                          {activity.title}
                        </CardTitle>
                        {activity.activity_date && (
                          <Badge className="shrink-0 border-0 bg-accent text-accent-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDate(activity.activity_date)}
                          </Badge>
                        )}
                      </div>
                      {activity.category && (
                        <Badge variant="outline" className="w-fit capitalize">
                          {activity.category}
                        </Badge>
                      )}
                      {activity.excerpt && (
                        <CardDescription className="line-clamp-2">{activity.excerpt}</CardDescription>
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
