import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { resolveProgramIcon } from '@/lib/lucide-icon-map'
import { cn } from '@/lib/utils'
import type { Curriculum } from '@/types'

export function FeaturedProgramCard({ item }: { item: Curriculum }) {
  const { t } = useTranslation('landing')
  const Icon = resolveProgramIcon(item.icon)

  return (
    <Link
      to={`/program/${item.slug}`}
      className={cn(
        'card-hover group relative block h-full overflow-hidden rounded-xl border border-primary/10 bg-card',
        'touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      )}
      aria-label={`${item.title}${item.excerpt ? ` — ${item.excerpt}` : ''}`}
    >
      {item.thumbnail ? (
        <img
          src={item.thumbnail}
          alt=""
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 md:aspect-video md:group-hover:scale-[1.02]"
          loading="lazy"
        />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-secondary/60 md:aspect-video">
          <Icon className="h-10 w-10 text-primary/40" aria-hidden />
        </div>
      )}

      {item.category && (
        <div className="absolute inset-x-0 top-0 flex justify-end p-3">
          <Badge variant="secondary" className="capitalize shadow-sm">
            {item.category}
          </Badge>
        </div>
      )}

      <div className="absolute inset-0 hidden items-end bg-gradient-to-t from-primary/85 via-primary/25 to-transparent p-4 opacity-0 transition-opacity duration-200 md:flex md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
        <div className="text-primary-foreground">
          <p className="font-semibold">{item.title}</p>
          {item.excerpt && (
            <p className="mt-1 line-clamp-2 text-sm text-primary-foreground/85">{item.excerpt}</p>
          )}
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium">
            {t('programs.viewMore')}
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      </div>

      <div className="border-t border-primary/10 p-4 md:hidden">
        <p className="font-medium leading-snug text-foreground">{item.title}</p>
        {item.excerpt && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.excerpt}</p>
        )}
        <span className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary">
          {t('programs.viewMore')}
          <ChevronRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </Link>
  )
}
