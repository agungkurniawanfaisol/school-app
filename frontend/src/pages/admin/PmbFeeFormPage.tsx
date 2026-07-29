import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAdminAcademicYearsList } from '@/hooks/useAcademicYears'
import { useCreatePmbFee } from '@/hooks/usePmbFees'
import { useSchool } from '@/hooks/useSchool'
import { formatRupiah, parseRupiahInput } from '@/schemas/pmb-fee'

export function PmbFeeFormPage() {
  const { t } = useTranslation('admin')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: school } = useSchool()
  const { data: yearsData } = useAdminAcademicYearsList({ per_page: 50 })
  const years = yearsData?.data ?? []
  const createItem = useCreatePmbFee()

  const [academicYearId, setAcademicYearId] = useState('')
  const [amountInput, setAmountInput] = useState('350000')
  const [notes, setNotes] = useState('')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (academicYearId || years.length === 0) return
    const active = years.find((year) => year.is_active)
    setAcademicYearId(String((active ?? years[0]).id))
  }, [academicYearId, years])

  const amount = useMemo(() => parseRupiahInput(amountInput), [amountInput])
  const preview = amount != null ? formatRupiah(amount) : '—'

  if (id) {
    return <Navigate to="/admin/pmb-fees" replace />
  }

  const payload = {
    school_id: school?.id ?? 0,
    academic_year_id: Number(academicYearId),
    amount: amount ?? 0,
    notes: notes.trim() || null,
    is_active: isActive,
  }

  const handleSave = () => {
    if (!payload.school_id || !payload.academic_year_id || amount == null) return
    createItem.mutate(payload, { onSuccess: () => navigate('/admin/pmb-fees') })
  }

  return (
    <AdminFormShell
      title={t('pages.pmbFees.createTitle')}
      backHref="/admin/pmb-fees"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/pmb-fees')}
      isSubmitting={createItem.isPending}
      isDisabled={!payload.school_id || !payload.academic_year_id || amount == null}
    >
      <Card className="admin-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-2">
            <Label>{t('form.academicYearLabel')}</Label>
            <Select value={academicYearId} onValueChange={setAcademicYearId}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder={t('common.filterAcademicYear')} />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.id} value={String(year.id)}>
                    {year.label}
                    {year.is_active ? ` (${t('status.active')})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">{t('form.pmbFeeAmount')}</Label>
            <Input
              id="amount"
              inputMode="numeric"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="350000"
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              {t('form.pmbFeeAmountHint')}: <span className="font-medium text-foreground">{preview}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t('form.notes')}</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('form.pmbFeeNotesPlaceholder')}
              className="h-11"
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div>
              <p className="font-medium">{t('form.setActivePmbFee')}</p>
              <p className="text-sm text-muted-foreground">{t('form.setActivePmbFeeHint')}</p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              aria-label={t('form.setActivePmbFee')}
            />
          </div>
        </CardContent>
      </Card>
    </AdminFormShell>
  )
}
