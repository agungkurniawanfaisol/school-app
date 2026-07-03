import { useState } from 'react'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAdminCourseEnrollmentsList } from '@/hooks/useCourseEnrollments'

const STATUS_OPTIONS = [
  { value: 'all', label: 'Semua status' },
  { value: 'active', label: 'Aktif' },
  { value: 'completed', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
]

export function CourseEnrollmentsListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const { data, isLoading, isFetching } = useAdminCourseEnrollmentsList({
    page,
    per_page: 15,
    search,
    status: status === 'all' ? undefined : status,
  })

  return (
    <AdminPaginatedTable
      title="Pendaftaran Kursus"
      description="Daftar siswa terdaftar di kursus"
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
        { key: 'student', header: 'Siswa', cell: (item) => item.student_name },
        { key: 'email', header: 'Email', cell: (item) => item.student_email },
        { key: 'course', header: 'Kursus', cell: (item) => item.course?.title ?? '—' },
        { key: 'status', header: 'Status', cell: (item) => <AdminStatusBadge status={item.status} /> },
      ]}
    />
  )
}
