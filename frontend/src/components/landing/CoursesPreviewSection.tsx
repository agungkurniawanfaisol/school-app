import { ArrowRight, Clock, PlayCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StaggerChildren, StaggerItem } from '@/components/motion'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { formatCurrency } from '@/lib/utils'
import { useCoursesList } from '@/hooks/useCourses'

export function CoursesPreviewSection() {
  const { t } = useTranslation('landing')
  const { data, isLoading, isFetching } = useCoursesList({ per_page: 6, featured: true })
  const courses = data?.data ?? []

  return (
    <section id="kursus" className="section-padding">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            badge={t('courses.badge')}
            title={t('courses.title')}
            description={t('courses.desc')}
            align="left"
            className="mb-0"
          />
          <Button asChild className="min-h-11 shrink-0 shadow-md shadow-primary/20">
            <Link to="/kursus">
              {t('courses.viewCatalog')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-72 shrink-0 rounded-xl" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="text-center text-muted-foreground">{t('courses.noData')}</p>
        ) : (
          <StaggerChildren
            className={`-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-thin sm:-mx-6 sm:px-6 ${isFetching ? 'opacity-70' : ''}`}
          >
            {courses.map((course) => {
              const isFree = course.price === 0
              return (
                <StaggerItem key={course.id} className="w-72 shrink-0 snap-start sm:w-80">
                  <Card className="card-hover h-full overflow-hidden border-primary/10">
                  <div className="relative">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-secondary/60">
                        <PlayCircle className="h-12 w-12 text-primary/40" />
                      </div>
                    )}
                    <Badge
                      className={`absolute left-3 top-3 border-0 ${isFree ? 'bg-primary text-primary-foreground' : 'bg-[var(--gold-accent)] text-foreground dark:text-background'}`}
                    >
                      {isFree ? t('courses.free') : t('courses.premium')}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap gap-1.5">
                      {course.level && <Badge variant="secondary">{course.level}</Badge>}
                      {course.category && (
                        <Badge variant="outline" className="capitalize">
                          {course.category}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2 text-base leading-snug">
                      <Link to={`/kursus/${course.slug}`} className="hover:text-primary">
                        {course.title}
                      </Link>
                    </CardTitle>
                    {course.excerpt && (
                      <CardDescription className="line-clamp-2 text-sm">{course.excerpt}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full w-2/5 rounded-full bg-primary/60" aria-hidden />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-primary">
                        {isFree ? t('courses.free') : formatCurrency(course.price)}
                      </span>
                      {course.duration_minutes != null && course.duration_minutes > 0 && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {course.duration_minutes} {t('courses.minutes')}
                        </span>
                      )}
                    </div>
                  </CardContent>
                  </Card>
                </StaggerItem>
              )
            })}
          </StaggerChildren>
        )}
      </div>
    </section>
  )
}
