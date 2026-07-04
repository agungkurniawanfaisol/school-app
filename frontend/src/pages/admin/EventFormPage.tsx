import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  useAdminEventDetail,
  useCreateEvent,
  useUpdateEvent,
} from '@/hooks/useEvents'
import { useSchool } from '@/hooks/useSchool'

export function EventFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminEventDetail(numericId)
  const createItem = useCreateEvent()
  const updateItem = useUpdateEvent(numericId)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventEndDate, setEventEndDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [category, setCategory] = useState<'akademik' | 'keagamaan' | 'olahraga' | 'umum'>('umum')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!existing) return
    setTitle(existing.title)
    setDescription(existing.description ?? '')
    setLocation(existing.location ?? '')
    setEventDate(existing.event_date ?? '')
    setEventEndDate(existing.event_end_date ?? '')
    setEventTime(existing.event_time ?? '')
    setCategory(existing.category)
    setOrder(existing.order)
    setIsActive(existing.is_active)
  }, [existing])

  if (isEdit && isLoading) return <p className="text-sm text-muted-foreground">Memuat data...</p>

  const payload = {
    school_id: school?.id ?? existing?.school_id ?? 0,
    title,
    description: description || null,
    location: location || null,
    event_date: eventDate,
    event_end_date: eventEndDate || null,
    event_time: eventTime || null,
    category,
    order,
    is_active: isActive,
  }

  const handleSave = () => {
    if (isEdit) {
      updateItem.mutate(payload, { onSuccess: () => navigate('/admin/events') })
    } else {
      createItem.mutate(payload, { onSuccess: () => navigate('/admin/events') })
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? 'Edit Agenda' : 'Tambah Agenda'}
      backHref="/admin/events"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/events')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!title || !eventDate || !payload.school_id}
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
          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="h-11" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="event_date">Tanggal Mulai</Label>
              <Input id="event_date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_end_date">Tanggal Selesai</Label>
              <Input id="event_end_date" type="date" value={eventEndDate} onChange={(e) => setEventEndDate(e.target.value)} className="h-11" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="event_time">Waktu</Label>
              <Input id="event_time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} placeholder="Contoh: 08:00-12:00" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
                <SelectTrigger id="category" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="akademik">Akademik</SelectItem>
                  <SelectItem value="keagamaan">Keagamaan</SelectItem>
                  <SelectItem value="olahraga">Olahraga</SelectItem>
                  <SelectItem value="umum">Umum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Urutan</Label>
            <Input id="order" type="number" min={0} value={order} onChange={(e) => setOrder(Number(e.target.value))} className="h-11" />
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
