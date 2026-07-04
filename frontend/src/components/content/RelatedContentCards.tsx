import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export interface RelatedContentItem {
  uuid: string
  title: string
  excerpt?: string | null
  thumbnail?: string | null
  category?: string | null
  dateLabel?: string | null
  href: string
}

interface RelatedContentCardsProps {
  title?: string
  items: RelatedContentItem[]
  viewAllHref?: string
  viewAllLabel?: string
}

export function RelatedContentCards({
  title,
  items,
  viewAllHref,
  viewAllLabel,
}: RelatedContentCardsProps) {
  const { t } = useTranslation('layout')
  const resolvedTitle = title ?? t('article.relatedTitle')
  const resolvedViewAllLabel = viewAllLabel ?? t('article.viewAll')
  if (items.length === 0) return null

  return (
    <section className="mt-10 space-y-4" aria-labelledby="related-content-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="related-content-heading" className="text-lg font-semibold">
          {resolvedTitle}
        </h2>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {resolvedViewAllLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <Link key={item.uuid} to={item.href} className="group block">
            <Card className="card-hover h-full overflow-hidden border-primary/10 transition-colors hover:border-primary/30">
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt=""
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
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
        ))}
      </div>
    </section>
  )
}
