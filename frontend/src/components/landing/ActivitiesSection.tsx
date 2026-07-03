import { Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RevealOnScroll } from '@/components/landing/RevealOnScroll'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { formatDate } from '@/lib/utils'
import { useActivitiesList } from '@/hooks/useActivities'
import type { StudentActivity } from '@/types'
import { cn } from '@/lib/utils'

function ActivityCard({ activity, featured = false }: { activity: StudentActivity; featured?: boolean }) {
  return (
    <Link to={`/kegiatan/detail/${activity.uuid}`}>
    <Card
      className={cn(
        'card-hover overflow-hidden border-primary/10',
        featured && 'lg:row-span-2',
      )}
    >
      {activity.thumbnail && (
        <img
          src={activity.thumbnail}
          alt={activity.title}
          className={cn('w-full object-cover', featured ? 'aspect-[4/3] lg:aspect-auto lg:h-64' : 'aspect-video')}
          loading="lazy"
        />
      )}
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className={cn('leading-snug', featured ? 'text-xl' : 'text-lg')}>
            {activity.title}
          </CardTitle>
          {activity.activity_date && (
            <Badge className="shrink-0 border-0 bg-accent text-accent-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              {formatDate(activity.activity_date)}
            </Badge>
          )}
        </div>
        {activity.category && (
          <Badge variant="outline" className="w-fit capitalize">
            {activity.category}
          </Badge>
        )}
        {activity.excerpt && <CardDescription className="line-clamp-2">{activity.excerpt}</CardDescription>}
      </CardHeader>
      {featured && activity.content && (
        <CardContent className="pt-0">
          <p className="line-clamp-3 text-sm text-muted-foreground">{activity.content}</p>
        </CardContent>
      )}
    </Card>
    </Link>
  )
}

export function ActivitiesSection() {
  const { data, isLoading, isFetching } = useActivitiesList({ per_page: 6, featured: true })
  const activities = data?.data ?? []
  const featured = activities[0]
  const rest = activities.slice(1)

  return (
    <section id="kegiatan" className="section-padding bg-secondary/30">
      <div className="container-page">
        <SectionHeader
          badge="Kegiatan"
          title="Kegiatan Siswa"
          description="Berbagai aktivitas yang mengembangkan bakat, kreativitas, dan kepemimpinan siswa."
        />

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-80 w-full rounded-xl" />
            <div className="grid gap-6 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ) : activities.length === 0 ? (
          <p className="text-center text-muted-foreground">Belum ada data kegiatan.</p>
        ) : (
          <RevealOnScroll direction="up">
            <div className={`grid gap-6 lg:grid-cols-2 ${isFetching ? 'opacity-70' : ''}`}>
              {featured && <ActivityCard activity={featured} featured />}
              <div className="grid gap-6 sm:grid-cols-2">
                {rest.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  )
}
