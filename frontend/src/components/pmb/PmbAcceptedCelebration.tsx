import { useEffect, useState } from 'react'
import { PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/utils'

function celebrationKey(uuid: string) {
  return `pmb-accepted-celebration:${uuid}`
}

interface PmbAcceptedCelebrationProps {
  uuid: string
  studentName: string | null
  registrationNumber: string
  className?: string
}

export function PmbAcceptedCelebration({
  uuid,
  studentName,
  registrationNumber,
  className,
}: PmbAcceptedCelebrationProps) {
  const reduceMotion = usePrefersReducedMotion()
  const [showBurst, setShowBurst] = useState(false)
  const [entered, setEntered] = useState(reduceMotion)

  useEffect(() => {
    if (reduceMotion) {
      setEntered(true)
      return
    }
    const frame = window.requestAnimationFrame(() => setEntered(true))
    return () => window.cancelAnimationFrame(frame)
  }, [reduceMotion])

  useEffect(() => {
    if (!uuid || reduceMotion) return
    try {
      const key = celebrationKey(uuid)
      if (localStorage.getItem(key)) return
      localStorage.setItem(key, '1')
      setShowBurst(true)
      const t = window.setTimeout(() => setShowBurst(false), 2800)
      return () => window.clearTimeout(t)
    } catch {
      setShowBurst(true)
      const t = window.setTimeout(() => setShowBurst(false), 2800)
      return () => window.clearTimeout(t)
    }
  }, [uuid, reduceMotion])

  const displayName = studentName?.trim() || 'Calon siswa'

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-600 via-primary to-emerald-800 p-5 text-white shadow-lg sm:p-7',
        !reduceMotion && 'transition-all duration-500',
        entered ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0',
        className,
      )}
      data-testid="pmb-accepted-celebration"
      aria-live="polite"
    >
      {showBurst && !reduceMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="pmb-confetti-piece absolute top-0 left-1/2 h-2 w-2 rounded-sm opacity-90"
              style={{
                ['--i' as string]: i,
                backgroundColor: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#fff' : '#6ee7b7',
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 space-y-3">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
            <PartyPopper className="h-6 w-6" aria-hidden />
          </span>
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium text-emerald-100">Status: Diterima</p>
            <h2 className="text-xl font-bold leading-snug sm:text-2xl">
              Selamat! {displayName} diterima
            </h2>
            <p className="text-sm text-emerald-50/90">
              Pendaftaran <span className="font-mono font-semibold">{registrationNumber}</span> telah
              disetujui. Surat penerimaan (LoA) siap dicetak atau diunduh sebagai PDF.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="h-11 min-h-11 bg-white text-emerald-900 hover:bg-emerald-50"
          onClick={() => {
            document.getElementById('loa')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
          }}
        >
          Lihat Surat Penerimaan
        </Button>
      </div>
    </section>
  )
}
