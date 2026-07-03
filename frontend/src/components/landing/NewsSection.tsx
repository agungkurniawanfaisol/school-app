import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'
import { useNewsList } from '@/hooks/useNews'

export function NewsSection() {
  const { data, isLoading, isFetching } = useNewsList({ per_page: 3, featured: true })

  return (
    <section id="berita" className="section-padding bg-secondary/20">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <h2 className="mb-3 text-3xl font-bold text-primary sm:text-4xl">Berita & Artikel</h2>
            <p className="max-w-xl text-muted-foreground">Informasi terbaru seputar kegiatan dan prestasi sekolah.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/#berita">
              Lihat Semua
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
            {data?.data.map((item) => (
              <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-md">
                {item.thumbnail && (
                  <img src={item.thumbnail} alt={item.title} className="h-44 w-full object-cover" />
                )}
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    {item.category && <Badge variant="outline">{item.category}</Badge>}
                    {item.published_at && (
                      <span className="text-xs text-muted-foreground">{formatDate(item.published_at)}</span>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">{item.title}</CardTitle>
                  {item.excerpt && <CardDescription className="line-clamp-2">{item.excerpt}</CardDescription>}
                </CardHeader>
                {item.author && (
                  <CardContent className="pt-0 text-xs text-muted-foreground">Oleh {item.author.name}</CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
