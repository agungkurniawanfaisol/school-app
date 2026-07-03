import { cn } from '@/lib/utils'
import { FadeInView } from '@/components/motion/FadeInView'

interface SectionHeaderProps {
  badge?: string
  title: string
  description?: string
  align?: 'center' | 'left'
  className?: string
  animate?: boolean
  action?: React.ReactNode
}

export function SectionHeader({
  badge,
  title,
  description,
  align = 'center',
  className,
  animate = true,
  action,
}: SectionHeaderProps) {
  const content = (
    <div
      className={cn(
        'mb-10 md:mb-12',
        align === 'center' ? 'text-center' : 'text-left',
        className,
      )}
    >
      {badge && (
        <span className="section-badge">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--gold-accent)]" />
          {badge}
        </span>
      )}
      <h2 className="section-title">{title}</h2>
      {description && (
        <p
          className={cn(
            'mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )

  if (!animate) return content

  return <FadeInView direction="up" tier="full">{content}</FadeInView>
}
