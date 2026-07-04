import { ArrowLeft, Tag } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurriculumDetail } from '@/hooks/useCurriculums'
import { cn } from '@/lib/utils'
import type { EditorDocument } from '@/schemas/editor'

function DetailSkeleton() {
  return (
    <div className="container-page section-padding">
      <Skeleton className="mb-6 h-8 w-48" />
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-4/3 w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  )
}

export function CurriculumPublicDetailPage() {
  const { t } = useTranslation('pages')
  const { slug } = useParams<{ slug: string }>()
  const { data: program, isLoading, isError } = useCurriculumDetail(slug ?? '')

  if (isLoading) {
    return (
      <PublicPageShell>
        <DetailSkeleton />
      </PublicPageShell>
    )
  }

  if (isError || !program) {
    return (
      <PublicPageShell>
        <div className="container-page section-padding text-center">
          <p className="text-muted-foreground">{t('programDetail.notFound')}</p>
          <Button asChild className="mt-4 min-h-11">
            <Link to="/program-unggulan">{t('programDetail.backToList')}</Link>
          </Button>
        </div>
      </PublicPageShell>
    )
  }

  const hasRichContent = Boolean(program.content_json)
  const hasPlainContent = Boolean(program.content?.trim())
  const hasContent = hasRichContent || hasPlainContent

  return (
    <PublicPageShell>
      <PageMeta
        title={program.title}
        description={program.excerpt ?? t('programDetail.metaDesc', { name: program.title })}
      />

      <div className="container-page section-padding">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-6 min-h-11 gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link to="/program-unggulan">
            <ArrowLeft className="h-4 w-4" />
            {t('programDetail.backLabel')}
          </Link>
        </Button>

        <div className={cn('grid gap-8', program.thumbnail && 'lg:grid-cols-5')}>
          {program.thumbnail && (
            <div className="lg:col-span-2">
              <img
                src={program.thumbnail}
                alt={program.title}
                className="w-full rounded-xl object-cover shadow-md lg:sticky lg:top-24"
              />
            </div>
          )}

          <div className={cn(program.thumbnail ? 'lg:col-span-3' : 'max-w-3xl')}>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {program.category && (
                <Badge variant="secondary" className="gap-1 capitalize">
                  <Tag className="h-3 w-3" />
                  {program.category}
                </Badge>
              )}
              {program.is_featured && (
                <Badge>{t('programDetail.badge')}</Badge>
              )}
            </div>

            <h1 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {program.title}
            </h1>

            {program.excerpt && (
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                {program.excerpt}
              </p>
            )}

            {hasContent && (
              <Card className="border-primary/10">
                <CardContent className="p-4 sm:p-6">
                  {hasRichContent ? (
                    <BlockRenderer document={program.content_json as EditorDocument} />
                  ) : (
                    <div className="prose prose-neutral max-w-none whitespace-pre-line dark:prose-invert">
                      {program.content}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PublicPageShell>
  )
}
