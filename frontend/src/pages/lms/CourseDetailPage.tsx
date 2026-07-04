import { Clock } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { useCourseDetail } from '@/hooks/useCourses'

export function CourseDetailPage() {
  const { t } = useTranslation('pages')
  const { slug = '' } = useParams()
  const { data: course, isLoading } = useCourseDetail(slug)

  if (isLoading) {
    return (
      <PublicPageShell>
        <SubpageHero title={t('courseDetail.loading')} backHref="/kursus" backLabel={t('courseDetail.catalog')} />
        <div className="container-page section-padding">
          <Skeleton className="mb-6 h-64 w-full" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </PublicPageShell>
    )
  }

  if (!course) {
    return (
      <PublicPageShell>
        <SubpageHero title={t('courseDetail.notFound')} backHref="/kursus" backLabel={t('courseDetail.catalog')} />
        <div className="container-page section-padding text-center">
          <Button asChild className="mt-4">
            <Link to="/kursus">{t('courseDetail.backToCatalog')}</Link>
          </Button>
        </div>
      </PublicPageShell>
    )
  }

  return (
    <PublicPageShell>
      <SubpageHero
        title={course.title}
        subtitle={course.excerpt}
        badge={course.category}
        backHref="/kursus"
        backLabel={t('courseDetail.catalog')}
      />
      <section className="container-page section-padding">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {course.thumbnail && (
              <img src={course.thumbnail} alt={course.title} className="mb-6 h-64 w-full rounded-lg object-cover" />
            )}
            <div className="mb-4 flex flex-wrap gap-2">
              {course.level && <Badge variant="secondary">{course.level}</Badge>}
              {course.category && <Badge variant="outline">{course.category}</Badge>}
            </div>
            <h2 className="sr-only">{course.title}</h2>
            {course.description && (
              <p className="mb-8 whitespace-pre-line text-muted-foreground">{course.description}</p>
            )}

            {course.modules && course.modules.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold">{t('courseDetail.materials')}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {course.modules.map((mod) => (
                    <AccordionItem key={mod.id} value={`mod-${mod.id}`}>
                      <AccordionTrigger>{mod.title}</AccordionTrigger>
                      <AccordionContent>
                        {mod.description && <p className="mb-3 text-sm text-muted-foreground">{mod.description}</p>}
                        <ul className="space-y-2">
                          {mod.lessons?.map((lesson) => (
                            <li key={lesson.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                              <span>{lesson.title}</span>
                              <div className="flex items-center gap-2">
                                {lesson.is_free_preview && <Badge variant="outline">{t('courseDetail.preview')}</Badge>}
                                {lesson.duration_minutes && (
                                  <span className="text-xs text-muted-foreground">{lesson.duration_minutes} {t('courseDetail.min')}</span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{formatCurrency(course.price, t('courseDetail.free'))}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.duration_minutes && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {t('courseCatalog.minutes')}: {course.duration_minutes}
                  </p>
                )}
                <Button className="w-full" disabled>
                  {t('courseDetail.enrollSoon')}
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/kursus">{t('courseDetail.backToCatalog')}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PublicPageShell>
  )
}
