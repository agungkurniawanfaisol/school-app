import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Maximize2, Save } from 'lucide-react'
import { BlockRenderer } from '@/components/editor/BlockRenderer'
import { RichPageEditor } from '@/components/editor/RichPageEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  useAdminActivityDetail,
  useCreateActivity,
  usePublishActivity,
  useUpdateActivity,
} from '@/hooks/useActivities'
import { useSchool } from '@/hooks/useSchool'
import { slugify } from '@/lib/utils'
import { EMPTY_EDITOR_DOC, type EditorDocument } from '@/schemas/editor'
import type { ActivityFormValues } from '@/schemas/activity'

export function ActivityFormPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const isEdit = !!uuid
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminActivityDetail(uuid ?? '')
  const createActivity = useCreateActivity()
  const updateActivity = useUpdateActivity(uuid ?? '')
  const publishActivity = usePublishActivity()
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [dirty, setDirty] = useState(false)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [activityDate, setActivityDate] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [contentJson, setContentJson] = useState<EditorDocument>(EMPTY_EDITOR_DOC)
  const [contentHtml, setContentHtml] = useState('')

  useEffect(() => {
    if (!existing) return
    setTitle(existing.title)
    setSlug(existing.slug)
    setExcerpt(existing.excerpt ?? '')
    setCategory(existing.category ?? '')
    setThumbnail(existing.thumbnail ?? '')
    setActivityDate(existing.activity_date ?? '')
    setIsFeatured(existing.is_featured)
    setContentJson((existing.content_json as EditorDocument) ?? EMPTY_EDITOR_DOC)
    setContentHtml(existing.content ?? '')
  }, [existing])

  const buildPayload = (): ActivityFormValues => ({
    school_id: school?.id ?? existing?.school_id ?? 0,
    title,
    slug: slug || slugify(title),
    excerpt: excerpt || null,
    category: category || null,
    thumbnail: thumbnail || null,
    activity_date: activityDate || null,
    content: contentHtml || null,
    content_json: contentJson,
    status: (existing?.status as ActivityFormValues['status'] | undefined) ?? 'draft',
    is_active: true,
    is_featured: isFeatured,
    order: existing?.order ?? 0,
    published_at: existing?.published_at ?? null,
  })

  const handleSave = async (andPreview = false) => {
    const payload = buildPayload()
    if (!payload.school_id) return

    if (isEdit) {
      await updateActivity.mutateAsync(payload)
      setDirty(false)
      if (andPreview && uuid) navigate(`/admin/student-activities/${uuid}/preview`)
      return
    }

    const created = await createActivity.mutateAsync(payload)
    setDirty(false)
    if (andPreview) {
      navigate(`/admin/student-activities/${created.uuid}/preview`)
    } else {
      navigate(`/admin/student-activities/${created.uuid}/edit`, { replace: true })
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
        <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="h-11" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="activity_date">Tanggal Kegiatan</Label>
        <Input
          id="activity_date"
          type="date"
          value={activityDate}
          onChange={(e) => setActivityDate(e.target.value)}
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
        <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4" />
        Tampilkan di beranda
      </label>
      {isEdit && existing?.status !== 'published' && (
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={publishActivity.isPending}
          onClick={() => uuid && publishActivity.mutate(uuid)}
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
        <Link to="/admin/student-activities">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke daftar kegiatan
        </Link>
      </Button>
      <Card className="border-primary/10">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold">{isEdit ? 'Edit Kegiatan' : 'Tambah Kegiatan'}</h1>
            <p className="text-sm text-muted-foreground">Page builder untuk dokumentasi kegiatan siswa</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setFullscreenOpen(true)}>
              <Maximize2 className="h-4 w-4" />
              Fullscreen
            </Button>
            {isEdit && uuid && (
              <Button asChild variant="outline">
                <Link to={`/admin/student-activities/${uuid}/preview`}>Pratinjau</Link>
              </Button>
            )}
            <Button type="button" disabled={createActivity.isPending || updateActivity.isPending} onClick={() => handleSave(false)}>
              <Save className="h-4 w-4" />
              Simpan
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={createActivity.isPending || updateActivity.isPending}
              onClick={() => {
                if (dirty || !isEdit) void handleSave(true)
                else if (uuid) navigate(`/admin/student-activities/${uuid}/preview`)
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
            <Card><CardContent className="p-4">{metaFields}</CardContent></Card>
          </TabsContent>
          <TabsContent value="content" className="mt-4">
            <RichPageEditor
              collection="activities"
              value={contentJson}
              onChange={(json, html) => {
                setContentJson(json)
                setContentHtml(html)
                setDirty(true)
              }}
            />
          </TabsContent>
        </Tabs>

        <Card className="hidden lg:block"><CardContent className="p-4">{metaFields}</CardContent></Card>
        <div className="hidden lg:block">
          <RichPageEditor
            collection="activities"
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
        <DialogContent className="fixed inset-0 flex h-dvh max-h-none w-screen max-w-none flex-col rounded-none border-0 p-0">
          <DialogHeader className="border-b px-4 py-3">
            <DialogTitle>Pratinjau fullscreen</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="mb-4 text-2xl font-bold">{title || 'Tanpa judul'}</h2>
            <BlockRenderer contentJson={contentJson} contentHtml={contentHtml} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
