import { Link, useParams } from 'react-router-dom'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useActivityDetailByUuid } from '@/hooks/useActivities'
import { formatDate } from '@/lib/utils'

export function ActivityDetailPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const { data: activity, isLoading, isError } = useActivityDetailByUuid(uuid ?? '')

  if (isLoading) {
    return (
      <div className="container-page section-padding">
        <Skeleton className="mb-4 h-10 w-2/3" />
        <Skeleton className="mb-8 h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (isError || !activity) {
    return (
      <div className="container-page section-padding text-center">
        <p className="text-muted-foreground">Kegiatan tidak ditemukan.</p>
        <Button asChild className="mt-4">
          <Link to="/">Kembali ke beranda</Link>
        </Button>
      </div>
    )
  }

  return (
    <article className="container-page section-padding">
      <div className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/#kegiatan">← Kembali</Link>
        </Button>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {activity.category && <Badge variant="secondary">{activity.category}</Badge>}
          {activity.activity_date && (
            <span className="text-sm text-muted-foreground">{formatDate(activity.activity_date)}</span>
          )}
        </div>
        <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">{activity.title}</h1>
        {activity.thumbnail && (
          <img src={activity.thumbnail} alt={activity.title} className="mb-8 aspect-video w-full rounded-xl object-cover" />
        )}
        {activity.excerpt && <p className="mb-8 text-lg text-muted-foreground">{activity.excerpt}</p>}
        <BlockRenderer contentJson={activity.content_json} contentHtml={activity.content} />
      </div>
    </article>
  )
}
