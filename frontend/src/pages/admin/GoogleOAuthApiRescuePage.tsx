import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { unregisterAllServiceWorkers } from '@/lib/unregisterLegacyServiceWorkers'

const RESCUE_ATTEMPTS_KEY = 'nh_oauth_api_rescue_attempts'

/**
 * Safety net when a stale service worker serves the SPA for
 * /api/admin/auth/google/callback (instead of Laravel). Without this,
 * React Router's `*` route sends users to the public landing page.
 */
export function GoogleOAuthApiRescuePage() {
  const { t } = useTranslation('admin')
  const navigate = useNavigate()
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) {
      return
    }
    startedRef.current = true

    void (async () => {
      const attempts = Number(sessionStorage.getItem(RESCUE_ATTEMPTS_KEY) ?? '0')
      if (attempts >= 2) {
        sessionStorage.removeItem(RESCUE_ATTEMPTS_KEY)
        navigate('/admin/login?error=oauth_failed', { replace: true })
        return
      }

      sessionStorage.setItem(RESCUE_ATTEMPTS_KEY, String(attempts + 1))
      await unregisterAllServiceWorkers()
      // Full navigation so the request hits Laravel (Google code is still in the URL).
      window.location.replace(window.location.href)
    })()
  }, [navigate])

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-secondary via-background to-secondary/40 px-4">
      <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
        {t('common.completingLogin', { defaultValue: 'Menyelesaikan login Google...' })}
      </p>
    </div>
  )
}
