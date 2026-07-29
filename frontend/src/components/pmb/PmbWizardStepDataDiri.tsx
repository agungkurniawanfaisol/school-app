import { Calendar, MapPin, Phone, User, Users } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { UseMutationResult } from '@tanstack/react-query'
import { PmbFormField } from '@/components/pmb/PmbFormField'
import { PmbFormSection } from '@/components/pmb/PmbFormSection'
import { PmbPhoneInput } from '@/components/pmb/PmbPhoneInput'
import { PmbRegistrationIdentityCard } from '@/components/pmb/PmbRegistrationIdentityCard'
import { PmbStudentPhotoUpload } from '@/components/pmb/PmbStudentPhotoUpload'
import { PmbTextInput } from '@/components/pmb/PmbTextInput'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PMB_INPUT_TEXT } from '@/lib/pmb-portal-layout'
import { cn } from '@/lib/utils'
import { RELATIONSHIP_OPTIONS, type PmbPortalDraftValues } from '@/schemas/pmb'
import type { Media } from '@/types'

type PmbPortalUploadPurpose = 'student_photo' | 'payment_proof' | 'testimonial_photo'

interface PmbWizardStepDataDiriProps {
  form: UseFormReturn<PmbPortalDraftValues>
  registrationUuid?: string | null
  upload: UseMutationResult<Media, Error, { file: File; purpose: PmbPortalUploadPurpose }, unknown>
  photoPreviewUrl?: string | null
  onPhotoUploaded: (media: Media) => void
}

export function PmbWizardStepDataDiri({
  form,
  registrationUuid,
  upload,
  photoPreviewUrl,
  onPhotoUploaded,
}: PmbWizardStepDataDiriProps) {
  const relationship = form.watch('relationship_to_child')
  const studentName = form.watch('student_name') ?? ''
  const photoMediaId = form.watch('student_photo_media_id')

  return (
    <div className="space-y-5">
      {registrationUuid && (
        <PmbRegistrationIdentityCard uuid={registrationUuid} showUuid />
      )}

      <PmbFormSection
        icon={User}
        title="Identitas Calon Siswa"
        description="Nama dan data kelahiran sesuai dokumen resmi."
      >
        <PmbStudentPhotoUpload
          studentName={studentName}
          mediaId={photoMediaId}
          previewUrl={photoPreviewUrl}
          upload={upload}
          onUploaded={onPhotoUploaded}
        />
        {form.formState.errors.student_photo_media_id && (
          <p className="-mt-2 text-sm font-medium text-destructive">
            {form.formState.errors.student_photo_media_id.message}
          </p>
        )}

        <PmbFormField
          control={form.control}
          name="student_name"
          label="Nama Lengkap *"
          hint="Sesuai akta kelahiran atau kartu identitas"
          leadingIcon={User}
        >
          {(field, className) => (
            <PmbTextInput
              format="title"
              placeholder="Nama lengkap calon siswa"
              className={className}
              {...field}
              value={field.value ?? ''}
              onChange={field.onChange}
            />
          )}
        </PmbFormField>

        <PmbFormField control={form.control} name="nickname" label="Nama Panggilan">
          {(field, className) => (
            <PmbTextInput
              format="title"
              placeholder="Nama sehari-hari"
              className={className}
              {...field}
              value={field.value ?? ''}
              onChange={field.onChange}
            />
          )}
        </PmbFormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <PmbFormField
            control={form.control}
            name="birth_place"
            label="Tempat Lahir *"
            leadingIcon={MapPin}
          >
            {(field, className) => (
              <PmbTextInput
                format="title"
                className={className}
                {...field}
                value={field.value ?? ''}
                onChange={field.onChange}
              />
            )}
          </PmbFormField>

          <FormField
            control={form.control}
            name="birth_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Lahir *</FormLabel>
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
        </div>
      </PmbFormSection>

      <PmbFormSection
        icon={Phone}
        title="Kontak & Alamat"
        description="Alamat domisili dan nomor yang bisa dihubungi."
      >
        <PmbFormField
          control={form.control}
          name="address"
          label="Alamat (Jalan / Dusun / Kelurahan) *"
        >
          {(field, className) => (
            <PmbTextInput
              format="sentence"
              placeholder="Jl. Contoh No. 1"
              className={className}
              {...field}
              value={field.value ?? ''}
              onChange={field.onChange}
            />
          )}
        </PmbFormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="address_rt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RT</FormLabel>
                <FormControl>
                  <Input
                    className={cn('h-11 focus-visible:ring-primary/30', PMB_INPUT_TEXT)}
                    inputMode="numeric"
                    placeholder="001"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address_rw"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RW</FormLabel>
                <FormControl>
                  <Input
                    className={cn('h-11 focus-visible:ring-primary/30', PMB_INPUT_TEXT)}
                    inputMode="numeric"
                    placeholder="002"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <PmbFormField control={form.control} name="kabupaten" label="Kabupaten/Kota *">
            {(field, className) => (
              <PmbTextInput
                format="title"
                placeholder="Contoh: Jakarta Selatan"
                className={className}
                {...field}
                value={field.value ?? ''}
                onChange={field.onChange}
              />
            )}
          </PmbFormField>
          <PmbFormField control={form.control} name="provinsi" label="Provinsi *">
            {(field, className) => (
              <PmbTextInput
                format="title"
                placeholder="Contoh: DKI Jakarta"
                className={className}
                {...field}
                value={field.value ?? ''}
                onChange={field.onChange}
              />
            )}
          </PmbFormField>
        </div>

        <FormField
          control={form.control}
          name="contact_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Handphone *</FormLabel>
              <p className="text-xs text-muted-foreground">Nomor aktif untuk konfirmasi pendaftaran</p>
              <FormControl>
                <PmbPhoneInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </PmbFormSection>

      <PmbFormSection
        icon={Users}
        title="Informasi Keluarga"
        description="Status calon siswa dalam keluarga."
      >
        <FormField
          control={form.control}
          name="relationship_to_child"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Anak *</FormLabel>
              <FormControl>
                <div
                  role="radiogroup"
                  aria-label="Status anak"
                  className="grid grid-cols-1 gap-2 sm:grid-cols-3"
                >
                  {RELATIONSHIP_OPTIONS.map((option) => {
                    const selected = field.value === option
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        className={cn(
                          'flex h-11 touch-manipulation items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors motion-reduce:transition-none',
                          selected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-input bg-background text-foreground hover:border-primary/35 hover:bg-muted/40',
                        )}
                        onClick={() => {
                          field.onChange(option)
                          if (option !== 'Lainnya') {
                            form.setValue('relationship_to_child_other', '', { shouldDirty: true })
                            form.clearErrors('relationship_to_child_other')
                          }
                        }}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div
          className={cn(
            'min-h-[4.75rem]',
            relationship !== 'Lainnya' && 'invisible pointer-events-none',
          )}
          aria-hidden={relationship !== 'Lainnya'}
        >
          <FormField
            control={form.control}
            name="relationship_to_child_other"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sebutkan Status Lainnya *</FormLabel>
                <FormControl>
                  <PmbTextInput
                    format="title"
                    placeholder="Contoh: Anak angkat, Anak asuh"
                    tabIndex={relationship === 'Lainnya' ? 0 : -1}
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="child_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anak ke *</FormLabel>
                <FormControl>
                  <Input
                    className={cn('h-11 focus-visible:ring-primary/30', PMB_INPUT_TEXT)}
                    inputMode="numeric"
                    placeholder="1"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sibling_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dari saudara ke *</FormLabel>
                <FormControl>
                  <Input
                    className={cn('h-11 focus-visible:ring-primary/30', PMB_INPUT_TEXT)}
                    inputMode="numeric"
                    placeholder="2"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </PmbFormSection>
    </div>
  )
}
