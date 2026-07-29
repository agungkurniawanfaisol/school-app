import { ExternalLink } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { SchoolLogo } from '@/components/brand/SchoolLogo'
import { UserAvatar } from '@/components/common/UserAvatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { isPmbPortalNavActive, isPmbRegistrationSubmitted, PMB_STATUS_LABELS, buildPmbPortalNav } from '@/config/pmb-portal-nav'
import { useAuthMe } from '@/hooks/useAuth'
import { usePmbNotifications } from '@/hooks/usePmb'
import { cn } from '@/lib/utils'
import type { PmbRegistration } from '@/types'

interface PmbPortalSidebarProps {
  isAuthenticated: boolean
  registration?: PmbRegistration | null
  onNavigate?: () => void
  className?: string
}

export function PmbPortalSidebar({
  isAuthenticated,
  registration,
  onNavigate,
  className,
}: PmbPortalSidebarProps) {
  const { pathname, hash } = useLocation()
  const { data: user } = useAuthMe()
  const { data: notifications } = usePmbNotifications()
  const unreadCount = isAuthenticated ? (notifications?.unread_count ?? 0) : 0
  const navItems = buildPmbPortalNav({ isAuthenticated, registration }).filter((item) => item.action !== 'logout')
  const displayName = user?.name ?? 'Pendaftar'
  const showRegistrationNumber = isPmbRegistrationSubmitted(registration?.status)

  return (
    <aside
      className={cn('pmb-portal-sidebar relative flex h-full w-72 shrink-0 flex-col', className)}
      aria-label="Navigasi portal PMB"
    >
      <div className="admin-sidebar-pattern pointer-events-none absolute inset-0" aria-hidden />

      <div className="admin-sidebar-header relative shrink-0 border-b border-[var(--sidebar-border)] px-4 pb-4 pt-5">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[rgb(255_255_255/0.15)] bg-[rgb(255_255_255/0.1)] p-2">
            <SchoolLogo alt="Nurul Hikmah" variant="sidebar" />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="truncate font-heading text-sm font-bold tracking-tight text-[var(--sidebar-text)]">
              Portal Pendaftaran
            </p>
            <p className="text-xs text-[var(--sidebar-muted)]">Untuk orang tua & wali</p>
          </div>
        </div>

        {isAuthenticated && (
          <div className="admin-sidebar-user mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5">
            <UserAvatar
              name={displayName}
              photoUrl={user?.avatar_url}
              size="sm"
              className="ring-1 ring-[rgb(255_255_255/0.15)]"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--sidebar-text)]">{displayName}</p>
              <p className="truncate text-xs text-[var(--sidebar-muted)]">{user?.email}</p>
            </div>
          </div>
        )}
      </div>

      {isAuthenticated && registration && (
        <div className="relative space-y-2 border-b border-[var(--sidebar-border)] px-4 py-3">
          {showRegistrationNumber && (
            <>
              <p className="text-xs text-[var(--sidebar-muted)]">No. Registrasi</p>
              <p className="font-mono text-sm font-semibold text-[var(--sidebar-text)]">
                {registration.registration_number}
              </p>
            </>
          )}
          <p className="truncate text-sm text-[var(--sidebar-text)]">
            {registration.student_name ?? 'Belum diisi'}
          </p>
          <Badge
            variant="outline"
            className="border-[var(--sidebar-border)] bg-[rgb(255_255_255/0.06)] text-[var(--sidebar-text)]"
          >
            {PMB_STATUS_LABELS[registration.status] ?? registration.status}
          </Badge>
        </div>
      )}

      <nav className="relative flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Menu portal PMB">
        <p className="admin-nav-section-label px-3 pb-1 text-[10px] font-semibold uppercase">Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isPmbPortalNavActive(pathname, item.href, hash)

          return (
            <Link
              key={item.id}
              to={item.href}
              onClick={() => onNavigate?.()}
              className={cn('admin-nav-link flex h-11 items-center gap-3 rounded-lg px-3 text-sm', active && 'admin-nav-link--active')}
            >
              <Icon className="admin-nav-icon h-4 w-4 shrink-0" aria-hidden />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.id === 'status' && unreadCount > 0 && (
                <span
                  className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground"
                  aria-label={`${unreadCount} notifikasi belum dibaca`}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="relative mt-auto border-t border-[var(--sidebar-border)] p-4">
        <Button
          type="button"
          variant="ghost"
          className="h-11 w-full justify-start gap-3 text-[var(--sidebar-muted)] hover:bg-[rgb(255_255_255/0.08)] hover:text-[var(--sidebar-text)]"
          asChild
        >
          <a href="/pmb" onClick={() => onNavigate?.()}>
            <ExternalLink className="h-4 w-4" aria-hidden />
            Kembali ke situs
          </a>
        </Button>
      </div>
    </aside>
  )
}
