import { useParams } from 'react-router-dom'
import { Award, Trophy, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { SubpageHero } from '@/components/layout/SubpageHero'
import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAchievementDetail } from '@/hooks/useAchievements'

const levelColors: Record<string, string> = {
  internasional: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
  nasional: 'bg-red-500/10 text-red-700 border-red-500/30',
  provinsi: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  kota: 'bg-green-500/10 text-green-700 border-green-500/30',
  kecamatan: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
  sekolah: 'bg-gray-500/10 text-gray-700 border-gray-500/30',
}

export function AchievementDetailPage() {
  const { t } = useTranslation('pages')
  const { uuid } = useParams<{ uuid: string }>()
  const { data: item, isLoading } = useAchievementDetail(uuid ?? '')

  if (isLoading) {
    return (
      <PublicPageShell>
        <SubpageHero title="" subtitle="" backHref="/prestasi" backLabel={t('achievements.backToList')} />
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
        <SubpageHero title={t('achievements.notFound')} subtitle="" backHref="/prestasi" backLabel={t('achievements.backToList')} />
        <div className="container-page section-padding text-center">
          <p className="text-muted-foreground">{t('achievements.notFoundDesc')}</p>
        </div>
      </PublicPageShell>
    )
  }

  return (
    <PublicPageShell>
      <PageMeta title={item.title} description={item.description ?? undefined} />
      <SubpageHero
        title={item.title}
        subtitle=""
        backHref="/prestasi"
        backLabel={t('achievements.backToList')}
      />

      <div className="container-page section-padding">
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden border-primary/10">
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="aspect-video w-full object-cover"
              />
            )}
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className={`text-sm ${levelColors[item.level] ?? ''}`}>
                  <Trophy className="mr-1 h-3.5 w-3.5" aria-hidden />
                  {t('achievements.level')} {item.level}
                </Badge>
                <Badge variant="secondary" className="capitalize text-sm">
                  {item.category}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {item.year}
                </Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {item.student_name && (
                  <div className="flex items-start gap-3 rounded-lg border border-primary/10 p-4">
                    <User className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">{t('achievements.studentName')}</p>
                      <p className="mt-0.5 text-sm font-medium">{item.student_name}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 rounded-lg border border-primary/10 p-4">
                  <Award className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{t('achievements.level')}</p>
                    <p className="mt-0.5 text-sm font-medium capitalize">{item.level}</p>
                  </div>
                </div>
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
