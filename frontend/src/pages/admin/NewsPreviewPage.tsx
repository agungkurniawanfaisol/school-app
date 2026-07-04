import { Link, useParams } from 'react-router-dom'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { PreviewFrame } from '@/components/editor/PreviewFrame'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import {
  NEWS_DISPLAY_STATUS_LABELS,
  NEWS_DISPLAY_STATUS_VARIANTS,
  type NewsDisplayStatus,
} from '@/lib/newsDisplayStatus'
import { useAdminNewsDetail } from '@/hooks/useNews'

export function NewsPreviewPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const { data: news, isLoading } = useAdminNewsDetail(uuid ?? '')

  if (isLoading || !news) {
    return <div className="p-6 text-muted-foreground">Memuat pratinjau…</div>
  }

  const displayStatus = (news.display_status ?? (news.status === 'published' ? 'live' : 'draft')) as NewsDisplayStatus
  const isDraft = displayStatus === 'draft'
  const scheduleNote =
    displayStatus === 'scheduled'
      ? `Akan tayang mulai ${formatDate(news.published_at)}`
      : displayStatus === 'ended'
        ? `Jadwal tampil berakhir ${formatDate(news.publish_ends_at)}`
        : displayStatus === 'live' && news.publish_ends_at
          ? `Tayang hingga ${formatDate(news.publish_ends_at)}`
          : null

  return (
    <PreviewFrame
      title={news.title}
      isDraft={isDraft}
      toolbar={
        <>
          <Button asChild variant="outline" size="sm">
            <Link to={`/admin/news/${news.uuid}/edit`}>Edit</Link>
          </Button>
          {displayStatus === 'live' && (
            <Button asChild variant="outline" size="sm">
              <Link to={`/berita/detail/${news.uuid}`}>Lihat publik</Link>
            </Button>
          )}
        </>
      }
    >
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge variant={NEWS_DISPLAY_STATUS_VARIANTS[displayStatus]}>
          {NEWS_DISPLAY_STATUS_LABELS[displayStatus]}
        </Badge>
        {news.category && <Badge variant="secondary">{news.category}</Badge>}
        {news.published_at && (
          <span className="text-sm text-muted-foreground">{formatDate(news.published_at)}</span>
        )}
      </div>
      {scheduleNote && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          {scheduleNote}
        </p>
      )}
      {news.thumbnail && (
        <img src={news.thumbnail} alt={news.title} className="mb-6 aspect-video w-full rounded-xl object-cover" />
      )}
      {news.excerpt && <p className="mb-6 text-lg text-muted-foreground">{news.excerpt}</p>}
      <BlockRenderer contentJson={news.content_json} contentHtml={news.content} />
    </PreviewFrame>
  )
}
