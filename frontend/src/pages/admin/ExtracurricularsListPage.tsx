import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminExtracurricularsList, useDeleteExtracurricular } from '@/hooks/useExtracurriculars'
import type { Extracurricular } from '@/hooks/useExtracurriculars'
import { useTranslation } from 'react-i18next'

export function ExtracurricularsListPage() {
  const { t } = useTranslation('admin')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Extracurricular | null>(null)
  const { data, isLoading, isFetching } = useAdminExtracurricularsList({ page, per_page: 15, search })
  const deleteItem = useDeleteExtracurricular()

  return (
    <>
      <AdminPaginatedTable
        title={t('pages.extracurriculars.listTitle')}
        description={t('pages.extracurriculars.listDesc')}
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
        createHref="/admin/extracurriculars/create"
        columns={[
          { key: 'name', header: t('table.name'), cell: (item) => item.name },
          { key: 'category', header: t('table.category'), cell: (item) => item.category },
          { key: 'schedule', header: t('table.schedule'), cell: (item) => item.schedule ?? '—' },
          { key: 'instructor', header: t('table.supervisor'), cell: (item) => item.instructor ?? '—' },
          { key: 'status', header: t('table.status'), cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
        ]}
        rowActions={(item) => (
          <AdminSimpleRowActions
            editHref={`/admin/extracurriculars/${item.id}/edit`}
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
