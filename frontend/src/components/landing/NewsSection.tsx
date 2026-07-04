import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { StaggerChildren, StaggerItem } from '@/components/motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/components/i18n/LanguageProvider'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { formatDate } from '@/lib/utils'
import { useNewsList } from '@/hooks/useNews'
import { cn } from '@/lib/utils'

import type { News } from '@/types'

function NewsCard({ item }: { item: News }) {
  const { t } = useTranslation('landing')
  const { locale } = useLanguage()
  return (
    <Link
      to={`/berita/detail/${item.uuid}`}
      className="block h-full touch-manipulation rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <Card className="card-hover h-full overflow-hidden border-primary/10 transition-colors hover:border-primary/30">
        {item.thumbnail && (
          <img
            src={item.thumbnail}
            alt=""
            className="aspect-video w-full object-cover"
            loading="lazy"
          />
        )}
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            {item.category && (
              <Badge variant="secondary" className="capitalize">
                {item.category}
              </Badge>
            )}
            {item.published_at && (
              <span className="text-xs text-muted-foreground">{formatDate(item.published_at, undefined, locale)}</span>
            )}
          </div>
          <CardTitle className="line-clamp-2 text-lg leading-snug">{item.title}</CardTitle>
          {item.excerpt && <CardDescription className="line-clamp-2">{item.excerpt}</CardDescription>}
        </CardHeader>
        {item.author && (
          <CardContent className="pt-0 text-xs text-muted-foreground">{t('news.by')} {item.author.name}</CardContent>
        )}
      </Card>
    </Link>
  )
}

export function NewsSection() {
  const { t } = useTranslation('landing')
  const { data, isLoading, isFetching } = useNewsList({ per_page: 3, featured: true })
  const items = data?.data ?? []
  const hasMore = (data?.meta?.total ?? 0) > items.length

  return (
    <section id="berita" className="landing-section section-padding bg-secondary/30">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            badge={t('news.badge')}
            title={t('news.title')}
            description={t('news.desc')}
            align="left"
            className="mb-0 md:mb-0"
          />
          <Button
            asChild
            variant="outline"
            className="min-h-11 shrink-0 border-primary text-primary hover:bg-secondary"
          >
            <Link to="/berita">
              {t('news.viewAll')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">{t('news.empty')}</p>
        ) : (
          <>
            <StaggerChildren
              className={cn(
                'hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3',
                isFetching && 'opacity-70',
              )}
            >
              {items.map((item) => (
                <StaggerItem key={item.id}>
                  <NewsCard item={item} />
                </StaggerItem>
              ))}
            </StaggerChildren>

            <div className={cn('md:hidden', isFetching && 'opacity-70')}>
              <Carousel opts={{ align: 'start', loop: false, dragFree: true }} className="w-full">
                <CarouselContent className="-ml-4">
                  {items.map((item) => (
                    <CarouselItem key={item.id} className="basis-[88%] pl-4 sm:basis-[72%]">
                      <NewsCard item={item} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {items.length > 1 && <CarouselDots count={items.length} className="mt-4" />}
              </Carousel>
              {items.length > 1 && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {t('news.swipe')}
                </p>
              )}
            </div>

            {hasMore && (
              <div className="mt-8 text-center md:hidden">
                <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
                  <Link to="/berita">
                    {t('news.viewAllMobile')}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
