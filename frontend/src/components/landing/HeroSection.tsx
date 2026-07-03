import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { queryConfig } from '@/hooks/queryConfig'
import { useSchool } from '@/hooks/useSchool'
import type { HeroSlider, PaginatedResponse } from '@/types'

export function HeroSection() {
  const { data: school, isLoading: schoolLoading } = useSchool()
  const { data: sliders, isLoading: slidersLoading } = useQuery({
    queryKey: ['hero-sliders'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<HeroSlider>>('/v1/hero-sliders', {
        params: { per_page: 10 },
      })
      return data.data
    },
    ...queryConfig,
  })

  const isLoading = schoolLoading || slidersLoading
  const slides = sliders?.length ? sliders : [
    {
      id: 0,
      title: school?.name ?? 'Nurul Hikmah School',
      subtitle: school?.tagline ?? 'Sekolah Islam Terpadu',
      image: null,
      cta_text: 'Daftar Sekarang',
      cta_url: '/pmb/daftar',
    } as HeroSlider,
  ]

  if (isLoading) {
    return (
      <section className="relative">
        <Skeleton className="h-[60vh] min-h-[400px] w-full rounded-none" />
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden bg-primary/5">
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative flex min-h-[60vh] items-center">
                {slide.image && (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40" />
                <div className="container-page relative z-10 py-16 text-primary-foreground">
                  <p className="mb-2 text-sm font-medium uppercase tracking-wider opacity-90">Selamat Datang</p>
                  <h1 className="mb-4 max-w-2xl text-3xl font-bold sm:text-4xl lg:text-5xl">{slide.title}</h1>
                  {slide.subtitle && (
                    <p className="mb-8 max-w-xl text-lg opacity-90 sm:text-xl">{slide.subtitle}</p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    {slide.cta_url && (
                      <Button asChild size="lg" variant="secondary">
                        <Link to={slide.cta_url.startsWith('/') ? slide.cta_url : `/${slide.cta_url}`}>
                          {slide.cta_text ?? 'Selengkapnya'}
                        </Link>
                      </Button>
                    )}
                    <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                      <a href="#tentang">Pelajari Lebih Lanjut</a>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {slides.length > 1 && (
          <>
            <CarouselPrevious className="left-4 border-primary-foreground/30 text-primary-foreground" />
            <CarouselNext className="right-4 border-primary-foreground/30 text-primary-foreground" />
          </>
        )}
      </Carousel>
    </section>
  )
}
