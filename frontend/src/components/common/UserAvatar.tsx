import { useEffect, useState } from 'react'
import { resolveAssetUrl } from '@/lib/safe-url'
import { cn } from '@/lib/utils'

export function getUserInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

const sizeClasses = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
} as const

type UserAvatarProps = {
  name: string
  photoUrl?: string | null
  size?: keyof typeof sizeClasses
  className?: string
}

export function UserAvatar({ name, photoUrl, size = 'sm', className }: UserAvatarProps) {
  const safePhoto = photoUrl ? resolveAssetUrl(photoUrl, '') : ''
  const [loadFailed, setLoadFailed] = useState(false)
  const initials = getUserInitials(name) || '?'
  const sizeClass = sizeClasses[size]

  useEffect(() => {
    setLoadFailed(false)
  }, [safePhoto])

  if (!safePhoto || loadFailed) {
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary',
          sizeClass,
          className,
        )}
        aria-hidden
      >
        {initials}
      </span>
    )
  }

  return (
    <img
      src={safePhoto}
      alt={name}
      className={cn('inline-flex shrink-0 rounded-full object-cover', sizeClass, className)}
      loading="lazy"
      onError={() => setLoadFailed(true)}
    />
  )
}
