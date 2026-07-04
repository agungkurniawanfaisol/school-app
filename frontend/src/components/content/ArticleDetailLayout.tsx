import { Calendar, Clock, Share2, Tag, User } from 'lucide-react'
import { useLayoutEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IslamicPattern } from '@/components/landing/IslamicPattern'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { openWhatsAppShare } from '@/lib/share'
import { estimateReadingTimeMinutes } from '@/lib/reading-time'
import { cn } from '@/lib/utils'

export interface ArticleDetailLayoutProps {
  backHref: string
  backLabel: string
  title: string
  excerpt?: string | null
  thumbnail?: string | null
  category?: string | null
  authorName?: string | null
  dateLabel?: string | null
  readingSource?: string | null
  shareTitle: string
  children: ReactNode
  footer?: ReactNode
}

export function ArticleDetailSkeleton() {
  return (
    <div className="pb-16">
      <Skeleton className="min-h-[40vh] w-full rounded-none sm:min-h-[52vh]" />
      <div className="container-page section-padding pt-8">
        <Skeleton className="mx-auto h-64 max-w-3xl rounded-xl" />
      </div>
    </div>
  )
}

export function ArticleDetailLayout({
  backHref,
  backLabel,
  title,
  excerpt,
  thumbnail,
  category,
  authorName,
  dateLabel,
  readingSource,
  shareTitle,
  children,
  footer,
}: ArticleDetailLayoutProps) {
  const { t } = useTranslation('layout')
  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const readingMinutes = estimateReadingTimeMinutes(readingSource ?? excerpt ?? '')
  const hasBackdrop = Boolean(thumbnail)

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [title])

  return (
    <article className="pb-16">
      <header
        className={cn(
          'relative overflow-hidden border-b border-primary/20',
          hasBackdrop ? 'min-h-[40vh] sm:min-h-[52vh]' : 'min-h-[32vh] sm:min-h-[38vh]',
        )}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            className="absolute inset-0 h-full w-full scale-105 object-cover"
            aria-hidden
            loading="eager"
          />
        ) : (
          <div
            className="absolute inset-0 bg-[length:200%_200%]"
            style={{ backgroundImage: 'var(--gradient-hero)' }}
            aria-hidden
          />
        )}

        <div className="absolute inset-0 bg-article-hero-overlay" aria-hidden />
        <IslamicPattern opacity={0.07} />
        <div
          className="pointer-events-none absolute -right-16 top-8 h-56 w-56 rounded-full bg-[var(--gold-accent)]/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-primary-foreground/10 blur-3xl"
          aria-hidden
        />

        <div className="container-page relative z-10 flex min-h-[inherit] flex-col justify-end py-6 text-white sm:py-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 sm:mb-10">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="article-hero-toolbar-btn min-h-11 border"
            >
              <Link to={backHref}>← {backLabel}</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="article-hero-toolbar-btn min-h-11 gap-2 border"
              aria-label={t('article.shareWa')}
              onClick={() => openWhatsAppShare(shareTitle, pageUrl)}
            >
              <Share2 className="h-4 w-4" aria-hidden />
              {t('article.share')}
            </Button>
          </div>

          <div className="mx-auto w-full max-w-4xl space-y-5 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <Badge className="border-0 bg-white/15 capitalize text-white backdrop-blur-sm">
                  <Tag className="mr-1 h-3 w-3" aria-hidden />
                  {category}
                </Badge>
              )}
              {dateLabel && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm text-white/90 backdrop-blur-sm">
                  <Calendar className="h-4 w-4" aria-hidden />
                  {dateLabel}
                </span>
              )}
              {readingMinutes > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm text-white/90 backdrop-blur-sm">
                  <Clock className="h-4 w-4" aria-hidden />
                  {t('article.readingTime', { minutes: readingMinutes })}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              {title}
            </h1>

            {authorName && (
              <p className="inline-flex items-center gap-2 text-sm text-white/85">
                <User className="h-4 w-4" aria-hidden />
                {t('article.byAuthor', { name: authorName })}
              </p>
            )}

            {excerpt && (
              <p className="max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl">
                {excerpt}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="container-page section-padding pt-6 sm:pt-8">
        <div className="mx-auto max-w-3xl">
          <Card className="-mt-4 border-primary/10 shadow-lg shadow-primary/5 sm:-mt-8">
            <CardContent className="p-4 sm:p-8 lg:p-10">{children}</CardContent>
          </Card>
          {footer}
        </div>
      </div>
    </article>
  )
}
