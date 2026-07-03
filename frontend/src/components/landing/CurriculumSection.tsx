import { BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurriculumsList } from '@/hooks/useCurriculums'

export function CurriculumSection() {
  const { data, isLoading, isFetching } = useCurriculumsList({ per_page: 6, featured: true })

  return (
    <section id="kurikulum" className="section-padding bg-secondary/20">
      <div className="container-page">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-primary sm:text-4xl">Kurikulum</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Program pembelajaran terintegrasi yang mengembangkan potensi akademik dan karakter Islami.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : (
          <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}>
            {data?.data.map((item) => (
              <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-md">
                {item.thumbnail && (
                  <img src={item.thumbnail} alt={item.title} className="h-40 w-full object-cover" />
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {item.title}
                    </CardTitle>
                    {item.category && <Badge variant="secondary">{item.category}</Badge>}
                  </div>
                  {item.excerpt && <CardDescription>{item.excerpt}</CardDescription>}
                </CardHeader>
                {item.content && (
                  <CardContent>
                    <p className="line-clamp-3 text-sm text-muted-foreground">{item.content}</p>
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
