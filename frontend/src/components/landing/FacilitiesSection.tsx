import { Building2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFacilitiesList } from '@/hooks/useFacilities'

export function FacilitiesSection() {
  const { data, isLoading, isFetching } = useFacilitiesList({ per_page: 6, featured: true })

  return (
    <section id="fasilitas" className="section-padding">
      <div className="container-page">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-primary sm:text-4xl">Fasilitas</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Sarana dan prasarana modern untuk mendukung proses belajar mengajar yang optimal.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full" />
            ))}
          </div>
        ) : (
          <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}>
            {data?.data.map((facility) => (
              <Card key={facility.id} className="overflow-hidden transition-shadow hover:shadow-md">
                {facility.thumbnail ? (
                  <img src={facility.thumbnail} alt={facility.name} className="h-44 w-full object-cover" />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-muted">
                    <Building2 className="h-12 w-12 text-primary/30" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{facility.name}</CardTitle>
                    {facility.category && <Badge variant="secondary">{facility.category}</Badge>}
                  </div>
                  {facility.description && (
                    <CardDescription className="line-clamp-2">{facility.description}</CardDescription>
                  )}
                </CardHeader>
                {facility.photos && facility.photos.length > 0 && (
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">{facility.photos.length} foto</p>
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
