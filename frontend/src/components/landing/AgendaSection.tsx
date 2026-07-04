import { ArrowRight, CalendarDays, Clock, MapPin } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FadeInView } from '@/components/motion/FadeInView'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import { useEventsList, type Event } from '@/hooks/useEvents'
import { cn, DATE_LOCALE_MAP } from '@/lib/utils'

const categoryColors: Record<string, string> = {
  akademik: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  keagamaan: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  olahraga: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  pertemuan: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
  pmb: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  umum: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

function MiniCalendar({ events }: { events: Event[] }) {
  const { locale } = useLanguage()
  const dateLocale = DATE_LOCALE_MAP[locale] ?? 'id-ID'
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = today.toLocaleDateString(dateLocale, { month: 'long', year: 'numeric' })

  const eventDates = useMemo(() => {
    const dates = new Set<number>()
    events.forEach((event) => {
      const d = new Date(event.event_date)
      if (d.getMonth() === month && d.getFullYear() === year) {
        dates.add(d.getDate())
      }
    })
    return dates
  }, [events, month, year])

  const days = useMemo(() => {
    const cells: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    return cells
  }, [firstDay, daysInMonth])

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

  return (
    <Card className="h-fit">
      <CardContent className="p-4">
        <p className="mb-3 text-center text-sm font-semibold">{monthName}</p>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {dayNames.map((name) => (
            <span key={name} className="pb-1 font-medium text-muted-foreground">
              {name}
            </span>
          ))}
          {days.map((day, i) => (
            <span
              key={i}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-xs',
                day === today.getDate() && 'bg-primary font-bold text-primary-foreground',
                day && eventDates.has(day) && day !== today.getDate() && 'bg-primary/15 font-semibold text-primary',
              )}
            >
              {day ?? ''}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function EventItem({ event }: { event: Event }) {
  const { locale } = useLanguage()
  const dateLocale = DATE_LOCALE_MAP[locale] ?? 'id-ID'
  const date = new Date(event.event_date)
  const day = date.getDate()
  const monthShort = date.toLocaleDateString(dateLocale, { month: 'short' })

  return (
    <div className="flex gap-4 rounded-lg border border-border/50 p-3 transition-colors hover:bg-secondary/30">
      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10">
        <span className="text-lg font-bold leading-none text-primary">{day}</span>
        <span className="text-[10px] uppercase text-primary/70">{monthShort}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{event.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {event.event_time && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden />
              {event.event_time}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" aria-hidden />
              {event.location}
            </span>
          )}
        </div>
        <Badge className={`mt-1.5 border-0 text-[10px] ${categoryColors[event.category] ?? categoryColors.umum}`}>
          {event.category}
        </Badge>
      </div>
    </div>
  )
}

export function AgendaSection() {
  const { t } = useTranslation('landing')
  const { data, isLoading } = useEventsList({ per_page: 5 })
  const events = data?.data ?? []

  return (
    <section id="agenda" className="section-padding bg-secondary/30">
      <div className="container-page">
        <SectionHeader
          badge={t('agenda.badge')}
          title={t('agenda.title')}
          description={t('agenda.desc')}
        />

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <Skeleton className="h-64 rounded-xl" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-muted-foreground">{t('agenda.empty')}</p>
        ) : (
          <FadeInView direction="up" tier="full">
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <MiniCalendar events={events} />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" aria-hidden />
                  <h3 className="text-sm font-semibold">{t('agenda.upcoming')}</h3>
                </div>
                {events.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
                <div className="flex justify-center pt-2">
                  <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-secondary">
                    <Link to="/agenda">
                      {t('agenda.viewAll')}
                      <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </FadeInView>
        )}
      </div>
    </section>
  )
}
