import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Clock, MapPin, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PublicCatalogPagination } from '@/components/content/PublicCatalogPagination'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useEventsList, type Event } from '@/hooks/useEvents'
import { DATE_LOCALE_MAP, formatDate } from '@/lib/utils'

const PER_PAGE = 12

const categoryColors: Record<string, string> = {
  akademik: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  keagamaan: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
  olahraga: 'bg-orange-500/10 text-orange-700 border-orange-500/30',
  umum: 'bg-gray-500/10 text-gray-700 border-gray-500/30',
}

function EventCard({ event }: { event: Event }) {
  const { locale } = useLanguage()
  const dateLocale = DATE_LOCALE_MAP[locale] ?? 'id-ID'
  const date = new Date(event.event_date)
  return (
    <Link
      to={`/agenda/detail/${event.uuid}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <Card className="card-hover h-full overflow-hidden border-primary/10 transition-colors hover:border-primary/30">
        <CardContent className="flex gap-4 p-4 sm:p-5">
          <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span className="text-xl font-bold leading-none">{date.getDate()}</span>
            <span className="mt-0.5 text-[10px] font-medium uppercase">
              {date.toLocaleDateString(dateLocale, { month: 'short' })}
            </span>
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={categoryColors[event.category] ?? ''}>
                {event.category}
              </Badge>
            </div>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary sm:text-base">
              {event.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                {formatDate(event.event_date, undefined, locale)}
              </span>
              {event.event_time && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {event.event_time}
                </span>
              )}
              {event.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  <span className="line-clamp-1">{event.location}</span>
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function AgendaCatalogPage() {
  const { t } = useTranslation('pages')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading, isFetching } = useEventsList({
    page,
    per_page: PER_PAGE,
    search: search || undefined,
  })

  const items = data?.data ?? []

  return (
    <PublicPageShell>
      <PageMeta
        title={t('agenda.title')}
        description={t('agenda.metaDesc')}
      />
      <SubpageHero
        title={t('agenda.title')}
        subtitle={t('agenda.subtitle')}
        backHref="/"
        backLabel={t('agenda.backHome')}
      />
      <div className="container-page section-padding">
        <div className="mx-auto max-w-4xl space-y-8">
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
              placeholder={t('agenda.search')}
              className="h-11 pl-9"
              aria-label={t('agenda.searchAria')}
            />
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {search ? t('agenda.empty') : t('agenda.noData')}
            </p>
          ) : (
            <div className={`space-y-4 ${isFetching ? 'opacity-70' : ''}`}>
              {items.map((event) => (
                <EventCard key={event.id} event={event} />
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
