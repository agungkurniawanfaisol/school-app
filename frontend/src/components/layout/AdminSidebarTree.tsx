import { type MouseEvent, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAdminSidebar, type AdminFlyoutTarget } from '@/components/admin/AdminSidebarContext'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  adminDashboardItem,
  findActiveAdminNavGroup,
  getAdminNavForRole,
  guruProfileItem,
  isAdminNavActive,
  type AdminNavItem,
} from '@/config/admin-nav'
import { useAuthMe } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

type AdminSidebarTreeProps = {
  mode?: 'full' | 'icons'
  onNavigate?: () => void
  className?: string
}

function NavIcon({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <span
      className={cn('admin-nav-icon flex size-8 shrink-0 items-center justify-center rounded-lg', active && 'text-[var(--sidebar-accent)]')}
      aria-hidden
    >
      {children}
    </span>
  )
}

function AdminNavLink({
  item,
  onNavigate,
  nested,
}: {
  item: AdminNavItem
  onNavigate?: () => void
  nested?: boolean
}) {
  const location = useLocation()
  const active = isAdminNavActive(location.pathname, item.href, item.exact)
  const Icon = item.icon

  return (
    <Link
      to={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'admin-nav-link group flex min-h-10 items-center gap-3 rounded-lg px-2.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-accent)]',
        nested && 'ml-3',
        active && 'admin-nav-link--active font-medium',
      )}
    >
      <NavIcon active={active}>
        <Icon className="size-4" />
      </NavIcon>
      <span className="flex-1 truncate">{item.label}</span>
    </Link>
  )
}

function AdminSidebarIcons({ onNavigate, className }: AdminSidebarTreeProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { data: user } = useAuthMe()
  const navConfig = getAdminNavForRole(user?.role ?? 'admin')
  const { openFlyout, scheduleCloseFlyout, cancelCloseFlyout } = useAdminSidebar()
  const activeGroup = findActiveAdminNavGroup(location.pathname)
  const dashboardActive = isAdminNavActive(location.pathname, adminDashboardItem.href, true)
  const profileActive = isAdminNavActive(location.pathname, guruProfileItem.href, true)
  const DashboardIcon = adminDashboardItem.icon
  const ProfileIcon = guruProfileItem.icon

  const handleIconHover = (target: AdminFlyoutTarget, event: MouseEvent<HTMLButtonElement>) => {
    cancelCloseFlyout()
    openFlyout(target, event.currentTarget.getBoundingClientRect().top)
  }

  const iconBtnClass = (active: boolean) =>
    cn(
      'size-10 rounded-xl border border-transparent text-[var(--sidebar-muted)] transition-colors',
      'hover:border-[rgb(255_255_255/0.12)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)]',
      active && 'border-[rgb(255_255_255/0.15)] bg-[var(--sidebar-active)] text-[var(--sidebar-accent)] shadow-sm',
    )

  if (user?.role === 'guru') {
    return (
      <nav className={cn('flex flex-col items-center gap-1.5 py-2', className)} aria-label="Navigasi admin">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={iconBtnClass(profileActive)}
          aria-label={guruProfileItem.label}
          aria-current={profileActive ? 'page' : undefined}
          onClick={() => {
            navigate(guruProfileItem.href)
            onNavigate?.()
          }}
        >
          <ProfileIcon className="size-5" aria-hidden />
        </Button>
      </nav>
    )
  }

  return (
    <nav className={cn('flex flex-col items-center gap-1.5 py-2', className)} aria-label="Navigasi admin">
      {navConfig.showDashboard && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={iconBtnClass(dashboardActive)}
          aria-label={adminDashboardItem.label}
          aria-current={dashboardActive ? 'page' : undefined}
          onMouseEnter={(e) => handleIconHover('dashboard', e)}
          onMouseLeave={scheduleCloseFlyout}
          onClick={() => {
            navigate(adminDashboardItem.href)
            onNavigate?.()
          }}
        >
          <DashboardIcon className="size-5" aria-hidden />
        </Button>
      )}

      {navConfig.groups.map((group) => {
        const GroupIcon = group.icon
        const groupActive = activeGroup === group.label

        return (
          <Button
            key={group.label}
            type="button"
            variant="ghost"
            size="icon"
            className={iconBtnClass(groupActive)}
            aria-label={group.label}
            aria-current={groupActive ? 'page' : undefined}
            onMouseEnter={(e) => handleIconHover(group.label, e)}
            onMouseLeave={scheduleCloseFlyout}
            onClick={() => {
              navigate(group.defaultHref)
              onNavigate?.()
            }}
          >
            <GroupIcon className="size-5" aria-hidden />
          </Button>
        )
      })}
    </nav>
  )
}

export function AdminSidebarTree({ mode = 'full', onNavigate, className }: AdminSidebarTreeProps) {
  const location = useLocation()
  const { data: user } = useAuthMe()
  const navConfig = getAdminNavForRole(user?.role ?? 'admin')
  const activeGroup = findActiveAdminNavGroup(location.pathname)
  const dashboardActive = isAdminNavActive(location.pathname, adminDashboardItem.href, true)
  const DashboardIcon = adminDashboardItem.icon

  if (mode === 'icons') {
    return <AdminSidebarIcons onNavigate={onNavigate} className={className} />
  }

  if (user?.role === 'guru') {
    return (
      <nav className={cn('space-y-1', className)} aria-label="Navigasi admin">
        <AdminNavLink item={guruProfileItem} onNavigate={onNavigate} />
      </nav>
    )
  }

  const defaultOpen = navConfig.groups
    .filter((g) => g.label === activeGroup)
    .map((g) => g.label)

  return (
    <nav className={cn('space-y-1', className)} aria-label="Navigasi admin">
      {navConfig.showDashboard && (
        <Link
          to={adminDashboardItem.href}
          onClick={onNavigate}
          aria-current={dashboardActive ? 'page' : undefined}
          className={cn(
            'admin-nav-link mb-3 flex min-h-10 items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-accent)]',
            dashboardActive && 'admin-nav-link--active',
          )}
        >
          <NavIcon active={dashboardActive}>
            <DashboardIcon className="size-4" />
          </NavIcon>
          {adminDashboardItem.label}
        </Link>
      )}

      {navConfig.groups.length > 0 && (
        <p className="admin-nav-section-label mb-2 px-2 text-[10px] font-bold uppercase">
          Menu Utama
        </p>
      )}

      <Accordion type="multiple" defaultValue={defaultOpen} key={location.pathname} className="space-y-1">
        {navConfig.groups.map((group) => {
          const GroupIcon = group.icon
          const groupActive = activeGroup === group.label

          return (
            <AccordionItem key={group.label} value={group.label} className="border-none">
              <AccordionTrigger
                className={cn(
                  'admin-nav-group-trigger min-h-10 rounded-lg px-2.5 py-2 text-sm font-medium hover:no-underline [&>svg]:text-[var(--sidebar-muted)]',
                  groupActive && 'text-[var(--sidebar-text)]',
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'admin-nav-icon flex size-7 items-center justify-center rounded-lg',
                      groupActive && 'text-[var(--sidebar-accent)]',
                    )}
                    aria-hidden
                  >
                    <GroupIcon className="size-3.5" />
                  </span>
                  {group.label}
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-0.5 border-l border-[rgb(255_255_255/0.1)] pb-1 pl-2 pt-0.5">
                {group.children.map((item) => (
                  <AdminNavLink key={item.href} item={item} onNavigate={onNavigate} nested />
                ))}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      {navConfig.profileItem && (
        <div className="mt-4 border-t border-[var(--sidebar-border)] pt-3">
          <p className="admin-nav-section-label mb-2 px-2 text-[10px] font-bold uppercase">Akun</p>
          <AdminNavLink item={navConfig.profileItem} onNavigate={onNavigate} />
        </div>
      )}
    </nav>
  )
}
