import { useEffect, useMemo, useState } from 'react'
import { Download, Mail, Megaphone } from 'lucide-react'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import { AdminSimpleRowActions } from '@/components/admin/AdminRowActions'
import { AdminFilterField } from '@/components/admin/AdminToolbar'
import { PmbAnalyticsDashboard } from '@/components/admin/pmb/PmbAnalyticsDashboard'
import { PmbEmailDialog } from '@/components/admin/pmb/PmbEmailDialog'
import { PmbExportActions } from '@/components/admin/pmb/PmbExportActions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAdminAcademicYearsList } from '@/hooks/useAcademicYears'
import { useAdminPmbRegistrationsList, useAdminPmbStats, useBroadcastPmbEmail, useSendPmbEmail } from '@/hooks/usePmb'
import { paymentProofFileName, resolvePaymentProofDownloadUrl } from '@/lib/pmb-payment-proof'
import type { ListFilters, PmbRegistration } from '@/types'
import { useTranslation } from 'react-i18next'

const SORT_OPTIONS = [
  { value: 'created_at:desc', sort_by: 'created_at', sort_dir: 'desc' as const },
  { value: 'created_at:asc', sort_by: 'created_at', sort_dir: 'asc' as const },
  { value: 'student_name:asc', sort_by: 'student_name', sort_dir: 'asc' as const },
  { value: 'student_name:desc', sort_by: 'student_name', sort_dir: 'desc' as const },
  { value: 'status:asc', sort_by: 'status', sort_dir: 'asc' as const },
  { value: 'grade_applied:asc', sort_by: 'grade_applied', sort_dir: 'asc' as const },
]

export function PmbRegistrationsListPage() {
  const { t } = useTranslation('admin')
  const { data: yearsData } = useAdminAcademicYearsList({ per_page: 50 })
  const years = yearsData?.data ?? []
  const activeYear = years.find((year) => year.is_active)?.label ?? ''
  const [academicYear, setAcademicYear] = useState('')
  const statusOptions = useMemo(
    () => [
      { value: 'all', label: t('common.allStatus') },
      { value: 'draft', label: t('pages.pmb.statusLabel.draft') },
      { value: 'awaiting_verification', label: t('pages.pmb.statusLabel.awaiting_verification') },
      { value: 'needs_revision', label: t('pages.pmb.statusLabel.needs_revision') },
      { value: 'accepted', label: t('pages.pmb.statusLabel.accepted') },
      { value: 'rejected', label: t('pages.pmb.statusLabel.rejected') },
    ],
    [t],
  )
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [sortValue, setSortValue] = useState('created_at:desc')
  const [selectedUuids, setSelectedUuids] = useState<string[]>([])
  const [sendOpen, setSendOpen] = useState(false)
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const sendEmail = useSendPmbEmail()
  const broadcastEmail = useBroadcastPmbEmail()

  useEffect(() => {
    if (!academicYear && activeYear) {
      setAcademicYear(activeYear)
    }
  }, [academicYear, activeYear])

  const sort = SORT_OPTIONS.find((opt) => opt.value === sortValue) ?? SORT_OPTIONS[0]

  const sharedFilters: ListFilters = useMemo(
    () => ({
      search: search || undefined,
      status: status === 'all' ? undefined : status,
      academic_year: academicYear === 'all' ? undefined : academicYear || undefined,
      sort_by: sort.sort_by,
      sort_dir: sort.sort_dir,
    }),
    [search, status, academicYear, sort.sort_by, sort.sort_dir],
  )

  const { data, isLoading, isFetching } = useAdminPmbRegistrationsList({
    ...sharedFilters,
    page,
    per_page: 15,
  })

  const { data: stats, isLoading: statsLoading, isFetching: statsFetching } = useAdminPmbStats(sharedFilters)

  const yearLabel = academicYear && academicYear !== 'all' ? academicYear : undefined
  const pageRows = data?.data ?? []
  const pageUuids = pageRows.map((row) => row.uuid)
  const allPageSelected = pageUuids.length > 0 && pageUuids.every((uuid) => selectedUuids.includes(uuid))

  const toggleRow = (uuid: string, checked: boolean) => {
    setSelectedUuids((current) => (
      checked ? [...new Set([...current, uuid])] : current.filter((item) => item !== uuid)
    ))
  }

  const togglePage = (checked: boolean) => {
    setSelectedUuids((current) => {
      if (!checked) {
        return current.filter((uuid) => !pageUuids.includes(uuid))
      }
      return [...new Set([...current, ...pageUuids])]
    })
  }

  return (
    <div className="pmb-registrations-page space-y-1">
      <AdminPaginatedTable
        title={t('pages.pmb.listTitle')}
        description={t('pages.pmb.listDesc')}
        headerActions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="min-h-11 gap-2"
              disabled={selectedUuids.length === 0}
              onClick={() => setSendOpen(true)}
            >
              <Mail className="h-4 w-4" aria-hidden />
              Kirim email ({selectedUuids.length})
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-11 gap-2"
              onClick={() => setBroadcastOpen(true)}
            >
              <Megaphone className="h-4 w-4" aria-hidden />
              Broadcast
            </Button>
            <PmbExportActions
              filters={sharedFilters}
              isRefreshing={isFetching || statsFetching}
            />
          </div>
        }
        beforeTable={
          <div className="space-y-6">
            <PmbAnalyticsDashboard
              stats={stats}
              isLoading={statsLoading}
              academicYearLabel={yearLabel}
            />
            <div className="flex items-center justify-between gap-3 border-b border-primary/10 pb-2">
              <h2 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
                {t('pages.pmb.tableTitle')}
              </h2>
              {data?.meta?.total != null ? (
                <p className="text-xs tabular-nums text-muted-foreground sm:text-sm">
                  {t('pages.pmb.tableCount', { count: data.meta.total })}
                </p>
              ) : null}
            </div>
          </div>
        }
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
          <>
            <AdminFilterField label={t('common.filterAcademicYear')}>
              <Select
                value={academicYear || 'all'}
                onValueChange={(v) => {
                  setAcademicYear(v)
                  setPage(1)
                }}
              >
                <SelectTrigger
                  className="h-11 w-full cursor-pointer border-primary/15 bg-background shadow-none"
                  aria-label={t('common.filterAcademicYear')}
                >
                  <SelectValue placeholder={t('common.filterAcademicYear')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.allAcademicYears')}</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year.id} value={year.label}>
                      {year.label}
                      {year.is_active ? ` (${t('status.active')})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AdminFilterField>
            <AdminFilterField label={t('common.filterStatus')}>
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v)
                  setPage(1)
                }}
              >
                <SelectTrigger
                  className="h-11 w-full cursor-pointer border-primary/15 bg-background shadow-none"
                  aria-label={t('common.filterStatus')}
                >
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
            </AdminFilterField>
            <AdminFilterField label={t('pages.pmb.sort.label')} className="sm:col-span-2 xl:col-span-1">
              <Select
                value={sortValue}
                onValueChange={(v) => {
                  setSortValue(v)
                  setPage(1)
                }}
              >
                <SelectTrigger
                  className="h-11 w-full cursor-pointer border-primary/15 bg-background shadow-none"
                  aria-label={t('pages.pmb.sort.label')}
                >
                  <SelectValue placeholder={t('pages.pmb.sort.label')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at:desc">{t('pages.pmb.sort.newest')}</SelectItem>
                  <SelectItem value="created_at:asc">{t('pages.pmb.sort.oldest')}</SelectItem>
                  <SelectItem value="student_name:asc">{t('pages.pmb.sort.nameAsc')}</SelectItem>
                  <SelectItem value="student_name:desc">{t('pages.pmb.sort.nameDesc')}</SelectItem>
                  <SelectItem value="status:asc">{t('pages.pmb.sort.status')}</SelectItem>
                  <SelectItem value="grade_applied:asc">{t('pages.pmb.sort.grade')}</SelectItem>
                </SelectContent>
              </Select>
            </AdminFilterField>
          </>
        }
        columns={[
          {
            key: 'select',
            header: (
              <Checkbox
                checked={allPageSelected}
                onCheckedChange={(checked) => togglePage(checked === true)}
                aria-label="Pilih semua di halaman ini"
              />
            ),
            className: 'w-10',
            cell: (item) => (
              <Checkbox
                checked={selectedUuids.includes(item.uuid)}
                onCheckedChange={(checked) => toggleRow(item.uuid, checked === true)}
                aria-label={`Pilih ${item.student_name ?? item.registration_number}`}
              />
            ),
          },
          {
            key: 'number',
            header: t('table.registrationNo'),
            cell: (item) => (
              <span className="font-mono text-xs tabular-nums text-muted-foreground sm:text-sm">
                {item.registration_number}
              </span>
            ),
          },
          {
            key: 'name',
            header: t('table.studentName'),
            cell: (item) => (
              <span className="inline-flex flex-wrap items-center gap-2 font-medium text-foreground">
                {item.student_name}
                {item.has_admin_unread ? (
                  <Badge variant="destructive" className="text-[10px] uppercase tracking-wide">
                    Baru
                  </Badge>
                ) : null}
              </span>
            ),
          },
          { key: 'year', header: t('table.academicYear'), cell: (item) => item.academic_year ?? '—' },
          {
            key: 'grade',
            header: t('table.grade'),
            cell: (item) => (
              <span className="inline-flex rounded-md bg-muted/60 px-2 py-0.5 text-xs font-medium">
                {item.grade_applied || '—'}
              </span>
            ),
          },
          { key: 'status', header: t('table.status'), cell: (item) => <AdminStatusBadge status={item.status} /> },
        ]}
        getRowClassName={(item: PmbRegistration) =>
          item.has_admin_unread ? 'bg-primary/5 hover:bg-primary/10' : undefined
        }
        rowActions={(item) => {
          const paymentInfo = (item.payment_info ?? null) as Record<string, unknown> | null
          const downloadUrl = resolvePaymentProofDownloadUrl(paymentInfo)

          return (
            <TooltipProvider delayDuration={300}>
              <div className="flex items-center justify-end gap-0.5">
                {downloadUrl ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button asChild size="icon" variant="ghost" className="h-11 w-11 min-h-11 min-w-11">
                        <a
                          href={downloadUrl}
                          download={paymentProofFileName(paymentInfo)}
                          aria-label={`Unduh bukti transfer ${item.student_name ?? item.registration_number}`}
                          data-testid={`pmb-proof-download-${item.uuid}`}
                        >
                          <Download className="h-4 w-4" aria-hidden />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Unduh bukti</TooltipContent>
                  </Tooltip>
                ) : null}
                <AdminSimpleRowActions viewHref={`/admin/pmb-registrations/${item.uuid}`} />
              </div>
            </TooltipProvider>
          )
        }}
      />

      <PmbEmailDialog
        mode="send"
        open={sendOpen}
        onOpenChange={setSendOpen}
        registrationUuids={selectedUuids}
        recipientCount={selectedUuids.length}
        isSubmitting={sendEmail.isPending}
        onSend={(values) => {
          sendEmail.mutate(values, {
            onSuccess: () => {
              setSendOpen(false)
              setSelectedUuids([])
            },
          })
        }}
        onBroadcast={() => undefined}
      />

      <PmbEmailDialog
        mode="broadcast"
        open={broadcastOpen}
        onOpenChange={setBroadcastOpen}
        isSubmitting={broadcastEmail.isPending}
        onSend={() => undefined}
        onBroadcast={(values) => {
          broadcastEmail.mutate(values, {
            onSuccess: () => setBroadcastOpen(false),
          })
        }}
      />
    </div>
  )
}
