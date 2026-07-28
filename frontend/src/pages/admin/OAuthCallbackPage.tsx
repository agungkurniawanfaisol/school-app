import { useEffect, useRef } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAuthMe, useGoogleExchange } from '@/hooks/useAuth'
import { getApiErrorMessage, getAuthToken } from '@/lib/api'

const OAUTH_TICKET_SESSION_KEY = 'nh_oauth_ticket_pending'

function parseTicketFromHash(): string | null {
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash) {
    return null
  }

  const params = new URLSearchParams(hash)
  const ticket = params.get('ticket')

  return ticket && ticket.length > 0 ? ticket : null
}

export function OAuthCallbackPage() {
  const { t } = useTranslation('admin')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { mutate, isPending } = useGoogleExchange()
  const startedRef = useRef(false)
  const token = getAuthToken()
  const { data: user, isSuccess, isError } = useAuthMe()

  useEffect(() => {
    if (startedRef.current) {
      return
    }

    const ticket = searchParams.get('ticket') || parseTicketFromHash()
    if (!ticket) {
      toast.error(t('auth.ticketNotFound'))
      navigate('/admin/login', { replace: true })
      return
    }

    const pendingTicket = sessionStorage.getItem(OAUTH_TICKET_SESSION_KEY)
    if (pendingTicket === ticket) {
      return
    }

    startedRef.current = true
    sessionStorage.setItem(OAUTH_TICKET_SESSION_KEY, ticket)
    window.history.replaceState(null, '', window.location.pathname)

    mutate(ticket, {
      onSuccess: (data) => {
        sessionStorage.removeItem(OAUTH_TICKET_SESSION_KEY)
        toast.success(t('auth.loginSuccess'))
        navigate(data.user.role === 'guru' ? '/admin/profile' : '/admin', { replace: true })
      },
      onError: (error) => {
        sessionStorage.removeItem(OAUTH_TICKET_SESSION_KEY)
        toast.error(getApiErrorMessage(error, t('auth.googleLoginFailed')))
        navigate('/admin/login', { replace: true })
      },
    })
  }, [mutate, navigate, searchParams, t])

  if (token && isSuccess && user && !isError) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-secondary via-background to-secondary/40 px-4">
      <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
        {isPending ? t('common.completingLogin') : t('common.processing')}
      </p>
    </div>
  )
}
