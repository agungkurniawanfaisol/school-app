import { Link, useParams } from 'react-router-dom'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { ArticleDetailLayout, ArticleDetailSkeleton } from '@/components/content/ArticleDetailLayout'
import { RelatedContentCards } from '@/components/content/RelatedContentCards'
import { PublicPageShell } from '@/components/layout/PublicPageShell'
import { PageMeta } from '@/components/seo/PageMeta'
import { Button } from '@/components/ui/button'
import { useNewsDetailByUuid, useNewsList } from '@/hooks/useNews'
import { formatDate } from '@/lib/utils'

export function NewsDetailPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const { data: news, isLoading, isError } = useNewsDetailByUuid(uuid ?? '')
  const { data: relatedData } = useNewsList({
    per_page: 4,
    category: news?.category ?? undefined,
  })

  if (isLoading) {
    return (
      <PublicPageShell>
        <ArticleDetailSkeleton />
      </PublicPageShell>
    )
  }

  if (isError || !news) {
    return (
      <PublicPageShell>
        <div className="container-page section-padding text-center">
          <h1 className="text-2xl font-bold">Berita tidak ditemukan</h1>
          <p className="mt-2 text-muted-foreground">
            Artikel mungkin sudah dihapus atau tautan tidak valid.
          </p>
          <Button asChild className="mt-6 min-h-11">
            <Link to="/berita">Kembali ke daftar berita</Link>
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
      dateLabel: item.published_at ? formatDate(item.published_at) : null,
      href: `/berita/detail/${item.uuid}`,
    }))

  return (
    <PublicPageShell>
      <PageMeta title={news.title} description={news.excerpt ?? undefined} />
      <ArticleDetailLayout
        backHref="/berita"
        backLabel="Berita"
        title={news.title}
        excerpt={news.excerpt}
        thumbnail={news.thumbnail}
        category={news.category}
        authorName={news.author?.name}
        dateLabel={news.published_at ? formatDate(news.published_at) : null}
        readingSource={news.content ?? news.excerpt}
        shareTitle={news.title}
        footer={
          <RelatedContentCards
            items={related}
            viewAllHref="/berita"
            viewAllLabel="Semua berita"
          />
        }
      >
        <BlockRenderer contentJson={news.content_json} contentHtml={news.content} />
      </ArticleDetailLayout>
    </PublicPageShell>
  )
}
