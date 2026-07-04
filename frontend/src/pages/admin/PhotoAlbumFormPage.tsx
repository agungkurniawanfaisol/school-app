import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { AdminImageField } from '@/components/admin/AdminImageField'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  useAdminPhotoAlbumDetail,
  useCreatePhotoAlbum,
  useUpdatePhotoAlbum,
} from '@/hooks/usePhotoAlbums'
import { useSchool } from '@/hooks/useSchool'
import { Trash2, Plus } from 'lucide-react'

interface PhotoEntry {
  url: string
  caption: string
  order: number
}

export function PhotoAlbumFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminPhotoAlbumDetail(numericId)
  const createItem = useCreatePhotoAlbum()
  const updateItem = useUpdatePhotoAlbum(numericId)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [photos, setPhotos] = useState<PhotoEntry[]>([])

  useEffect(() => {
    if (!existing) return
    setTitle(existing.title)
    setDescription(existing.description ?? '')
    setCoverImage(existing.cover_image ?? '')
    setEventDate(existing.event_date ?? '')
    setOrder(existing.order)
    setIsActive(existing.is_active)
    setPhotos(
      existing.photos?.map((p) => ({
        url: p.url,
        caption: p.caption ?? '',
        order: p.order,
      })) ?? []
    )
  }, [existing])

  if (isEdit && isLoading) return <p className="text-sm text-muted-foreground">Memuat data...</p>

  const payload = {
    school_id: school?.id ?? existing?.school_id ?? 0,
    title,
    description: description || null,
    cover_image: coverImage || null,
    event_date: eventDate || null,
    order,
    is_active: isActive,
    photos: photos.map((p, i) => ({
      url: p.url,
      caption: p.caption || null,
      order: p.order ?? i,
    })),
  }

  const handleSave = () => {
    if (isEdit) {
      updateItem.mutate(payload, { onSuccess: () => navigate('/admin/photo-albums') })
    } else {
      createItem.mutate(payload, { onSuccess: () => navigate('/admin/photo-albums') })
    }
  }

  const addPhoto = () => {
    setPhotos([...photos, { url: '', caption: '', order: photos.length }])
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const updatePhoto = (index: number, field: keyof PhotoEntry, value: string | number) => {
    const updated = [...photos]
    updated[index] = { ...updated[index], [field]: value }
    setPhotos(updated)
  }

  return (
    <AdminFormShell
      title={isEdit ? 'Edit Album Foto' : 'Tambah Album Foto'}
      backHref="/admin/photo-albums"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/photo-albums')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!title || !payload.school_id}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <AdminImageField label="Cover Album" value={coverImage} onChange={setCoverImage} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="event_date">Tanggal Kegiatan</Label>
              <Input id="event_date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Urutan</Label>
              <Input id="order" type="number" min={0} value={order} onChange={(e) => setOrder(Number(e.target.value))} className="h-11" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-primary/10 p-4">
            <Label htmlFor="is_active">Aktif</Label>
            <Switch id="is_active" checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardContent>
      </Card>

      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Foto Album</Label>
            <Button type="button" variant="outline" size="sm" onClick={addPhoto}>
              <Plus className="mr-1 h-4 w-4" />
              Tambah Foto
            </Button>
          </div>

          {photos.length > 0 && (
            <div className="grid gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg border p-3">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      {photo.url && (
                        <img
                          src={photo.url}
                          alt={photo.caption || `Foto ${index + 1}`}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                      )}
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="URL foto"
                          value={photo.url}
                          onChange={(e) => updatePhoto(index, 'url', e.target.value)}
                          className="h-9"
                        />
                        <Input
                          placeholder="Caption (opsional)"
                          value={photo.caption}
                          onChange={(e) => updatePhoto(index, 'caption', e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive"
                    onClick={() => removePhoto(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {photos.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Belum ada foto. Klik &quot;Tambah Foto&quot; untuk menambahkan.
            </p>
          )}
        </CardContent>
      </Card>
    </AdminFormShell>
  )
}
