import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { useCoursesList } from '@/hooks/useCourses'

export function CourseCatalogPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading, isFetching } = useCoursesList({ page, per_page: 12, search })

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="container-page flex-1 section-padding">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-primary">Katalog Kursus</h1>
          <p className="text-muted-foreground">Temukan kursus online untuk mendukung pembelajaran Anda.</p>
        </div>

        <Input
          placeholder="Cari kursus..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="mb-8 max-w-md"
        />

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
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
                  <div className="flex flex-wrap gap-2">
                    {course.level && <Badge variant="secondary">{course.level}</Badge>}
                    {course.category && <Badge variant="outline">{course.category}</Badge>}
                  </div>
                  <CardTitle className="text-lg">
                    <Link to={`/kursus/${course.slug}`} className="hover:text-primary">
                      {course.title}
                    </Link>
                  </CardTitle>
                  {course.excerpt && <CardDescription className="line-clamp-2">{course.excerpt}</CardDescription>}
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <span className="font-semibold text-primary">{formatCurrency(course.price)}</span>
                  {course.duration_minutes && (
                    <span className="text-xs text-muted-foreground">{course.duration_minutes} menit</span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {data?.meta && data.meta.last_page > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              Halaman {page} dari {data.meta.last_page}
            </span>
            <button
              type="button"
              disabled={page >= data.meta.last_page}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
