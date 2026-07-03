import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getAuthToken } from '@/lib/api'

export function AdminPreviewGate({ children }: { children: ReactNode }) {
  const token = getAuthToken()
  if (!token) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}
