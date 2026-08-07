import { useState } from 'react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminActiveBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import {
  useAdminAppReleasesList,
  useDeleteAppRelease,
  type AppRelease,
} from '@/hooks/useAppReleases'
import { formatAppVersion } from '@/lib/app-version'
import { useTranslation } from 'react-i18next'

export function AppReleasesListPage() {
  const { t } = useTranslation('admin')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<AppRelease | null>(null)
  const { data, isLoading, isFetching } = useAdminAppReleasesList({ page, per_page: 15, search })
  const deleteItem = useDeleteAppRelease()

  return (
    <>
      <AdminPaginatedTable
        title={t('pages.appReleases.listTitle')}
        description={t('pages.appReleases.listDesc')}
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
        createHref="/admin/app-releases/create"
        columns={[
          {
            key: 'version',
            header: t('table.version'),
            cell: (item) => formatAppVersion(item.version),
          },
          { key: 'title', header: t('table.title'), cell: (item) => item.title },
          {
            key: 'published',
            header: t('table.status'),
            cell: (item) => <AdminActiveBadge isActive={item.is_published} />,
          },
        ]}
        rowActions={(item) => (
          <AdminSimpleRowActions
            editHref={`/admin/app-releases/${item.id}/edit`}
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
