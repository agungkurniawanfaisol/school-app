import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAdminUsersList, useDeleteUser } from '@/hooks/useUsers'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'

export function UsersListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading, isFetching } = useAdminUsersList({ page, per_page: 15, search })
  const deleteUser = useDeleteUser()

  const handleDelete = (id: number, name: string) => {
    if (!window.confirm(`Hapus pengguna "${name}"?`)) return

    deleteUser.mutate(id, {
      onSuccess: () => toast.success('Pengguna berhasil dihapus'),
      onError: (error) => toast.error(getApiErrorMessage(error, 'Gagal menghapus pengguna')),
    })
  }

  return (
    <AdminPaginatedTable
      title="Kelola Pengguna"
      description="Daftar akun admin dan guru"
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
            <Link to={`/admin/users/${item.id}/edit`}>Edit</Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id, item.name)}>
            Hapus
          </Button>
        </div>
      )}
      columns={[
        { key: 'name', header: 'Nama', cell: (item) => item.name },
        { key: 'email', header: 'Email', cell: (item) => item.email },
        {
          key: 'role',
          header: 'Role',
          cell: (item) => (
            <Badge variant={item.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
              {item.role}
            </Badge>
          ),
        },
        {
          key: 'active',
          header: 'Status',
          cell: (item) => (
            <Badge variant={item.is_active ? 'default' : 'secondary'}>
              {item.is_active ? 'Aktif' : 'Nonaktif'}
            </Badge>
          ),
        },
      ]}
    />
  )
}
