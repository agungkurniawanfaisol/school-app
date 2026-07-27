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
}

export function AdminToolbar({
  search,
  onSearchChange,
  searchPlaceholder,
  filters,
  actions,
  className,
}: AdminToolbarProps) {
  const { t } = useTranslation('admin')

  return (
    <div className={cn('admin-toolbar', className)}>
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          placeholder={searchPlaceholder ?? t('common.search')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 pl-9"
          aria-label={t('common.searchData')}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {filters}
        {actions}
      </div>
    </div>
  )
}
