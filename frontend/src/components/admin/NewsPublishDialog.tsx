import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fromDatetimeLocalValue, toDatetimeLocalValue } from '@/lib/newsDisplayStatus'
import type { News } from '@/types'
import { toast } from 'sonner'

export interface NewsPublishSchedulePayload {
  published_at?: string | null
  publish_ends_at?: string | null
}

interface NewsPublishDialogProps {
  news: News | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isPending?: boolean
  onConfirm: (uuid: string, payload: NewsPublishSchedulePayload) => void
}

export function NewsPublishDialog({
  news,
  open,
  onOpenChange,
  isPending,
  onConfirm,
}: NewsPublishDialogProps) {
  const { t } = useTranslation('admin')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')

  useEffect(() => {
    if (!open || !news) return
    setStartsAt(toDatetimeLocalValue(news.published_at) || toDatetimeLocalValue(new Date().toISOString()))
    setEndsAt(toDatetimeLocalValue(news.publish_ends_at))
  }, [open, news])

  const handlePublishNow = () => {
    if (!news) return
    const endsAtIso = fromDatetimeLocalValue(endsAt)
    const nowIso = new Date().toISOString()
    if (endsAtIso && new Date(endsAtIso) <= new Date(nowIso)) {
      toast.error(t('validation.endAfterStart'))
      return
    }
    onConfirm(news.uuid, {
      published_at: nowIso,
      publish_ends_at: endsAtIso,
    })
  }

  const handleSchedule = () => {
    if (!news) return
    const startsAtIso = fromDatetimeLocalValue(startsAt)
    const endsAtIso = fromDatetimeLocalValue(endsAt)
    if (!startsAtIso) {
      toast.error(t('validation.invalidStartTime'))
      return
    }
    if (endsAtIso && new Date(endsAtIso) <= new Date(startsAtIso)) {
      toast.error(t('validation.endAfterStart'))
      return
    }
    onConfirm(news.uuid, {
      published_at: startsAtIso,
      publish_ends_at: endsAtIso,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('publish.title')}</DialogTitle>
          <DialogDescription>
            {t('publish.description', { title: news?.title })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="publish-starts">{t('publish.startsLabel')}</Label>
            <Input
              id="publish-starts"
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="publish-ends">{t('publish.endsLabel')}</Label>
            <Input
              id="publish-ends"
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="h-11"
            />
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="button" variant="secondary" disabled={isPending} onClick={handlePublishNow}>
            {t('common.publishNow')}
          </Button>
          <Button type="button" disabled={isPending || !startsAt} onClick={handleSchedule}>
            {t('common.saveSchedule')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
