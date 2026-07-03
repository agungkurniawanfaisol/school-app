import { ExternalLink, LogOut, PanelLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AdminNav } from '@/components/admin/AdminNav'
import { AdminSidebarFlyout } from '@/components/admin/AdminSidebarFlyout'
import { useAdminSidebar } from '@/components/admin/AdminSidebarContext'
import { SchoolLogo } from '@/components/brand/SchoolLogo'
import { AdminSidebarTree } from '@/components/layout/AdminSidebarTree'
import { ThemeToggle } from '@/components/theme'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  className?: string
}

function AdminSidebarRail() {
  const logout = useLogout()
  const { toggleCollapsed, closeFlyout } = useAdminSidebar()

  return (
    <div className="relative flex h-full flex-col items-center border-[var(--sidebar-border)] py-3">
      <div className="admin-sidebar-pattern pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mb-3 flex size-10 items-center justify-center rounded-xl border border-[rgb(255_255_255/0.15)] bg-[rgb(255_255_255/0.1)] p-1.5">
        <SchoolLogo alt="Nurul Hikmah" variant="sidebar" className="max-h-6 brightness-0 invert" />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="relative mb-2 size-10 text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)]"
        onClick={toggleCollapsed}
        aria-label="Perluas sidebar"
      >
        <PanelLeft className="size-5" aria-hidden />
      </Button>

      <div className="admin-sidebar-scroll relative flex-1 overflow-y-auto">
        <AdminSidebarTree mode="icons" />
      </div>

      <div
        className="relative mt-2 flex flex-col items-center gap-1.5 border-t border-[var(--sidebar-border)] pt-3"
        onMouseEnter={closeFlyout}
      >
        <ThemeToggle
          variant="outline"
          className="border-[rgb(255_255_255/0.15)] bg-[rgb(255_255_255/0.06)] text-[var(--sidebar-text)] hover:bg-[rgb(255_255_255/0.12)]"
        />
        <Button
          variant="ghost"
          size="icon"
          className="size-10 text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)]"
          aria-label="Lihat Situs"
          asChild
        >
          <Link to="/">
            <ExternalLink className="size-4" aria-hidden />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-10 text-[var(--sidebar-muted)] hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200"
          aria-label="Keluar"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          <LogOut className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  )
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const { collapsed, sidebarWidthClass, toggleCollapsed, closeFlyout } = useAdminSidebar()

  return (
    <>
      <aside
        className={cn(
          'admin-sidebar fixed inset-y-0 left-0 z-30 hidden h-dvh flex-col border-r transition-[width] duration-200 ease-out motion-reduce:transition-none lg:flex',
          sidebarWidthClass,
          className,
        )}
        aria-label="Sidebar admin"
      >
        {collapsed ? (
          <AdminSidebarRail />
        ) : (
          <AdminNav showCollapse onCollapse={toggleCollapsed} />
        )}
      </aside>

      {collapsed && <AdminSidebarFlyout onNavigate={closeFlyout} />}
    </>
  )
}
