import type { ReactNode } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface AdminToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  filters?: ReactNode
  actions?: ReactNode
  className?: string
  /** When true, filter children render in a responsive equal-width grid. */
  filterGrid?: boolean
}

export function AdminToolbar({
  search,
  onSearchChange,
  searchPlaceholder,
  filters,
  actions,
  className,
  filterGrid = true,
}: AdminToolbarProps) {
  const { t } = useTranslation('admin')

  return (
    <div
      className={cn(
        'flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4',
        className,
      )}
    >
      <div className="relative w-full shrink-0 lg:max-w-xs xl:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          placeholder={searchPlaceholder ?? t('common.search')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 border-primary/15 bg-background pl-9 shadow-none focus-visible:border-primary/40"
          aria-label={t('common.searchData')}
        />
      </div>

      {(filters || actions) && (
        <div
          className={cn(
            'min-w-0 flex-1',
            filterGrid
              ? 'grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3'
              : 'flex flex-wrap items-end gap-2.5',
          )}
        >
          {filters}
          {actions ? <div className="flex items-end gap-2 sm:col-span-full xl:col-span-1">{actions}</div> : null}
        </div>
      )}
    </div>
  )
}

interface AdminFilterFieldProps {
  label: string
  children: ReactNode
  className?: string
}

/** Labeled filter control for admin toolbars (selects, etc.). */
export function AdminFilterField({ label, children, className }: AdminFilterFieldProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}
