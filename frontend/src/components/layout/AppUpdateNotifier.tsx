import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import {
  fetchServerVersion,
  formatAppVersion,
  setSeenVersion,
  shouldNotifyUpdate,
} from '@/lib/app-version'

const POLL_MS = 5 * 60 * 1000
const TOAST_ID = 'nh-app-update'

function notifyUpdate(serverVersion: string): void {
  toast.message(`Versi baru tersedia (${formatAppVersion(serverVersion)}).`, {
    id: TOAST_ID,
    description: 'Muat ulang untuk memperbarui.',
    duration: Infinity,
    action: {
      label: 'Muat ulang',
      onClick: () => {
        setSeenVersion(serverVersion)
        window.location.reload()
      },
    },
    // Closing the toast only hides it; poll/visibility can show it again until reload.
  })
}

export function AppUpdateNotifier() {
  const checkingRef = useRef(false)

  useEffect(() => {
    const controller = new AbortController()

    const check = async () => {
      if (checkingRef.current) return
      checkingRef.current = true
      try {
        const info = await fetchServerVersion(controller.signal)
        if (!info?.version) return
        if (shouldNotifyUpdate(info.version)) {
          notifyUpdate(info.version)
        }
      } finally {
        checkingRef.current = false
      }
    }

    void check()

    const onVisible = () => {
      if (document.visibilityState === 'visible') void check()
    }

    document.addEventListener('visibilitychange', onVisible)
    const intervalId = window.setInterval(() => void check(), POLL_MS)

    return () => {
      controller.abort()
      document.removeEventListener('visibilitychange', onVisible)
      window.clearInterval(intervalId)
    }
  }, [])

  return null
}
