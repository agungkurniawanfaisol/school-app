import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AdminFormShell } from '@/components/admin/AdminFormShell'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAdminAcademicYearsList } from '@/hooks/useAcademicYears'
import { useAdminPmbFeeDetail, useCreatePmbFee, useUpdatePmbFee } from '@/hooks/usePmbFees'
import { useSchool } from '@/hooks/useSchool'
import {
  defaultFeeName,
  formatRupiah,
  parseRupiahInput,
  pmbFeeFormSchema,
  type PmbFeeFormValues,
} from '@/schemas/pmb-fee'

export function PmbFeeFormPage() {
  const { t } = useTranslation('admin')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const feeId = id ? Number(id) : 0
  const isEdit = feeId > 0
  const { data: school } = useSchool()
  const { data: yearsData } = useAdminAcademicYearsList({ per_page: 50 })
  const { data: existing } = useAdminPmbFeeDetail(feeId)
  const years = yearsData?.data ?? []
  const createItem = useCreatePmbFee()
  const updateItem = useUpdatePmbFee(feeId)

  const [academicYearId, setAcademicYearId] = useState('')
  const [name, setName] = useState('')
  const [jenjang, setJenjang] = useState<'tk' | 'sd'>('sd')
  const [program, setProgram] = useState<'reguler' | 'icp'>('reguler')
  const [amountInput, setAmountInput] = useState('350000')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountHolder, setAccountHolder] = useState('')
  const [notes, setNotes] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [nameTouched, setNameTouched] = useState(false)

  useEffect(() => {
    if (academicYearId || years.length === 0) return
    const active = years.find((year) => year.is_active)
    setAcademicYearId(String((active ?? years[0]).id))
  }, [academicYearId, years])

  useEffect(() => {
    if (!existing) return
    setAcademicYearId(String(existing.academic_year_id))
    setName(existing.name)
    setJenjang(existing.jenjang)
    setProgram(existing.program)
    setAmountInput(String(existing.amount))
    setBankName(existing.bank_name ?? '')
    setAccountNumber(existing.account_number ?? '')
    setAccountHolder(existing.account_holder ?? '')
    setNotes(existing.notes ?? '')
    setIsActive(existing.is_active)
    setNameTouched(true)
  }, [existing])

  useEffect(() => {
    if (nameTouched || isEdit) return
    setName(defaultFeeName(jenjang, program))
  }, [jenjang, program, nameTouched, isEdit])

  const amount = useMemo(() => parseRupiahInput(amountInput), [amountInput])
  const preview = amount != null ? formatRupiah(amount) : '—'

  const payload: PmbFeeFormValues = {
    school_id: school?.id ?? 0,
    academic_year_id: Number(academicYearId),
    name: name.trim(),
    jenjang,
    program,
    amount: amount ?? 0,
    bank_name: bankName.trim(),
    account_number: accountNumber.trim(),
    account_holder: accountHolder.trim(),
    notes: notes.trim() || null,
    is_active: isActive,
  }

  const parsed = pmbFeeFormSchema.safeParse(payload)
  const isSubmitting = createItem.isPending || updateItem.isPending

  const handleSave = () => {
    if (!parsed.success) return
    if (isEdit) {
      updateItem.mutate(parsed.data, { onSuccess: () => navigate('/admin/pmb-fees') })
      return
    }
    createItem.mutate(parsed.data, { onSuccess: () => navigate('/admin/pmb-fees') })
  }

  return (
    <AdminFormShell
      title={isEdit ? t('pages.pmbFees.editTitle', { defaultValue: 'Edit Biaya PMB' }) : t('pages.pmbFees.createTitle')}
      backHref="/admin/pmb-fees"
      onSubmit={handleSave}
      onCancel={() => navigate('/admin/pmb-fees')}
      isSubmitting={isSubmitting}
      isDisabled={!parsed.success}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Jenjang</Label>
              <Select value={jenjang} onValueChange={(v) => setJenjang(v as 'tk' | 'sd')}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tk">TK</SelectItem>
                  <SelectItem value="sd">SD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Program</Label>
              <Select value={program} onValueChange={(v) => setProgram(v as 'reguler' | 'icp')}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reguler">Reguler</SelectItem>
                  <SelectItem value="icp">ICP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fee_name">Nama biaya</Label>
            <Input
              id="fee_name"
              value={name}
              onChange={(e) => {
                setNameTouched(true)
                setName(e.target.value)
              }}
              className="h-11"
            />
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
            <Label htmlFor="bank_name">Bank Transfer</Label>
            <Input id="bank_name" value={bankName} onChange={(e) => setBankName(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account_number">Nomor Rekening</Label>
            <Input
              id="account_number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="h-11 font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account_holder">Atas Nama Rekening</Label>
            <Input
              id="account_holder"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              className="h-11"
            />
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
              <p className="text-sm text-muted-foreground">
                Beberapa biaya boleh aktif bersamaan (TK/SD × Reguler/ICP).
              </p>
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
