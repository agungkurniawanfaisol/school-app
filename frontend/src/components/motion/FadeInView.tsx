import * as m from 'motion/react-m'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import {
  springGentle,
  springSnappy,
  viewportInView,
  type MotionTier,
} from '@/lib/motion'
import { cn } from '@/lib/utils'

type FadeDirection = 'up' | 'down' | 'left' | 'right' | 'none'

const directionOffsets: Record<FadeDirection, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
}

function getHiddenVariant(direction: FadeDirection, tier: MotionTier) {
  const scale = tier === 'lite' ? 0.5 : 1
  const { x, y } = directionOffsets[direction]
  return {
    opacity: 0,
    x: x * scale,
    y: y * scale,
  }
}

const visibleVariant = { opacity: 1, x: 0, y: 0 }

interface FadeInViewProps {
  children: ReactNode
  className?: string
  tier?: MotionTier
  direction?: FadeDirection
  as?: 'div' | 'section' | 'article' | 'li'
  delay?: number
}

export function FadeInView({
  children,
  className,
  tier = 'full',
  direction = 'up',
  as = 'div',
  delay = 0,
}: FadeInViewProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const Component = m[as]

  if (tier === 'none' || prefersReducedMotion) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  const effectiveTier = tier === 'full' ? 'full' : 'lite'
  const transition = {
    ...(effectiveTier === 'lite' ? springGentle : springSnappy),
    delay: delay / 1000,
  }

  return (
    <Component
      className={cn(className)}
      initial={getHiddenVariant(direction, effectiveTier)}
      whileInView={visibleVariant}
      viewport={viewportInView}
      transition={transition}
    >
      {children}
    </Component>
  )
}
