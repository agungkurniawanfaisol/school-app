import { resolveAssetUrl } from '@/lib/safe-url'

/** Resolve signed payment-proof download URL from admin payment_info payload. */
export function resolvePaymentProofDownloadUrl(
  paymentInfo: Record<string, unknown> | null | undefined,
): string {
  if (!paymentInfo) return ''

  const download =
    typeof paymentInfo.proof_download_url === 'string' ? paymentInfo.proof_download_url : null
  const preview = typeof paymentInfo.proof_url === 'string' ? paymentInfo.proof_url : null

  return resolveAssetUrl(download || preview, '')
}

export function paymentProofFileName(
  paymentInfo: Record<string, unknown> | null | undefined,
): string {
  if (paymentInfo && typeof paymentInfo.proof_name === 'string' && paymentInfo.proof_name.trim()) {
    return paymentInfo.proof_name.trim()
  }
  return 'bukti-transfer'
}
