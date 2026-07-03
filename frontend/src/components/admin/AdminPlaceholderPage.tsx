import type { LucideIcon } from 'lucide-react'
import { Construction } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type AdminPlaceholderPageProps = {
  title: string
  description?: string
  icon?: LucideIcon
}

export function AdminPlaceholderPage({
  title,
  description = 'Modul ini sedang dalam pengembangan dan akan segera tersedia.',
  icon: Icon = Construction,
}: AdminPlaceholderPageProps) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Card className="w-full max-w-lg border-primary/10 shadow-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Icon className="h-8 w-8 text-primary" aria-hidden />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild variant="outline">
            <Link to="/admin">Kembali ke Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
