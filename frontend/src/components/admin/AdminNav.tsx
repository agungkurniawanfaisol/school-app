import { ExternalLink, LogOut, PanelLeftClose, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SchoolLogo } from '@/components/brand/SchoolLogo'
import { AdminSidebarTree } from '@/components/layout/AdminSidebarTree'
import { ThemeToggle } from '@/components/theme'
import { Button } from '@/components/ui/button'
import { findAdminNavItem } from '@/config/admin-nav'
import { useAuthMe, useLogout } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export function getAdminPageTitle(pathname: string): string {
  return findAdminNavItem(pathname)?.label ?? 'Panel Admin'
}

function getUserInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

interface AdminNavProps {
  className?: string
  showCollapse?: boolean
  onCollapse?: () => void
  onNavigate?: () => void
}

export function AdminNav({
  className,
  showCollapse = false,
  onCollapse,
  onNavigate,
}: AdminNavProps) {
  const { data: user } = useAuthMe()
  const logout = useLogout()
  const displayName = user?.name ?? 'Administrator'
  const initials = getUserInitials(displayName)

  return (
    <div className={cn('admin-sidebar relative flex h-full flex-col', className)}>
      <div className="admin-sidebar-pattern pointer-events-none absolute inset-0" aria-hidden />

      <div className="admin-sidebar-header relative shrink-0 border-b border-[var(--sidebar-border)] px-4 pb-4 pt-5">
        <div className="flex items-start gap-3">
          <div className="relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-[rgb(255_255_255/0.15)] bg-[rgb(255_255_255/0.1)] p-2 shadow-inner">
            <SchoolLogo alt="Nurul Hikmah" variant="sidebar" />
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#14532d] bg-emerald-400" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-center gap-1.5">
              <p className="truncate font-heading text-sm font-bold tracking-tight text-[var(--sidebar-text)]">
                Nurul Hikmah
              </p>
              <Sparkles className="size-3.5 shrink-0 text-[var(--sidebar-accent)]" aria-hidden />
            </div>
            <p className="text-xs text-[var(--sidebar-muted)]">Panel Administrasi</p>
          </div>
          {showCollapse && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)]"
              onClick={onCollapse}
              aria-label="Ciutkan sidebar"
            >
              <PanelLeftClose className="size-4" aria-hidden />
            </Button>
          )}
        </div>

        <div className="admin-sidebar-user mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="relative shrink-0">
            <div
              className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-bold text-emerald-950 shadow-md"
              aria-hidden
            >
              {initials || 'A'}
            </div>
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#14532d] bg-emerald-300" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--sidebar-text)]">{displayName}</p>
            <p className="truncate text-xs capitalize text-[var(--sidebar-muted)]">{user?.role ?? 'admin'}</p>
          </div>
        </div>
      </div>

      <div className="admin-sidebar-scroll relative flex-1 overflow-y-auto px-3 py-4">
        <AdminSidebarTree mode="full" onNavigate={onNavigate} />
      </div>

      <div className="admin-sidebar-footer relative shrink-0 space-y-2 p-3">
        <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5">
          <span className="text-xs font-medium text-[var(--sidebar-muted)]">Tampilan</span>
          <ThemeToggle variant="outline" className="border-[rgb(255_255_255/0.15)] bg-[rgb(255_255_255/0.06)] text-[var(--sidebar-text)] hover:bg-[rgb(255_255_255/0.12)]" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            className="min-h-10 justify-start gap-2 border border-[rgb(255_255_255/0.08)] bg-[rgb(255_255_255/0.04)] text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)]"
            asChild
          >
            <Link to="/" onClick={onNavigate}>
              <ExternalLink className="size-4" aria-hidden />
              Situs
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="min-h-10 justify-start gap-2 border border-[rgb(255_255_255/0.08)] bg-[rgb(255_255_255/0.04)] text-[var(--sidebar-muted)] hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <LogOut className="size-4" aria-hidden />
            {logout.isPending ? '...' : 'Keluar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
