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
  useAdminAppReleaseDetail,
  useCreateAppRelease,
  useUpdateAppRelease,
} from '@/hooks/useAppReleases'
import { createAppReleaseSchema } from '@/schemas/app-release'

export function AppReleaseFormPage() {
  const { t } = useTranslation('admin')
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: existing, isLoading } = useAdminAppReleaseDetail(numericId)
  const createItem = useCreateAppRelease()
  const updateItem = useUpdateAppRelease(numericId)

  const [version, setVersion] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [publishedAt, setPublishedAt] = useState('')
  const [isPublished, setIsPublished] = useState(true)

  useEffect(() => {
    if (!existing) return
    setVersion(existing.version)
    setTitle(existing.title)
    setBody(existing.body)
    setPublishedAt(existing.published_at ? existing.published_at.slice(0, 16) : '')
    setIsPublished(existing.is_published)
  }, [existing])

  if (isEdit && isLoading) return <p className="text-sm text-muted-foreground">{t('common.loadingData')}</p>

  const payload = {
    version,
    title,
    body,
    published_at: publishedAt || null,
    is_published: isPublished,
  }

  const parsed = createAppReleaseSchema(t).safeParse(payload)

  const handleSave = () => {
    if (!parsed.success) return
    if (isEdit) {
      updateItem.mutate(parsed.data, { onSuccess: () => navigate('/admin/app-releases') })
    } else {
      createItem.mutate(parsed.data, { onSuccess: () => navigate('/admin/app-releases') })
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? t('pages.appReleases.editTitle') : t('pages.appReleases.createTitle')}
      backHref="/admin/app-releases"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/app-releases')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!parsed.success}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="version">{t('form.version')}</Label>
            <Input
              id="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
              className="h-11"
              disabled={isEdit}
            />
            <p className="text-xs text-muted-foreground">{t('pages.appReleases.versionHint')}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">{t('form.title')}</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">{t('form.releaseNotes')}</Label>
            <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} rows={6} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="published_at">{t('form.publishedAt')}</Label>
            <Input
              id="published_at"
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-primary/10 p-4">
            <Label htmlFor="is_published">{t('form.published')}</Label>
            <Switch id="is_published" checked={isPublished} onCheckedChange={setIsPublished} />
          </div>
        </CardContent>
      </Card>
    </AdminFormShell>
  )
}
