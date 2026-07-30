import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useConnectGmailOAuth,
  useDisconnectGmailOAuth,
  useGmailOAuthStatus,
} from '@/hooks/useGmailOAuth'

export function GmailOAuthCard() {
  const { data, isLoading } = useGmailOAuthStatus()
  const connect = useConnectGmailOAuth()
  const disconnect = useDisconnectGmailOAuth()

  const ready = data?.ready_to_send === true
  const connected = data?.connected === true

  return (
    <Card className="admin-card border-primary/15" data-testid="gmail-oauth-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail className="h-4.5 w-4.5" aria-hidden />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base font-semibold">Email Gmail (OAuth)</CardTitle>
            <CardDescription className="text-xs">
              Hubungkan akun Gmail untuk mengirim email PMB otomatis dan broadcast.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat status…</p>
        ) : (
          <>
            <p className="text-sm">
              Status:{' '}
              <span className={ready ? 'font-medium text-green-700' : 'font-medium text-amber-700'}>
                {ready ? 'Siap mengirim' : connected ? 'Terhubung, cek MAIL_FROM_ADDRESS' : 'Belum terhubung'}
              </span>
            </p>
            {data?.from_address ? (
              <p className="text-xs text-muted-foreground">Pengirim: {data.from_address}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Set `MAIL_FROM_ADDRESS` di `.env` ke alamat Gmail pengirim.
              </p>
            )}
            {!data?.client_configured ? (
              <p className="text-xs text-destructive">
                Client Google belum dikonfigurasi (`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` /
                `GOOGLE_GMAIL_REDIRECT_URI`).
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                className="min-h-11"
                disabled={!data?.client_configured || connect.isPending}
                onClick={() => connect.mutate()}
              >
                {connected ? 'Hubungkan ulang' : 'Hubungkan Gmail'}
              </Button>
              {connected ? (
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  disabled={disconnect.isPending}
                  onClick={() => disconnect.mutate()}
                >
                  Putuskan
                </Button>
              ) : null}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
