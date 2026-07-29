import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { cn } from '@/lib/utils'

interface PmbDocumentBarcodeProps {
  value: string
  className?: string
  /** Pixel size of the QR square (default 128). */
  size?: number
}

/** Compact scannable QR for LoA / formulir (avoids wide CODE128 barcodes). */
export function PmbDocumentBarcode({ value, className, size = 128 }: PmbDocumentBarcodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !value) return
    let cancelled = false
    void QRCode.toCanvas(canvas, value, {
      width: size,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#18181b', light: '#ffffff' },
    }).catch(() => {
      if (!cancelled) {
        const ctx = canvas.getContext('2d')
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
      }
    })
    return () => {
      cancelled = true
    }
  }, [value, size])

  if (!value) return null

  return (
    <div
      className={cn(
        'mx-auto flex w-fit flex-col items-center gap-1.5 rounded border border-zinc-200 bg-white p-2',
        className,
      )}
      data-testid="pmb-document-barcode"
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`QR code ${value}`}
        className="h-32 w-32 max-w-full"
      />
      <p className="font-mono text-xs font-semibold tracking-wide text-zinc-800">{value}</p>
    </div>
  )
}

export function formatIdDate(value: string | null | undefined): string {
  if (!value) return '—'
  const d = new Date(value.includes('T') ? value : `${value}T00:00:00`)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatIdDateTime(value: string | null | undefined): string {
  if (!value) {
    return new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function draftStr(draft: Record<string, unknown> | null | undefined, key: string): string {
  if (!draft) return ''
  const v = draft[key]
  if (v == null || v === '') return ''
  return String(v)
}

export function genderLabel(gender: string | null | undefined): string {
  if (gender === 'L') return 'LAKI - LAKI'
  if (gender === 'P') return 'PEREMPUAN'
  return '—'
}
