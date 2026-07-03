import { useState } from 'react'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { Badge } from '@/components/ui/badge'
import { useAdminNewsList } from '@/hooks/useNews'

export function AdminNewsListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading, isFetching } = useAdminNewsList({ page, per_page: 15, search })

  return (
    <AdminPaginatedTable
      title="Kelola Berita"
      description="Daftar berita dan artikel sekolah"
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
      createHref="/admin/news/create"
      columns={[
        { key: 'title', header: 'Judul', cell: (item) => item.title },
        { key: 'category', header: 'Kategori', cell: (item) => item.category ?? '-' },
        {
          key: 'status',
          header: 'Status',
          cell: (item) => (
            <Badge variant={item.is_active ? 'default' : 'secondary'}>
              {item.status ?? (item.is_active ? 'Aktif' : 'Nonaktif')}
            </Badge>
          ),
        },
      ]}
    />
  )
}
