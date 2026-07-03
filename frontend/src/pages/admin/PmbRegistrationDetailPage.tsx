import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAdminPmbRegistrationDetail, useUpdatePmbRegistration } from '@/hooks/usePmb'

export function PmbRegistrationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const numericId = Number(id)
  const navigate = useNavigate()
  const { data, isLoading } = useAdminPmbRegistrationDetail(numericId)
  const updateItem = useUpdatePmbRegistration(numericId)
  const [status, setStatus] = useState('pending')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!data) return
    setStatus(data.status)
    setNotes(data.notes ?? '')
  }, [data])

  if (isLoading || !data) {
    return <p className="text-sm text-muted-foreground">Memuat data pendaftaran...</p>
  }

  return (
    <AdminFormShell
      title={`Pendaftaran ${data.registration_number}`}
      description={data.student_name}
      backHref="/admin/pmb-registrations"
      onSubmit={() => updateItem.mutate({ status: status as 'pending' | 'review' | 'accepted' | 'rejected', notes: notes || null })}
      onCancel={() => navigate('/admin/pmb-registrations')}
      isSubmitting={updateItem.isPending}
      submitLabel="Simpan Status"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-base">Data Siswa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Nama:</span> {data.student_name}</p>
            <p><span className="text-muted-foreground">Tempat/Tgl Lahir:</span> {data.birth_place ?? '—'} / {data.birth_date ?? '—'}</p>
            <p><span className="text-muted-foreground">Jenis Kelamin:</span> {data.gender ?? '—'}</p>
            <p><span className="text-muted-foreground">Jenjang:</span> {data.grade_applied}</p>
            <p><span className="text-muted-foreground">Sekolah Sebelumnya:</span> {data.previous_school ?? '—'}</p>
            <p><span className="text-muted-foreground">Alamat:</span> {data.address ?? '—'}</p>
          </CardContent>
        </Card>
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-base">Data Orang Tua</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Nama:</span> {data.parent_name}</p>
            <p><span className="text-muted-foreground">Telepon:</span> {data.parent_phone}</p>
            <p><span className="text-muted-foreground">Email:</span> {data.parent_email ?? '—'}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="admin-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Status Pendaftaran</CardTitle>
          <AdminStatusBadge status={data.status} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="review">Direview</SelectItem>
                <SelectItem value="accepted">Diterima</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan Admin</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
          </div>
        </CardContent>
      </Card>
    </AdminFormShell>
  )
}
