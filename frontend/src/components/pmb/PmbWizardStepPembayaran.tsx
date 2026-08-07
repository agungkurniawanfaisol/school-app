import { Calendar, CreditCard } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { UseMutationResult } from '@tanstack/react-query'
import { PmbFileUploadZone } from '@/components/pmb/PmbFileUploadZone'
import { PmbFormSection } from '@/components/pmb/PmbFormSection'
import { PmbPaymentNotice } from '@/components/pmb/PmbPaymentNotice'
import { PmbTextarea } from '@/components/pmb/PmbTextInput'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import type { PmbFee } from '@/hooks/usePmbFees'
import type { UploadPhase } from '@/hooks/useMediaUpload'
import { PMB_INPUT_TEXT } from '@/lib/pmb-portal-layout'
import { cn } from '@/lib/utils'
import { jenjangLabel, programLabel, type PmbFeeJenjang, PMB_FEE_JENJANGS } from '@/schemas/pmb-fee'
import type { PmbPortalDraftValues } from '@/schemas/pmb'
import type { Media } from '@/types'

type PmbPortalUploadPurpose = 'student_photo' | 'payment_proof' | 'testimonial_photo'

interface PmbWizardStepPembayaranProps {
  form: UseFormReturn<PmbPortalDraftValues>
  fees: PmbFee[]
  proofPreviewUrl?: string | null
  upload: UseMutationResult<Media, Error, { file: File; purpose: PmbPortalUploadPurpose }, unknown> & {
    progress: number
    phase: UploadPhase
  }
}

export function PmbWizardStepPembayaran({
  form,
  fees,
  upload,
  proofPreviewUrl,
}: PmbWizardStepPembayaranProps) {
  const proofId = form.watch('payment_proof_media_id')
  const transferConfirmed = form.watch('transfer_confirmed')
  const selectedJenjang = form.watch('jenjang')
  const selectedFeeUuid = form.watch('pmb_fee_uuid')
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)

  const jenjangOptions = useMemo(() => {
    const set = new Set(fees.map((fee) => fee.jenjang))
    return PMB_FEE_JENJANGS.filter((j) => set.has(j))
  }, [fees])

  const programFees = useMemo(
    () => fees.filter((fee) => fee.jenjang === selectedJenjang),
    [fees, selectedJenjang],
  )

  const selectedFee = useMemo(
    () => fees.find((fee) => fee.uuid === selectedFeeUuid) ?? null,
    [fees, selectedFeeUuid],
  )

  const selectJenjang = (jenjang: PmbFeeJenjang) => {
    form.setValue('jenjang', jenjang, { shouldDirty: true, shouldValidate: true })
    form.setValue('program', null, { shouldDirty: true })
    form.setValue('pmb_fee_uuid', null, { shouldDirty: true })
    form.setValue('fee_name', null, { shouldDirty: true })
    form.setValue('grade_applied', jenjang.toUpperCase(), { shouldDirty: true })
  }

  const selectFee = (fee: PmbFee) => {
    form.setValue('jenjang', fee.jenjang, { shouldDirty: true, shouldValidate: true })
    form.setValue('program', fee.program, { shouldDirty: true, shouldValidate: true })
    form.setValue('pmb_fee_uuid', fee.uuid, { shouldDirty: true, shouldValidate: true })
    form.setValue('fee_name', fee.name, { shouldDirty: true })
    form.setValue('grade_applied', fee.jenjang.toUpperCase(), { shouldDirty: true })
  }

  return (
    <div className="space-y-5">
      <PmbFormSection
        icon={CreditCard}
        title="Pilih Jenjang & Program"
        description="Pilih jenjang terlebih dahulu, lalu program. Nominal dan rekening tampil otomatis."
      >
        <div className="space-y-3">
          <p className="text-sm font-medium">1. Jenjang</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {jenjangOptions.map((jenjang) => {
              const active = selectedJenjang === jenjang
              return (
                <button
                  key={jenjang}
                  type="button"
                  onClick={() => selectJenjang(jenjang)}
                  className={cn(
                    'min-h-11 rounded-xl border px-3 py-3 text-sm font-semibold transition-colors',
                    active
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-foreground hover:border-primary/40',
                  )}
                >
                  {jenjangLabel(jenjang)}
                </button>
              )
            })}
          </div>
          {jenjangOptions.length === 0 && (
            <p className="text-sm text-amber-800">Biaya aktif belum diatur. Hubungi admin sekolah.</p>
          )}
        </div>

        {selectedJenjang && (
          <div className="space-y-3">
            <p className="text-sm font-medium">2. Program</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {programFees.map((fee) => {
                const active = selectedFeeUuid === fee.uuid
                return (
                  <button
                    key={fee.uuid}
                    type="button"
                    onClick={() => selectFee(fee)}
                    className={cn(
                      'min-h-11 rounded-xl border px-3 py-3 text-left transition-colors',
                      active
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background hover:border-primary/40',
                    )}
                  >
                    <span className="block text-sm font-semibold">{programLabel(fee.program, fee.program_name)}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{fee.amount_formatted}</span>
                  </button>
                )
              })}
            </div>
            {programFees.length === 0 && (
              <p className="text-sm text-muted-foreground">Belum ada program aktif untuk jenjang ini.</p>
            )}
          </div>
        )}

        {form.formState.errors.pmb_fee_uuid && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.pmb_fee_uuid.message}
          </p>
        )}
      </PmbFormSection>

      {selectedFee && (
        <PmbPaymentNotice
          fee={selectedFee.amount_formatted}
          bankName={selectedFee.bank_name}
          accountNumber={selectedFee.account_number}
          accountHolder={selectedFee.account_holder}
          studentName={form.watch('student_name')}
        />
      )}

      <PmbFormSection
        icon={CreditCard}
        title="Detail Pembayaran"
        description="Isi tanggal transfer dan unggah bukti pembayaran."
      >
        <FormField
          control={form.control}
          name="payment_transferred_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Transfer</FormLabel>
              <FormControl>
                <div className="relative">
                  <Calendar
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    className={cn('h-11 pl-10 focus-visible:ring-primary/30', PMB_INPUT_TEXT)}
                    type="date"
                    {...field}
                    value={field.value ?? ''}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan</FormLabel>
              <FormControl>
                <PmbTextarea
                  format="sentence"
                  hint="Opsional — misalnya nama pengirim transfer"
                  {...field}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2" data-form-field="payment_proof_media_id">
          <FormLabel>Bukti Transfer *</FormLabel>
          <PmbFileUploadZone
            label="Unggah bukti transfer"
            replaceLabel="Ganti bukti transfer"
            hint="JPG, PNG, WEBP, atau PDF. Maks. 10 MB."
            isUploading={upload.isPending}
            uploadPhase={upload.phase}
            uploadProgress={upload.progress}
            uploaded={Boolean(proofId)}
            fileName={uploadedFileName}
            previewUrl={proofPreviewUrl}
            onFileSelect={(file) => {
              setUploadedFileName(file.name)
              upload.mutate(
                { file, purpose: 'payment_proof' },
                {
                  onSuccess: (media) =>
                    form.setValue('payment_proof_media_id', media.id, { shouldDirty: true }),
                  onError: () => setUploadedFileName(null),
                },
              )
            }}
          />
          {form.formState.errors.payment_proof_media_id && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.payment_proof_media_id.message}
            </p>
          )}
        </div>

        <FormField
          control={form.control}
          name="transfer_confirmed"
          render={({ field }) => (
            <FormItem
              className={cn(
                'flex min-h-11 items-start gap-3 space-y-0 rounded-xl border p-4 transition-colors motion-reduce:transition-none',
                transferConfirmed
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-border bg-muted/20',
              )}
            >
              <FormControl>
                <Checkbox
                  checked={field.value === true}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  className="mt-0.5 size-5 shrink-0"
                />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="font-normal leading-snug">
                  Saya sudah transfer dan mengunggah bukti. *
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </PmbFormSection>
    </div>
  )
}
