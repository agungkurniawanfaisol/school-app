import Autoplay from 'embla-carousel-autoplay'
import { useMemo } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const DEFAULT_DELAY_MS = 5000

export function useCarouselAutoplayPlugins(slideCount: number, delay = DEFAULT_DELAY_MS) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return useMemo(() => {
    if (slideCount <= 1 || prefersReducedMotion) {
      return []
    }

    return [
      Autoplay({
        delay,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  }, [slideCount, prefersReducedMotion, delay])
}
