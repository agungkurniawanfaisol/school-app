import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { TeacherTypeValue } from '@/schemas/teacher'

export function useTeacherTypeLabels(): Record<TeacherTypeValue, string> {
  const { t } = useTranslation('admin')

  return useMemo(
    () => ({
      kepala_sekolah: t('teacherType.principal'),
      guru: t('teacherType.teacher'),
      staff: t('teacherType.staff'),
    }),
    [t],
  )
}
