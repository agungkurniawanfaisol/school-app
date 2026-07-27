import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ImagePlus, Trash2 } from 'lucide-react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminToolbar } from '@/components/admin/AdminToolbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { mediaKeys, useAdminMediaList, useDeleteMedia } from '@/hooks/useMedia'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import type { Media } from '@/types'
import { useTranslation } from 'react-i18next'

export function MediaLibraryPage() {
  const { t } = useTranslation('admin')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<Media | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const upload = useMediaUpload('general')
  const deleteItem = useDeleteMedia()
  const { data, isLoading, isFetching } = useAdminMediaList({ page, per_page: 24, search })

  const handleUpload = async (file: File | undefined) => {
    if (!file) return
    await upload.mutateAsync(file)
    queryClient.invalidateQueries({ queryKey: mediaKeys.adminLists() })
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={t('pages.media.title')}
        description={t('pages.media.desc')}
        actions={
          <Button type="button" onClick={() => inputRef.current?.click()} disabled={upload.isPending}>
            <ImagePlus className="h-4 w-4" aria-hidden />
            {upload.isPending ? t('common.uploading') : t('common.upload')}
          </Button>
        }
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          void handleUpload(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      <AdminToolbar search={search} onSearchChange={(v) => { setSearch(v); setPage(1) }} searchPlaceholder={t('common.searchFile')} />

      <div className={`grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 ${isFetching ? 'opacity-70' : ''}`}>
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)
        ) : data?.data.length ? (
          data.data.map((item) => (
            <Card key={item.id} className="admin-card overflow-hidden">
              <div className="aspect-square bg-muted">
                {item.url && <img src={item.url} alt={item.original_name ?? item.filename} className="h-full w-full object-cover" />}
              </div>
              <CardContent className="space-y-2 p-3">
                <p className="truncate text-sm font-medium">{item.original_name ?? item.filename}</p>
                <p className="text-xs text-muted-foreground">{item.collection}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(item)}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  {t('common.delete')}
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <AdminEmptyState icon={ImagePlus} title={t('pages.media.emptyTitle')} description={t('pages.media.emptyDesc')} />
          </div>
        )}
      </div>

      {data && data.meta.last_page > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            {t('common.previous')}
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            {t('common.pageOf', { page, lastPage: data.meta.last_page })}
          </span>
          <Button variant="outline" disabled={page >= data.meta.last_page} onClick={() => setPage((p) => p + 1)}>
            {t('common.next')}
          </Button>
        </div>
      )}

      <AdminDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return
          deleteItem.mutate(deleteTarget.uuid, { onSuccess: () => setDeleteTarget(null) })
        }}
        isLoading={deleteItem.isPending}
      />
    </div>
  )
}
