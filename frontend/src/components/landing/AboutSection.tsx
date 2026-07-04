import { BookOpen, GraduationCap, HandHeart, Heart, Sparkles, Target, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { StaggerChildren, StaggerItem } from '@/components/motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RevealOnScroll } from '@/components/landing/RevealOnScroll'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { useSchool } from '@/hooks/useSchool'
import { cn } from '@/lib/utils'

export function AboutSection() {
  const { t } = useTranslation('landing')
  const { data: school, isLoading } = useSchool()

  const values = [
    { icon: Heart, title: t('about.akhlak'), desc: t('about.akhlakDesc'), color: 'hover:border-rose-300/50 dark:hover:border-rose-500/40' },
    { icon: Sparkles, title: t('about.ilmu'), desc: t('about.ilmuDesc'), color: 'hover:border-amber-300/50 dark:hover:border-amber-500/40' },
    { icon: HandHeart, title: t('about.amal'), desc: t('about.amalDesc'), color: 'hover:border-emerald-300/50 dark:hover:border-emerald-500/40' },
    { icon: Target, title: t('about.ukhuwah'), desc: t('about.ukhuwahDesc'), color: 'hover:border-primary/40' },
  ]

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
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"
                  alt={school?.name ?? 'Nurul Hikmah'}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
                  <p className="text-lg font-bold sm:text-xl">{school?.name ?? 'Nurul Hikmah'}</p>
                  <p className="text-sm text-white/80">{school?.tagline ?? ''}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: GraduationCap, value: '1998', label: t('about.statSince') },
                  { icon: Users, value: '500+', label: t('about.statStudents') },
                  { icon: BookOpen, value: 'TK–SMP', label: t('about.statLevels') },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 rounded-xl border border-primary/10 bg-secondary/40 px-2 py-3 text-center">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold text-foreground">{value}</span>
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
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

        <RevealOnScroll direction="up" delay={150}>
          <div className="mt-14">
            <h3 className="mb-8 text-center text-xl font-bold text-primary">{t('about.values')}</h3>
            <StaggerChildren className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {values.map(({ icon: Icon, title, desc, color }) => (
                <StaggerItem key={title}>
                  <div
                    className={cn(
                      'card-hover flex h-full flex-col items-center rounded-2xl border border-primary/10 bg-card p-5 text-center',
                      color,
                    )}
                  >
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
