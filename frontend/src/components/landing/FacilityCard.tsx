import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { resolveAssetUrl } from '@/lib/safe-url'
import { cn } from '@/lib/utils'
import type { Facility, FacilityPhoto } from '@/types'

function facilityImageSrc(facility: Facility): string | null {
  const photo: FacilityPhoto | null = facility.photos?.[0] ?? null
  const raw = photo?.url ?? photo?.path ?? facility.thumbnail
  if (!raw?.trim()) return null
  const resolved = resolveAssetUrl(raw, '')
  if (resolved) return resolved
  if (raw.startsWith('http') || raw.startsWith('/')) return raw
  return `/storage/${raw}`
}

export function FacilityCard({ facility }: { facility: Facility }) {
  const imageSrc = facilityImageSrc(facility)

  return (
    <Link
      to={`/fasilitas/${facility.slug}`}
      className={cn(
        'card-hover group relative block h-full w-full overflow-hidden rounded-xl border border-primary/10 bg-card',
        'touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      )}
      aria-label={facility.name}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary/50">
            <Building2 className="h-12 w-12 text-primary/30" aria-hidden />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
          <p className="line-clamp-2 text-sm font-semibold text-white md:text-base">{facility.name}</p>
          {facility.category && (
            <p className="mt-0.5 line-clamp-1 text-xs text-white/75">{facility.category}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
