import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { AdminTFunction } from '@/lib/zod-i18n'
import type { ZodType } from 'zod'

export function useAdminSchema<T extends ZodType>(
  factory: (t: AdminTFunction) => T,
  deps: ReadonlyArray<unknown> = [],
): T {
  const { t } = useTranslation('admin')
  return useMemo(() => factory(t as AdminTFunction), [t, ...deps])
}
