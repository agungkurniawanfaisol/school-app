import * as m from 'motion/react-m'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { pageEnterVariants, springGentle, type MotionTier } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface PageEnterProps {
  children: ReactNode
  className?: string
  tier?: MotionTier
}

export function PageEnter({ children, className, tier = 'lite' }: PageEnterProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (tier === 'none' || prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <m.div
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={pageEnterVariants}
      transition={springGentle}
    >
      {children}
    </m.div>
  )
}
