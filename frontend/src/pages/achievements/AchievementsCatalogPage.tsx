import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PublicCatalogPagination } from '@/components/content/PublicCatalogPagination'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useAchievementsList } from '@/hooks/useAchievements'

const PER_PAGE = 12

const levelColors: Record<string, string> = {
  internasional: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
  nasional: 'bg-red-500/10 text-red-700 border-red-500/30',
  provinsi: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  kota: 'bg-green-500/10 text-green-700 border-green-500/30',
  kecamatan: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
  sekolah: 'bg-gray-500/10 text-gray-700 border-gray-500/30',
}

export function AchievementsCatalogPage() {
  const { t } = useTranslation('pages')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading, isFetching } = useAchievementsList({
    page,
    per_page: PER_PAGE,
    search: search || undefined,
  })

  const items = data?.data ?? []

  return (
    <PublicPageShell>
      <PageMeta
        title={t('achievements.title')}
        description={t('achievements.metaDesc')}
      />
      <SubpageHero
        title={t('achievements.title')}
        subtitle={t('achievements.subtitle')}
        backHref="/"
        backLabel={t('achievements.backHome')}
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
              placeholder={t('achievements.search')}
              className="h-11 pl-9"
              aria-label={t('achievements.searchAria')}
            />
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {search ? t('achievements.empty') : t('achievements.noData')}
            </p>
          ) : (
            <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}>
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`/prestasi/detail/${item.uuid}`}
                  className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Card className="card-hover h-full overflow-hidden border-primary/10 transition-colors hover:border-primary/30">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center bg-muted">
                        <Trophy className="h-10 w-10 text-muted-foreground/40" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={levelColors[item.level] ?? ''}>
                          {item.level}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {item.category}
                        </Badge>
                        <span className="ml-auto text-xs text-muted-foreground">{item.year}</span>
                      </div>
                      <CardTitle className="line-clamp-2 text-lg leading-snug group-hover:text-primary">
                        {item.title}
                      </CardTitle>
                      {item.student_name && (
                        <CardDescription className="line-clamp-1">{item.student_name}</CardDescription>
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
