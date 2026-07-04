import { useParams } from 'react-router-dom'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useEventDetail } from '@/hooks/useEvents'
import { formatDate } from '@/lib/utils'

const categoryColors: Record<string, string> = {
  akademik: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  keagamaan: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
  olahraga: 'bg-orange-500/10 text-orange-700 border-orange-500/30',
  umum: 'bg-gray-500/10 text-gray-700 border-gray-500/30',
}

export function AgendaDetailPage() {
  const { t } = useTranslation('pages')
  const { uuid } = useParams<{ uuid: string }>()
  const { data: event, isLoading } = useEventDetail(uuid ?? '')

  if (isLoading) {
    return (
      <PublicPageShell>
        <SubpageHero title="" subtitle="" backHref="/agenda" backLabel={t('agenda.backToList')} />
        <div className="container-page section-padding">
          <div className="mx-auto max-w-4xl space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </PublicPageShell>
    )
  }

  if (!event) {
    return (
      <PublicPageShell>
        <SubpageHero title={t('agenda.notFound')} subtitle="" backHref="/agenda" backLabel={t('agenda.backToList')} />
        <div className="container-page section-padding text-center">
          <p className="text-muted-foreground">{t('agenda.notFoundDesc')}</p>
        </div>
      </PublicPageShell>
    )
  }

  const dateStr = event.event_end_date
    ? `${formatDate(event.event_date)} — ${formatDate(event.event_end_date)}`
    : formatDate(event.event_date)

  return (
    <PublicPageShell>
      <PageMeta title={event.title} description={event.description ?? undefined} />
      <SubpageHero
        title={event.title}
        subtitle=""
        backHref="/agenda"
        backLabel={t('agenda.backToList')}
      />

      <div className="container-page section-padding">
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden border-primary/10">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className={`text-sm ${categoryColors[event.category] ?? ''}`}>
                  {event.category}
                </Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-start gap-3 rounded-lg border border-primary/10 p-4">
                  <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{t('agenda.date')}</p>
                    <p className="mt-0.5 text-sm font-medium">{dateStr}</p>
                  </div>
                </div>
                {event.event_time && (
                  <div className="flex items-start gap-3 rounded-lg border border-primary/10 p-4">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{t('agenda.time')}</p>
                      <p className="mt-0.5 text-sm font-medium">{event.event_time}</p>
                    </div>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-start gap-3 rounded-lg border border-primary/10 p-4">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{t('agenda.location')}</p>
                      <p className="mt-0.5 text-sm font-medium">{event.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {event.description && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="whitespace-pre-wrap">{event.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicPageShell>
  )
}
