import { useMemo, useState } from 'react'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAdminCourseEnrollmentsList } from '@/hooks/useCourseEnrollments'
import { useTranslation } from 'react-i18next'

export function CourseEnrollmentsListPage() {
  const { t } = useTranslation('admin')
  const statusOptions = useMemo(
    () => [
      { value: 'all', label: t('common.allStatus') },
      { value: 'active', label: t('status.active') },
      { value: 'completed', label: t('status.completed') },
      { value: 'cancelled', label: t('status.cancelled') },
    ],
    [t],
  )
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
      title={t('pages.courses.enrollmentsTitle')}
      description={t('pages.courses.enrollmentsDesc')}
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
            <SelectValue placeholder={t('common.filterStatus')} />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
      columns={[
        { key: 'student', header: t('table.student'), cell: (item) => item.student_name },
        { key: 'email', header: t('table.email'), cell: (item) => item.student_email },
        { key: 'course', header: t('table.course'), cell: (item) => item.course?.title ?? '—' },
        { key: 'status', header: t('table.status'), cell: (item) => <AdminStatusBadge status={item.status} /> },
      ]}
    />
  )
}
