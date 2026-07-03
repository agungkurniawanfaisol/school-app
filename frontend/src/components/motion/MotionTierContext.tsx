import { createContext, useContext, type ReactNode } from 'react'
import type { MotionTier } from '@/lib/motion'

const MotionTierContext = createContext<MotionTier>('lite')

interface MotionTierProviderProps {
  tier: MotionTier
  children: ReactNode
}

export function MotionTierProvider({ tier, children }: MotionTierProviderProps) {
  return (
    <MotionTierContext.Provider value={tier}>{children}</MotionTierContext.Provider>
  )
}

export function useMotionTier(): MotionTier {
  return useContext(MotionTierContext)
}
