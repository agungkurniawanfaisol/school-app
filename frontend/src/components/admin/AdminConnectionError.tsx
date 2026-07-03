import { Button } from '@/components/ui/button'

interface AdminConnectionErrorProps {
  onRetry: () => void
  isRetrying?: boolean
}

export function AdminConnectionError({ onRetry, isRetrying }: AdminConnectionErrorProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-xl border border-primary/15 bg-card p-6 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-foreground">Tidak dapat terhubung ke server</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Backend API mungkin sedang restart atau belum siap. Sesi login Anda tetap tersimpan — coba lagi
          setelah beberapa detik.
        </p>
        <Button type="button" className="mt-4" onClick={onRetry} disabled={isRetrying}>
          {isRetrying ? 'Menghubungkan…' : 'Coba lagi'}
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          Pastikan backend berjalan: <code className="rounded bg-muted px-1">make dev</code> atau{' '}
          <code className="rounded bg-muted px-1">docker compose up -d backend</code>
        </p>
      </div>
    </div>
  )
}
