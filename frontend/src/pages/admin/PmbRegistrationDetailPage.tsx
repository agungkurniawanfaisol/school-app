import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAdminPmbRegistrationDetail, useUpdatePmbRegistration } from '@/hooks/usePmb'

export function PmbRegistrationDetailPage() {
  const { t } = useTranslation('admin')
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
    return <p className="text-sm text-muted-foreground">{t('common.loadingRegistration')}</p>
  }

  return (
    <AdminFormShell
      title={t('pages.pmb.detailTitle', { number: data.registration_number })}
      description={data.student_name}
      backHref="/admin/pmb-registrations"
      onSubmit={() => updateItem.mutate({ status: status as 'pending' | 'review' | 'accepted' | 'rejected', notes: notes || null })}
      onCancel={() => navigate('/admin/pmb-registrations')}
      isSubmitting={updateItem.isPending}
      submitLabel={t('common.saveStatus')}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-base">{t('pages.pmb.studentData')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">{t('pages.pmb.field.name')}:</span> {data.student_name}</p>
            <p><span className="text-muted-foreground">{t('pages.pmb.field.birthPlaceDate')}:</span> {data.birth_place ?? '—'} / {data.birth_date ?? '—'}</p>
            <p><span className="text-muted-foreground">{t('pages.pmb.field.gender')}:</span> {data.gender ?? '—'}</p>
            <p><span className="text-muted-foreground">{t('pages.pmb.field.grade')}:</span> {data.grade_applied}</p>
            <p><span className="text-muted-foreground">{t('pages.pmb.field.previousSchool')}:</span> {data.previous_school ?? '—'}</p>
            <p><span className="text-muted-foreground">{t('pages.pmb.field.address')}:</span> {data.address ?? '—'}</p>
          </CardContent>
        </Card>
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-base">{t('pages.pmb.parentData')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">{t('pages.pmb.field.name')}:</span> {data.parent_name}</p>
            <p><span className="text-muted-foreground">{t('pages.pmb.field.phone')}:</span> {data.parent_phone}</p>
            <p><span className="text-muted-foreground">{t('pages.pmb.field.email')}:</span> {data.parent_email ?? '—'}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="admin-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{t('pages.pmb.registrationStatus')}</CardTitle>
          <AdminStatusBadge status={data.status} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t('form.status')}</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">{t('status.pending')}</SelectItem>
                <SelectItem value="review">{t('status.reviewing')}</SelectItem>
                <SelectItem value="accepted">{t('status.accepted')}</SelectItem>
                <SelectItem value="rejected">{t('status.rejected')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">{t('form.adminNotes')}</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
          </div>
        </CardContent>
      </Card>
    </AdminFormShell>
  )
}
