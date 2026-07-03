import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { StaggerChildren, StaggerItem } from '@/components/motion'
import { FacilityCard } from '@/components/landing/FacilityCard'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { useFacilitiesList } from '@/hooks/useFacilities'
import { cn } from '@/lib/utils'

export const LANDING_FACILITY_LIMIT = 6

export function FacilitiesSection() {
  const { data, isLoading, isFetching } = useFacilitiesList({
    per_page: LANDING_FACILITY_LIMIT,
    featured: true,
  })
  const facilities = data?.data ?? []
  const hasMore = (data?.meta?.total ?? 0) > facilities.length

  return (
    <section id="fasilitas" className="section-padding pattern-bg">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            badge="Sarana Prasarana"
            title="Fasilitas Sekolah"
            description="Sarana dan prasarana modern untuk mendukung proses belajar mengajar yang optimal."
            align="left"
            className="mb-0"
          />
          {hasMore && !isLoading && (
            <Button asChild className="min-h-11 shrink-0 shadow-md shadow-primary/20">
              <Link to="/fasilitas">
                Lihat Selengkapnya
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
            ))}
          </div>
        ) : facilities.length === 0 ? (
          <p className="text-center text-muted-foreground">Belum ada data fasilitas.</p>
        ) : (
          <>
            <StaggerChildren
              className={cn(
                'hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3',
                isFetching && 'opacity-70',
              )}
            >
              {facilities.map((facility) => (
                <StaggerItem key={facility.id}>
                  <FacilityCard facility={facility} />
                </StaggerItem>
              ))}
            </StaggerChildren>

            <div className={cn('md:hidden', isFetching && 'opacity-70')}>
              <Carousel opts={{ align: 'start', loop: false, dragFree: true }} className="w-full">
                <CarouselContent className="-ml-4">
                  {facilities.map((facility) => (
                    <CarouselItem key={facility.id} className="basis-[88%] pl-4 sm:basis-[72%]">
                      <FacilityCard facility={facility} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {facilities.length > 1 && <CarouselDots count={facilities.length} className="mt-4" />}
              </Carousel>
              {facilities.length > 1 && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Geser untuk melihat fasilitas lainnya
                </p>
              )}
            </div>

            {hasMore && (
              <div className="mt-8 text-center md:hidden">
                <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto">
                  <Link to="/fasilitas">
                    Lihat Semua Fasilitas
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
