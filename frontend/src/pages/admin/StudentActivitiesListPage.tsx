import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContentRowActions } from '@/components/admin/AdminContentRowActions'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  useAdminActivitiesList,
  useDeleteActivity,
  usePublishActivity,
  useUnpublishActivity,
} from '@/hooks/useActivities'
import type { StudentActivity } from '@/types'
import { formatDate } from '@/lib/utils'

export function StudentActivitiesListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<StudentActivity | null>(null)
  const { data, isLoading, isFetching } = useAdminActivitiesList({ page, per_page: 15, search })
  const deleteActivity = useDeleteActivity()
  const publishActivity = usePublishActivity()
  const unpublishActivity = useUnpublishActivity()

  return (
    <>
      <AdminPaginatedTable
        title="Kelola Kegiatan Siswa"
        description="Dokumentasi kegiatan dan prestasi siswa"
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
        createHref="/admin/student-activities/create"
        columns={[
          { key: 'title', header: 'Judul', cell: (item) => item.title },
          {
            key: 'activity_date',
            header: 'Tanggal',
            cell: (item) => (item.activity_date ? formatDate(item.activity_date) : '-'),
          },
          {
            key: 'status',
            header: 'Status',
            cell: (item) => (
              <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                {item.status === 'published' ? 'Dipublikasikan' : 'Draf'}
              </Badge>
            ),
          },
        ]}
        rowActions={(item) => (
          <AdminContentRowActions
            uuid={item.uuid}
            status={item.status}
            editHref={`/admin/student-activities/${item.uuid}/edit`}
            previewHref={`/admin/student-activities/${item.uuid}/preview`}
            isPublishing={publishActivity.isPending || unpublishActivity.isPending}
            onPublish={() => publishActivity.mutate(item.uuid)}
            onUnpublish={() => unpublishActivity.mutate(item.uuid)}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus kegiatan?</DialogTitle>
            <DialogDescription>
              Kegiatan &quot;{deleteTarget?.title}&quot; akan dihapus permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={deleteActivity.isPending}
              onClick={async () => {
                if (!deleteTarget) return
                await deleteActivity.mutateAsync(deleteTarget.uuid)
                setDeleteTarget(null)
                navigate('/admin/student-activities')
              }}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
