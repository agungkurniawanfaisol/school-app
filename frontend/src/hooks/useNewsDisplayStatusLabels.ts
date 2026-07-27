import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { NewsDisplayStatus } from '@/lib/newsDisplayStatus'

const NEWS_STATUS_KEYS: Record<NewsDisplayStatus, string> = {
  draft: 'status.draft',
  scheduled: 'status.scheduled',
  live: 'status.live',
  ended: 'status.ended',
  archived: 'status.archived',
}

export function useNewsDisplayStatusLabels(): Record<NewsDisplayStatus, string> {
  const { t } = useTranslation('admin')

  return useMemo(
    () => ({
      draft: t(NEWS_STATUS_KEYS.draft),
      scheduled: t(NEWS_STATUS_KEYS.scheduled),
      live: t(NEWS_STATUS_KEYS.live),
      ended: t(NEWS_STATUS_KEYS.ended),
      archived: t(NEWS_STATUS_KEYS.archived),
    }),
    [t],
  )
}
