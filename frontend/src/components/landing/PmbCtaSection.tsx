import { GraduationCap, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IslamicPattern } from '@/components/landing/IslamicPattern'
import { RevealOnScroll } from '@/components/landing/RevealOnScroll'

export function PmbCtaSection() {
  const { t } = useTranslation('landing')
  return (
    <section className="relative overflow-hidden bg-[length:200%_200%] text-white animate-gradient-shift" style={{ backgroundImage: 'var(--gradient-hero)' }}>
      <IslamicPattern opacity={0.06} />

      <div
        className="animate-float absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-white/5 blur-3xl"
        aria-hidden
      />
      <div
        className="animate-float-delayed absolute -right-16 top-1/4 h-48 w-48 rounded-full bg-[var(--gold-accent)]/10 blur-2xl"
        aria-hidden
      />

      <div className="container-page relative section-padding">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <RevealOnScroll direction="left">
            <div>
              <Badge className="mb-4 animate-pulse-soft border-white/30 bg-white/15 text-white">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[var(--gold-accent)]" />
                {t('pmb.badge')}
              </Badge>
              <h2 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.75rem]">
                {t('pmb.title')}{' '}
                <span className="text-gradient-gold">{t('pmb.highlight')}</span>
              </h2>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/90">
                {t('pmb.desc')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="btn-shine h-12 bg-white px-7 text-primary shadow-xl transition-transform hover:scale-[1.02] hover:bg-white/90"
                >
                  <Link to="/pmb/daftar">{t('pmb.register')}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/50 bg-transparent px-7 text-white transition-transform hover:scale-[1.02] hover:bg-white/10"
                >
                  <Link to="/pmb">{t('pmb.requirements')}</Link>
                </Button>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction="right" delay={150}>
            <div className="flex justify-center lg:justify-end" aria-hidden>
              <div className="animate-float relative">
                <div className="absolute -inset-8 rounded-full bg-[var(--gold-accent)]/15 blur-3xl" />
                <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-2 border-white/25 bg-white/10 shadow-2xl backdrop-blur-md sm:h-60 sm:w-60">
                  <GraduationCap className="h-28 w-28 text-white/90 sm:h-32 sm:w-32" strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-3 -right-3 rounded-xl border border-[var(--gold-accent)]/50 bg-[var(--gold-accent)]/25 px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-sm">
                  {t('pmb.qurani')}
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
