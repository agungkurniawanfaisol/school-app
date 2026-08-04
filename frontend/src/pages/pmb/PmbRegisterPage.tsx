import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { PmbWizardStepper } from '@/components/pmb/PmbWizardStepper'
import { PmbWizardStepDataDiri } from '@/components/pmb/PmbWizardStepDataDiri'
import { PmbWizardStepOrangTua } from '@/components/pmb/PmbWizardStepOrangTua'
import { PmbWizardStepPembayaran } from '@/components/pmb/PmbWizardStepPembayaran'
import { PmbWizardStepRingkasan } from '@/components/pmb/PmbWizardStepRingkasan'
import { PageEnter } from '@/components/motion/PageEnter'
import { SchoolLogo } from '@/components/brand/SchoolLogo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { BRAND_GRADIENT } from '@/components/pmb/PmbWizardShell'
import {
  isPmbRegistrationCorrectionAllowed,
  isPmbRegistrationReadonly,
  PMB_STATUS_DESCRIPTIONS,
  PMB_STATUS_LABELS,
} from '@/config/pmb-portal-nav'
import { getAcademicYear } from '@/lib/academic-year'
import { cn } from '@/lib/utils'
import { getAuthToken, getStoredUser, hasPortalAuth, isAuthError, setAuthSession } from '@/lib/api'
import { resolveAssetUrl } from '@/lib/safe-url'
import { authKeys } from '@/hooks/useAuth'
import { useActiveAcademicYear } from '@/hooks/useAcademicYears'
import { useAuthMe } from '@/hooks/useAuth'
import {
  usePmbPortalRegistration,
  usePmbPortalUpload,
  useSavePmbDraft,
  useSubmitPmbCorrection,
  useSubmitPmbRegistration,
} from '@/hooks/usePmb'
import { useActivePmbFees } from '@/hooks/usePmbFees'
import { useSchool } from '@/hooks/useSchool'
import {
  pmbDataDiriStepSchema,
  pmbOrangTuaStepSchema,
  pmbPaymentStepSchema,
  pmbPortalDraftSchema,
  WIZARD_STEP_DESCRIPTIONS,
  WIZARD_STEP_LABELS,
  type PmbPortalDraftValues,
} from '@/schemas/pmb'
import { focusFirstFormError, PMB_STEP_FIELD_ORDER } from '@/lib/form-focus'
import { PMB_WIZARD_FOOTER_SPACER, PMB_WIZARD_FOOTER_STICKY } from '@/lib/pmb-portal-layout'
import type { Media } from '@/types'
import type { z } from 'zod'

const TOTAL_STEPS = WIZARD_STEP_LABELS.length
const LOGIN_PATH = '/admin/login?redirect=/pmb/daftar'

function toBackendStep(frontendStep: number): number {
  return frontendStep + 2
}

function fromBackendStep(currentStep?: number | null): number {
  if (!currentStep || currentStep < 2) {
    return 0
  }

  return Math.min(TOTAL_STEPS - 1, currentStep - 2)
}

function mapRegistrationToForm(
  registration: NonNullable<ReturnType<typeof usePmbPortalRegistration>['data']>,
): PmbPortalDraftValues {
  const draft = (registration.draft_payload ?? {}) as Partial<PmbPortalDraftValues>
  return {
    student_name: registration.student_name ?? draft.student_name ?? '',
    nickname: draft.nickname ?? '',
    address: registration.address ?? draft.address ?? '',
    address_rt: draft.address_rt ?? '',
    address_rw: draft.address_rw ?? '',
    kabupaten: draft.kabupaten ?? '',
    provinsi: draft.provinsi ?? '',
    contact_phone: draft.contact_phone ?? '',
    birth_place: registration.birth_place ?? draft.birth_place ?? '',
    birth_date: registration.birth_date ?? draft.birth_date ?? '',
    relationship_to_child: draft.relationship_to_child,
    relationship_to_child_other: draft.relationship_to_child_other ?? '',
    child_order: draft.child_order ?? '',
    sibling_count: draft.sibling_count ?? '',
    academic_year: registration.academic_year ?? draft.academic_year ?? getAcademicYear(),
    father_name: draft.father_name ?? '',
    mother_name: draft.mother_name ?? '',
    father_phone: draft.father_phone ?? '',
    mother_phone: draft.mother_phone ?? '',
    parent_email: registration.parent_email ?? draft.parent_email ?? '',
    email_secondary: draft.email_secondary ?? '',
    parent_name: registration.parent_name ?? draft.parent_name ?? '',
    parent_phone: registration.parent_phone ?? draft.parent_phone ?? '',
    grade_applied: registration.grade_applied ?? draft.grade_applied ?? null,
    pmb_fee_uuid:
      (registration.payment_info?.pmb_fee_uuid as string | undefined) ?? draft.pmb_fee_uuid ?? null,
    jenjang: (draft.jenjang as PmbPortalDraftValues['jenjang'])
      ?? ((registration.payment_info?.jenjang as PmbPortalDraftValues['jenjang']) ?? null),
    program: (draft.program as PmbPortalDraftValues['program'])
      ?? ((registration.payment_info?.program as PmbPortalDraftValues['program']) ?? null),
    fee_name:
      draft.fee_name
      ?? (registration.payment_info?.fee_name as string | undefined)
      ?? null,
    payment_proof_media_id:
      (registration.payment_info?.proof_media_id as number | undefined) ?? draft.payment_proof_media_id,
    payment_transferred_at:
      (registration.payment_info?.transferred_at as string | undefined) ?? draft.payment_transferred_at ?? '',
    payment_note: (registration.payment_info?.note as string | undefined) ?? draft.payment_note ?? '',
    transfer_confirmed:
      draft.transfer_confirmed ??
      Boolean(
        (registration.payment_info?.proof_media_id as number | undefined) ?? draft.payment_proof_media_id,
      ),
    student_photo_media_id: draft.student_photo_media_id ?? registration.student_photo?.id,
  }
}

export function PmbRegisterPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [step, setStep] = useState(0)
  const { data: school } = useSchool()
  const { data: activeYear } = useActiveAcademicYear(school?.id)
  const { data: registration } = usePmbPortalRegistration(school?.id)
  const { data: fees = [] } = useActivePmbFees(school?.id)
  const saveDraft = useSavePmbDraft()
  const submit = useSubmitPmbRegistration()
  const submitCorrection = useSubmitPmbCorrection()
  const upload = usePmbPortalUpload()
  const { data: authUser, isError: isAuthErrorState, error: authError } = useAuthMe()
  const isPendaftar = (authUser ?? getStoredUser())?.role === 'pendaftar'
  const saveTimer = useRef<number | null>(null)
  const hydratedRegistrationUuid = useRef<string | null>(null)
  const hasSubmittedRef = useRef(false)
  const [studentPhotoPreviewUrl, setStudentPhotoPreviewUrl] = useState<string | null>(null)

  const resolvedAcademicYear = activeYear?.label ?? getAcademicYear()
  const stepLabel = WIZARD_STEP_LABELS[step]
  const isCorrectionMode = isPmbRegistrationCorrectionAllowed(registration?.status)
  const isReadonly = isPmbRegistrationReadonly(registration?.status)
  const stepDescription = isCorrectionMode
    ? stepLabel === 'Ringkasan'
      ? 'Periksa kembali data sebelum mengirim perbaikan.'
      : WIZARD_STEP_DESCRIPTIONS[stepLabel]
    : WIZARD_STEP_DESCRIPTIONS[stepLabel]

  const form = useForm<PmbPortalDraftValues>({
    resolver: zodResolver(pmbPortalDraftSchema),
    defaultValues: {
      student_name: '',
      academic_year: resolvedAcademicYear,
      transfer_confirmed: false,
    },
  })

  useEffect(() => {
    if (!activeYear?.label || registration) return
    form.setValue('academic_year', activeYear.label)
  }, [activeYear?.label, form, registration])

  useEffect(() => {
    if (!registration) return
    // Only hydrate once per registration — draft autosave must not reset the form
    // (that remounts Select and causes visible scroll/jump on mobile).
    if (hydratedRegistrationUuid.current === registration.uuid) return
    hydratedRegistrationUuid.current = registration.uuid
    form.reset(mapRegistrationToForm(registration))
    // Correction: start at Data Diri so every field + uploads are immediately editable.
    setStep(
      isPmbRegistrationCorrectionAllowed(registration.status)
        ? 0
        : fromBackendStep(registration.current_step),
    )
    const photoUrl = registration.student_photo?.url
    setStudentPhotoPreviewUrl(photoUrl ? resolveAssetUrl(photoUrl, '') || null : null)
  }, [form, registration])

  const handleStudentPhotoUploaded = useCallback(
    (media: Media) => {
      form.setValue('student_photo_media_id', media.id, { shouldDirty: true, shouldValidate: true })
      setStudentPhotoPreviewUrl(media.url)
      const storedUser = getStoredUser()
      const token = getAuthToken()
      if (storedUser && token) {
        setAuthSession(token, { ...storedUser, avatar_url: media.url })
        queryClient.setQueryData(authKeys.me(), { ...storedUser, avatar_url: media.url })
      }
    },
    [form, queryClient],
  )

  const saveCurrentDraft = useCallback(
    (values: PmbPortalDraftValues, currentStep?: number) => {
      if (!isPendaftar) return
      saveDraft.mutate({
        ...values,
        school_id: school?.id,
        current_step: toBackendStep(currentStep ?? step),
      })
    },
    [isPendaftar, saveDraft, school?.id, step],
  )

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (!isPendaftar || hasSubmittedRef.current) return
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
      saveTimer.current = window.setTimeout(() => {
        saveCurrentDraft(values as PmbPortalDraftValues)
      }, 700)
    })
    return () => {
      subscription.unsubscribe()
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [form, isPendaftar, saveCurrentDraft])

  const applyStepValidation = (
    result: z.SafeParseReturnType<PmbPortalDraftValues, PmbPortalDraftValues>,
    fieldOrder: (keyof PmbPortalDraftValues)[],
  ): boolean => {
    if (!result.success) {
      const errorFields: (keyof PmbPortalDraftValues)[] = []
      result.error.issues.forEach((issue) => {
        const path = issue.path[0]
        if (typeof path === 'string') {
          const field = path as keyof PmbPortalDraftValues
          form.setError(field, { message: issue.message })
          if (!errorFields.includes(field)) {
            errorFields.push(field)
          }
        }
      })
      focusFirstFormError(form, fieldOrder, errorFields)
      return false
    }

    Object.entries(result.data).forEach(([key, value]) => {
      form.setValue(key as keyof PmbPortalDraftValues, value as never, { shouldDirty: true })
    })
    form.clearErrors()
    return true
  }

  const validateStep = async (currentStep: number): Promise<boolean> => {
    const values = form.getValues()
    const fieldOrder = PMB_STEP_FIELD_ORDER[currentStep] ?? []

    if (currentStep === 0) {
      return applyStepValidation(pmbDataDiriStepSchema.safeParse(values), fieldOrder)
    }
    if (currentStep === 1) {
      return applyStepValidation(pmbOrangTuaStepSchema.safeParse(values), fieldOrder)
    }
    if (currentStep === 2) {
      return applyStepValidation(pmbPaymentStepSchema.safeParse(values), fieldOrder)
    }
    return true
  }

  const next = async () => {
    if (!(await validateStep(step))) return
    const nextStep = Math.min(step + 1, TOTAL_STEPS - 1)
    saveCurrentDraft(form.getValues(), nextStep)
    setStep(nextStep)
  }

  const sendForm = async (mode: 'submit' | 'correction') => {
    const values = form.getValues()
    const dataDiri = pmbDataDiriStepSchema.safeParse(values)
    const orangTua = pmbOrangTuaStepSchema.safeParse(values)
    const payment = pmbPaymentStepSchema.safeParse(values)
    if (!dataDiri.success || !orangTua.success || !payment.success) {
      toast.error(
        mode === 'correction'
          ? 'Lengkapi semua data sebelum mengirim perbaikan.'
          : 'Lengkapi semua data sebelum mengirim.',
      )
      return
    }

    // Stop draft autosave so a late PATCH cannot race the submit response in cache.
    hasSubmittedRef.current = true
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current)
      saveTimer.current = null
    }

    const payload = {
      ...values,
      ...dataDiri.data,
      ...orangTua.data,
      ...payment.data,
    }

    const mutation = mode === 'correction' ? submitCorrection : submit
    mutation.mutate(payload, {
      onSuccess: (data) => {
        navigate(`/pmb/portal/pendaftaran/${data.uuid}`, { replace: true })
      },
      onError: () => {
        hasSubmittedRef.current = false
      },
    })
  }

  useEffect(() => {
    if (!isAuthErrorState || !authError || !isAuthError(authError)) return
    toast.error('Sesi berakhir. Silakan masuk kembali.')
    navigate(LOGIN_PATH, { replace: true })
  }, [authError, isAuthErrorState, navigate])

  useEffect(() => {
    // Block autosave only for locked (read-only) statuses — allow it in draft + review.
    hasSubmittedRef.current = isReadonly
  }, [isReadonly])

  if (!hasPortalAuth()) {
    return <Navigate to={LOGIN_PATH} replace />
  }

  if (getAuthToken() && !isPendaftar) {
    return <Navigate to="/admin" replace />
  }

  const paymentInfo = (registration?.payment_info ?? null) as Record<string, unknown> | null
  const paymentProofUrl =
    typeof paymentInfo?.proof_url === 'string' ? resolveAssetUrl(paymentInfo.proof_url, '') : null
  const statusHref = registration?.uuid ? `/pmb/portal/pendaftaran/${registration.uuid}` : undefined
  const isSending = submit.isPending || submitCorrection.isPending

  if (isReadonly && registration) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
        <Card className="overflow-hidden border-primary/15 shadow-md shadow-primary/5">
          <div
            className="px-4 py-6 text-center sm:px-6 sm:py-8"
            style={{ background: BRAND_GRADIENT }}
          >
            <SchoolLogo alt="Nurul Hikmah" variant="login" className="mx-auto mb-3 drop-shadow-md" />
            <h1 className="text-lg font-semibold text-white sm:text-xl">Data Pendaftaran</h1>
            <p className="mt-1 text-sm text-white/80">
              {registration.registration_number} · Tahun Ajaran{' '}
              {registration.academic_year ?? resolvedAcademicYear}
            </p>
          </div>

          <CardContent className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
            <Form {...form}>
              <PmbWizardStepRingkasan
                form={form}
                variant="readonly"
                statusHref={statusHref}
                studentPhotoUrl={studentPhotoPreviewUrl ?? registration.student_photo?.url}
                paymentProofUrl={paymentProofUrl}
                paymentProofMimeType={
                  typeof paymentInfo?.proof_mime_type === 'string' ? paymentInfo.proof_mime_type : null
                }
                paymentProofName={typeof paymentInfo?.proof_name === 'string' ? paymentInfo.proof_name : null}
              />
            </Form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
      <Card className="overflow-hidden border-primary/15 shadow-md shadow-primary/5">
        <div
          className="px-4 py-6 text-center sm:px-6 sm:py-8"
          style={{ background: BRAND_GRADIENT }}
        >
          <SchoolLogo alt="Nurul Hikmah" variant="login" className="mx-auto mb-3 drop-shadow-md" />
          <h1 className="text-lg font-semibold text-white sm:text-xl">
            {isCorrectionMode ? 'Perbaiki Data Pendaftaran' : 'Formulir Pendaftaran PMB'}
          </h1>
          <p className="mt-1 text-sm text-white/80">
            {isCorrectionMode && registration?.registration_number
              ? `${registration.registration_number} · Tahun Ajaran ${registration.academic_year ?? resolvedAcademicYear}`
              : `Tahun Ajaran ${resolvedAcademicYear}`}
          </p>
          {isCorrectionMode && (
            <Badge
              variant="outline"
              className="mt-3 border-white/40 bg-white/15 text-white hover:bg-white/20"
            >
              Status: {PMB_STATUS_LABELS.needs_revision}
            </Badge>
          )}
        </div>

        <CardContent className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
          {isCorrectionMode && (
            <div
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950 sm:px-4"
              role="status"
            >
              <p className="font-medium">Status: {PMB_STATUS_LABELS.needs_revision}</p>
              <p className="mt-1 text-amber-900/80">
                {PMB_STATUS_DESCRIPTIONS.needs_revision}
              </p>
              {statusHref && (
                <Button
                  type="button"
                  variant="link"
                  className="mt-1 h-auto px-0 text-amber-950 underline"
                  onClick={() => navigate(statusHref)}
                >
                  Lihat status pendaftaran
                </Button>
              )}
            </div>
          )}

          <PmbWizardStepper
            currentStep={step}
            onStepSelect={isCorrectionMode ? (index) => setStep(Math.max(0, Math.min(TOTAL_STEPS - 1, index))) : undefined}
          />

          <div className="space-y-1 border-b border-primary/10 pb-4">
            <h2 className="text-base font-semibold sm:text-lg">{stepLabel}</h2>
            <p className="text-sm text-muted-foreground">{stepDescription}</p>
          </div>

          <Form {...form}>
            <form onSubmit={(event) => event.preventDefault()} className="space-y-5">
              <PageEnter key={step} tier="lite">
                {step === 0 && (
                  <PmbWizardStepDataDiri
                    form={form}
                    registrationUuid={registration?.uuid}
                    upload={upload}
                    photoPreviewUrl={studentPhotoPreviewUrl ?? authUser?.avatar_url}
                    onPhotoUploaded={handleStudentPhotoUploaded}
                  />
                )}
                {step === 1 && <PmbWizardStepOrangTua form={form} />}
                {step === 2 && (
                  <PmbWizardStepPembayaran
                    form={form}
                    fees={fees}
                    upload={upload}
                    proofPreviewUrl={paymentProofUrl}
                  />
                )}
                {step === 3 && (
                  <PmbWizardStepRingkasan
                    form={form}
                    isCorrection={isCorrectionMode}
                    onEditStep={isCorrectionMode ? (index) => setStep(index) : undefined}
                    studentPhotoUrl={studentPhotoPreviewUrl}
                    paymentProofUrl={paymentProofUrl}
                    paymentProofMimeType={
                      typeof paymentInfo?.proof_mime_type === 'string' ? paymentInfo.proof_mime_type : null
                    }
                    paymentProofName={
                      typeof paymentInfo?.proof_name === 'string' ? paymentInfo.proof_name : null
                    }
                  />
                )}
              </PageEnter>

              <div className={PMB_WIZARD_FOOTER_SPACER} aria-hidden />

              <div
                className={cn(
                  PMB_WIZARD_FOOTER_STICKY,
                  '-mx-4 mt-4 border-t border-primary/10 bg-card/95 px-4 py-3 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.08)] backdrop-blur-sm',
                  'lg:mx-0 lg:mt-6 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none lg:backdrop-blur-none',
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  {step > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-full touch-manipulation border-primary/20 active:scale-[0.98] motion-reduce:active:scale-100 sm:w-auto"
                      onClick={() => setStep((value) => Math.max(0, value - 1))}
                    >
                      Kembali
                    </Button>
                  )}
                  {step < TOTAL_STEPS - 1 ? (
                    <Button
                      type="button"
                      className="h-11 w-full touch-manipulation active:scale-[0.98] motion-reduce:active:scale-100 sm:ml-auto sm:w-auto"
                      onClick={() => void next()}
                    >
                      Lanjut
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="h-11 w-full touch-manipulation active:scale-[0.98] motion-reduce:active:scale-100 sm:ml-auto sm:w-auto"
                      onClick={() => void sendForm(isCorrectionMode ? 'correction' : 'submit')}
                      disabled={isSending}
                    >
                      {isSending
                        ? 'Mengirim…'
                        : isCorrectionMode
                          ? 'Kirim perbaikan'
                          : 'Kirim Pendaftaran'}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
