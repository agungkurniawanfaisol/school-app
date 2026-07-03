import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Facility } from '@/types'

export function FacilityCard({ facility }: { facility: Facility }) {
  const previewPhoto = facility.photos?.[0] ?? null
  const imageSrc = previewPhoto?.path ?? facility.thumbnail

  return (
    <Link
      to={`/fasilitas/${facility.slug}`}
      className={cn(
        'card-hover group relative block h-full w-full overflow-hidden rounded-xl border border-primary/10 bg-card',
        'touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      )}
      aria-label={facility.name}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 md:group-hover:scale-[1.02]"
          loading="lazy"
        />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-secondary/50">
          <Building2 className="h-12 w-12 text-primary/30" aria-hidden />
        </div>
      )}

      <div className="absolute inset-0 hidden items-end bg-gradient-to-t from-primary/80 via-primary/20 to-transparent p-4 opacity-0 transition-opacity duration-200 md:flex md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
        <div className="text-primary-foreground">
          <p className="font-semibold">{facility.name}</p>
          {facility.category && (
            <p className="text-xs text-primary-foreground/80">{facility.category}</p>
          )}
        </div>
      </div>

      <div className="border-t border-primary/10 p-4 md:hidden">
        <p className="font-medium text-foreground">{facility.name}</p>
        {facility.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{facility.description}</p>
        )}
      </div>
    </Link>
  )
}
