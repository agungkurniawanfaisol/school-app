import type { ReactNode } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface AdminToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  filters?: ReactNode
  actions?: ReactNode
  className?: string
}

export function AdminToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Cari...',
  filters,
  actions,
  className,
}: AdminToolbarProps) {
  return (
    <div className={cn('admin-toolbar', className)}>
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 pl-9"
          aria-label="Cari data"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {filters}
        {actions}
      </div>
    </div>
  )
}
