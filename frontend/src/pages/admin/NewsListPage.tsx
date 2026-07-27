import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  NEWS_DISPLAY_STATUS_VARIANTS,
  type NewsDisplayStatus,
} from '@/lib/newsDisplayStatus'
import { useNewsDisplayStatusLabels } from '@/hooks/useNewsDisplayStatusLabels'
import { formatDate } from '@/lib/utils'
import type { News } from '@/types'

function resolveDisplayStatus(item: News): NewsDisplayStatus {
  return item.display_status ?? (item.status === 'published' ? 'live' : 'draft')
}

export function AdminNewsListPage() {
  const { t } = useTranslation('admin')
  const statusLabels = useNewsDisplayStatusLabels()
  const displayStatusOptions = useMemo(
    () => [
      { value: 'all' as const, label: t('common.allStatus') },
      { value: 'draft' as const, label: statusLabels.draft },
      { value: 'scheduled' as const, label: statusLabels.scheduled },
      { value: 'live' as const, label: statusLabels.live },
      { value: 'ended' as const, label: statusLabels.ended },
      { value: 'archived' as const, label: statusLabels.archived },
    ],
    [t, statusLabels],
  )
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
        title={t('pages.news.listTitle')}
        description={t('pages.news.listDesc')}
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
            <SelectTrigger className="h-11 w-full sm:w-44" aria-label={t('common.filterDisplayStatus')}>
              <SelectValue placeholder={t('common.displayStatus')} />
            </SelectTrigger>
            <SelectContent>
              {displayStatusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
        columns={[
          { key: 'title', header: t('table.title'), cell: (item) => item.title },
          { key: 'category', header: t('table.category'), cell: (item) => item.category ?? '-' },
          {
            key: 'schedule',
            header: t('table.schedule'),
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
            header: t('table.status'),
            cell: (item) => {
              const status = resolveDisplayStatus(item)
              return (
                <Badge variant={NEWS_DISPLAY_STATUS_VARIANTS[status]}>
                  {statusLabels[status]}
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
            <DialogTitle>{t('pages.news.deleteTitle')}</DialogTitle>
            <DialogDescription>
              {t('pages.news.deleteDesc', { title: deleteTarget?.title })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {t('common.cancel')}
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
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
