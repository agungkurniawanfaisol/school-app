import { Eye, MoreHorizontal, Pencil, Trash2, Upload, UploadCloud } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface AdminContentRowActionsProps {
  uuid: string
  status?: string
  editHref: string
  previewHref?: string
  onPublish?: () => void
  onUnpublish?: () => void
  onDelete: () => void
  isPublishing?: boolean
}

function IconButton({
  label,
  children,
  onClick,
  disabled,
  asChild,
  href,
  destructive,
}: {
  label: string
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  asChild?: boolean
  href?: string
  destructive?: boolean
}) {
  const btn =
    asChild && href ? (
      <Button
        asChild
        size="icon"
        variant="ghost"
        className={`h-11 w-11 min-h-11 min-w-11 ${destructive ? 'text-destructive hover:text-destructive' : ''}`}
      >
        <Link to={href} aria-label={label}>
          {children}
        </Link>
      </Button>
    ) : (
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className={`h-11 w-11 min-h-11 min-w-11 ${destructive ? 'text-destructive hover:text-destructive' : ''}`}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
      >
        {children}
      </Button>
    )

  return (
    <Tooltip>
      <TooltipTrigger asChild>{btn}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export function AdminContentRowActions({
  status,
  editHref,
  previewHref,
  onPublish,
  onUnpublish,
  onDelete,
  isPublishing,
}: AdminContentRowActionsProps) {
  const { t } = useTranslation('admin')
  const isPublished = status === 'published'

  return (
    <TooltipProvider delayDuration={300}>
      {/* Mobile: overflow menu — avoids 4×44px icons crowding ~320px cards */}
      <div className="flex justify-end md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="min-h-11 min-w-11"
              aria-label={t('common.moreActions')}
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={editHref}>{t('common.edit')}</Link>
            </DropdownMenuItem>
            {previewHref && (
              <DropdownMenuItem asChild>
                <Link to={previewHref}>{t('common.preview')}</Link>
              </DropdownMenuItem>
            )}
            {isPublished && onUnpublish ? (
              <DropdownMenuItem onClick={onUnpublish} disabled={isPublishing}>
                {t('common.unpublish')}
              </DropdownMenuItem>
            ) : onPublish ? (
              <DropdownMenuItem onClick={onPublish} disabled={isPublishing}>
                {t('common.publish')}
              </DropdownMenuItem>
            ) : null}
            {(onPublish || onUnpublish) && <DropdownMenuSeparator />}
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
              {t('common.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden justify-end gap-0.5 md:flex">
        <IconButton label={t('common.edit')} href={editHref} asChild>
          <Pencil className="h-4 w-4" />
        </IconButton>
        {previewHref && (
          <IconButton label={t('common.preview')} href={previewHref} asChild>
            <Eye className="h-4 w-4" />
          </IconButton>
        )}
        {isPublished && onUnpublish ? (
          <IconButton label={t('common.unpublish')} onClick={onUnpublish} disabled={isPublishing}>
            <UploadCloud className="h-4 w-4" />
          </IconButton>
        ) : onPublish ? (
          <IconButton label={t('common.publish')} onClick={onPublish} disabled={isPublishing}>
            <Upload className="h-4 w-4" />
          </IconButton>
        ) : null}
        <IconButton label={t('common.delete')} onClick={onDelete} destructive>
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </div>
    </TooltipProvider>
  )
}

interface AdminSimpleRowActionsProps {
  editHref?: string
  onDelete?: () => void
  viewHref?: string
  extraItems?: { label: string; onClick: () => void }[]
}

export function AdminSimpleRowActions({ editHref, onDelete, viewHref, extraItems }: AdminSimpleRowActionsProps) {
  const { t } = useTranslation('admin')
  const hasMenu = extraItems?.length || onDelete

  if (!hasMenu && editHref) {
    return (
      <TooltipProvider delayDuration={300}>
        <IconButton label={t('common.edit')} href={editHref} asChild>
          <Pencil className="h-4 w-4" />
        </IconButton>
      </TooltipProvider>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="icon" variant="ghost" className="min-h-11 min-w-11" aria-label={t('common.moreActions')}>
          <MoreHorizontal className="h-4 w-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {viewHref && (
          <DropdownMenuItem asChild>
            <Link to={viewHref}>{t('common.viewDetail')}</Link>
          </DropdownMenuItem>
        )}
        {editHref && (
          <DropdownMenuItem asChild>
            <Link to={editHref}>{t('common.edit')}</Link>
          </DropdownMenuItem>
        )}
        {extraItems?.map((item) => (
          <DropdownMenuItem key={item.label} onClick={item.onClick}>
            {item.label}
          </DropdownMenuItem>
        ))}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
              {t('common.delete')}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
