import { Calendar, CreditCard } from 'lucide-react'
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { UseMutationResult } from '@tanstack/react-query'
import { PmbFileUploadZone } from '@/components/pmb/PmbFileUploadZone'
import { PmbFormSection } from '@/components/pmb/PmbFormSection'
import { PmbPaymentNotice } from '@/components/pmb/PmbPaymentNotice'
import { PmbTextarea } from '@/components/pmb/PmbTextInput'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import type { UploadPhase } from '@/hooks/useMediaUpload'
import { PMB_INPUT_TEXT } from '@/lib/pmb-portal-layout'
import { cn } from '@/lib/utils'
import type { PmbPortalDraftValues } from '@/schemas/pmb'
import type { Media } from '@/types'

type PmbPortalUploadPurpose = 'student_photo' | 'payment_proof' | 'testimonial_photo'

interface PmbWizardStepPembayaranProps {
  form: UseFormReturn<PmbPortalDraftValues>
  fee?: string | null
  bankName?: string | null
  accountNumber?: string | null
  accountHolder?: string | null
  proofPreviewUrl?: string | null
  upload: UseMutationResult<Media, Error, { file: File; purpose: PmbPortalUploadPurpose }, unknown> & {
    progress: number
    phase: UploadPhase
  }
}

export function PmbWizardStepPembayaran({
  form,
  fee,
  bankName,
  accountNumber,
  accountHolder,
  upload,
  proofPreviewUrl,
}: PmbWizardStepPembayaranProps) {
  const proofId = form.watch('payment_proof_media_id')
  const transferConfirmed = form.watch('transfer_confirmed')
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)

  return (
    <div className="space-y-5">
      <PmbPaymentNotice
        fee={fee}
        bankName={bankName}
        accountNumber={accountNumber}
        accountHolder={accountHolder}
        studentName={form.watch('student_name')}
      />

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
