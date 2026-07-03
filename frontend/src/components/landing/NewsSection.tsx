import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StaggerChildren, StaggerItem } from '@/components/motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { formatDate } from '@/lib/utils'
import { useNewsList } from '@/hooks/useNews'

export function NewsSection() {
  const { data, isLoading, isFetching } = useNewsList({ per_page: 3, featured: true })
  const items = data?.data ?? []

  return (
    <section id="berita" className="landing-section section-padding bg-secondary/30">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            badge="Berita"
            title="Berita & Artikel"
            description="Informasi terbaru seputar kegiatan dan prestasi sekolah."
            align="left"
            className="mb-0 md:mb-0"
          />
          <Button asChild variant="outline" className="shrink-0 border-primary text-primary hover:bg-secondary">
            <Link to="/#berita">
              Semua Berita
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">Belum ada berita.</p>
        ) : (
          <StaggerChildren className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}>
            {items.map((item) => (
              <StaggerItem key={item.id}>
                <Link to={`/berita/detail/${item.uuid}`}>
                <Card className="card-hover h-full overflow-hidden border-primary/10 transition-colors hover:border-primary/30">
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                )}
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {item.category && (
                      <Badge variant="secondary" className="capitalize">
                        {item.category}
                      </Badge>
                    )}
                    {item.published_at && (
                      <span className="text-xs text-muted-foreground">{formatDate(item.published_at)}</span>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 text-lg leading-snug">{item.title}</CardTitle>
                  {item.excerpt && (
                    <CardDescription className="line-clamp-2">{item.excerpt}</CardDescription>
                  )}
                </CardHeader>
                {item.author && (
                  <CardContent className="pt-0 text-xs text-muted-foreground">
                    Oleh {item.author.name}
                  </CardContent>
                )}
              </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        )}
      </div>
    </section>
  )
}
