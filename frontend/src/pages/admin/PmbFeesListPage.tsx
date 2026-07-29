import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Building2, CreditCard } from 'lucide-react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  useActivatePmbFee,
  useAdminPmbFeesList,
  useDeletePmbFee,
  type PmbFee,
} from '@/hooks/usePmbFees'
import { usePublicSettings } from '@/hooks/useSettings'
import { formatRupiah } from '@/schemas/pmb-fee'

export function PmbFeesListPage() {
  const { t } = useTranslation('admin')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<PmbFee | null>(null)
  const { data, isLoading, isFetching } = useAdminPmbFeesList({ page, per_page: 15, search })
  const { data: pmbSettings } = usePublicSettings('pmb')
  const deleteItem = useDeletePmbFee()
  const activateItem = useActivatePmbFee()

  const settingMap = Object.fromEntries((pmbSettings ?? []).map((s) => [s.key, s.value?.trim() ?? '']))
  const bankName = settingMap.pmb_bank_name || ''
  const accountNumber = settingMap.pmb_account_number || ''
  const accountHolder = settingMap.pmb_account_holder || ''
  const bankConfigured = Boolean(bankName && accountNumber && accountHolder)

  return (
    <>
      <AdminPaginatedTable
        title={t('pages.pmbFees.listTitle')}
        description={t('pages.pmbFees.listDesc')}
        data={data?.data}
        meta={data?.meta}
        isLoading={isLoading}
        isFetching={isFetching}
        page={page}
        onPageChange={setPage}
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        createHref="/admin/pmb-fees/create"
        beforeTable={
          <Alert className={bankConfigured ? 'border-primary/25 bg-primary/5' : 'border-amber-500/30 bg-amber-500/10'}>
            <CreditCard className="h-5 w-5" />
            <AlertTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4" aria-hidden />
              {t('pages.pmbFees.bankBannerTitle')}
            </AlertTitle>
            <AlertDescription className="space-y-3">
              {bankConfigured ? (
                <ul className="space-y-1 text-sm">
                  <li>
                    <span className="text-muted-foreground">{t('pages.pmbFees.bankLabel')}: </span>
                    <strong>{bankName}</strong>
                  </li>
                  <li>
                    <span className="text-muted-foreground">{t('pages.pmbFees.accountLabel')}: </span>
                    <strong className="font-mono">{accountNumber}</strong>
                  </li>
                  <li>
                    <span className="text-muted-foreground">{t('pages.pmbFees.holderLabel')}: </span>
                    <strong>{accountHolder}</strong>
                  </li>
                </ul>
              ) : (
                <p className="text-sm">{t('pages.pmbFees.bankBannerEmpty')}</p>
              )}
              <Button asChild variant="outline" size="sm" className="min-h-11">
                <Link to="/admin/settings">{t('pages.pmbFees.bankBannerEdit')}</Link>
              </Button>
            </AlertDescription>
          </Alert>
        }
        columns={[
          {
            key: 'year',
            header: t('table.academicYear'),
            cell: (item) => item.academic_year?.label ?? '—',
          },
          {
            key: 'amount',
            header: t('table.amount'),
            cell: (item) => item.amount_formatted || formatRupiah(item.amount),
          },
          {
            key: 'status',
            header: t('table.status'),
            cell: (item) => <AdminActiveBadge isActive={item.is_active} />,
          },
        ]}
        rowActions={(item) => {
          const extras = !item.is_active
            ? [
                {
                  label: t('common.activate'),
                  onClick: () => activateItem.mutate(item),
                },
              ]
            : []

          return (
            <AdminSimpleRowActions
              onDelete={() => setDeleteTarget(item)}
              extraItems={extras}
            />
          )
        }}
      />
      <AdminDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        description={
          deleteTarget?.is_active
            ? t('pages.pmbFees.deleteActiveDescription')
            : t('dialog.deleteDescription')
        }
        onConfirm={() => {
          if (!deleteTarget) return
          deleteItem.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={deleteItem.isPending}
      />
    </>
  )
}
