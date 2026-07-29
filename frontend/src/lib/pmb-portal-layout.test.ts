import { describe, expect, it } from 'vitest'
import {
  PMB_MOBILE_BOTTOM_NAV,
  PMB_PORTAL_MAIN_PB,
  PMB_WIZARD_FOOTER_SPACER,
  PMB_WIZARD_FOOTER_STICKY,
} from '@/lib/pmb-portal-layout'

describe('pmb-portal-layout', () => {
  it('exports mobile bottom nav offset token', () => {
    expect(PMB_MOBILE_BOTTOM_NAV).toBe('5.5rem')
  })

  it('includes safe-area in main padding and sticky footer classes', () => {
    expect(PMB_PORTAL_MAIN_PB).toContain('safe-area-inset-bottom')
    expect(PMB_PORTAL_MAIN_PB).toContain('sm:pt-6')
    expect(PMB_PORTAL_MAIN_PB).not.toContain('sm:py-6')
    expect(PMB_WIZARD_FOOTER_STICKY).toContain('safe-area-inset-bottom')
    expect(PMB_WIZARD_FOOTER_SPACER).toContain('sm:hidden')
  })
})
