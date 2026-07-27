import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAdminUsersList, useDeleteUser } from '@/hooks/useUsers'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { useTranslation } from 'react-i18next'

export function UsersListPage() {
  const { t } = useTranslation('admin')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading, isFetching } = useAdminUsersList({ page, per_page: 15, search })
  const deleteUser = useDeleteUser()

  const handleDelete = (id: number, name: string) => {
    if (!window.confirm(t('pages.users.deleteConfirm', { name }))) return

    deleteUser.mutate(id, {
      onSuccess: () => toast.success(t('toast.userDeleted')),
      onError: (error) => toast.error(getApiErrorMessage(error, t('toast.userDeleteFailed'))),
    })
  }

  return (
    <AdminPaginatedTable
      title={t('pages.users.listTitle')}
      description={t('pages.users.listDesc')}
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
      createHref="/admin/users/create"
      rowActions={(item) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/admin/users/${item.id}/edit`}>{t('common.edit')}</Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id, item.name)}>
            {t('common.delete')}
          </Button>
        </div>
      )}
      columns={[
        { key: 'name', header: t('table.name'), cell: (item) => item.name },
        { key: 'email', header: t('table.email'), cell: (item) => item.email },
        {
          key: 'role',
          header: t('table.role'),
          cell: (item) => (
            <Badge variant={item.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
              {item.role}
            </Badge>
          ),
        },
        {
          key: 'active',
          header: t('table.status'),
          cell: (item) => (
            <Badge variant={item.is_active ? 'default' : 'secondary'}>
              {item.is_active ? t('status.active') : t('status.inactive')}
            </Badge>
          ),
        },
      ]}
    />
  )
}
