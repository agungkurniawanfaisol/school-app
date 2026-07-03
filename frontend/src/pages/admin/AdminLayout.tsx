import { Navigate, Outlet } from 'react-router-dom'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { getAuthToken } from '@/lib/api'
import { useAuthMe } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'

export function AdminLayout() {
  const token = getAuthToken()
  const { isLoading, isError } = useAuthMe()

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh">
        <Skeleton className="h-full w-64 rounded-none" />
        <div className="flex-1 p-8">
          <Skeleton className="mb-4 h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (isError) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="flex min-h-svh">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
