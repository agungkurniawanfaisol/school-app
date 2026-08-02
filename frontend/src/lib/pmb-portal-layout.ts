/**
 * Shared layout tokens for PMB portal mobile chrome (bottom nav + safe area).
 * Bottom nav: ~52px row + safe-area inset ≈ 5.5rem total offset.
 */
export const PMB_MOBILE_BOTTOM_NAV = '5.5rem'

/**
 * Main scroll area padding above fixed bottom nav (mobile/tablet).
 * Use `sm:pt-6` (not `sm:py-6`) so bottom padding with safe-area is kept until `lg:`
 * where bottom nav is hidden.
 */
export const PMB_PORTAL_MAIN_PB =
  'pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:px-6 sm:pt-6 lg:px-8 lg:pb-8'

/** Wizard sticky action bar sits above bottom nav while bottom nav is visible (< lg). */
export const PMB_WIZARD_FOOTER_STICKY =
  'sticky bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-10 lg:static lg:bottom-auto'

/**
 * Reserve space so last form fields are not hidden behind sticky wizard footer.
 * Stacked CTAs (Kembali + Lanjut) need ~8.5rem including padding/border.
 */
export const PMB_WIZARD_FOOTER_SPACER = 'h-[8.5rem] shrink-0 lg:hidden'

/** Prevent iOS auto-zoom on focus — 16px minimum on mobile. */
export const PMB_INPUT_TEXT = 'text-base sm:text-sm'
