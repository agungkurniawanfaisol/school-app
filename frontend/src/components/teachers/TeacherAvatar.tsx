import { useState } from 'react'
import { resolveAssetUrl } from '@/lib/safe-url'
import { cn } from '@/lib/utils'
import type { Teacher } from '@/types'

interface TeacherAvatarProps {
  teacher: Pick<Teacher, 'name' | 'photo'>
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-12 w-12 text-lg',
  md: 'h-16 w-16 text-xl',
  lg: 'h-24 w-24 text-3xl',
  xl: 'h-32 w-32 text-4xl',
} as const

function TeacherInitials({
  name,
  sizeClass,
  className,
}: {
  name: string
  sizeClass: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary/60',
        sizeClass,
        className,
      )}
      aria-hidden
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export function TeacherAvatar({ teacher, size = 'md', className }: TeacherAvatarProps) {
  const sizeClass = sizeClasses[size]
  const safePhoto = teacher.photo ? resolveAssetUrl(teacher.photo, '') : ''
  const [showFallback, setShowFallback] = useState(!safePhoto)

  if (showFallback) {
    return <TeacherInitials name={teacher.name} sizeClass={sizeClass} className={className} />
  }

  return (
    <img
      src={safePhoto}
      alt={teacher.name}
      className={cn('shrink-0 rounded-xl object-cover', sizeClass, className)}
      loading="lazy"
      onError={() => setShowFallback(true)}
    />
  )
}
