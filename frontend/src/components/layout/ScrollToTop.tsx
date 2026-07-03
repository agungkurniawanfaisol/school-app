import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets window scroll on route changes. Preserves hash navigation (e.g. /#berita).
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      const target = document.getElementById(id)
      if (target) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' })
        return
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}
