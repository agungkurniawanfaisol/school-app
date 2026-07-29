import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PmbNotificationPanel } from '@/components/pmb/PmbNotificationPanel'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useAdminPmbNotifications, useMarkAdminPmbNotificationsRead } from '@/hooks/usePmb'
import { cn } from '@/lib/utils'
import type { PmbNotificationItem } from '@/types'

function useIsDesktopLg() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => setIsDesktop(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isDesktop
}

function unreadBadgeLabel(count: number): string {
  return count > 9 ? '9+' : String(count)
}

export function AdminPmbNotificationBell({ className }: { className?: string }) {
  const navigate = useNavigate()
  const isDesktop = useIsDesktopLg()
  const [open, setOpen] = useState(false)
  const { data, isLoading } = useAdminPmbNotifications()
  const markRead = useMarkAdminPmbNotificationsRead()

  const unreadCount = data?.unread_count ?? 0
  const items = data?.items ?? []

  const handleMarkAll = () => {
    markRead.mutate({ all: true })
  }

  const handleItemClick = (item: PmbNotificationItem) => {
    if (item.source === 'message') {
      markRead.mutate({ message_ids: [item.source_id] })
    } else if (item.registration_uuid) {
      markRead.mutate({ registration_uuid: item.registration_uuid })
    } else if (item.unread) {
      markRead.mutate({ all: true })
    }

    setOpen(false)

    if (item.registration_uuid) {
      const hash = item.href_hash ? `#${item.href_hash}` : ''
      navigate(`/admin/pmb-registrations/${item.registration_uuid}${hash}`)
    }
  }

  const triggerButton = (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn('relative size-11 shrink-0 border-primary/20 lg:size-10', className)}
      aria-label="Notifikasi PMB"
      aria-haspopup={isDesktop ? 'dialog' : undefined}
    >
      <Bell className="h-5 w-5" aria-hidden />
      {unreadCount > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground"
          aria-label={`${unreadCount} belum dibaca`}
        >
          {unreadBadgeLabel(unreadCount)}
        </span>
      )}
    </Button>
  )

  const panel = (
    <PmbNotificationPanel
      items={items}
      unreadCount={unreadCount}
      isLoading={isLoading}
      onMarkAllRead={handleMarkAll}
      onItemClick={handleItemClick}
      markAllPending={markRead.isPending}
      emptyHint="Pendaftar baru atau perbaikan akan muncul di sini"
      className="h-full max-h-[min(70vh,28rem)]"
    />
  )

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
        <PopoverContent align="end" sideOffset={8} className="w-[22rem] p-0">
          {panel}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn('relative size-11 shrink-0 border-primary/20 lg:size-10', className)}
        aria-label="Notifikasi PMB"
        onClick={() => setOpen(true)}
      >
        <Bell className="h-5 w-5" aria-hidden />
        {unreadCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground"
            aria-label={`${unreadCount} belum dibaca`}
          >
            {unreadBadgeLabel(unreadCount)}
          </span>
        )}
      </Button>
      <SheetContent
        side="bottom"
        className="flex h-[min(85dvh,32rem)] flex-col gap-0 rounded-t-2xl p-0 pb-[env(safe-area-inset-bottom,0px)]"
      >
        <SheetTitle className="sr-only">Notifikasi PMB</SheetTitle>
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-muted" aria-hidden />
        {panel}
      </SheetContent>
    </Sheet>
  )
}
