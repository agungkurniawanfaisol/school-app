import { Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import { useActivitiesList } from '@/hooks/useActivities'

export function ActivitiesSection() {
  const { data, isLoading, isFetching } = useActivitiesList({ per_page: 6, featured: true })

  return (
    <section id="kegiatan" className="section-padding bg-secondary/20">
      <div className="container-page">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-primary sm:text-4xl">Kegiatan Siswa</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Berbagai aktivitas yang mengembangkan bakat, kreativitas, dan kepemimpinan siswa.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full" />
            ))}
          </div>
        ) : (
          <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}>
            {data?.data.map((activity) => (
              <Card key={activity.id} className="overflow-hidden transition-shadow hover:shadow-md">
                {activity.thumbnail && (
                  <img src={activity.thumbnail} alt={activity.title} className="h-44 w-full object-cover" />
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                    {activity.category && <Badge variant="outline">{activity.category}</Badge>}
                  </div>
                  {activity.excerpt && <CardDescription>{activity.excerpt}</CardDescription>}
                </CardHeader>
                {activity.activity_date && (
                  <CardContent className="flex items-center gap-2 pt-0 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDate(activity.activity_date)}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
