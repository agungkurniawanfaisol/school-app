import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AdminSidebarProvider, useAdminSidebar } from '@/components/admin/AdminSidebarContext'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { isGuruAllowedPath } from '@/config/admin-nav'
import { useAuthMe } from '@/hooks/useAuth'
import { isGuruRole } from '@/hooks/useUsers'
import { clearAuthSession, getAuthToken, isAuthError } from '@/lib/api'
import { cn } from '@/lib/utils'

function AdminLayoutSkeleton() {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Skeleton className="hidden h-full w-72 shrink-0 rounded-none lg:block" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Skeleton className="h-14 shrink-0 rounded-none" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Skeleton className="mb-4 h-8 w-48 max-w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}

export function AdminLayout() {
  const token = getAuthToken()
  const { data: user, isPending, isError, error, fetchStatus } = useAuthMe()

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  if (isError && isAuthError(error)) {
    clearAuthSession()
    return <Navigate to="/admin/login" replace />
  }

  if (!user && (isPending || fetchStatus === 'fetching')) {
    return <AdminLayoutSkeleton />
  }

  if (!user) {
    clearAuthSession()
    return <Navigate to="/admin/login" replace />
  }

  return (
    <AdminSidebarProvider>
      <AdminLayoutShell />
    </AdminSidebarProvider>
  )
}

function AdminLayoutShell() {
  const { contentOffsetClass } = useAdminSidebar()
  const { data: user } = useAuthMe()
  const { pathname } = useLocation()

  if (user && isGuruRole(user.role) && !isGuruAllowedPath(pathname)) {
    return <Navigate to="/admin/profile" replace />
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Lewati ke konten
      </a>

      <AdminSidebar />

      <div className={cn('flex min-w-0 flex-1 flex-col', contentOffsetClass)}>
        <AdminHeader />
        <main
          id="admin-main"
          className="admin-content-bg flex-1 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6 lg:p-8"
        >
          <div className="admin-page">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
