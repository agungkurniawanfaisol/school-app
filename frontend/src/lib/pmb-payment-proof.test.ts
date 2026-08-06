import { describe, expect, it } from 'vitest'
import { paymentProofFileName, resolvePaymentProofDownloadUrl } from '@/lib/pmb-payment-proof'

describe('pmb-payment-proof', () => {
  it('prefers proof_download_url', () => {
    expect(
      resolvePaymentProofDownloadUrl({
        proof_url: '/api/v1/pmb/portal/media/a?signature=1',
        proof_download_url: '/api/v1/pmb/portal/media/a?download=1&signature=2',
      }),
    ).toBe('/api/v1/pmb/portal/media/a?download=1&signature=2')
  })

  it('falls back to proof_url', () => {
    expect(
      resolvePaymentProofDownloadUrl({
        proof_url: '/api/v1/pmb/portal/media/a?signature=1',
      }),
    ).toBe('/api/v1/pmb/portal/media/a?signature=1')
  })

  it('returns empty when missing', () => {
    expect(resolvePaymentProofDownloadUrl(null)).toBe('')
    expect(resolvePaymentProofDownloadUrl({})).toBe('')
  })

  it('uses proof_name for filename', () => {
    expect(paymentProofFileName({ proof_name: 'bukti.png' })).toBe('bukti.png')
    expect(paymentProofFileName({})).toBe('bukti-transfer')
  })
})
