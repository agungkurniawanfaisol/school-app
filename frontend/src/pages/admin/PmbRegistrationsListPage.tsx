import { useState } from 'react'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAdminPmbRegistrationsList } from '@/hooks/usePmb'

const STATUS_OPTIONS = [
  { value: 'all', label: 'Semua status' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'review', label: 'Direview' },
  { value: 'accepted', label: 'Diterima' },
  { value: 'rejected', label: 'Ditolak' },
]

export function PmbRegistrationsListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const { data, isLoading, isFetching } = useAdminPmbRegistrationsList({
    page,
    per_page: 15,
    search,
    status: status === 'all' ? undefined : status,
  })

  return (
    <AdminPaginatedTable
      title="Pendaftaran PMB"
      description="Kelola pendaftaran siswa baru"
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
      toolbarFilters={
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1) }}>
          <SelectTrigger className="h-11 w-full sm:w-44">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
      columns={[
        { key: 'number', header: 'No. Registrasi', cell: (item) => item.registration_number },
        { key: 'name', header: 'Nama Siswa', cell: (item) => item.student_name },
        { key: 'grade', header: 'Jenjang', cell: (item) => item.grade_applied },
        { key: 'status', header: 'Status', cell: (item) => <AdminStatusBadge status={item.status} /> },
      ]}
      rowActions={(item) => <AdminSimpleRowActions viewHref={`/admin/pmb-registrations/${item.id}`} />}
    />
  )
}
