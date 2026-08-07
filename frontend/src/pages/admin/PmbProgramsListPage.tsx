import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminPmbProgramsList, useDeletePmbProgram, type PmbProgram } from '@/hooks/usePmbPrograms'

export function PmbProgramsListPage() {
  const { t } = useTranslation('admin')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<PmbProgram | null>(null)
  const { data, isLoading, isFetching } = useAdminPmbProgramsList({ page, per_page: 15, search })
  const deleteItem = useDeletePmbProgram()

  return (
    <>
      <AdminPaginatedTable
        title={t('pages.pmbPrograms.listTitle')}
        description={t('pages.pmbPrograms.listDesc')}
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
        createHref="/admin/pmb-programs/create"
        columns={[
          { key: 'name', header: t('table.name'), cell: (item) => item.name },
          { key: 'code', header: t('table.code', { defaultValue: 'Kode' }), cell: (item) => item.code },
          {
            key: 'status',
            header: t('table.status'),
            cell: (item) => <AdminActiveBadge isActive={item.is_active} />,
          },
        ]}
        rowActions={(item) => (
          <AdminSimpleRowActions
            editHref={`/admin/pmb-programs/${item.id}/edit`}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />
      <AdminDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteItem.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={deleteItem.isPending}
      />
    </>
  )
}
