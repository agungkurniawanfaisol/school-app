import { Target } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StaggerChildren, StaggerItem } from '@/components/motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RevealOnScroll } from '@/components/landing/RevealOnScroll'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { useSchool } from '@/hooks/useSchool'
import { useSchoolStatsList } from '@/hooks/useSchoolStats'
import { useSchoolValuesList } from '@/hooks/useSchoolValues'
import { getAboutImage } from '@/lib/brand'
import { resolveValueIcon } from '@/lib/lucide-icon-map'
import { cn } from '@/lib/utils'

const VALUE_HOVER_COLORS = [
  'hover:border-rose-300/50 dark:hover:border-rose-500/40',
  'hover:border-amber-300/50 dark:hover:border-amber-500/40',
  'hover:border-emerald-300/50 dark:hover:border-emerald-500/40',
  'hover:border-primary/40',
] as const

export function AboutSection() {
  const { t } = useTranslation('landing')
  const { data: school, isLoading } = useSchool()
  const { data: valuesResponse } = useSchoolValuesList({ per_page: 12 })
  const { data: statsResponse } = useSchoolStatsList({ per_page: 12 })

  const values = valuesResponse?.data ?? []
  const stats = statsResponse?.data ?? []
  const aboutImageSrc = getAboutImage(school?.about_image)

  if (isLoading) {
    return (
      <section id="tentang" className="section-padding pattern-bg pattern-islamic">
        <div className="container-page space-y-6">
          <Skeleton className="skeleton-shimmer mx-auto h-8 w-48 rounded-lg" />
          <Skeleton className="skeleton-shimmer h-64 w-full rounded-2xl" />
        </div>
      </section>
    )
  }

  return (
    <section id="tentang" className="landing-section section-padding pattern-bg pattern-islamic">
      <div className="container-page">
        <SectionHeader
          badge={t('about.badge')}
          title={t('about.title')}
          description={
            school?.description ??
            t('about.fallbackDesc')
          }
        />

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
          <RevealOnScroll direction="left">
            <div className="space-y-5">
              <div className="group relative overflow-hidden rounded-2xl border-2 border-primary/15 shadow-lg shadow-primary/5">
                <img
                  src={aboutImageSrc}
                  alt={school?.name ?? 'Nurul Hikmah'}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
                  <p className="text-lg font-bold sm:text-xl">{school?.name ?? 'Nurul Hikmah'}</p>
                  <p className="text-sm text-white/80">{school?.tagline ?? ''}</p>
                </div>
              </div>

              {stats.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {stats.map((stat) => {
                    const Icon = resolveValueIcon(stat.icon)
                    return (
                      <div
                        key={stat.uuid}
                        className="flex flex-col items-center gap-1 rounded-xl border border-primary/10 bg-secondary/40 px-2 py-3 text-center"
                      >
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="text-sm font-bold text-foreground">{stat.value}</span>
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                      </div>
                    )
                  })}
                </div>
              ) : null}
            </div>
          </RevealOnScroll>

          <div className="space-y-6">
            {school?.vision && (
              <RevealOnScroll direction="right" delay={100}>
                <Card className="card-hover border-primary/10 bg-secondary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Target className="h-5 w-5 text-[var(--gold-accent)]" />
                      {t('about.vision')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-muted-foreground">{school.vision}</p>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            )}
            {school?.mission && (
              <RevealOnScroll direction="right" delay={200}>
                <Card className="card-hover border-primary/10 bg-secondary/30">
                  <CardHeader>
                    <CardTitle className="text-primary">{t('about.mission')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                      {school.mission}
                    </p>
                  </CardContent>
                </Card>
              </RevealOnScroll>
            )}
          </div>
        </div>

        {values.length > 0 ? (
          <RevealOnScroll direction="up" delay={150}>
            <div className="mt-14">
              <h3 className="mb-8 text-center text-xl font-bold text-primary">{t('about.values')}</h3>
              <StaggerChildren className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {values.map((item, index) => {
                  const Icon = resolveValueIcon(item.icon)
                  const color = VALUE_HOVER_COLORS[index % VALUE_HOVER_COLORS.length]
                  return (
                    <StaggerItem key={item.uuid}>
                      <div
                        className={cn(
                          'card-hover flex h-full flex-col items-center rounded-2xl border border-primary/10 bg-card p-5 text-center',
                          color,
                        )}
                      >
                        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-6 w-6" />
                        </span>
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </StaggerItem>
                  )
                })}
              </StaggerChildren>
            </div>
          </RevealOnScroll>
        ) : null}
      </div>
    </section>
  )
}
