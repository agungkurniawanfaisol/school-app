import { LogOut, Menu, PanelLeft, PanelLeftClose, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AdminNav, getAdminPageTitle } from '@/components/admin/AdminNav'
import { useAdminSidebar } from '@/components/admin/AdminSidebarContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { getAdminBreadcrumbs } from '@/config/admin-nav'
import { useAuthMe, useLogout } from '@/hooks/useAuth'

function getUserInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function AdminHeader() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { data: user } = useAuthMe()
  const logout = useLogout()
  const { collapsed, toggleCollapsed } = useAdminSidebar()
  const breadcrumbs = getAdminBreadcrumbs(pathname)
  const pageTitle = getAdminPageTitle(pathname)

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate('/admin/login'),
    })
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-primary/15 bg-background/90 px-4 shadow-sm shadow-primary/5 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 lg:h-16 lg:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-11 shrink-0 border-primary/20 lg:hidden"
            aria-label="Buka menu navigasi"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[min(100%,20rem)] gap-0 border-r-0 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigasi Admin</SheetTitle>
          </SheetHeader>
          <AdminNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="hidden size-9 shrink-0 border-primary/20 lg:inline-flex"
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
      >
        {collapsed ? <PanelLeft className="size-4" aria-hidden /> : <PanelLeftClose className="size-4" aria-hidden />}
      </Button>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-xs sm:flex">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1
            return (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 && <span className="text-muted-foreground/50" aria-hidden>/</span>}
                {crumb.href && !isLast ? (
                  <Link
                    to={crumb.href}
                    className="truncate text-muted-foreground transition-colors hover:text-primary"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="truncate text-muted-foreground">{crumb.label}</span>
                )}
              </span>
            )
          })}
        </nav>
        <h1 className="truncate font-heading text-base font-bold tracking-tight text-foreground lg:text-lg">
          {pageTitle}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {user?.role && (
          <Badge variant="secondary" className="hidden capitalize sm:inline-flex">
            {user.role}
          </Badge>
        )}
        {user?.name && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full p-0" aria-label="Menu akun">
                <Avatar className="h-9 w-9 border border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                    {getUserInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profil Saya
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
