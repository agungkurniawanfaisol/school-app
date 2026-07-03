export const springSnappy = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 32,
  mass: 0.8,
}

export const springGentle = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 30,
}

export const viewportInView = {
  once: false,
  amount: 0.2,
  margin: '0px 0px -8% 0px',
} as const

/** @deprecated Use viewportInView — kept for imports during migration */
export const viewportOnce = viewportInView

export type MotionTier = 'full' | 'lite' | 'none'

export const fadeUpFull = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
} as const

export const fadeUpLite = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
} as const

export const pageEnterVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
} as const

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
} as const
