import { Navigate, useSearchParams } from 'react-router-dom'

/** Legacy route — unified login OAuth now completes at /admin/login/oauth */
export function PmbOAuthCallbackPage() {
  const [params] = useSearchParams()
  const ticket = params.get('ticket')
  const query = ticket ? `?ticket=${encodeURIComponent(ticket)}&redirect=/pmb/daftar` : '?redirect=/pmb/daftar'

  return <Navigate to={`/admin/login/oauth${query}`} replace />
}
