import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { StaggerChildren, StaggerItem } from '@/components/motion'
import { FeaturedProgramCard } from '@/components/landing/FeaturedProgramCard'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { useCurriculumsList } from '@/hooks/useCurriculums'
import { cn } from '@/lib/utils'

export const LANDING_PROGRAM_LIMIT = 6

export function FeaturedProgramsSection() {
  const { data, isLoading, isFetching } = useCurriculumsList({
    per_page: LANDING_PROGRAM_LIMIT,
    featured: true,
  })
  const items = data?.data ?? []
  const hasMore = (data?.meta?.total ?? 0) > items.length

  return (
    <section id="program-unggulan" className="section-padding bg-secondary/30 pattern-bg">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            badge="Program Unggulan"
            title="Program Pembelajaran Unggulan"
            description="Program terintegrasi yang mengembangkan potensi akademik dan karakter Islami siswa."
            align="left"
            className="mb-0"
          />
          {hasMore && !isLoading && (
            <Button asChild className="min-h-11 shrink-0 shadow-md shadow-primary/20">
              <Link to="/program-unggulan">
                Lihat Selengkapnya
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl md:aspect-video" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">Belum ada program unggulan.</p>
        ) : (
          <>
            <StaggerChildren
              className={cn(
                'hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3',
                isFetching && 'opacity-70',
              )}
            >
              {items.map((item) => (
                <StaggerItem key={item.id}>
                  <FeaturedProgramCard item={item} />
                </StaggerItem>
              ))}
            </StaggerChildren>

            <div className={cn('md:hidden', isFetching && 'opacity-70')}>
              <Carousel opts={{ align: 'start', loop: false, dragFree: true }} className="w-full">
                <CarouselContent className="-ml-4">
                  {items.map((item) => (
                    <CarouselItem key={item.id} className="basis-[88%] pl-4 sm:basis-[72%]">
                      <FeaturedProgramCard item={item} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {items.length > 1 && <CarouselDots count={items.length} className="mt-4" />}
              </Carousel>
              {items.length > 1 && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Geser untuk melihat program lainnya
                </p>
              )}
            </div>

            {hasMore && (
              <div className="mt-8 text-center md:hidden">
                <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
                  <Link to="/program-unggulan">
                    Lihat Semua Program
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

/** @deprecated Use FeaturedProgramsSection */
export const CurriculumSection = FeaturedProgramsSection
