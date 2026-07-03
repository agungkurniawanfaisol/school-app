import { Link, useParams } from 'react-router-dom'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { PreviewFrame } from '@/components/editor/PreviewFrame'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { useAdminNewsDetail } from '@/hooks/useNews'

export function NewsPreviewPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const { data: news, isLoading } = useAdminNewsDetail(uuid ?? '')

  if (isLoading || !news) {
    return <div className="p-6 text-muted-foreground">Memuat pratinjau…</div>
  }

  const isDraft = news.status !== 'published'

  return (
    <PreviewFrame
      title={news.title}
      isDraft={isDraft}
      toolbar={
        <>
          <Button asChild variant="outline" size="sm">
            <Link to={`/admin/news/${news.uuid}/edit`}>Edit</Link>
          </Button>
          {!isDraft && (
            <Button asChild variant="outline" size="sm">
              <Link to={`/berita/detail/${news.uuid}`}>Lihat publik</Link>
            </Button>
          )}
        </>
      }
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {news.category && <Badge variant="secondary">{news.category}</Badge>}
        {news.published_at && (
          <span className="text-sm text-muted-foreground">{formatDate(news.published_at)}</span>
        )}
      </div>
      {news.thumbnail && (
        <img src={news.thumbnail} alt={news.title} className="mb-6 aspect-video w-full rounded-xl object-cover" />
      )}
      {news.excerpt && <p className="mb-6 text-lg text-muted-foreground">{news.excerpt}</p>}
      <BlockRenderer contentJson={news.content_json} contentHtml={news.content} />
    </PreviewFrame>
  )
}
