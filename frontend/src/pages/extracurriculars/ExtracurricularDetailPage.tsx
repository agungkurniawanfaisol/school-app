import { useParams } from 'react-router-dom'
import { CalendarClock, Dumbbell, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useExtracurricularDetail } from '@/hooks/useExtracurriculars'

export function ExtracurricularDetailPage() {
  const { t } = useTranslation('pages')
  const { uuid } = useParams<{ uuid: string }>()
  const { data: item, isLoading } = useExtracurricularDetail(uuid ?? '')

  if (isLoading) {
    return (
      <PublicPageShell>
        <SubpageHero title="" subtitle="" backHref="/ekstrakurikuler" backLabel={t('extracurricular.backToList')} />
        <div className="container-page section-padding">
          <div className="mx-auto max-w-4xl space-y-6">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </PublicPageShell>
    )
  }

  if (!item) {
    return (
      <PublicPageShell>
        <SubpageHero title={t('extracurricular.notFound')} subtitle="" backHref="/ekstrakurikuler" backLabel={t('extracurricular.backToList')} />
        <div className="container-page section-padding text-center">
          <p className="text-muted-foreground">{t('extracurricular.notFoundDesc')}</p>
        </div>
      </PublicPageShell>
    )
  }

  return (
    <PublicPageShell>
      <PageMeta title={item.name} description={item.description ?? undefined} />
      <SubpageHero
        title={item.name}
        subtitle={item.description ?? ''}
        backHref="/ekstrakurikuler"
        backLabel={t('extracurricular.backToList')}
      />

      <div className="container-page section-padding">
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden border-primary/10">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="aspect-video w-full object-cover"
              />
            )}
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="capitalize text-sm">
                  {item.category}
                </Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {item.schedule && (
                  <div className="flex items-start gap-3 rounded-lg border border-primary/10 p-4">
                    <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{t('extracurricular.schedule')}</p>
                      <p className="mt-0.5 text-sm font-medium">{item.schedule}</p>
                    </div>
                  </div>
                )}
                {item.instructor && (
                  <div className="flex items-start gap-3 rounded-lg border border-primary/10 p-4">
                    <User className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{t('extracurricular.instructor')}</p>
                      <p className="mt-0.5 text-sm font-medium">{item.instructor}</p>
                    </div>
                  </div>
                )}
              </div>

              {item.description && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="whitespace-pre-wrap">{item.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicPageShell>
  )
}
