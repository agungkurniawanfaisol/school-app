import { Mail, UserRound } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { PmbFormField } from '@/components/pmb/PmbFormField'
import { PmbFormSection } from '@/components/pmb/PmbFormSection'
import { PmbPhoneInput } from '@/components/pmb/PmbPhoneInput'
import { PmbTextInput } from '@/components/pmb/PmbTextInput'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PMB_INPUT_TEXT } from '@/lib/pmb-portal-layout'
import { cn } from '@/lib/utils'
import type { PmbPortalDraftValues } from '@/schemas/pmb'

interface PmbWizardStepOrangTuaProps {
  form: UseFormReturn<PmbPortalDraftValues>
}

export function PmbWizardStepOrangTua({ form }: PmbWizardStepOrangTuaProps) {
  return (
    <div className="space-y-5">
      <PmbFormSection
        icon={UserRound}
        title="Data Ayah & Ibu"
        description="Minimal salah satu nomor HP ayah atau ibu wajib diisi."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <PmbFormField
            control={form.control}
            name="father_name"
            label="Nama Ayah *"
            leadingIcon={UserRound}
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

          <PmbFormField
            control={form.control}
            name="mother_name"
            label="Nama Ibu *"
            leadingIcon={UserRound}
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
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="father_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. HP Ayah</FormLabel>
                <FormControl>
                  <PmbPhoneInput value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mother_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. HP Ibu</FormLabel>
                <FormControl>
                  <PmbPhoneInput value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </PmbFormSection>

      <PmbFormSection
        icon={Mail}
        title="Email Aktif"
        description="Digunakan untuk notifikasi status pendaftaran."
      >
        <PmbFormField
          control={form.control}
          name="parent_email"
          label="Email Aktif 1 *"
          hint="Email utama orang tua / wali"
          leadingIcon={Mail}
        >
          {(field, className) => (
            <Input
              className={cn('h-11', PMB_INPUT_TEXT, className)}
              type="email"
              placeholder="nama@email.com"
              {...field}
              value={field.value ?? ''}
            />
          )}
        </PmbFormField>

        <PmbFormField
          control={form.control}
          name="email_secondary"
          label="Email Aktif 2"
          hint="Opsional — cadangan jika email utama tidak aktif"
          leadingIcon={Mail}
        >
          {(field, className) => (
            <Input
              className={cn('h-11', PMB_INPUT_TEXT, className)}
              type="email"
              placeholder="nama@email.com"
              {...field}
              value={field.value ?? ''}
            />
          )}
        </PmbFormField>
      </PmbFormSection>
    </div>
  )
}
