import {
  CheckCircle2,
  FileCheck,
  MessageSquare,
  RefreshCw,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, formatRelativeTimeId } from '@/lib/utils'
import type { PmbNotificationItem } from '@/types'

const TYPE_ICONS: Record<string, LucideIcon> = {
  message: MessageSquare,
  payment_verified: CheckCircle2,
  payment_rejected: XCircle,
  status_changed: RefreshCw,
  loa_issued: FileCheck,
}

interface PmbNotificationPanelProps {
  items: PmbNotificationItem[]
  unreadCount: number
  isLoading?: boolean
  onMarkAllRead: () => void
  onItemClick: (item: PmbNotificationItem) => void
  markAllPending?: boolean
  className?: string
  emptyHint?: string
}

export function PmbNotificationPanel({
  items,
  unreadCount,
  isLoading,
  onMarkAllRead,
  onItemClick,
  markAllPending,
  className,
  emptyHint = 'Update dari admin akan muncul di sini',
}: PmbNotificationPanelProps) {
  return (
    <div className={cn('flex min-h-0 flex-col', className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="text-base font-semibold">Notifikasi</h2>
        {unreadCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 shrink-0 text-xs text-primary"
            onClick={onMarkAllRead}
            disabled={markAllPending}
          >
            Tandai semua dibaca
          </Button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {isLoading && items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">Memuat…</p>
        ) : items.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm font-medium text-foreground">Belum ada notifikasi</p>
            <p className="mt-1 text-xs text-muted-foreground">{emptyHint}</p>
          </div>
        ) : (
          <ul className="divide-y divide-border" role="list">
            {items.map((item) => {
              const Icon = TYPE_ICONS[item.type] ?? MessageSquare
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={cn(
                      'flex min-h-11 w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60',
                      item.unread && 'bg-primary/5',
                    )}
                    onClick={() => onItemClick(item)}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full',
                        item.unread ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
                      )}
                      aria-hidden
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium leading-snug text-foreground">
                          {item.title}
                        </span>
                        {item.unread && (
                          <span
                            className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
                            aria-label="Belum dibaca"
                          />
                        )}
                      </span>
                      {item.body && (
                        <span className="mt-0.5 line-clamp-1 block text-xs text-muted-foreground">
                          {item.body}
                        </span>
                      )}
                      {item.created_at && (
                        <span className="mt-1 block text-[11px] text-muted-foreground">
                          {formatRelativeTimeId(item.created_at)}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
