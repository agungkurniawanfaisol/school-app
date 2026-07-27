import { useMemo, useState } from 'react'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAdminPmbRegistrationsList } from '@/hooks/usePmb'
import { useTranslation } from 'react-i18next'

export function PmbRegistrationsListPage() {
  const { t } = useTranslation('admin')
  const statusOptions = useMemo(
    () => [
      { value: 'all', label: t('common.allStatus') },
      { value: 'pending', label: t('status.pending') },
      { value: 'review', label: t('status.reviewing') },
      { value: 'accepted', label: t('status.accepted') },
      { value: 'rejected', label: t('status.rejected') },
    ],
    [t],
  )
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
      title={t('pages.pmb.listTitle')}
      description={t('pages.pmb.listDesc')}
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
        { key: 'number', header: t('table.registrationNo'), cell: (item) => item.registration_number },
        { key: 'name', header: t('table.studentName'), cell: (item) => item.student_name },
        { key: 'grade', header: t('table.grade'), cell: (item) => item.grade_applied },
        { key: 'status', header: t('table.status'), cell: (item) => <AdminStatusBadge status={item.status} /> },
      ]}
      rowActions={(item) => <AdminSimpleRowActions viewHref={`/admin/pmb-registrations/${item.id}`} />}
    />
  )
}
