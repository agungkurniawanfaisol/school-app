import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { useAdminSchoolValuesList, useDeleteSchoolValue } from '@/hooks/useSchoolValues'
import { resolveValueIcon } from '@/lib/lucide-icon-map'
import type { SchoolValue } from '@/types'
import { useTranslation } from 'react-i18next'

export function SchoolValuesListPage() {
  const { t } = useTranslation('admin')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<SchoolValue | null>(null)
  const { data, isLoading, isFetching } = useAdminSchoolValuesList({ page, per_page: 15, search })
  const deleteItem = useDeleteSchoolValue()

  return (
    <>
      <AdminPaginatedTable
        title={t('pages.schoolValues.listTitle')}
        description={t('pages.schoolValues.listDesc')}
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
        createHref="/admin/nilai-kami/create"
        columns={[
          {
            key: 'icon',
            header: t('form.icon'),
            cell: (item) => {
              const Icon = resolveValueIcon(item.icon)
              return <Icon className="h-5 w-5 text-primary" aria-hidden />
            },
          },
          { key: 'title', header: t('table.title'), cell: (item) => item.title },
          {
            key: 'description',
            header: t('form.description'),
            cell: (item) => (
              <span className="line-clamp-2 max-w-xs text-muted-foreground">{item.description}</span>
            ),
          },
          { key: 'order', header: t('form.order'), cell: (item) => item.order },
          { key: 'active', header: t('table.status'), cell: (item) => <AdminActiveBadge isActive={item.is_active} /> },
        ]}
        rowActions={(item) => (
          <AdminSimpleRowActions
            editHref={`/admin/nilai-kami/${item.uuid}/edit`}
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
