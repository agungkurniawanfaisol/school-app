import * as m from 'motion/react-m'
import { useLayoutEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Copy,
  Share2,
  Star,
  Tag,
} from 'lucide-react'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import { IslamicPattern } from '@/components/landing/IslamicPattern'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useActivitiesList, useActivityDetailByUuid } from '@/hooks/useActivities'
import {
  springSnappy,
  staggerContainer,
} from '@/lib/motion'
import { estimateReadingTimeMinutes } from '@/lib/reading-time'
import { openWhatsAppShare } from '@/lib/share'
import { cn, formatDate } from '@/lib/utils'
import type { RelatedContentItem } from '@/components/content/RelatedContentCards'

function ActivityDetailSkeleton() {
  return (
    <div className="pb-16">
      <Skeleton className="min-h-[40vh] w-full rounded-none sm:min-h-[50vh]" />
      <div className="container-page px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="-mt-16 flex gap-3">
            <Skeleton className="h-20 w-40 rounded-xl" />
            <Skeleton className="h-20 w-32 rounded-xl" />
            <Skeleton className="hidden h-20 w-36 rounded-xl sm:block" />
          </div>
          <Skeleton className="mt-8 h-64 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function ActivityDetailPage() {
  const { t } = useTranslation('pages')
  const { t: tLayout } = useTranslation('layout')
  const { locale } = useLanguage()
  const { uuid } = useParams<{ uuid: string }>()
  const { data: activity, isLoading, isError } = useActivityDetailByUuid(uuid ?? '')
  const { data: relatedData } = useActivitiesList({
    per_page: 4,
    category: activity?.category ?? undefined,
  })
  const [copied, setCopied] = useState(false)

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [activity?.title])

  if (isLoading) {
    return (
      <PublicPageShell>
        <ActivityDetailSkeleton />
      </PublicPageShell>
    )
  }

  if (isError || !activity) {
    return (
      <PublicPageShell>
        <div className="container-page section-padding text-center">
          <h1 className="text-2xl font-bold">{t('activityDetail.notFound')}</h1>
          <p className="mt-2 text-muted-foreground">
            {t('activityDetail.removed')}
          </p>
          <Button asChild className="mt-6 min-h-11">
            <Link to="/kegiatan">{t('activityDetail.backToList')}</Link>
          </Button>
        </div>
      </PublicPageShell>
    )
  }

  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const readingMinutes = estimateReadingTimeMinutes(activity.content ?? activity.excerpt ?? '')
  const dateFormatted = activity.activity_date ? formatDate(activity.activity_date, undefined, locale) : null
  const hasBackdrop = Boolean(activity.thumbnail)

  const related: RelatedContentItem[] = (relatedData?.data ?? [])
    .filter((item) => item.uuid !== uuid)
    .slice(0, 3)
    .map((item) => ({
      uuid: item.uuid,
      title: item.title,
      excerpt: item.excerpt,
      thumbnail: item.thumbnail,
      category: item.category,
      dateLabel: item.activity_date ? formatDate(item.activity_date, undefined, locale) : null,
      href: `/kegiatan/detail/${item.uuid}`,
    }))

  const infoCards = [
    dateFormatted && {
      icon: Calendar,
      label: t('activityDetail.dateLabel'),
      value: dateFormatted,
    },
    activity.category && {
      icon: Tag,
      label: t('activityDetail.categoryLabel'),
      value: activity.category,
    },
    readingMinutes > 0 && {
      icon: Clock,
      label: t('activityDetail.readTimeLabel'),
      value: tLayout('article.readingTime', { minutes: readingMinutes }),
    },
    activity.is_featured && {
      icon: Star,
      label: t('activityDetail.featuredLabel'),
      value: t('activityDetail.featuredValue'),
    },
  ].filter(Boolean) as Array<{ icon: typeof Calendar; label: string; value: string }>

  function handleCopyLink() {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <PublicPageShell>
      <PageMeta title={activity.title} description={activity.excerpt ?? undefined} />
      <article className="pb-16">
        {/* --- HERO --- */}
        <header
          className={cn(
            'relative overflow-hidden',
            hasBackdrop ? 'min-h-[40vh] sm:min-h-[50vh]' : 'min-h-[32vh] sm:min-h-[38vh]',
          )}
        >
          {activity.thumbnail ? (
            <img
              src={activity.thumbnail}
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

          <m.div
            className="container-page relative z-10 flex min-h-[inherit] flex-col justify-end py-6 text-white sm:py-10"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Toolbar */}
            <m.div
              className="mb-8 flex flex-wrap items-center justify-between gap-3 sm:mb-10"
              variants={{ hidden: { opacity: 0, y: -12 }, visible: { opacity: 1, y: 0 } }}
              transition={springSnappy}
            >
              <Button
                asChild
                variant="outline"
                size="sm"
                className="article-hero-toolbar-btn min-h-11 border"
              >
                <Link to="/kegiatan">← {t('activityDetail.backLabel')}</Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="article-hero-toolbar-btn min-h-11 gap-2 border"
                aria-label={tLayout('article.shareWa')}
                onClick={() => openWhatsAppShare(t('activityDetail.shareTitle', { title: activity.title }), pageUrl)}
              >
                <Share2 className="h-4 w-4" aria-hidden />
                {tLayout('article.share')}
              </Button>
            </m.div>

            {/* Title & Excerpt */}
            <div className="mx-auto w-full max-w-4xl space-y-4 pb-2">
              <m.h1
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                transition={{ ...springSnappy, delay: 0.1 }}
              >
                {activity.title}
              </m.h1>

              {activity.excerpt && (
                <m.p
                  className="max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl"
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ ...springSnappy, delay: 0.2 }}
                >
                  {activity.excerpt}
                </m.p>
              )}
            </div>
          </m.div>
        </header>

        {/* --- FLOATING INFO CARDS --- */}
        {infoCards.length > 0 && (
          <div className="container-page relative z-20 px-4">
            <m.div
              className="-mt-8 mx-auto flex max-w-4xl flex-wrap gap-3 sm:-mt-10"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
              }}
            >
              {infoCards.map((card) => {
                const Icon = card.icon
                return (
                  <m.div
                    key={card.label}
                    className="flex items-center gap-3 rounded-xl border border-primary/15 bg-card px-4 py-3 shadow-lg shadow-primary/5 backdrop-blur-sm"
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    transition={springSnappy}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        {card.label}
                      </p>
                      <p className="truncate text-sm font-semibold capitalize text-card-foreground">
                        {card.value}
                      </p>
                    </div>
                  </m.div>
                )
              })}
            </m.div>
          </div>
        )}

        {/* --- CONTENT BODY --- */}
        <div className="container-page section-padding pt-8 sm:pt-12">
          <div className="mx-auto max-w-3xl">
            <m.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springSnappy, delay: 0.3 }}
            >
              <Card className="border-primary/10 shadow-lg shadow-primary/5">
                <CardContent className="p-4 sm:p-8 lg:p-10">
                  <BlockRenderer contentJson={activity.content_json} contentHtml={activity.content} />
                </CardContent>
              </Card>
            </m.div>

            {/* --- SHARE SECTION --- */}
            <m.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springSnappy, delay: 0.45 }}
            >
              <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-dashed border-primary/20 bg-secondary/30 px-6 py-6">
                <p className="text-sm font-medium text-muted-foreground">
                  {t('activityDetail.sharePrompt')}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-h-11 gap-2"
                    onClick={() => openWhatsAppShare(t('activityDetail.shareTitle', { title: activity.title }), pageUrl)}
                  >
                    <Share2 className="h-4 w-4" aria-hidden />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-h-11 gap-2"
                    onClick={handleCopyLink}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-primary" aria-hidden />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden />
                    )}
                    {copied ? t('activityDetail.linkCopied') : t('activityDetail.copyLink')}
                  </Button>
                  {'share' in navigator && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-h-11 gap-2"
                      onClick={() =>
                        navigator.share({
                          title: activity.title,
                          text: activity.excerpt ?? activity.title,
                          url: pageUrl,
                        })
                      }
                    >
                      <Share2 className="h-4 w-4" aria-hidden />
                      {t('activityDetail.shareNative')}
                    </Button>
                  )}
                </div>
              </div>
            </m.div>

            {/* --- RELATED ACTIVITIES --- */}
            {related.length > 0 && (
              <m.div
                className="mt-12 space-y-5"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={springSnappy}
              >
                <section aria-labelledby="related-activities-heading">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-1 rounded-full bg-primary" aria-hidden />
                      <h2
                        id="related-activities-heading"
                        className="text-lg font-semibold"
                      >
                        {t('activityDetail.related')}
                      </h2>
                    </div>
                    <Link
                      to="/kegiatan"
                      className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      {t('activityDetail.allActivities')}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>

                  <m.div
                    className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.1 } },
                    }}
                  >
                    {related.map((item) => (
                      <m.div
                        key={item.uuid}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        transition={springSnappy}
                      >
                        <Link to={item.href} className="group block h-full">
                          <Card className="card-hover h-full overflow-hidden border-primary/10 transition-colors hover:border-primary/30">
                            {item.thumbnail && (
                              <div className="relative overflow-hidden">
                                <img
                                  src={item.thumbnail}
                                  alt=""
                                  className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                              </div>
                            )}
                            <CardHeader className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                {item.category && (
                                  <Badge variant="secondary" className="capitalize">
                                    {item.category}
                                  </Badge>
                                )}
                                {item.dateLabel && (
                                  <span className="text-xs text-muted-foreground">{item.dateLabel}</span>
                                )}
                              </div>
                              <CardTitle className="line-clamp-2 text-base leading-snug group-hover:text-primary">
                                {item.title}
                              </CardTitle>
                              {item.excerpt && (
                                <CardDescription className="line-clamp-2">{item.excerpt}</CardDescription>
                              )}
                            </CardHeader>
                          </Card>
                        </Link>
                      </m.div>
                    ))}
                  </m.div>
                </section>
              </m.div>
            )}
          </div>
        </div>
      </article>
    </PublicPageShell>
  )
}
