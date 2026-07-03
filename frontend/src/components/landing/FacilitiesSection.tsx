import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StaggerChildren, StaggerItem } from '@/components/motion'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { useFacilitiesList } from '@/hooks/useFacilities'
import type { Facility } from '@/types'

function FacilityGalleryItem({ facility }: { facility: Facility }) {
  const previewPhoto = facility.photos?.[0] ?? null
  const imageSrc = previewPhoto?.path ?? facility.thumbnail

  return (
    <Link
      to={`/fasilitas/${facility.slug}`}
      className="card-hover group relative block w-full overflow-hidden rounded-xl border border-primary/10 bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={facility.name}
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-secondary/50">
          <Building2 className="h-12 w-12 text-primary/30" />
        </div>
      )}

      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary/80 via-primary/20 to-transparent p-4 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
        <div className="flex w-full items-end justify-between gap-2 text-primary-foreground">
          <div>
            <p className="font-semibold">{facility.name}</p>
            {facility.category && (
              <p className="text-xs text-primary-foreground/80">{facility.category}</p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-primary/10 p-3 md:hidden">
        <p className="font-medium text-foreground">{facility.name}</p>
        {facility.description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{facility.description}</p>
        )}
      </div>
    </Link>
  )
}

export function FacilitiesSection() {
  const { data, isLoading, isFetching } = useFacilitiesList({ per_page: 6, featured: true })
  const facilities = data?.data ?? []

  return (
    <section id="fasilitas" className="section-padding pattern-bg">
      <div className="container-page">
        <SectionHeader
          badge="Sarana Prasarana"
          title="Fasilitas Sekolah"
          description="Sarana dan prasarana modern untuk mendukung proses belajar mengajar yang optimal."
          action={
            <Button asChild variant="outline" size="sm" className="min-h-11">
              <Link to="/#fasilitas">Jelajahi</Link>
            </Button>
          }
        />

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
            ))}
          </div>
        ) : facilities.length === 0 ? (
          <p className="text-center text-muted-foreground">Belum ada data fasilitas.</p>
        ) : (
          <StaggerChildren className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}>
            {facilities.map((facility) => (
              <StaggerItem key={facility.id}>
                <FacilityGalleryItem facility={facility} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        )}
      </div>
    </section>
  )
}
