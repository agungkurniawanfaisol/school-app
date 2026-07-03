import { Link, useParams } from 'react-router-dom'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useNewsDetailByUuid } from '@/hooks/useNews'
import { formatDate } from '@/lib/utils'

export function NewsDetailPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const { data: news, isLoading, isError } = useNewsDetailByUuid(uuid ?? '')

  if (isLoading) {
    return (
      <div className="container-page section-padding">
        <Skeleton className="mb-4 h-10 w-2/3" />
        <Skeleton className="mb-8 h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (isError || !news) {
    return (
      <div className="container-page section-padding text-center">
        <p className="text-muted-foreground">Berita tidak ditemukan.</p>
        <Button asChild className="mt-4">
          <Link to="/">Kembali ke beranda</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <PageMeta title={news.title} description={news.excerpt ?? undefined} />
      <article className="container-page section-padding">
      <div className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/#berita">← Kembali</Link>
        </Button>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {news.category && <Badge variant="secondary">{news.category}</Badge>}
          {news.published_at && <span className="text-sm text-muted-foreground">{formatDate(news.published_at)}</span>}
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">{news.title}</h1>
        {news.author && <p className="mb-6 text-sm text-muted-foreground">Oleh {news.author.name}</p>}
        {news.thumbnail && (
          <img src={news.thumbnail} alt={news.title} className="mb-8 aspect-video w-full rounded-xl object-cover" />
        )}
        {news.excerpt && <p className="mb-8 text-lg text-muted-foreground">{news.excerpt}</p>}
        <BlockRenderer contentJson={news.content_json} contentHtml={news.content} />
      </div>
    </article>
    </>
  )
}
