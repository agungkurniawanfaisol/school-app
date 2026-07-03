import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { AdminConnectionError } from '@/components/admin/AdminConnectionError'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthMe } from '@/hooks/useAuth'
import { clearAuthSession, getAuthToken, isAuthError, isNetworkError } from '@/lib/api'

export function AdminPreviewGate({ children }: { children: ReactNode }) {
  const token = getAuthToken()
  const { data: user, isLoading, isError, error, refetch, isRefetching } = useAuthMe()

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  if (isError && isAuthError(error)) {
    clearAuthSession()
    return <Navigate to="/admin/login" replace />
  }

  if (isError && isNetworkError(error)) {
    return <AdminConnectionError onRetry={() => void refetch()} isRetrying={isRefetching} />
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="mb-4 h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!user) {
    clearAuthSession()
    return <Navigate to="/admin/login" replace />
  }

  return children
}
