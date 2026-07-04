import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { toDatetimeLocalValue, fromDatetimeLocalValue, NEWS_DISPLAY_STATUS_LABELS } from '@/lib/newsDisplayStatus'
import { EMPTY_EDITOR_DOC, type EditorDocument } from '@/schemas/editor'
import type { NewsFormValues } from '@/schemas/news'

export function NewsFormPage() {
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
        <Label htmlFor="title">Judul</Label>
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
        <Label htmlFor="slug">Slug</Label>
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
        <Label htmlFor="category">Kategori</Label>
        <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="h-11" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="excerpt">Ringkasan</Label>
        <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="thumbnail">URL Thumbnail</Label>
        <Input id="thumbnail" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className="h-11" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          className="h-4 w-4"
        />
        Tampilkan di beranda
      </label>

      <div className="space-y-3 rounded-lg border border-dashed p-3">
        <p className="text-sm font-medium">Jadwal tampil</p>
        <div className="space-y-2">
          <Label htmlFor="published-at">Mulai tampil</Label>
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
          <Label htmlFor="publish-ends-at">Berakhir tampil (opsional)</Label>
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
            Status saat ini: {NEWS_DISPLAY_STATUS_LABELS[existing.display_status]}
            {existing.published_at && ` · mulai ${formatDate(existing.published_at)}`}
            {existing.publish_ends_at && ` · berakhir ${formatDate(existing.publish_ends_at)}`}
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
          Publikasikan
        </Button>
      )}
    </div>
  )

  if (isEdit && isLoading) {
    return <div className="p-6 text-muted-foreground">Memuat…</div>
  }

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm" className="min-h-11 -ml-2 gap-2 px-0 hover:bg-transparent">
        <Link to="/admin/news">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke daftar berita
        </Link>
      </Button>
      <Card className="border-primary/10">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold">{isEdit ? 'Edit Berita' : 'Tambah Berita'}</h1>
            <p className="text-sm text-muted-foreground">Page builder untuk konten berita</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setFullscreenOpen(true)}>
              <Maximize2 className="h-4 w-4" />
              Fullscreen
            </Button>
            {isEdit && uuid && (
              <Button asChild variant="outline">
                <Link to={`/admin/news/${uuid}/preview`}>Pratinjau</Link>
              </Button>
            )}
            <Button
              type="button"
              disabled={createNews.isPending || updateNews.isPending}
              onClick={() => handleSave(false)}
            >
              <Save className="h-4 w-4" />
              Simpan
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
              Simpan & Pratinjau
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="lg:grid lg:grid-cols-[320px_1fr] lg:gap-6">
        <Tabs defaultValue="content" className="lg:hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Konten</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          </TabsList>
          <TabsContent value="settings" className="mt-4">
            <Card>
              <CardContent className="p-4">{metaFields}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="content" className="mt-4">
            <RichPageEditor
              collection="news"
              value={contentJson}
              onChange={(json, html) => {
                setContentJson(json)
                setContentHtml(html)
                setDirty(true)
              }}
            />
          </TabsContent>
        </Tabs>

        <Card className="hidden lg:block">
          <CardContent className="p-4">{metaFields}</CardContent>
        </Card>

        <div className="hidden lg:block">
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
      </div>

      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent className="fixed inset-0 flex h-dvh max-h-none w-screen max-w-none translate-x-0 translate-y-0 flex-col rounded-none border-0 p-0">
          <DialogHeader className="border-b px-4 py-3">
            <DialogTitle>Pratinjau fullscreen</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="mb-4 text-2xl font-bold">{title || 'Tanpa judul'}</h2>
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
