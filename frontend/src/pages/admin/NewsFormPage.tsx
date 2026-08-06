import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Maximize2, Save } from 'lucide-react'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { RichPageEditor } from '@/components/editor/RichPageEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  useAdminNewsDetail,
  useCreateNews,
  usePublishNews,
  useUpdateNews,
} from '@/hooks/useNews'
import { useSchool } from '@/hooks/useSchool'
import { NewsPublishDialog } from '@/components/admin/NewsPublishDialog'
import { slugify, formatDate } from '@/lib/utils'
import { toDatetimeLocalValue, fromDatetimeLocalValue } from '@/lib/newsDisplayStatus'
import { useNewsDisplayStatusLabels } from '@/hooks/useNewsDisplayStatusLabels'
import { EMPTY_EDITOR_DOC, type EditorDocument } from '@/schemas/editor'
import type { NewsFormValues } from '@/schemas/news'

export function NewsFormPage() {
  const { t } = useTranslation('admin')
  const statusLabels = useNewsDisplayStatusLabels()
  const { uuid } = useParams<{ uuid: string }>()
  const isEdit = !!uuid
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminNewsDetail(uuid ?? '')
  const createNews = useCreateNews()
  const updateNews = useUpdateNews(uuid ?? '')
  const publishNews = usePublishNews()
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [dirty, setDirty] = useState(false)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [publishedAt, setPublishedAt] = useState('')
  const [publishEndsAt, setPublishEndsAt] = useState('')
  const [contentJson, setContentJson] = useState<EditorDocument>(EMPTY_EDITOR_DOC)
  const [contentHtml, setContentHtml] = useState('')

  useEffect(() => {
    if (!existing) return
    setTitle(existing.title)
    setSlug(existing.slug)
    setExcerpt(existing.excerpt ?? '')
    setCategory(existing.category ?? '')
    setThumbnail(existing.thumbnail ?? '')
    setIsFeatured(existing.is_featured)
    setPublishedAt(toDatetimeLocalValue(existing.published_at))
    setPublishEndsAt(toDatetimeLocalValue(existing.publish_ends_at))
    setContentJson((existing.content_json as EditorDocument) ?? EMPTY_EDITOR_DOC)
    setContentHtml(existing.content ?? '')
  }, [existing])

  const buildPayload = (): NewsFormValues => ({
    school_id: school?.id ?? existing?.school_id ?? 0,
    title,
    slug: slug || slugify(title),
    excerpt: excerpt || null,
    category: category || null,
    thumbnail: thumbnail || null,
    content: contentHtml || null,
    content_json: contentJson,
    status: (existing?.status as NewsFormValues['status'] | undefined) ?? 'draft',
    is_active: true,
    is_featured: isFeatured,
    order: existing?.order ?? 0,
    published_at: fromDatetimeLocalValue(publishedAt),
    publish_ends_at: fromDatetimeLocalValue(publishEndsAt),
  })

  const handleSave = async (andPreview = false) => {
    const payload = buildPayload()
    if (!payload.school_id) return

    if (isEdit) {
      await updateNews.mutateAsync(payload)
      setDirty(false)
      if (andPreview && uuid) {
        navigate(`/admin/news/${uuid}/preview`)
      }
      return
    }

    const created = await createNews.mutateAsync(payload)
    setDirty(false)
    if (andPreview) {
      navigate(`/admin/news/${created.uuid}/preview`)
    } else {
      navigate(`/admin/news/${created.uuid}/edit`, { replace: true })
    }
  }

  const metaFields = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">{t('form.title')}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setDirty(true)
            if (!isEdit && !slug) setSlug(slugify(e.target.value))
          }}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">{t('form.slug')}</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value)
            setDirty(true)
          }}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">{t('form.category')}</Label>
        <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="h-11" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="excerpt">{t('form.excerpt')}</Label>
        <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="thumbnail">{t('form.thumbnail')}</Label>
        <Input id="thumbnail" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className="h-11" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          className="h-4 w-4"
        />
        {t('form.showOnHomepageLabel')}
      </label>

      <div className="space-y-3 rounded-lg border border-dashed p-3">
        <p className="text-sm font-medium">{t('publish.scheduleTitle')}</p>
        <div className="space-y-2">
          <Label htmlFor="published-at">{t('publish.startsLabel')}</Label>
          <Input
            id="published-at"
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => {
              setPublishedAt(e.target.value)
              setDirty(true)
            }}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="publish-ends-at">{t('publish.endsLabel')}</Label>
          <Input
            id="publish-ends-at"
            type="datetime-local"
            value={publishEndsAt}
            onChange={(e) => {
              setPublishEndsAt(e.target.value)
              setDirty(true)
            }}
            className="h-11"
          />
        </div>
        {existing?.display_status && existing.display_status !== 'draft' && (
          <p className="text-xs text-muted-foreground">
            {t('publish.currentStatus', { status: statusLabels[existing.display_status] })}
            {existing.published_at && ` · ${t('publish.startsAt', { date: formatDate(existing.published_at) })}`}
            {existing.publish_ends_at && ` · ${t('publish.endsAt', { date: formatDate(existing.publish_ends_at) })}`}
          </p>
        )}
      </div>

      {isEdit && existing?.status !== 'published' && (
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={publishNews.isPending}
          onClick={() => setPublishOpen(true)}
        >
          {t('common.publish')}
        </Button>
      )}
    </div>
  )

  if (isEdit && isLoading) {
    return <div className="p-6 text-muted-foreground">{t('common.loading')}</div>
  }

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm" className="min-h-11 -ml-2 gap-2 px-0 hover:bg-transparent">
        <Link to="/admin/news">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('pages.news.listTitle')}
        </Link>
      </Button>
      <Card className="border-primary/10">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold">{isEdit ? t('pages.news.editTitle') : t('pages.news.createTitle')}</h1>
            <p className="text-sm text-muted-foreground">{t('pages.news.formDesc')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setFullscreenOpen(true)}>
              <Maximize2 className="h-4 w-4" />
              {t('common.fullscreen')}
            </Button>
            {isEdit && uuid && (
              <Button asChild variant="outline">
                <Link to={`/admin/news/${uuid}/preview`}>{t('common.preview')}</Link>
              </Button>
            )}
            <Button
              type="button"
              disabled={createNews.isPending || updateNews.isPending}
              onClick={() => handleSave(false)}
            >
              <Save className="h-4 w-4" />
              {t('common.save')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={createNews.isPending || updateNews.isPending}
              onClick={() => {
                if (dirty || !isEdit) {
                  void handleSave(true)
                } else if (uuid) {
                  navigate(`/admin/news/${uuid}/preview`)
                }
              }}
            >
              {t('common.save')} & {t('common.preview')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:grid lg:grid-cols-[320px_1fr] lg:gap-6 lg:space-y-0">
        <Card>
          <CardContent className="p-4">{metaFields}</CardContent>
        </Card>

        <RichPageEditor
          collection="news"
          value={contentJson}
          onChange={(json, html) => {
            setContentJson(json)
            setContentHtml(html)
            setDirty(true)
          }}
        />
      </div>

      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent className="fixed inset-0 flex h-dvh max-h-none w-screen max-w-none translate-x-0 translate-y-0 flex-col rounded-none border-0 p-0">
          <DialogHeader className="border-b px-4 py-3">
            <DialogTitle>{t('pages.activities.fullscreenPreview')}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="mb-4 text-2xl font-bold">{title || t('common.untitled')}</h2>
            <BlockRenderer contentJson={contentJson} contentHtml={contentHtml} />
          </div>
        </DialogContent>
      </Dialog>

      {existing && (
        <NewsPublishDialog
          news={existing}
          open={publishOpen}
          onOpenChange={setPublishOpen}
          isPending={publishNews.isPending}
          onConfirm={(newsUuid, payload) => {
            publishNews.mutate(
              { uuid: newsUuid, ...payload },
              { onSuccess: () => setPublishOpen(false) },
            )
          }}
        />
      )}
    </div>
  )
}
