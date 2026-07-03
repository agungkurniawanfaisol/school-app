import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContentRowActions } from '@/components/admin/AdminContentRowActions'
import { AdminPaginatedTable } from '@/components/admin/AdminPaginatedTable'
import { NewsPublishDialog } from '@/components/admin/NewsPublishDialog'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useAdminNewsList,
  useDeleteNews,
  usePublishNews,
  useUnpublishNews,
} from '@/hooks/useNews'
import {
  NEWS_DISPLAY_STATUS_LABELS,
  NEWS_DISPLAY_STATUS_VARIANTS,
  type NewsDisplayStatus,
} from '@/lib/newsDisplayStatus'
import { formatDate } from '@/lib/utils'
import type { News } from '@/types'

const DISPLAY_STATUS_OPTIONS: { value: 'all' | NewsDisplayStatus; label: string }[] = [
  { value: 'all', label: 'Semua status' },
  { value: 'draft', label: NEWS_DISPLAY_STATUS_LABELS.draft },
  { value: 'scheduled', label: NEWS_DISPLAY_STATUS_LABELS.scheduled },
  { value: 'live', label: NEWS_DISPLAY_STATUS_LABELS.live },
  { value: 'ended', label: NEWS_DISPLAY_STATUS_LABELS.ended },
  { value: 'archived', label: NEWS_DISPLAY_STATUS_LABELS.archived },
]

function resolveDisplayStatus(item: News): NewsDisplayStatus {
  return item.display_status ?? (item.status === 'published' ? 'live' : 'draft')
}

export function AdminNewsListPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [displayStatus, setDisplayStatus] = useState<'all' | NewsDisplayStatus>('all')
  const [deleteTarget, setDeleteTarget] = useState<News | null>(null)
  const [publishTarget, setPublishTarget] = useState<News | null>(null)
  const { data, isLoading, isFetching } = useAdminNewsList({
    page,
    per_page: 15,
    search,
    ...(displayStatus !== 'all' ? { display_status: displayStatus } : {}),
  })
  const deleteNews = useDeleteNews()
  const publishNews = usePublishNews()
  const unpublishNews = useUnpublishNews()

  return (
    <>
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
        toolbarFilters={
          <Select
            value={displayStatus}
            onValueChange={(v) => {
              setDisplayStatus(v as typeof displayStatus)
              setPage(1)
            }}
          >
            <SelectTrigger className="h-11 w-full sm:w-44" aria-label="Filter status tampil">
              <SelectValue placeholder="Status tampil" />
            </SelectTrigger>
            <SelectContent>
              {DISPLAY_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
        columns={[
          { key: 'title', header: 'Judul', cell: (item) => item.title },
          { key: 'category', header: 'Kategori', cell: (item) => item.category ?? '-' },
          {
            key: 'schedule',
            header: 'Jadwal',
            cell: (item) => {
              if (!item.published_at) return '-'
              const end = item.publish_ends_at ? ` – ${formatDate(item.publish_ends_at)}` : ''
              return (
                <span className="text-sm text-muted-foreground">
                  {formatDate(item.published_at)}
                  {end}
                </span>
              )
            },
          },
          {
            key: 'status',
            header: 'Status',
            cell: (item) => {
              const status = resolveDisplayStatus(item)
              return (
                <Badge variant={NEWS_DISPLAY_STATUS_VARIANTS[status]}>
                  {NEWS_DISPLAY_STATUS_LABELS[status]}
                </Badge>
              )
            },
          },
        ]}
        rowActions={(item) => (
          <AdminContentRowActions
            uuid={item.uuid}
            status={item.status}
            editHref={`/admin/news/${item.uuid}/edit`}
            previewHref={`/admin/news/${item.uuid}/preview`}
            isPublishing={publishNews.isPending || unpublishNews.isPending}
            onPublish={() => setPublishTarget(item)}
            onUnpublish={() => unpublishNews.mutate(item.uuid)}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />

      <NewsPublishDialog
        news={publishTarget}
        open={!!publishTarget}
        onOpenChange={(open) => !open && setPublishTarget(null)}
        isPending={publishNews.isPending}
        onConfirm={(uuid, payload) => {
          publishNews.mutate(
            { uuid, ...payload },
            { onSuccess: () => setPublishTarget(null) },
          )
        }}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus berita?</DialogTitle>
            <DialogDescription>
              Berita &quot;{deleteTarget?.title}&quot; akan dihapus permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={deleteNews.isPending}
              onClick={async () => {
                if (!deleteTarget) return
                await deleteNews.mutateAsync(deleteTarget.uuid)
                setDeleteTarget(null)
                navigate('/admin/news')
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
