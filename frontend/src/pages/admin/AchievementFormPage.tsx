import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { AdminImageField } from '@/components/admin/AdminImageField'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  useAdminAchievementDetail,
  useCreateAchievement,
  useUpdateAchievement,
} from '@/hooks/useAchievements'
import { useSchool } from '@/hooks/useSchool'

const CATEGORY_OPTIONS = [
  { value: 'akademik', label: 'Akademik' },
  { value: 'olahraga', label: 'Olahraga' },
  { value: 'seni', label: 'Seni' },
  { value: 'keagamaan', label: 'Keagamaan' },
  { value: 'lainnya', label: 'Lainnya' },
]

const LEVEL_OPTIONS = [
  { value: 'sekolah', label: 'Sekolah' },
  { value: 'kecamatan', label: 'Kecamatan' },
  { value: 'kota', label: 'Kota/Kabupaten' },
  { value: 'provinsi', label: 'Provinsi' },
  { value: 'nasional', label: 'Nasional' },
  { value: 'internasional', label: 'Internasional' },
]

export function AchievementFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: existing, isLoading } = useAdminAchievementDetail(numericId)
  const createItem = useCreateAchievement()
  const updateItem = useUpdateAchievement(numericId)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('akademik')
  const [level, setLevel] = useState('sekolah')
  const [studentName, setStudentName] = useState('')
  const [year, setYear] = useState<number | ''>(new Date().getFullYear())
  const [image, setImage] = useState('')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!existing) return
    setTitle(existing.title)
    setDescription(existing.description ?? '')
    setCategory(existing.category)
    setLevel(existing.level)
    setStudentName(existing.student_name ?? '')
    setYear(existing.year)
    setImage(existing.image ?? '')
    setOrder(existing.order)
    setIsActive(existing.is_active)
  }, [existing])

  if (isEdit && isLoading) return <p className="text-sm text-muted-foreground">Memuat data...</p>

  const payload = {
    school_id: school?.id ?? existing?.school_id ?? 0,
    title,
    description: description || null,
    category: category as 'akademik' | 'olahraga' | 'seni' | 'keagamaan' | 'lainnya',
    level: level as 'sekolah' | 'kecamatan' | 'kota' | 'provinsi' | 'nasional' | 'internasional',
    student_name: studentName || null,
    year: year === '' ? new Date().getFullYear() : Number(year),
    image: image || null,
    order,
    is_active: isActive,
  }

  const handleSave = () => {
    if (isEdit) {
      updateItem.mutate(payload, { onSuccess: () => navigate('/admin/achievements') })
    } else {
      createItem.mutate(payload, { onSuccess: () => navigate('/admin/achievements') })
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? 'Edit Prestasi' : 'Tambah Prestasi'}
      backHref="/admin/achievements"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/achievements')}
      isSubmitting={createItem.isPending || updateItem.isPending}
      isDisabled={!title || !year || !payload.school_id}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Tingkat</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger id="level" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVEL_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="student_name">Nama Siswa</Label>
              <Input id="student_name" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Tahun</Label>
              <Input
                id="year"
                type="number"
                min={2000}
                max={2100}
                value={year}
                onChange={(e) => setYear(e.target.value === '' ? '' : Number(e.target.value))}
                className="h-11"
              />
            </div>
          </div>
          <AdminImageField label="Gambar" value={image} onChange={setImage} />
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
