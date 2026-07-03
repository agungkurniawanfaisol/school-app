import { useState } from 'react'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { Badge } from '@/components/ui/badge'
import { useAdminTeachersList } from '@/hooks/useTeachers'

export function AdminTeachersListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading, isFetching } = useAdminTeachersList({ page, per_page: 15, search })

  return (
    <AdminPaginatedTable
      title="Kelola Guru"
      description="Daftar guru dan tenaga pendidik"
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
      createHref="/admin/teachers/create"
      columns={[
        { key: 'name', header: 'Nama', cell: (item) => item.name },
        { key: 'subject', header: 'Mata Pelajaran', cell: (item) => item.subject ?? '-' },
        { key: 'title', header: 'Jabatan', cell: (item) => item.title ?? '-' },
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
