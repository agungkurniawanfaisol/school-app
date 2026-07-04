import { ArrowRight, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import { RevealOnScroll } from '@/components/landing/RevealOnScroll'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { formatDate } from '@/lib/utils'
import { useActivitiesList } from '@/hooks/useActivities'
import type { StudentActivity } from '@/types'
import { cn } from '@/lib/utils'

function ActivityCard({ activity, featured = false }: { activity: StudentActivity; featured?: boolean }) {
  const { locale } = useLanguage()
  return (
    <Link
      to={`/kegiatan/detail/${activity.uuid}`}
      className="block touch-manipulation rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <Card
        className={cn(
          'card-hover h-full overflow-hidden border-primary/10',
          featured && 'lg:row-span-2',
        )}
      >
        {activity.thumbnail && (
          <img
            src={activity.thumbnail}
            alt=""
            className={cn('w-full object-cover', featured ? 'aspect-[4/3] lg:aspect-auto lg:h-64' : 'aspect-video')}
            loading="lazy"
          />
        )}
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <CardTitle className={cn('leading-snug', featured ? 'text-xl' : 'text-lg')}>
              {activity.title}
            </CardTitle>
            {activity.activity_date && (
              <Badge className="shrink-0 border-0 bg-accent text-accent-foreground">
                <Calendar className="mr-1 h-3 w-3" aria-hidden />
                {formatDate(activity.activity_date, undefined, locale)}
              </Badge>
            )}
          </div>
          {activity.category && (
            <Badge variant="outline" className="w-fit capitalize">
              {activity.category}
            </Badge>
          )}
          {activity.excerpt && <CardDescription className="line-clamp-2">{activity.excerpt}</CardDescription>}
        </CardHeader>
        {featured && activity.content && (
          <CardContent className="pt-0">
            <p className="line-clamp-3 text-sm text-muted-foreground">{activity.content}</p>
          </CardContent>
        )}
      </Card>
    </Link>
  )
}

export function ActivitiesSection() {
  const { t } = useTranslation('landing')
  const { data, isLoading, isFetching } = useActivitiesList({ per_page: 6, featured: true })
  const activities = data?.data ?? []
  const featured = activities[0]
  const rest = activities.slice(1)
  const hasMore = (data?.meta?.total ?? 0) > activities.length

  return (
    <section id="kegiatan" className="section-padding bg-secondary/30">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            badge={t('activities.badge')}
            title={t('activities.title')}
            description={t('activities.desc')}
            align="left"
            className="mb-0 md:mb-0"
          />
          <Button
            asChild
            variant="outline"
            className="min-h-11 shrink-0 border-primary text-primary hover:bg-secondary"
          >
            <Link to="/kegiatan">
              {t('activities.viewAll')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-80 w-full rounded-xl" />
            <div className="grid gap-6 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ) : activities.length === 0 ? (
          <p className="text-center text-muted-foreground">{t('activities.empty')}</p>
        ) : (
          <RevealOnScroll direction="up">
            <div className={cn('space-y-6', isFetching && 'opacity-70')}>
              <div className="grid gap-6 lg:grid-cols-2">
                {featured && <ActivityCard activity={featured} featured />}

                {rest.length > 0 && (
                  <>
                    <div className="hidden gap-6 sm:grid-cols-2 lg:grid">
                      {rest.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} />
                      ))}
                    </div>

                    <div className="lg:hidden">
                      <Carousel opts={{ align: 'start', loop: false, dragFree: true }} className="w-full">
                        <CarouselContent className="-ml-4">
                          {rest.map((activity) => (
                            <CarouselItem key={activity.id} className="basis-[88%] pl-4 sm:basis-[72%]">
                              <ActivityCard activity={activity} />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        {rest.length > 1 && <CarouselDots count={rest.length} className="mt-4" />}
                      </Carousel>
                      {rest.length > 1 && (
                        <p className="mt-2 text-center text-xs text-muted-foreground">
                          {t('activities.swipe')}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {hasMore && (
                <div className="text-center lg:hidden">
                  <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
                    <Link to="/kegiatan">
                      {t('activities.viewAllMobile')}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  )
}
