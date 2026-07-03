import type { ReactNode } from 'react'
import { SchoolLogo } from '@/components/brand/SchoolLogo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type AdminLoginCardProps = {
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function AdminLoginCard({ children, footer, className }: AdminLoginCardProps) {
  return (
    <Card
      className={cn(
        'admin-fade-in w-full max-w-md overflow-hidden border-gold/30 shadow-xl ring-1 ring-gold/10',
        className,
      )}
    >
      <div
        className="px-4 py-7 text-center sm:px-6 sm:py-8"
        style={{
          background: 'linear-gradient(135deg, #1a5f2a 0%, #2d7a3e 55%, #14532d 100%)',
        }}
      >
        <SchoolLogo alt="Nurul Hikmah" variant="login" className="mx-auto drop-shadow-md" />
      </div>

      <CardHeader className="space-y-1.5 px-4 pb-2 pt-5 text-center sm:px-6">
        <CardTitle className="text-xl text-primary sm:text-2xl">Panel Admin</CardTitle>
        <CardDescription className="text-pretty text-sm sm:text-base">
          Masuk dengan akun Google sekolah atau email yang sudah didaftarkan admin
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-4 pb-6 sm:px-6">
        {children}
        {footer ? <div className="pt-1">{footer}</div> : null}
      </CardContent>
    </Card>
  )
}
