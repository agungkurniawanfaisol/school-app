import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ImagePlus, Loader2, Maximize2, Save } from 'lucide-react'
import { FacilityPhotoGalleryEditor } from '@/components/admin/FacilityPhotoGalleryEditor'
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
  useAdminFacilityDetail,
  useCreateFacility,
  useUpdateFacility,
} from '@/hooks/useFacilities'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { useSchool } from '@/hooks/useSchool'
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges'
import { slugify } from '@/lib/utils'
import { EMPTY_EDITOR_DOC, type EditorDocument } from '@/schemas/editor'
import { facilitySchema, type FacilityFormValues, type FacilityPhotoFormValues } from '@/schemas/facility'

export function FacilityFormPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const isEdit = !!uuid
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminFacilityDetail(uuid ?? '')
  const createFacility = useCreateFacility()
  const updateFacility = useUpdateFacility(uuid ?? '')
  const thumbnailUpload = useMediaUpload('facilities')
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [dirty, setDirty] = useState(false)
  useUnsavedChanges(dirty)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [order, setOrder] = useState(0)
  const [photos, setPhotos] = useState<FacilityPhotoFormValues[]>([])
  const [contentJson, setContentJson] = useState<EditorDocument>(EMPTY_EDITOR_DOC)
  const [contentHtml, setContentHtml] = useState('')

  useEffect(() => {
    if (!existing) return
    setName(existing.name)
    setSlug(existing.slug)
    setDescription(existing.description ?? '')
    setCategory(existing.category ?? '')
    setThumbnail(existing.thumbnail ?? '')
    setIsFeatured(existing.is_featured)
    setIsActive(existing.is_active)
    setOrder(existing.order)
    setPhotos(
      (existing.photos ?? []).map((photo, index) => ({
        id: photo.id,
        path: photo.url ?? photo.path,
        caption: photo.caption,
        order: photo.order ?? index,
        is_active: photo.is_active,
      })),
    )
    setContentJson((existing.content_json as EditorDocument) ?? EMPTY_EDITOR_DOC)
    setContentHtml(existing.content ?? '')
  }, [existing])

  const buildPayload = (): FacilityFormValues => ({
    school_id: school?.id ?? existing?.school_id ?? 0,
    name,
    slug: slug || slugify(name),
    description: description || null,
    category: category || null,
    thumbnail: thumbnail || null,
    content: contentHtml || null,
    content_json: contentJson,
    is_active: isActive,
    is_featured: isFeatured,
    order,
    photos: photos.map((photo, index) => ({ ...photo, order: index })),
  })

  const handleSave = async (andPreview = false) => {
    const payload = buildPayload()
    const parsed = facilitySchema.safeParse(payload)
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Data tidak valid.')
      return
    }
    if (!parsed.data.school_id) return

    if (isEdit) {
      await updateFacility.mutateAsync(parsed.data)
      setDirty(false)
      if (andPreview && uuid) {
        window.open(`/admin/facilities/${uuid}/preview`, '_blank', 'noopener,noreferrer')
      }
      return
    }

    const created = await createFacility.mutateAsync(parsed.data)
    setDirty(false)
    if (andPreview) {
      window.open(`/admin/facilities/${created.uuid}/preview`, '_blank', 'noopener,noreferrer')
    } else {
      navigate(`/admin/facilities/${created.uuid}/edit`, { replace: true })
    }
  }

  const handleThumbnailUpload = async (file: File) => {
    const media = await thumbnailUpload.mutateAsync(file)
    setThumbnail(media.url)
    setDirty(true)
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = ''
  }

  const metaFields = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Fasilitas</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
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
        <Input
          id="category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setDirty(true)
          }}
          placeholder="Contoh: akademik, olahraga"
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Ringkasan Singkat</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            setDirty(true)
          }}
          rows={3}
          placeholder="Deskripsi singkat untuk kartu di beranda"
        />
      </div>
      <div className="space-y-2">
        <Label>Thumbnail</Label>
        {thumbnail ? (
          <div className="relative overflow-hidden rounded-xl border border-primary/10">
            <img src={thumbnail} alt="Thumbnail fasilitas" className="aspect-video w-full object-cover" />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute bottom-2 right-2"
              onClick={() => thumbnailInputRef.current?.click()}
            >
              Ganti
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full"
            disabled={thumbnailUpload.isPending}
            onClick={() => thumbnailInputRef.current?.click()}
          >
            {thumbnailUpload.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <ImagePlus className="h-4 w-4" aria-hidden />
            )}
            Unggah Thumbnail
          </Button>
        )}
        <input
          ref={thumbnailInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          aria-label="Unggah thumbnail"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void handleThumbnailUpload(file)
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="order">Urutan Tampil</Label>
        <Input
          id="order"
          type="number"
          min={0}
          value={order}
          onChange={(e) => {
            setOrder(Number(e.target.value))
            setDirty(true)
          }}
          className="h-11"
        />
      </div>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isFeatured}
          onChange={(e) => {
            setIsFeatured(e.target.checked)
            setDirty(true)
          }}
          className="h-4 w-4"
        />
        Tampilkan di beranda
      </label>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => {
            setIsActive(e.target.checked)
            setDirty(true)
          }}
          className="h-4 w-4"
        />
        Aktif
      </label>
    </div>
  )

  if (isEdit && isLoading) {
    return <div className="p-6 text-muted-foreground">Memuat…</div>
  }

  return (
    <div className="space-y-4">
      <Card className="border-primary/10">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold">{isEdit ? 'Edit Fasilitas' : 'Tambah Fasilitas'}</h1>
            <p className="text-sm text-muted-foreground">Galeri foto + editor konten detail</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setFullscreenOpen(true)}>
              <Maximize2 className="h-4 w-4" />
              Fullscreen
            </Button>
            {isEdit && uuid && (
              <Button asChild variant="outline">
                <Link to={`/admin/facilities/${uuid}/preview`} target="_blank" rel="noopener noreferrer">
                  Pratinjau
                </Link>
              </Button>
            )}
            <Button
              type="button"
              disabled={createFacility.isPending || updateFacility.isPending}
              onClick={() => void handleSave(false)}
            >
              <Save className="h-4 w-4" />
              Simpan
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={createFacility.isPending || updateFacility.isPending}
              onClick={() => {
                if (dirty || !isEdit) {
                  void handleSave(true)
                } else if (uuid) {
                  window.open(`/admin/facilities/${uuid}/preview`, '_blank', 'noopener,noreferrer')
                }
              }}
            >
              Simpan & Pratinjau
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="content" className="lg:hidden">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Konten</TabsTrigger>
          <TabsTrigger value="gallery">Galeri</TabsTrigger>
          <TabsTrigger value="settings">Pengaturan</TabsTrigger>
        </TabsList>
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardContent className="p-4">{metaFields}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="gallery" className="mt-4">
          <FacilityPhotoGalleryEditor
            photos={photos}
            onChange={(next) => {
              setPhotos(next)
              setDirty(true)
            }}
          />
        </TabsContent>
        <TabsContent value="content" className="mt-4">
          <RichPageEditor
            collection="facilities"
            value={contentJson}
            onChange={(json, html) => {
              setContentJson(json)
              setContentHtml(html)
              setDirty(true)
            }}
          />
        </TabsContent>
      </Tabs>

      <div className="hidden gap-6 lg:grid lg:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">{metaFields}</CardContent>
          </Card>
          <FacilityPhotoGalleryEditor
            photos={photos}
            onChange={(next) => {
              setPhotos(next)
              setDirty(true)
            }}
          />
        </div>
        <RichPageEditor
          collection="facilities"
          value={contentJson}
          onChange={(json, html) => {
            setContentJson(json)
            setContentHtml(html)
            setDirty(true)
          }}
        />
      </div>

      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent className="fixed inset-0 flex h-dvh max-h-none w-screen max-w-none flex-col rounded-none border-0 p-0">
          <DialogHeader className="border-b px-4 py-3">
            <DialogTitle>Pratinjau konten</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="mb-4 text-2xl font-bold">{name || 'Tanpa judul'}</h2>
            {description && <p className="mb-6 text-lg text-muted-foreground">{description}</p>}
            <BlockRenderer contentJson={contentJson} contentHtml={contentHtml} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
