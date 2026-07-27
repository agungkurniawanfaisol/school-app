import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { findAdminNavItem } from '@/config/admin-nav'

export function useAdminPageTitle(pathname: string): string {
  const { t } = useTranslation('admin')
  const item = findAdminNavItem(pathname)
  return item ? t(item.labelKey) : t('nav.panelAdmin')
}

export function useAdminNavLabel() {
  const { t } = useTranslation('admin')
  return useCallback((labelKey: string) => t(labelKey), [t])
}
