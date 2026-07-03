import { BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { RevealOnScroll } from '@/components/landing/RevealOnScroll'
import { useCurriculumsList } from '@/hooks/useCurriculums'
import type { Curriculum } from '@/types'

function CurriculumCard({ item }: { item: Curriculum }) {
  return (
    <Card className="card-hover h-full overflow-hidden border-primary/10">
      {item.thumbnail ? (
        <img src={item.thumbnail} alt={item.title} className="aspect-video w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex aspect-video items-center justify-center bg-secondary/60">
          <BookOpen className="h-10 w-10 text-primary/40" />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-snug">{item.title}</CardTitle>
          {item.category && (
            <Badge variant="secondary" className="shrink-0 capitalize">
              {item.category}
            </Badge>
          )}
        </div>
        {item.excerpt && <CardDescription className="line-clamp-2">{item.excerpt}</CardDescription>}
      </CardHeader>
      {item.content && (
        <CardContent className="pt-0">
          <p className="line-clamp-2 text-sm text-muted-foreground">{item.content}</p>
        </CardContent>
      )}
    </Card>
  )
}

export function CurriculumSection() {
  const { data, isLoading, isFetching } = useCurriculumsList({ per_page: 6, featured: true })
  const items = data?.data ?? []

  return (
    <section id="kurikulum" className="section-padding bg-secondary/30 pattern-bg">
      <div className="container-page">
        <SectionHeader
          badge="Program Unggulan"
          title="Kurikulum Terpadu"
          description="Program pembelajaran terintegrasi yang mengembangkan potensi akademik dan karakter Islami."
        />

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">Belum ada data kurikulum.</p>
        ) : (
          <>
            <div className={`hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}>
              {items.map((item, i) => (
                <RevealOnScroll key={item.id} delay={i * 80}>
                  <CurriculumCard item={item} />
                </RevealOnScroll>
              ))}
            </div>

            <div className={`md:hidden ${isFetching ? 'opacity-70' : ''}`}>
              <Carousel opts={{ align: 'start', loop: false }} className="w-full">
                <CarouselContent className="-ml-4">
                  {items.map((item) => (
                    <CarouselItem key={item.id} className="basis-[85%] pl-4 sm:basis-[70%]">
                      <CurriculumCard item={item} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
