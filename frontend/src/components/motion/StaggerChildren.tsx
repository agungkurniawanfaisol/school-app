import * as m from 'motion/react-m'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { fadeUpFull, springSnappy, staggerContainer, viewportInView } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface StaggerChildrenProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'ul' | 'section'
}

export function StaggerChildren({
  children,
  className,
  as = 'div',
}: StaggerChildrenProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const Component = m[as]

  if (prefersReducedMotion) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportInView}
      variants={staggerContainer}
    >
      {children}
    </Component>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'article'
}

export function StaggerItem({
  children,
  className,
  as = 'div',
}: StaggerItemProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const Component = m[as]

  if (prefersReducedMotion) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  return (
    <Component
      className={cn(className)}
      variants={fadeUpFull}
      transition={springSnappy}
    >
      {children}
    </Component>
  )
}
