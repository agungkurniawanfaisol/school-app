import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminSchoolStatsList, useDeleteSchoolStat } from '@/hooks/useSchoolStats'
import { resolveValueIcon } from '@/lib/lucide-icon-map'
import type { SchoolStat } from '@/types'
import { useTranslation } from 'react-i18next'

export function SchoolStatsListPage() {
  const { t } = useTranslation('admin')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<SchoolStat | null>(null)
  const { data, isLoading, isFetching } = useAdminSchoolStatsList({ page, per_page: 15, search })
  const deleteItem = useDeleteSchoolStat()

  return (
    <>
      <AdminPaginatedTable
        title={t('pages.schoolStats.listTitle')}
        description={t('pages.schoolStats.listDesc')}
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
        createHref="/admin/statistik-sekolah/create"
        columns={[
          {
            key: 'icon',
            header: t('form.icon'),
            cell: (item) => {
              const Icon = resolveValueIcon(item.icon)
              return <Icon className="h-5 w-5 text-primary" aria-hidden />
            },
          },
          { key: 'label', header: t('form.label'), cell: (item) => item.label },
          { key: 'value', header: t('form.statValue'), cell: (item) => item.value },
          { key: 'order', header: t('form.order'), cell: (item) => item.order },
          { key: 'active', header: t('table.status'), cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
        ]}
        rowActions={(item) => (
          <AdminSimpleRowActions
            editHref={`/admin/statistik-sekolah/${item.uuid}/edit`}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />
      <AdminDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteItem.mutate(deleteTarget.uuid, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={deleteItem.isPending}
      />
    </>
  )
}
