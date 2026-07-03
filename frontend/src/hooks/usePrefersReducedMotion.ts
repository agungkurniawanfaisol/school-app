import { useReducedMotion } from 'motion/react'

export function usePrefersReducedMotion(): boolean {
  const reducedMotion = useReducedMotion()

  if (typeof window === 'undefined') {
    return false
  }

  return reducedMotion ?? false
}
