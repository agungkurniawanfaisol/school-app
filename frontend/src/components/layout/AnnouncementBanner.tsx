import { useState } from 'react'
import { AlertTriangle, ExternalLink, Info, Megaphone, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useAnnouncementsList } from '@/hooks/useAnnouncements'
import type { Announcement } from '@/types'

const DISMISSED_KEY = 'nh-dismissed-banners'

function getDismissed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(DISMISSED_KEY) ?? '[]')
  } catch {
    return []
  }
}

function dismiss(uuid: string) {
  const current = getDismissed()
  if (!current.includes(uuid)) {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...current, uuid]))
  }
}

const priorityConfig = {
  urgent: {
    icon: AlertTriangle,
    bg: 'bg-destructive text-destructive-foreground',
    btnClass: 'border-destructive-foreground/30 text-destructive-foreground hover:bg-destructive-foreground/10',
  },
  important: {
    icon: Megaphone,
    bg: 'bg-amber-500 text-amber-950 dark:bg-amber-600 dark:text-amber-50',
    btnClass: 'border-amber-950/30 text-amber-950 hover:bg-amber-950/10 dark:border-amber-50/30 dark:text-amber-50 dark:hover:bg-amber-50/10',
  },
  normal: {
    icon: Info,
    bg: 'bg-primary text-primary-foreground',
    btnClass: 'border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10',
  },
} as const

export function AnnouncementBanner() {
  const { t } = useTranslation('layout')
  const { data } = useAnnouncementsList({ per_page: 5 })
  const [dismissed, setDismissed] = useState<string[]>(getDismissed)

  const announcements = (data?.data ?? []).filter(
    (a: Announcement) => a.is_active && !dismissed.includes(a.uuid),
  )

  const active = announcements.length > 0
    ? announcements.reduce((best: Announcement, curr: Announcement) => {
        const order = ['urgent', 'important', 'normal'] as const
        return order.indexOf(curr.priority) < order.indexOf(best.priority) ? curr : best
      })
    : null

  if (!active) return null

  const config = priorityConfig[active.priority]
  const Icon = config.icon

  function handleDismiss() {
    dismiss(active!.uuid)
    setDismissed(getDismissed())
  }

  return (
    <div className={`relative z-50 ${config.bg}`} role="alert">
      <div className="container-page flex items-center gap-3 px-4 py-2.5">
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        <p className="flex-1 text-sm font-medium">{active.title}</p>
        {active.cta_text && active.cta_url && (
          <a
            href={active.cta_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden items-center gap-1 rounded-md border px-3 py-1 text-xs font-medium transition-colors sm:inline-flex ${config.btnClass}`}
          >
            {active.cta_text}
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 shrink-0 rounded-full border ${config.btnClass}`}
          onClick={handleDismiss}
          aria-label={t('announcement.dismiss')}
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </Button>
      </div>
    </div>
  )
}
