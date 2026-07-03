import { Quote, Star } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTestimonialsList } from '@/hooks/useTestimonials'

export function TestimonialsSection() {
  const { data, isLoading, isFetching } = useTestimonialsList({ per_page: 6, featured: true })

  return (
    <section id="testimoni" className="section-padding">
      <div className="container-page">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-primary sm:text-4xl">Testimoni</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Apa kata orang tua dan alumni tentang pengalaman mereka di sekolah kami.
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
              <Card key={item.id} className="relative">
                <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10" />
                <CardHeader className="flex flex-row items-center gap-4">
                  {item.photo ? (
                    <img src={item.photo} alt={item.name} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {item.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.role && <p className="text-sm text-muted-foreground">{item.role}</p>}
                  </div>
                </CardHeader>
                <CardContent>
                  {item.rating && (
                    <div className="mb-2 flex gap-0.5">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">&ldquo;{item.content}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
