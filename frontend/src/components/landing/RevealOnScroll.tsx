import type { ReactNode } from 'react'
import { FadeInView } from '@/components/motion/FadeInView'

interface RevealOnScrollProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  as?: 'div' | 'section' | 'article'
}

/** @deprecated Prefer FadeInView from @/components/motion — kept for gradual migration */
export function RevealOnScroll({
  children,
  className,
  delay = 0,
  direction = 'up',
  as = 'div',
}: RevealOnScrollProps) {
  return (
    <FadeInView
      className={className}
      direction={direction}
      tier="full"
      as={as}
      delay={delay}
    >
      {children}
    </FadeInView>
  )
}
