import { Link, useLocation } from 'react-router-dom'
import { buildPmbPortalNav, isPmbPortalNavActive } from '@/config/pmb-portal-nav'
import { usePmbNotifications } from '@/hooks/usePmb'
import { cn } from '@/lib/utils'
import type { PmbRegistration } from '@/types'

interface PmbPortalBottomNavProps {
  isAuthenticated: boolean
  registration?: PmbRegistration | null
}

export function PmbPortalBottomNav({ isAuthenticated, registration }: PmbPortalBottomNavProps) {
  const { pathname, hash } = useLocation()
  const { data: notifications } = usePmbNotifications()
  const unreadCount = isAuthenticated ? (notifications?.unread_count ?? 0) : 0
  const items = buildPmbPortalNav({ isAuthenticated, registration }).filter(
    (item) => !item.action && item.id !== 'loa',
  )

  if (items.length === 0) return null

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 lg:hidden"
      aria-label="Navigasi utama portal PMB"
    >
      <div
        className="pointer-events-none absolute inset-x-0 -top-5 h-5 bg-gradient-to-t from-background/90 to-transparent"
        aria-hidden
      />
      <div className="border-t border-primary/10 bg-background/95 shadow-[0_-4px_24px_rgb(26_95_42/0.08)] backdrop-blur-md supports-[backdrop-filter]:bg-background/85">
        <div className="mx-auto flex max-w-lg items-stretch justify-around px-1">
          {items.map((item) => {
            const Icon = item.icon
            const active = isPmbPortalNavActive(pathname, item.href, hash)

            return (
              <Link
                key={item.id}
                to={item.href}
                aria-label={item.label}
                className={cn(
                  'relative flex min-h-[52px] min-w-[4.5rem] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-center transition-colors',
                  'active:scale-[0.96] motion-reduce:active:scale-100',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <span className="relative">
                  <Icon className="h-5 w-5 shrink-0" aria-hidden strokeWidth={active ? 2.25 : 2} />
                  {item.id === 'status' && unreadCount > 0 && (
                    <span
                      className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-0.5 text-[9px] font-bold text-destructive-foreground"
                      aria-label={`${unreadCount} notifikasi belum dibaca`}
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </span>
                <span className={cn('max-w-full truncate text-[10px] leading-tight sm:text-xs', active && 'font-semibold')}>
                  {item.shortLabel ?? item.label}
                </span>
                {active && (
                  <span className="absolute bottom-1 h-0.5 w-8 rounded-full bg-primary" aria-hidden />
                )}
              </Link>
            )
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom,0px)]" aria-hidden />
      </div>
    </nav>
  )
}
