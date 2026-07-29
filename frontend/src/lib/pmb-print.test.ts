import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { printPmbDocument } from '@/lib/pmb-print'

describe('printPmbDocument', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="pmb-print-root" data-print="loa"><span>LoA</span></div>
      <div class="pmb-print-root" data-print="form"><span>Form</span></div>
    `
    vi.spyOn(window, 'print').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.body.removeAttribute('data-pmb-printing')
  })

  it('activates the matching print root and calls window.print', () => {
    printPmbDocument('loa')

    const loa = document.querySelector('.pmb-print-root[data-print="loa"]')
    const form = document.querySelector('.pmb-print-root[data-print="form"]')
    expect(loa).toHaveAttribute('data-print-active', 'true')
    expect(form).not.toHaveAttribute('data-print-active')
    expect(document.body).toHaveAttribute('data-pmb-printing', 'loa')
    expect(window.print).toHaveBeenCalled()
  })
})
