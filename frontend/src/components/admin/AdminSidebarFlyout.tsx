import { Link, useLocation } from 'react-router-dom'
import { useAdminSidebar } from '@/components/admin/AdminSidebarContext'
import {
  adminDashboardItem,
  adminNavTree,
  isAdminNavActive,
  type AdminNavItem,
} from '@/config/admin-nav'
import { cn } from '@/lib/utils'

type AdminSidebarFlyoutProps = {
  onNavigate?: () => void
}

function FlyoutNavLink({ item, onNavigate }: { item: AdminNavItem; onNavigate?: () => void }) {
  const location = useLocation()
  const active = isAdminNavActive(location.pathname, item.href, item.exact)
  const Icon = item.icon

  return (
    <Link
      to={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'admin-nav-link flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-accent)]',
        active && 'admin-nav-link--active font-medium',
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      <span className="truncate">{item.label}</span>
    </Link>
  )
}

function FlyoutGroupHeader({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-[rgb(255_255_255/0.1)] px-4 py-3">
      <span className="flex size-8 items-center justify-center rounded-lg bg-[rgb(255_255_255/0.1)] text-[var(--sidebar-accent)]" aria-hidden>
        <Icon className="size-4" />
      </span>
      <span className="text-sm font-semibold text-[var(--sidebar-text)]">{label}</span>
    </div>
  )
}

function AdminSidebarFlyoutPanel({ onNavigate }: AdminSidebarFlyoutProps) {
  const { flyoutTarget } = useAdminSidebar()

  if (!flyoutTarget) {
    return null
  }

  if (flyoutTarget === 'dashboard') {
    const DashboardIcon = adminDashboardItem.icon
    return (
      <div>
        <FlyoutGroupHeader icon={DashboardIcon} label={adminDashboardItem.label} />
        <div className="p-3">
          <FlyoutNavLink item={adminDashboardItem} onNavigate={onNavigate} />
        </div>
      </div>
    )
  }

  const group = adminNavTree.find((g) => g.label === flyoutTarget)
  if (!group) {
    return null
  }

  return (
    <div>
      <FlyoutGroupHeader icon={group.icon} label={group.label} />
      <nav className="max-h-80 space-y-0.5 overflow-y-auto p-3" aria-label={`Menu ${group.label}`}>
        {group.children.map((item) => (
          <FlyoutNavLink key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </nav>
    </div>
  )
}

export function AdminSidebarFlyout({ onNavigate }: AdminSidebarFlyoutProps) {
  const { flyoutTarget, flyoutTop, cancelCloseFlyout, scheduleCloseFlyout } = useAdminSidebar()

  if (!flyoutTarget) {
    return null
  }

  const clampedTop = Math.max(8, Math.min(flyoutTop, window.innerHeight - 120))

  return (
    <div
      className={cn(
        'admin-sidebar-flyout pointer-events-auto fixed left-[calc(4rem+0.625rem)] z-40 hidden w-56 overflow-hidden lg:block',
        'max-h-[min(24rem,calc(100dvh-1rem))]',
        'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-left-1 motion-safe:duration-150',
        'motion-reduce:animate-none',
      )}
      style={{ top: clampedTop }}
      onMouseEnter={cancelCloseFlyout}
      onMouseLeave={scheduleCloseFlyout}
    >
      <AdminSidebarFlyoutPanel onNavigate={onNavigate} />
    </div>
  )
}
