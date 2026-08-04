import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import {
  useActivatePmbFee,
  useAdminPmbFeesList,
  useDeletePmbFee,
  type PmbFee,
} from '@/hooks/usePmbFees'
import { formatRupiah, jenjangLabel, programLabel } from '@/schemas/pmb-fee'

export function PmbFeesListPage() {
  const { t } = useTranslation('admin')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<PmbFee | null>(null)
  const { data, isLoading, isFetching } = useAdminPmbFeesList({ page, per_page: 15, search })
  const deleteItem = useDeletePmbFee()
  const activateItem = useActivatePmbFee()

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
        columns={[
          {
            key: 'name',
            header: 'Nama',
            cell: (item) => item.name,
          },
          {
            key: 'jenjang',
            header: 'Jenjang',
            cell: (item) => jenjangLabel(item.jenjang),
          },
          {
            key: 'program',
            header: 'Program',
            cell: (item) => programLabel(item.program),
          },
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
            key: 'bank',
            header: 'Bank',
            cell: (item) => item.bank_name || '—',
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
              editHref={`/admin/pmb-fees/${item.id}/edit`}
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
