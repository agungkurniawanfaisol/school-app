export type PmbPrintKind = 'loa' | 'form'

const ATTR = 'data-print-active'
const BODY_ATTR = 'data-pmb-printing'

/**
 * Marks one PMB print root active and opens the browser print dialog
 * (user can choose “Save as PDF”).
 */
export function printPmbDocument(kind: PmbPrintKind): void {
  const roots = document.querySelectorAll<HTMLElement>('.pmb-print-root')
  roots.forEach((el) => {
    el.removeAttribute(ATTR)
  })

  const target = document.querySelector<HTMLElement>(`.pmb-print-root[data-print="${kind}"]`)
  if (!target) return

  target.setAttribute(ATTR, 'true')
  document.body.setAttribute(BODY_ATTR, kind)

  const cleanup = () => {
    target.removeAttribute(ATTR)
    document.body.removeAttribute(BODY_ATTR)
    window.removeEventListener('afterprint', cleanup)
  }

  window.addEventListener('afterprint', cleanup)
  window.print()

  // Fallback if afterprint never fires (some WebViews)
  window.setTimeout(cleanup, 60_000)
}
