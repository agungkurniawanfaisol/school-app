import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'
import type { PmbPortalDraftValues } from '@/schemas/pmb'

export const PMB_STEP_FIELD_ORDER: Record<number, (keyof PmbPortalDraftValues)[]> = {
  0: [
    'student_photo_media_id',
    'student_name',
    'nickname',
    'birth_place',
    'birth_date',
    'address',
    'address_rt',
    'address_rw',
    'kabupaten',
    'provinsi',
    'contact_phone',
    'relationship_to_child',
    'relationship_to_child_other',
    'child_order',
    'sibling_count',
  ],
  1: ['father_name', 'mother_name', 'father_phone', 'mother_phone', 'parent_email', 'email_secondary'],
  2: ['pmb_fee_uuid', 'jenjang', 'program', 'payment_transferred_at', 'payment_note', 'payment_proof_media_id', 'transfer_confirmed'],
}

export function getFirstErrorField<T extends FieldValues>(
  errorFields: FieldPath<T>[],
  fieldOrder: FieldPath<T>[],
): FieldPath<T> | undefined {
  return fieldOrder.find((field) => errorFields.includes(field))
}

function getScrollBehavior(): ScrollBehavior {
  if (typeof window === 'undefined') return 'auto'
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

function focusWithinField(field: string): void {
  const anchor = document.querySelector<HTMLElement>(`[data-form-field="${field}"]`)
  if (!anchor) return

  anchor.scrollIntoView({ behavior: getScrollBehavior(), block: 'center' })

  const focusable =
    anchor.querySelector<HTMLElement>('input:not([type="hidden"])') ??
    anchor.querySelector<HTMLElement>('textarea') ??
    anchor.querySelector<HTMLElement>('select') ??
    anchor.querySelector<HTMLElement>('button[role="combobox"]') ??
    anchor.querySelector<HTMLElement>('[role="checkbox"]') ??
    anchor.querySelector<HTMLElement>('button:not([disabled])')

  if (focusable) {
    focusable.focus({ preventScroll: true })
    return
  }

  if (anchor.tabIndex < 0) {
    anchor.tabIndex = -1
  }
  anchor.focus({ preventScroll: true })
}

export function focusFirstFormError<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldOrder: FieldPath<T>[],
  errorFields: FieldPath<T>[],
): void {
  const field = getFirstErrorField(errorFields, fieldOrder)
  if (!field) return

  requestAnimationFrame(() => {
    form.setFocus(field)
    focusWithinField(String(field))
  })
}
