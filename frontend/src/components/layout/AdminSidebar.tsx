import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Users,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuthMe, useLogout } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/news', label: 'Berita', icon: Newspaper },
  { href: '/admin/teachers', label: 'Guru', icon: Users },
  { href: '/admin/curriculums', label: 'Kurikulum', icon: BookOpen },
  { href: '/admin/pmb', label: 'PMB', icon: GraduationCap },
]

export function AdminSidebar() {
  const location = useLocation()
  const { data: user } = useAuthMe()
  const logout = useLogout()

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-primary">Panel Admin</h2>
        <p className="text-sm text-muted-foreground">{user?.name ?? 'Administrator'}</p>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.href
            : location.pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </aside>
  )
}
