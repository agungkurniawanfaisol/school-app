import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { RevealOnScroll } from '@/components/landing/RevealOnScroll'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { TeacherAvatar } from '@/components/teachers/TeacherAvatar'
import { useTeachersList } from '@/hooks/useTeachers'
import type { Teacher } from '@/types'
import { cn } from '@/lib/utils'

export const LANDING_TEACHER_LIMIT = 7

function TeacherCard({ teacher, featured = false }: { teacher: Teacher; featured?: boolean }) {
  const { t } = useTranslation('landing')
  const detailHref = `/guru/${teacher.slug}`

  if (featured) {
    return (
      <Link
        to={detailHref}
        className="block touch-manipulation rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:col-span-2"
      >
        <Card className="card-hover h-full overflow-hidden border-primary/15 bg-gradient-to-br from-secondary/50 to-card">
          <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start sm:p-8">
            <div className="shrink-0 overflow-hidden rounded-2xl border-2 border-primary/20 shadow-md">
              <TeacherAvatar teacher={teacher} size="lg" className="h-32 w-32" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t('teachers.featured')}</p>
              <h3 className="mt-1 text-2xl font-bold text-foreground">{teacher.name}</h3>
              {teacher.title && (
                <p className="mt-1 text-sm text-muted-foreground">{teacher.title}</p>
              )}
              {teacher.subject && (
                <p className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {teacher.subject}
                </p>
              )}
              {teacher.bio && (
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {teacher.bio}
                </p>
              )}
              <p className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-primary">
                {t('teachers.viewProfile')}
              </p>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link
      to={detailHref}
      className="block touch-manipulation rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <Card className="card-hover group h-full overflow-hidden border-primary/10">
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl bg-muted">
          <TeacherAvatar teacher={teacher} size="lg" className="h-full w-full rounded-none text-3xl" />
          <div className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-primary/90 via-primary/70 to-transparent p-4 pt-12 text-primary-foreground md:block md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
            <p className="font-semibold">{teacher.name}</p>
            {teacher.subject && <p className="text-sm text-primary-foreground/85">{teacher.subject}</p>}
          </div>
        </div>
        <CardContent className="border-t border-primary/10 py-3 text-center md:border-t-0">
          <p className="font-medium text-foreground md:hidden">{teacher.name}</p>
          {teacher.title && (
            <p className="text-xs text-muted-foreground md:group-hover:text-primary">{teacher.title}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

export function TeachersSection() {
  const { t } = useTranslation('landing')
  const { data, isLoading, isFetching } = useTeachersList({ per_page: LANDING_TEACHER_LIMIT, type: 'guru' })
  const teachers = data?.data ?? []
  const featured = teachers.find((t) => t.is_featured) ?? teachers[0]
  const rest = teachers.filter((t) => t.id !== featured?.id)
  const hasMore = (data?.meta?.total ?? 0) > teachers.length

  return (
    <section id="guru" className="section-padding">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            badge={t('teachers.badge')}
            title={t('teachers.title')}
            description={t('teachers.desc')}
            align="left"
            className="mb-0"
          />
          {hasMore && !isLoading && (
            <Button asChild className="min-h-11 shrink-0 shadow-md shadow-primary/20">
              <Link to="/guru">
                {t('teachers.viewAll')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: LANDING_TEACHER_LIMIT }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full rounded-xl" />
            ))}
          </div>
        ) : teachers.length === 0 ? (
          <p className="text-center text-muted-foreground">{t('teachers.empty')}</p>
        ) : (
          <RevealOnScroll direction="up">
            <div className={cn('space-y-6', isFetching && 'opacity-70')}>
              {featured && (
                <div className="grid gap-6 lg:grid-cols-4">
                  <TeacherCard teacher={featured} featured />
                </div>
              )}
              {rest.length > 0 && (
                <>
                  <div className="hidden gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid lg:grid-cols-4">
                    {rest.map((teacher) => (
                      <TeacherCard key={teacher.id} teacher={teacher} />
                    ))}
                  </div>

                  <div className="md:hidden">
                    <Carousel opts={{ align: 'start', loop: false, dragFree: true }} className="w-full">
                      <CarouselContent className="-ml-4">
                        {rest.map((teacher) => (
                          <CarouselItem key={teacher.id} className="basis-[72%] pl-4 sm:basis-[56%]">
                            <TeacherCard teacher={teacher} />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {rest.length > 1 && <CarouselDots count={rest.length} className="mt-4" />}
                    </Carousel>
                    {rest.length > 1 && (
                      <p className="mt-2 text-center text-xs text-muted-foreground">
                        {t('teachers.swipe')}
                      </p>
                    )}
                  </div>
                </>
              )}

              {hasMore && (
                <div className="text-center md:hidden">
                  <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
                    <Link to="/guru">
                      {t('teachers.viewAllMobile')}
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
