import { Award, BookOpen, GraduationCap, Sparkles, Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { StaggerChildren, StaggerItem } from '@/components/motion'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { CountUp } from '@/components/landing/CountUp'
import { IslamicPattern } from '@/components/landing/IslamicPattern'
import { useCarouselAutoplayPlugins } from '@/hooks/useCarouselAutoplay'
import { api } from '@/lib/api'
import { queryConfig } from '@/hooks/queryConfig'
import { useSchool } from '@/hooks/useSchool'
import type { HeroSlider, PaginatedResponse } from '@/types'
import { cn } from '@/lib/utils'

export function HeroSection() {
  const { t } = useTranslation('landing')
  const { data: school, isLoading: schoolLoading } = useSchool()
  const { data: sliders, isLoading: slidersLoading } = useQuery({
    queryKey: ['hero-sliders'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<HeroSlider>>('/v1/hero-sliders', {
        params: { per_page: 10 },
      })
      return data.data
    },
    ...queryConfig,
  })

  const isLoading = schoolLoading || slidersLoading
  const slides = sliders?.length
    ? sliders
    : [
        {
          id: 0,
          title: t('hero.defaultTitle'),
          subtitle: school?.tagline ?? t('hero.defaultSubtitle'),
          image: null,
          cta_text: t('hero.defaultCta'),
          cta_url: '/pmb/daftar',
        } as HeroSlider,
      ]

  const autoplayPlugins = useCarouselAutoplayPlugins(slides.length)

  const trustStats = [
    { icon: Users, value: 500, suffix: '+', label: t('hero.activeStudents') },
    { icon: Award, value: 15, suffix: '+', label: t('hero.yearEstablished') },
    { icon: BookOpen, value: null as number | null, suffix: '', label: t('hero.programTahfidz') },
    { icon: GraduationCap, value: null as number | null, suffix: '', label: t('hero.accreditedA') },
  ]

  const collageItems = [
    { label: t('hero.tahfidz'), color: 'from-primary/30 to-primary/10' },
    { label: t('hero.academic'), color: 'from-primary/40 to-primary/10' },
    { label: t('hero.character'), color: 'from-[var(--gold-accent)]/30 to-primary/10' },
    { label: t('hero.activity'), color: 'from-primary/25 to-accent/40' },
  ]

  if (isLoading) {
    return (
      <section className="relative">
        <Skeleton className="skeleton-shimmer min-h-[70vh] w-full rounded-none" />
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden">
      <Carousel className="w-full" opts={{ loop: true, align: 'start' }} plugins={autoplayPlugins}>
        <CarouselContent className="-ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div className="relative min-h-[75vh] lg:min-h-[90vh]">
                {slide.image ? (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 h-full w-full scale-105 object-cover"
                  />
                ) : (
                  <div
                    className="animate-gradient-shift absolute inset-0 bg-[length:200%_200%]"
                    style={{ backgroundImage: 'var(--gradient-hero)' }}
                    aria-hidden
                  />
                )}

                <div
                  className="absolute inset-0 bg-hero-overlay"
                  aria-hidden
                />

                <IslamicPattern opacity={0.08} />

                {/* Animated blobs */}
                <div
                  className="animate-float absolute -right-24 top-[15%] h-80 w-80 rounded-full bg-white/8 blur-3xl"
                  aria-hidden
                />
                <div
                  className="animate-float-delayed absolute -left-16 bottom-[20%] h-64 w-64 rounded-full bg-[var(--gold-accent)]/15 blur-3xl"
                  aria-hidden
                />
                <div
                  className="animate-pulse-soft absolute right-[30%] top-[10%] h-3 w-3 rounded-full bg-[var(--gold-accent)]"
                  aria-hidden
                />

                <div className="container-page relative z-10 flex min-h-[75vh] flex-col justify-center py-20 text-white lg:min-h-[90vh] lg:py-24">
                  <div className="grid items-center gap-12 lg:grid-cols-2">
                    <StaggerChildren className="space-y-6">
                      <StaggerItem>
                        <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
                          <Sparkles className="h-3.5 w-3.5 text-[var(--gold-accent)]" />
                          {t('hero.welcome')} {school?.name?.split(' ').slice(-2).join(' ') ?? t('hero.schoolName')}
                        </p>
                      </StaggerItem>

                      <StaggerItem>
                        <h1 className="max-w-xl text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-5xl xl:text-[3.5rem]">
                          {slide.title.includes('&') ? (
                            <>
                              {slide.title.split('&')[0]}
                              <span className="text-gradient-gold">&</span>
                              {slide.title.split('&').slice(1).join('&')}
                            </>
                          ) : (
                            slide.title
                          )}
                        </h1>
                      </StaggerItem>

                      {slide.subtitle && (
                        <StaggerItem>
                          <p className="max-w-lg text-base leading-relaxed text-white/90 sm:text-lg">
                            {slide.subtitle}
                          </p>
                        </StaggerItem>
                      )}

                      <StaggerItem>
                        <div className="flex flex-wrap gap-3">
                          <Button
                            asChild
                            size="lg"
                            className="btn-shine h-12 bg-white px-7 text-primary shadow-xl shadow-black/25 transition-transform hover:scale-[1.02] hover:bg-white/95"
                          >
                            <Link
                              to={
                                slide.cta_url?.startsWith('/')
                                  ? slide.cta_url
                                  : `/${slide.cta_url ?? 'pmb/daftar'}`
                              }
                            >
                              {slide.cta_text ?? t('hero.registerPmb')}
                            </Link>
                          </Button>
                          <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="h-12 border-white/50 bg-white/5 px-7 text-white backdrop-blur-sm transition-transform hover:scale-[1.02] hover:bg-white/15"
                          >
                            <a href="#tentang">{t('hero.explore')}</a>
                          </Button>
                        </div>
                      </StaggerItem>
                    </StaggerChildren>

                    <div className="hidden lg:block" aria-hidden>
                      <div className="animate-float relative ms-auto w-full max-w-md">
                        <div className="absolute -inset-6 rounded-[2rem] bg-[var(--gold-accent)]/10 blur-2xl" />
                        <div className="card-glass relative overflow-hidden rounded-3xl p-6 shadow-2xl">
                          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-white/20" />
                          <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full border border-[var(--gold-accent)]/30" />
                          <div className="grid grid-cols-2 gap-3">
                            {collageItems.map((item, i) => (
                              <div
                                key={item.label}
                                className={cn(
                                  'group relative flex aspect-square flex-col items-center justify-center rounded-2xl bg-gradient-to-br p-4 transition-transform duration-300 hover:scale-105',
                                  item.color,
                                  i % 2 === 0 ? 'animate-float' : 'animate-float-delayed',
                                )}
                              >
                                <span className="text-2xl font-bold text-white/90">
                                  {item.label.charAt(0)}
                                </span>
                                <span className="mt-1 text-xs font-semibold text-white/75">
                                  {item.label}
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className="mt-5 text-center text-sm font-medium text-white/85">
                            {t('hero.subtitle')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom wave */}
                <div className="absolute bottom-0 left-0 right-0 text-background" aria-hidden>
                  <svg viewBox="0 0 1440 60" fill="currentColor" className="block w-full" preserveAspectRatio="none">
                    <path d="M0,40 C360,60 720,20 1080,40 C1260,50 1380,55 1440,40 L1440,60 L0,60 Z" />
                  </svg>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {slides.length > 1 && (
          <>
            <CarouselPrevious className="left-4 border-white/30 bg-white/10 text-white backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/25" />
            <CarouselNext className="right-4 border-white/30 bg-white/10 text-white backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/25" />
            <CarouselDots
              count={slides.length}
              className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2 lg:bottom-24"
            />
          </>
        )}
      </Carousel>

      <div className="relative z-10 bg-background">
        <div className="container-page -mt-2 pb-8 pt-4">
          <StaggerChildren className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {trustStats.map(({ icon: Icon, value, suffix, label }) => (
              <StaggerItem key={label}>
                <div className="card-hover group flex items-center gap-3 rounded-2xl border border-primary/10 bg-card p-4 shadow-sm">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-lg font-bold text-primary">
                      {value != null ? (
                        <CountUp end={value} suffix={suffix ?? ''} />
                      ) : (
                        label.split(' ')[0]
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {value != null ? label : label.includes(' ') ? label.split(' ').slice(1).join(' ') : label}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </div>
    </section>
  )
}
