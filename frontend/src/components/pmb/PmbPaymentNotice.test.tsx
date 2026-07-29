import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PmbPaymentNotice } from './PmbPaymentNotice'

describe('PmbPaymentNotice', () => {
  it('shows bank, account number, and account holder when provided', () => {
    render(
      <PmbPaymentNotice
        fee="Rp 350.000"
        bankName="Bank Syariah Indonesia (BSI)"
        accountNumber="7123456789"
        accountHolder="Yayasan Nurul Hikmah"
        studentName="Sugondo Joyo Puspito"
      />,
    )

    expect(screen.getByText('Instruksi Transfer')).toBeInTheDocument()
    expect(screen.getByText('Bank Syariah Indonesia (BSI)')).toBeInTheDocument()
    expect(screen.getByText('7123456789')).toBeInTheDocument()
    expect(screen.getByText('Yayasan Nurul Hikmah')).toBeInTheDocument()
    expect(screen.getByText('Rp 350.000')).toBeInTheDocument()
    expect(screen.queryByText(/Rekening tujuan belum lengkap/)).not.toBeInTheDocument()
  })

  it('always shows bank rows and warns when settings are missing', () => {
    render(<PmbPaymentNotice fee="Rp 350.000" studentName="Sugondo Joyo Puspito" />)

    expect(screen.getByText('Bank')).toBeInTheDocument()
    expect(screen.getByText('No. Rekening')).toBeInTheDocument()
    expect(screen.getByText('Atas nama')).toBeInTheDocument()
    expect(screen.getByText(/Rekening tujuan belum lengkap/)).toBeInTheDocument()
    expect(screen.getAllByText(/Belum dikonfigurasi/).length).toBeGreaterThanOrEqual(3)
  })
})
