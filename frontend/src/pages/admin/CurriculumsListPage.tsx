import { useState } from 'react'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { Badge } from '@/components/ui/badge'
import { useAdminCurriculumsList } from '@/hooks/useCurriculums'

export function AdminCurriculumsListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading, isFetching } = useAdminCurriculumsList({ page, per_page: 15, search })

  return (
    <AdminPaginatedTable
      title="Kelola Kurikulum"
      description="Daftar program kurikulum sekolah"
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
      createHref="/admin/curriculums/create"
      columns={[
        { key: 'title', header: 'Judul', cell: (item) => item.title },
        { key: 'category', header: 'Kategori', cell: (item) => item.category ?? '-' },
        {
          key: 'featured',
          header: 'Unggulan',
          cell: (item) => (
            <Badge variant={item.is_featured ? 'default' : 'outline'}>
              {item.is_featured ? 'Ya' : 'Tidak'}
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
