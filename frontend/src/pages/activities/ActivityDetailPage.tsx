import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { ArticleDetailLayout, ArticleDetailSkeleton } from '@/components/content/ArticleDetailLayout'
import { RelatedContentCards } from '@/components/content/RelatedContentCards'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { PageMeta } from '@/components/seo/PageMeta'
import { Button } from '@/components/ui/button'
import { useActivitiesList, useActivityDetailByUuid } from '@/hooks/useActivities'
import { formatDate } from '@/lib/utils'

export function ActivityDetailPage() {
  const { t } = useTranslation('pages')
  const { uuid } = useParams<{ uuid: string }>()
  const { data: activity, isLoading, isError } = useActivityDetailByUuid(uuid ?? '')
  const { data: relatedData } = useActivitiesList({
    per_page: 4,
    category: activity?.category ?? undefined,
  })

  if (isLoading) {
    return (
      <PublicPageShell>
        <ArticleDetailSkeleton />
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

  const related = (relatedData?.data ?? [])
    .filter((item) => item.uuid !== uuid)
    .slice(0, 3)
    .map((item) => ({
      uuid: item.uuid,
      title: item.title,
      excerpt: item.excerpt,
      thumbnail: item.thumbnail,
      category: item.category,
      dateLabel: item.activity_date ? formatDate(item.activity_date) : null,
      href: `/kegiatan/detail/${item.uuid}`,
    }))

  return (
    <PublicPageShell>
      <PageMeta title={activity.title} description={activity.excerpt ?? undefined} />
      <ArticleDetailLayout
        backHref="/kegiatan"
        backLabel={t('activityDetail.backLabel')}
        title={activity.title}
        excerpt={activity.excerpt}
        thumbnail={activity.thumbnail}
        category={activity.category}
        dateLabel={activity.activity_date ? formatDate(activity.activity_date) : null}
        readingSource={activity.content ?? activity.excerpt}
        shareTitle={t('activityDetail.shareTitle', { title: activity.title })}
        footer={
          <RelatedContentCards
            title={t('activityDetail.related')}
            items={related}
            viewAllHref="/kegiatan"
            viewAllLabel={t('activityDetail.allActivities')}
          />
        }
      >
        <BlockRenderer contentJson={activity.content_json} contentHtml={activity.content} />
      </ArticleDetailLayout>
    </PublicPageShell>
  )
}
