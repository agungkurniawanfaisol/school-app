import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { AdminImageField } from '@/components/admin/AdminImageField'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  useAdminHeroSliderDetail,
  useCreateHeroSlider,
  useUpdateHeroSlider,
} from '@/hooks/useHeroSliders'
import { useSchool } from '@/hooks/useSchool'

export function HeroSliderFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminHeroSliderDetail(numericId)
  const createItem = useCreateHeroSlider()
  const updateItem = useUpdateHeroSlider(numericId)

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [image, setImage] = useState('')
  const [ctaText, setCtaText] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!existing) return
    setTitle(existing.title)
    setSubtitle(existing.subtitle ?? '')
    setImage(existing.image ?? '')
    setCtaText(existing.cta_text ?? '')
    setCtaUrl(existing.cta_url ?? '')
    setOrder(existing.order)
    setIsActive(existing.is_active)
  }, [existing])

  if (isEdit && isLoading) {
    return <p className="text-sm text-muted-foreground">Memuat data...</p>
  }

  const payload = {
    school_id: school?.id ?? existing?.school_id ?? 0,
    title,
    subtitle: subtitle || null,
    image,
    cta_text: ctaText || null,
    cta_url: ctaUrl || null,
    order,
    is_active: isActive,
  }

  const handleSave = () => {
    if (isEdit) {
      updateItem.mutate(payload, { onSuccess: () => navigate('/admin/hero-sliders') })
    } else {
      createItem.mutate(payload, { onSuccess: () => navigate('/admin/hero-sliders') })
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? 'Edit Carousel' : 'Tambah Carousel'}
      backHref="/admin/hero-sliders"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/hero-sliders')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!title || !image || !payload.school_id}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subjudul</Label>
            <Input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="h-11" />
          </div>
          <AdminImageField label="Gambar" value={image} onChange={setImage} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cta_text">Teks Tombol</Label>
              <Input id="cta_text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_url">URL Tombol</Label>
              <Input id="cta_url" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} className="h-11" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Urutan</Label>
            <Input
              id="order"
              type="number"
              min={0}
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="h-11"
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-primary/10 p-4">
            <Label htmlFor="is_active">Aktif</Label>
            <Switch id="is_active" checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardContent>
      </Card>
    </AdminFormShell>
  )
}
