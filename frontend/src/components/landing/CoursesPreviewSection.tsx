import { ArrowRight, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { useCoursesList } from '@/hooks/useCourses'

export function CoursesPreviewSection() {
  const { data, isLoading, isFetching } = useCoursesList({ per_page: 3, featured: true })

  return (
    <section id="kursus" className="section-padding bg-secondary/20">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <h2 className="mb-3 text-3xl font-bold text-primary sm:text-4xl">Kursus Online</h2>
            <p className="max-w-xl text-muted-foreground">Belajar kapan saja dengan materi berkualitas dari pengajar terbaik.</p>
          </div>
          <Button asChild>
            <Link to="/kursus">
              Lihat Semua Kursus
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        ) : (
          <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}>
            {data?.data.map((course) => (
              <Card key={course.id} className="overflow-hidden transition-shadow hover:shadow-md">
                {course.thumbnail && (
                  <img src={course.thumbnail} alt={course.title} className="h-44 w-full object-cover" />
                )}
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {course.level && <Badge variant="secondary">{course.level}</Badge>}
                    {course.category && <Badge variant="outline">{course.category}</Badge>}
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">
                    <Link to={`/kursus/${course.slug}`} className="hover:text-primary">
                      {course.title}
                    </Link>
                  </CardTitle>
                  {course.excerpt && <CardDescription className="line-clamp-2">{course.excerpt}</CardDescription>}
                </CardHeader>
                <CardContent className="flex items-center justify-between pt-0">
                  <span className="font-semibold text-primary">{formatCurrency(course.price)}</span>
                  {course.duration_minutes && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {course.duration_minutes} menit
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
