import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useAdminAnnouncementDetail,
  useCreateAnnouncement,
  useUpdateAnnouncement,
} from '@/hooks/useAnnouncements'
import { useSchool } from '@/hooks/useSchool'

export function AnnouncementFormPage() {
  const { t } = useTranslation('admin')
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminAnnouncementDetail(numericId)
  const createItem = useCreateAnnouncement()
  const updateItem = useUpdateAnnouncement(numericId)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>('normal')
  const [isPinned, setIsPinned] = useState(false)
  const [publishedAt, setPublishedAt] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [ctaText, setCtaText] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')

  useEffect(() => {
    if (!existing) return
    setTitle(existing.title)
    setContent(existing.content)
    setPriority(existing.priority)
    setIsPinned(existing.is_pinned)
    setPublishedAt(existing.published_at ? existing.published_at.slice(0, 16) : '')
    setExpiresAt(existing.expires_at ? existing.expires_at.slice(0, 16) : '')
    setOrder(existing.order)
    setIsActive(existing.is_active)
    setCtaText(existing.cta_text ?? '')
    setCtaUrl(existing.cta_url ?? '')
  }, [existing])

  if (isEdit && isLoading) return <p className="text-sm text-muted-foreground">{t('common.loadingData')}</p>

  const payload = {
    school_id: school?.id ?? existing?.school_id ?? 0,
    title,
    content,
    priority,
    is_pinned: isPinned,
    published_at: publishedAt || null,
    expires_at: expiresAt || null,
    order,
    is_active: isActive,
    cta_text: ctaText || null,
    cta_url: ctaUrl || null,
  }

  const handleSave = () => {
    if (isEdit) {
      updateItem.mutate(payload, { onSuccess: () => navigate('/admin/announcements') })
    } else {
      createItem.mutate(payload, { onSuccess: () => navigate('/admin/announcements') })
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? t('pages.announcements.editTitle') : t('pages.announcements.createTitle')}
      backHref="/admin/announcements"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/announcements')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!title || !content || !payload.school_id}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="title">{t('form.title')}</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">{t('form.content')}</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={5} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priority">{t('form.priority')}</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                <SelectTrigger id="priority" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">{t('status.normal')}</SelectItem>
                  <SelectItem value="important">{t('status.important')}</SelectItem>
                  <SelectItem value="urgent">{t('status.urgent')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">{t('form.order')}</Label>
              <Input id="order" type="number" min={0} value={order} onChange={(e) => setOrder(Number(e.target.value))} className="h-11" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="published_at">{t('form.publishedAt')}</Label>
              <Input id="published_at" type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expires_at">{t('form.expiresAt')}</Label>
              <Input id="expires_at" type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="h-11" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cta_text">{t('form.ctaText')}</Label>
              <Input id="cta_text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder={t('form.ctaExample')} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_url">{t('form.ctaUrl')}</Label>
              <Input id="cta_url" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://..." className="h-11" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-primary/10 p-4">
            <Label htmlFor="is_pinned">{t('form.isPinned')}</Label>
            <Switch id="is_pinned" checked={isPinned} onCheckedChange={setIsPinned} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-primary/10 p-4">
            <Label htmlFor="is_active">{t('form.active')}</Label>
            <Switch id="is_active" checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardContent>
      </Card>
    </AdminFormShell>
  )
}
