import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ExternalLink, Info, Megaphone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAnnouncementsList } from '@/hooks/useAnnouncements'
import type { Announcement } from '@/types'

const POPUP_DISMISSED_KEY = 'nh-dismissed-popups'
const POPUP_SESSION_KEY = 'nh-session-dismissed-popups'

function getDismissedPopups(): string[] {
  try {
    const permanent = JSON.parse(localStorage.getItem(POPUP_DISMISSED_KEY) ?? '[]')
    const session = JSON.parse(sessionStorage.getItem(POPUP_SESSION_KEY) ?? '[]')
    return [...new Set([...permanent, ...session])]
  } catch {
    return []
  }
}

function dismissPopupPermanently(uuid: string) {
  try {
    const current: string[] = JSON.parse(localStorage.getItem(POPUP_DISMISSED_KEY) ?? '[]')
    if (!current.includes(uuid)) {
      localStorage.setItem(POPUP_DISMISSED_KEY, JSON.stringify([...current, uuid]))
    }
  } catch { /* ignore */ }
}

function dismissPopupForSession(uuid: string) {
  try {
    const current: string[] = JSON.parse(sessionStorage.getItem(POPUP_SESSION_KEY) ?? '[]')
    if (!current.includes(uuid)) {
      sessionStorage.setItem(POPUP_SESSION_KEY, JSON.stringify([...current, uuid]))
    }
  } catch { /* ignore */ }
}

const priorityIcons = {
  urgent: AlertTriangle,
  important: Megaphone,
  normal: Info,
} as const

const priorityColors = {
  urgent: 'text-destructive',
  important: 'text-amber-500 dark:text-amber-400',
  normal: 'text-primary',
} as const

export function AnnouncementPopup() {
  const { t } = useTranslation('layout')
  const { data } = useAnnouncementsList({ per_page: 5 })
  const [dismissed, setDismissed] = useState<string[]>(getDismissedPopups)
  const [dontShow, setDontShow] = useState(false)
  const [open, setOpen] = useState(false)

  const popup = useMemo(() => {
    const items = (data?.data ?? []).filter(
      (a: Announcement) =>
        a.is_active &&
        a.is_pinned &&
        !dismissed.includes(a.uuid),
    )
    if (items.length === 0) return null
    const order = ['urgent', 'important', 'normal'] as const
    return items.reduce((best, curr) =>
      order.indexOf(curr.priority) < order.indexOf(best.priority) ? curr : best,
    )
  }, [data, dismissed])

  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => setOpen(true), 800)
      return () => clearTimeout(timer)
    }
  }, [popup])

  if (!popup) return null

  const Icon = priorityIcons[popup.priority]
  const iconColor = priorityColors[popup.priority]

  function handleClose() {
    if (dontShow) {
      dismissPopupPermanently(popup!.uuid)
    }
    dismissPopupForSession(popup!.uuid)
    setDismissed(getDismissedPopups())
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-secondary ${iconColor}`}>
              <Icon className="h-5 w-5" aria-hidden />
            </div>
          </div>
          <DialogTitle className="text-lg">{popup.title}</DialogTitle>
          {popup.content && (
            <DialogDescription className="whitespace-pre-line text-sm leading-relaxed">
              {popup.content}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="flex-col gap-3 sm:flex-col">
          {popup.cta_text && popup.cta_url && (
            <a
              href={popup.cta_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              {popup.cta_text}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          )}
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={dontShow}
              onCheckedChange={(v) => setDontShow(v === true)}
            />
            {t('announcement.dontShowAgain')}
          </label>
          <Button onClick={handleClose} className="w-full">
            {t('announcement.understood')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
