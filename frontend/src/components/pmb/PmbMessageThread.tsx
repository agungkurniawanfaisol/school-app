import { cn } from '@/lib/utils'
import type { PmbMessage } from '@/types'

export type PmbMessageViewer = 'admin' | 'pendaftar'

function isAdminRole(role: string | null | undefined): boolean {
  return role === 'admin' || role === 'admin_pmb' || role === 'super_admin'
}

export function isPmbMessageFromViewer(item: PmbMessage, viewer: PmbMessageViewer): boolean {
  const role = item.user?.role ?? item.sender_role
  const fromAdmin = isAdminRole(role)
  return viewer === 'admin' ? fromAdmin : !fromAdmin
}

function formatMessageTime(value: string | null): string | null {
  if (!value) return null
  return new Date(value).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface PmbMessageBubbleProps {
  item: PmbMessage
  viewer: PmbMessageViewer
}

export function PmbMessageBubble({ item, viewer }: PmbMessageBubbleProps) {
  const own = isPmbMessageFromViewer(item, viewer)
  const role = item.user?.role ?? item.sender_role
  const fromAdmin = isAdminRole(role)
  const name = item.user?.name ?? item.sender_name ?? 'Pengguna'
  const roleLabel = fromAdmin ? 'Admin' : 'Pendaftar'
  const time = formatMessageTime(item.created_at)

  return (
    <div
      className={cn('flex w-full', own ? 'justify-end' : 'justify-start')}
      data-side={own ? 'own' : 'other'}
      data-testid={own ? 'pmb-message-own' : 'pmb-message-other'}
    >
      <div
        className={cn(
          'max-w-[min(100%,20rem)] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm sm:max-w-[28rem]',
          own
            ? 'rounded-br-md bg-primary text-primary-foreground'
            : fromAdmin
              ? 'rounded-bl-md border border-sky-200/80 bg-sky-50 text-sky-950 dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-50'
              : 'rounded-bl-md border border-amber-200/80 bg-amber-50 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/35 dark:text-amber-50',
        )}
      >
        <p
          className={cn(
            'text-xs font-semibold',
            own
              ? 'text-primary-foreground/85'
              : fromAdmin
                ? 'text-sky-800 dark:text-sky-200'
                : 'text-amber-800 dark:text-amber-200',
          )}
        >
          {name}
          <span className="font-normal opacity-80"> · {roleLabel}</span>
        </p>
        <p className="mt-1 whitespace-pre-wrap break-words">{item.body}</p>
        {time && (
          <p
            className={cn(
              'mt-1.5 text-[11px]',
              own
                ? 'text-primary-foreground/70'
                : fromAdmin
                  ? 'text-sky-700/80 dark:text-sky-300/80'
                  : 'text-amber-700/80 dark:text-amber-300/80',
            )}
          >
            {time}
          </p>
        )}
      </div>
    </div>
  )
}

interface PmbMessageThreadProps {
  messages: PmbMessage[]
  viewer: PmbMessageViewer
  emptyText?: string
  className?: string
}

export function PmbMessageThread({
  messages,
  viewer,
  emptyText = 'Belum ada pesan.',
  className,
}: PmbMessageThreadProps) {
  if (messages.length === 0) {
    return (
      <p className={cn('py-6 text-center text-sm text-muted-foreground', className)}>{emptyText}</p>
    )
  }

  return (
    <div
      className={cn(
        'max-h-80 space-y-3 overflow-y-auto rounded-xl border border-primary/10 bg-muted/20 p-3 sm:p-4',
        className,
      )}
      role="log"
      aria-label="Riwayat pesan"
    >
      {messages.map((item) => (
        <PmbMessageBubble key={item.id} item={item} viewer={viewer} />
      ))}
    </div>
  )
}
