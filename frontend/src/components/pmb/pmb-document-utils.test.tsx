import { render, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PmbDocumentBarcode } from '@/components/pmb/pmb-document-utils'

vi.mock('qrcode', () => ({
  default: {
    toCanvas: vi.fn().mockResolvedValue(undefined),
  },
}))

describe('PmbDocumentBarcode', () => {
  it('renders compact QR canvas with registration number label', async () => {
    const QRCode = await import('qrcode')
    const { getByTestId, getByText } = render(<PmbDocumentBarcode value="PMB-001" />)

    expect(getByTestId('pmb-document-barcode')).toBeInTheDocument()
    expect(getByText('PMB-001')).toBeInTheDocument()
    await waitFor(() => {
      expect(QRCode.default.toCanvas).toHaveBeenCalled()
    })
    const canvas = getByTestId('pmb-document-barcode').querySelector('canvas')
    expect(canvas).toHaveAttribute('aria-label', 'QR code PMB-001')
  })
})
