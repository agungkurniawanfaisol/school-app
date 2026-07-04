import { ArrowRight, Medal, Star, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FadeInView } from '@/components/motion/FadeInView'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { useAchievementsList, type Achievement } from '@/hooks/useAchievements'

const levelColors: Record<string, string> = {
  nasional: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  internasional: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  provinsi: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  kota: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  kecamatan: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  sekolah: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

function CounterCard({ icon: Icon, value, label }: { icon: React.ElementType; value: number; label: string }) {
  return (
    <Card className="text-center">
      <CardContent className="flex flex-col items-center gap-1 p-4 md:p-6">
        <Icon className="h-6 w-6 text-primary md:h-8 md:w-8" aria-hidden />
        <p className="text-2xl font-bold text-primary md:text-3xl">{value}</p>
        <p className="text-xs text-muted-foreground md:text-sm">{label}</p>
      </CardContent>
    </Card>
  )
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <Card className="h-full overflow-hidden border-primary/10">
      {achievement.image && (
        <img
          src={achievement.image}
          alt=""
          className="aspect-video w-full object-cover"
          loading="lazy"
        />
      )}
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{achievement.title}</CardTitle>
          <Badge className={`shrink-0 border-0 text-xs ${levelColors[achievement.level] ?? levelColors.sekolah}`}>
            {achievement.level}
          </Badge>
        </div>
        {achievement.student_name && (
          <p className="text-sm text-muted-foreground">{achievement.student_name}</p>
        )}
      </CardHeader>
      {achievement.description && (
        <CardContent className="pt-0">
          <p className="line-clamp-2 text-sm text-muted-foreground">{achievement.description}</p>
        </CardContent>
      )}
    </Card>
  )
}

export function AchievementsSection() {
  const { t } = useTranslation('landing')
  const { data, isLoading } = useAchievementsList({ per_page: 6 })
  const achievements = data?.data ?? []

  const total = data?.meta?.total ?? achievements.length
  const nationalPlus = achievements.filter((a) => a.level === 'nasional' || a.level === 'internasional').length
  const currentYear = achievements.filter((a) => a.year === new Date().getFullYear()).length

  return (
    <section id="prestasi" className="section-padding">
      <div className="container-page">
        <SectionHeader
          badge={t('achievements.badge')}
          title={t('achievements.title')}
          description={t('achievements.desc')}
        />

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          </div>
        ) : achievements.length === 0 ? (
          <p className="text-center text-muted-foreground">{t('achievements.empty')}</p>
        ) : (
          <FadeInView direction="up" tier="full">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <CounterCard icon={Trophy} value={total} label={t('achievements.total')} />
                <CounterCard icon={Medal} value={nationalPlus} label={t('achievements.national')} />
                <CounterCard icon={Star} value={currentYear} label={t('achievements.thisYear')} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {achievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>

              <div className="flex justify-center pt-2">
                <Button asChild variant="outline" className="min-h-11 border-primary text-primary hover:bg-secondary">
                  <Link to="/prestasi">
                    {t('achievements.viewAll')}
                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>
          </FadeInView>
        )}
      </div>
    </section>
  )
}
