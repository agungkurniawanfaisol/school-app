import { Link, useParams } from 'react-router-dom'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { PreviewFrame } from '@/components/editor/PreviewFrame'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { useAdminActivityDetail } from '@/hooks/useActivities'

export function ActivityPreviewPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const { data: activity, isLoading } = useAdminActivityDetail(uuid ?? '')

  if (isLoading || !activity) {
    return <div className="p-6 text-muted-foreground">Memuat pratinjau…</div>
  }

  const isDraft = activity.status !== 'published'

  return (
    <PreviewFrame
      title={activity.title}
      isDraft={isDraft}
      toolbar={
        <>
          <Button asChild variant="outline" size="sm">
            <Link to={`/admin/student-activities/${activity.uuid}/edit`}>Edit</Link>
          </Button>
          {!isDraft && (
            <Button asChild variant="outline" size="sm">
              <Link to={`/kegiatan/detail/${activity.uuid}`}>Lihat publik</Link>
            </Button>
          )}
        </>
      }
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {activity.category && <Badge variant="secondary">{activity.category}</Badge>}
        {activity.activity_date && (
          <span className="text-sm text-muted-foreground">{formatDate(activity.activity_date)}</span>
        )}
      </div>
      {activity.thumbnail && (
        <img src={activity.thumbnail} alt={activity.title} className="mb-6 aspect-video w-full rounded-xl object-cover" />
      )}
      {activity.excerpt && <p className="mb-6 text-lg text-muted-foreground">{activity.excerpt}</p>}
      <BlockRenderer contentJson={activity.content_json} contentHtml={activity.content} />
    </PreviewFrame>
  )
}
