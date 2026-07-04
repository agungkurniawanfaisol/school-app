import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { IslamicPattern } from '@/components/landing/IslamicPattern'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SubpageHeroProps {
  title: string
  subtitle?: string | null
  badge?: string | null
  backHref?: string
  backLabel?: string
  /** Extra content rendered below the subtitle */
  children?: ReactNode
  className?: string
}

/**
 * Consistent hero banner for all public subpages (non-landing, non-admin).
 * Uses the school's gradient + 35% dark overlay + Islamic star pattern.
 */
export function SubpageHero({
  title,
  subtitle,
  badge,
  backHref,
  backLabel,
  children,
  className,
}: SubpageHeroProps) {
  const { t } = useTranslation('layout')
  return (
    <section
      className={cn(
        'relative overflow-hidden border-b border-primary/20',
        className,
      )}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 bg-[length:200%_200%]"
        style={{ backgroundImage: 'var(--gradient-hero)' }}
        aria-hidden
      />

      {/* 35% dark overlay */}
      <div className="absolute inset-0 bg-black/35" aria-hidden />

      <IslamicPattern opacity={0.06} />

      {/* Decorative glow accents */}
      <div
        className="pointer-events-none absolute -right-16 top-4 h-48 w-48 rounded-full bg-[var(--gold-accent)]/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-primary-foreground/8 blur-3xl"
        aria-hidden
      />

      <div className="container-page relative z-10 py-10 text-white sm:py-14">
        {backHref && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="mb-6 border-white/30 bg-white/10 text-white hover:bg-white/20"
          >
            <Link to={backHref}>← {backLabel ?? t('nav.back')}</Link>
          </Button>
        )}

        <div className="max-w-3xl space-y-3">
          {badge && (
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--gold-accent)]">
              {badge}
            </p>
          )}
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="max-w-2xl text-base text-white/80 sm:text-lg">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}
