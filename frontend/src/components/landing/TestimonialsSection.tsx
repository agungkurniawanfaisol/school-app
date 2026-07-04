import { Quote, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { RevealOnScroll } from '@/components/landing/RevealOnScroll'
import { useTestimonialsList } from '@/hooks/useTestimonials'
import type { Testimonial } from '@/types'

function GoldStars({ rating }: { rating: number }) {
  const { t } = useTranslation('landing')
  return (
    <div className="flex gap-0.5" aria-label={t('testimonials.ratingAria', { rating })}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-[var(--gold-accent)] text-[var(--gold-accent)]' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  )
}

function TestimonialSlide({ item }: { item: Testimonial }) {
  return (
    <Card className="card-hover h-full border-primary/10 bg-card/90 shadow-lg shadow-primary/5 backdrop-blur-sm">
      <CardContent className="flex h-full flex-col p-6 md:p-8">
        <Quote className="mb-4 h-8 w-8 text-primary/15" aria-hidden />
        {item.rating != null && item.rating > 0 && (
          <div className="mb-4">
            <GoldStars rating={item.rating} />
          </div>
        )}
        <blockquote className="flex-1 text-base leading-relaxed text-muted-foreground md:text-lg">
          &ldquo;{item.content}&rdquo;
        </blockquote>
        <div className="mt-6 flex items-center gap-4 border-t border-border pt-6">
          {item.photo ? (
            <img
              src={item.photo}
              alt={item.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
              {item.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-semibold text-foreground">{item.name}</p>
            {item.role && <p className="text-sm text-muted-foreground">{item.role}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TestimonialsSection() {
  const { t } = useTranslation('landing')
  const { data, isLoading, isFetching } = useTestimonialsList({ per_page: 6, featured: true })
  const items = data?.data ?? []

  return (
    <section id="testimoni" className="section-padding bg-secondary/30 pattern-bg">
      <div className="container-page">
        <SectionHeader
          badge={t('testimonials.badge')}
          title={t('testimonials.title')}
          description={t('testimonials.desc')}
        />

        {isLoading ? (
          <Skeleton className="mx-auto h-56 max-w-2xl rounded-2xl" />
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">{t('testimonials.empty')}</p>
        ) : (
          <RevealOnScroll direction="up">
            <div className={`mx-auto max-w-4xl ${isFetching ? 'opacity-70' : ''}`}>
            <Carousel opts={{ align: 'center', loop: true }} className="w-full">
              <CarouselContent>
                {items.map((item) => (
                  <CarouselItem key={item.id}>
                    <TestimonialSlide item={item} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {items.length > 1 && <CarouselDots count={items.length} className="mt-6" />}
            </Carousel>
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  )
}
